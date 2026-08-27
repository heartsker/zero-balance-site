#!/usr/bin/env node
// Deploy lanes for the two targets that share this one source tree:
//
//   node scripts/deploy.mjs cloudflare  -> global site (all locales) on Cloudflare Workers
//   node scripts/deploy.mjs yandex      -> Russian-default + English mirror on Yandex Object Storage
//   node scripts/deploy.mjs all         -> both, sequentially
//
// Cloudflare reads ./dist (see wrangler.toml), so its build uses the default
// output dir. The Yandex build is stamped for zerobalanceapp.ru, emits Russian
// (default, at the root) plus English (under /en/, for people who search Yandex
// in English), lands in ./dist-ru, is pruned to those two locales, then synced
// to the bucket over the S3 API. See docs/ru-mirror.md for one-time setup and
// required env vars.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = process.cwd();

// Optional .env (gitignored) for Yandex S3 credentials + bucket. Never commit it.
function loadEnv() {
  const f = join(ROOT, '.env');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    // .env wins over any pre-existing shell vars, so stale real-AWS credentials
    // can't shadow the Yandex keys and cause an AccessDenied on the bucket.
    if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

function run(cmd, env = {}) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });
}

// Ping IndexNow (-> Yandex, Bing, ...) with the URLs that changed in this build.
// Best-effort: the deploy has already shipped by the time we get here, so a transient
// submission failure must not fail the lane. Re-run `npm run indexnow` / `indexnow:ru`
// manually if a ping is ever missed.
function pingIndexNow(flags = '') {
  try {
    run(`node scripts/indexnow.mjs${flags ? ` ${flags}` : ''}`);
  } catch (err) {
    console.warn(`\nindexnow ping failed (deploy already succeeded): ${err.message}`);
  }
}

function deployCloudflare() {
  // Defaults (no env) build the global site (zerobalance.pro, all locales) into
  // ./dist, which wrangler.toml serves.
  run('npm run build');
  run('npx wrangler deploy');
  pingIndexNow();
}

function deployYandex() {
  const bucket = process.env.YANDEX_BUCKET;
  if (!bucket) {
    throw new Error('Set YANDEX_BUCKET (e.g. zerobalanceapp.ru) in .env or the environment.');
  }
  const endpoint = process.env.YANDEX_S3_ENDPOINT || 'https://storage.yandexcloud.net';
  const outDir = 'dist-ru';

  run(`node scripts/build-yandex.mjs ${outDir}`);

  // Credentials come from AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (env or .env).
  run(
    `aws s3 sync ${outDir} s3://${bucket} --delete --endpoint-url ${endpoint} --region ru-central1`,
  );

  // Belt-and-suspenders: force-upload the root index.html (the one file Astro
  // writes as a redirect stub and the flatten then overwrites with the real home)
  // so the origin copy of the landing page is always current, independent of any
  // `aws s3 sync` size/mtime heuristic.
  run(
    `aws s3 cp ${outDir}/index.html s3://${bucket}/index.html --endpoint-url ${endpoint} --region ru-central1 --content-type text/html`,
  );

  // The API Gateway reads the bucket directly. Deploy and preflight its router,
  // then keep the custom domain attached and DNS pointed at the verified gateway.
  run('node scripts/deploy-yandex-agent.mjs --cutover');
  run('node scripts/verify-agent-readiness.mjs https://zerobalanceapp.ru');
  pingIndexNow(`--host=zerobalanceapp.ru --dist=${outDir}`);
}

loadEnv();
const target = process.argv[2];
switch (target) {
  case 'cloudflare':
    deployCloudflare();
    break;
  case 'yandex':
    deployYandex();
    break;
  case 'all':
    deployCloudflare();
    deployYandex();
    break;
  default:
    console.error('Usage: node scripts/deploy.mjs <cloudflare|yandex|all>');
    process.exit(1);
}
