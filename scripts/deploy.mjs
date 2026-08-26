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
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Mirror of ALL_LOCALES in src/lib/siteConfig.ts - used only to prune stray
// locale directories that a page hardcoded (e.g. the en+ru blog) but that the
// mirror does not serve.
const ALL_LOCALES = ['en', 'ru', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt-BR', 'tr'];
// The locales the Yandex mirror ships: Russian (default, flattened to the root)
// plus English (kept under /en/). Keep in sync with PUBLIC_SITE_LOCALES below.
const MIRROR_LOCALES = ['ru', 'en'];
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

// Purge the Yandex CDN edge cache for the mirror (delegates to scripts/purge-cdn.mjs,
// reusable standalone as `npm run purge:yandex`). The CDN fronting the bucket caches
// every path for ~24h at the edge AND ignores query strings, so without a purge a
// fresh deploy stays invisible for up to a day - most visibly on the heavily-hit
// root `/`. Best-effort like the IndexNow ping: the bytes are already on the bucket,
// so a purge failure (e.g. `yc` missing or unauthenticated in CI) must not fail the
// lane - run `npm run purge:yandex` by hand then.
function purgeCdn() {
  try {
    run('node scripts/purge-cdn.mjs');
  } catch (err) {
    console.warn(`\nCDN purge failed (deploy already shipped to the bucket): ${err.message}`);
  }
}

// Recursively rewrite the `/ru/` prefix out of every text artifact so the mirror
// serves Russian at the site root (zerobalanceapp.ru/faq/, not /ru/faq/).
function stripRuPrefixRefs(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      stripRuPrefixRefs(p);
    } else if (/\.(html|xml|txt|md)$/.test(entry.name)) {
      const before = readFileSync(p, 'utf8');
      const after = before
        // Absolute self-URLs: zerobalanceapp.ru/ru/... -> zerobalanceapp.ru/...
        .split('https://zerobalanceapp.ru/ru/').join('https://zerobalanceapp.ru/')
        // Relative links wherever they appear (attrs, JSON-LD, prose, markdown):
        // strip a LEADING `/ru/` path segment. The negative lookbehind keeps any
        // nested `/ru/` that follows a word char (e.g. a hashed asset path) intact.
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
    PUBLIC_SITE_LOCALES: MIRROR_LOCALES.join(','),
    PUBLIC_SITE_DEFAULT_LOCALE: 'ru',
    MARKDOWN_DIST_DIR: outDir,
  });

  // Keep only the mirror's locales (ru + en); drop any other locale directory a
  // page hardcoded (e.g. an en-only blog post builds /ar/, /de/, ... too).
  // Standard pages already build ru+en via the LOCALES env.
  // Screenshots are imported from src/assets and emitted as optimized WebP under
  // /_astro/ only for the locales this build renders (ru + en), so there is no
  // verbatim per-locale screenshot directory left to prune here.
  for (const loc of ALL_LOCALES) {
    if (MIRROR_LOCALES.includes(loc)) continue;
    const dir = join(ROOT, outDir, loc);
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`pruned ${outDir}/${loc}/`);
    }
  }

  // Flatten /ru to the site root: Russian is the mirror's default, so serve it at
  // zerobalanceapp.ru/... instead of /ru/.... Move the ru tree up (overwriting
  // the root redirect stub with the real home), then rewrite /ru/ references.
  // English is left under /en/ (reachable via the language toggle).
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

  // Belt-and-suspenders: force-upload the root index.html (the one file Astro
  // writes as a redirect stub and the flatten then overwrites with the real home)
  // so the origin copy of the landing page is always current, independent of any
  // `aws s3 sync` size/mtime heuristic.
  run(
    `aws s3 cp ${outDir}/index.html s3://${bucket}/index.html --endpoint-url ${endpoint} --region ru-central1 --content-type text/html`,
  );

  // Edge cache holds the old bytes for ~24h otherwise; purge so the deploy is live now.
  purgeCdn();
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
