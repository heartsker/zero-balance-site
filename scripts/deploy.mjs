#!/usr/bin/env node
// Deploy lanes for the two targets that share this one source tree:
//
//   node scripts/deploy.mjs cloudflare  -> global site (all locales) on Cloudflare Workers
//   node scripts/deploy.mjs yandex      -> Russian-only mirror on Yandex Object Storage
//   node scripts/deploy.mjs all         -> both, sequentially
//
// Cloudflare reads ./dist (see wrangler.toml), so its build uses the default
// output dir. The Yandex build is stamped for zerobalanceapp.ru, emits Russian
// only, lands in ./dist-ru, is pruned to ru, then synced to the bucket over the
// S3 API. See docs/ru-mirror.md for one-time setup and required env vars.
import { execSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Mirror of ALL_LOCALES in src/lib/siteConfig.ts - used only to prune stray
// non-ru locale directories that a page hardcoded (e.g. the en+ru blog).
const ALL_LOCALES = ['en', 'ru', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt-BR', 'tr'];
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

// Recursively rewrite the `/ru/` prefix out of every text artifact so the mirror
// serves Russian at the site root (zerobalanceapp.ru/faq/, not /ru/faq/).
function stripRuPrefixRefs(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      stripRuPrefixRefs(p);
    } else if (/\.(html|xml|txt)$/.test(entry.name)) {
      const before = readFileSync(p, 'utf8');
      const after = before
        // Absolute self-URLs: zerobalanceapp.ru/ru/... -> zerobalanceapp.ru/...
        .split('https://zerobalanceapp.ru/ru/').join('https://zerobalanceapp.ru/')
        // Relative links wherever they appear (attrs, JSON-LD, prose, markdown):
        // strip a LEADING `/ru/` path segment. The negative lookbehind keeps
        // asset paths like /screenshots/ru/1.png (where `/ru/` follows a word char).
        .replace(/(?<!\w)\/ru\//g, '/');
      if (after !== before) writeFileSync(p, after);
    }
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

  run('npm run build -- --outDir ' + outDir, {
    PUBLIC_SITE_DOMAIN: 'https://zerobalanceapp.ru',
    PUBLIC_SITE_LOCALES: 'ru',
    PUBLIC_SITE_DEFAULT_LOCALE: 'ru',
  });

  // Russian-only: drop any non-ru locale directory a page hardcoded (the en+ru
  // blog emits /en/). Standard pages already build ru-only via the LOCALES env.
  for (const loc of ALL_LOCALES) {
    if (loc === 'ru') continue;
    const dir = join(ROOT, outDir, loc);
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`pruned ${outDir}/${loc}/`);
    }
    // public/screenshots/<loc>/ is copied verbatim for every locale, but the
    // mirror's HTML only references /screenshots/ru/. Drop the other 11 so the
    // sync doesn't ship ~44 unused App Store shots to the bucket.
    const shots = join(ROOT, outDir, 'screenshots', loc);
    if (existsSync(shots)) {
      rmSync(shots, { recursive: true, force: true });
      console.log(`pruned ${outDir}/screenshots/${loc}/`);
    }
  }

  // Flatten /ru to the site root: this mirror is single-language, so serve at
  // zerobalanceapp.ru/... instead of /ru/.... Move the ru tree up (overwriting
  // the root redirect stub with the real home), then rewrite /ru/ references.
  const ruDir = join(ROOT, outDir, 'ru');
  if (existsSync(ruDir)) {
    cpSync(ruDir, join(ROOT, outDir), { recursive: true, force: true });
    rmSync(ruDir, { recursive: true, force: true });
    stripRuPrefixRefs(join(ROOT, outDir));
    console.log(`flattened ${outDir}/ru/ -> ${outDir}/`);
  }

  // Credentials come from AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (env or .env).
  run(
    `aws s3 sync ${outDir} s3://${bucket} --delete --endpoint-url ${endpoint} --region ru-central1`,
  );
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
