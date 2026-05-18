#!/usr/bin/env node
// Submits new/changed URLs to IndexNow (Bing, Yandex, ...). See plan in CLAUDE memory.
//
// Usage:
//   node scripts/indexnow.mjs            # submit URLs whose content hash changed
//   node scripts/indexnow.mjs --all      # submit every URL in the sitemap
//   node scripts/indexnow.mjs --dry-run  # print what would be submitted, no network

import { createHash, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
const DIST_DIR = join(ROOT, 'dist');
const STATE_FILE = join(ROOT, '.indexnow-state.json');
const SITEMAP_FILE = join(DIST_DIR, 'sitemap-0.xml');
const HOST = 'zerobalance.pro';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const BATCH_SIZE = 10000;

const args = new Set(process.argv.slice(2));
const ALL = args.has('--all');
const DRY = args.has('--dry-run');

function die(msg) {
  console.error(`indexnow: ${msg}`);
  process.exit(1);
}

function loadOrCreateKey() {
  const existing = readdirSync(PUBLIC_DIR).find((name) => {
    if (!/^[a-f0-9]{32}\.txt$/.test(name)) return false;
    const stem = name.slice(0, 32);
    const contents = readFileSync(join(PUBLIC_DIR, name), 'utf8').trim();
    return contents === stem;
  });
  if (existing) return existing.slice(0, 32);

  const key = randomBytes(16).toString('hex');
  const keyPath = join(PUBLIC_DIR, `${key}.txt`);
  writeFileSync(keyPath, key);
  console.log(`indexnow: generated key file public/${key}.txt`);
  console.log('indexnow: commit it and redeploy before the next ping so Bing/Yandex can verify it.');
  return key;
}

function parseSitemap() {
  if (!existsSync(SITEMAP_FILE)) {
    die(`${SITEMAP_FILE} not found. Run \`npm run build\` first.`);
  }
  const xml = readFileSync(SITEMAP_FILE, 'utf8');
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const url = m[1].trim();
    if (url.startsWith(`${ORIGIN}/`)) urls.push(url);
  }
  return urls;
}

function urlToDistPath(url) {
  const path = url.slice(ORIGIN.length);
  const trimmed = path.endsWith('/') ? path.slice(0, -1) : path;
  if (trimmed === '') return join(DIST_DIR, 'index.html');
  return join(DIST_DIR, trimmed, 'index.html');
}

function hashFor(url) {
  const file = urlToDistPath(url);
  if (!existsSync(file)) return null;
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function loadState() {
  if (!existsSync(STATE_FILE)) return { hashes: {} };
  try {
    const data = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
    if (!data.hashes) data.hashes = {};
    return data;
  } catch {
    return { hashes: {} };
  }
}

function saveState(state) {
  const tmp = `${STATE_FILE}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`);
  renameSync(tmp, STATE_FILE);
}

async function submit(urlList, key) {
  const body = {
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${key}.txt`,
    urlList,
  };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => '');
  return { status: res.status, body: text };
}

async function main() {
  const key = loadOrCreateKey();
  const urls = parseSitemap();
  if (urls.length === 0) die('sitemap parsed but contained no zerobalance.pro URLs');

  const state = loadState();
  const nextHashes = { ...state.hashes };
  const toSubmit = [];
  const missing = [];

  for (const url of urls) {
    const hash = hashFor(url);
    if (hash === null) {
      missing.push(url);
      continue;
    }
    nextHashes[url] = hash;
    if (ALL || state.hashes[url] !== hash) toSubmit.push(url);
  }

  // Drop URLs that no longer appear in the sitemap from the next state.
  const sitemapSet = new Set(urls);
  for (const url of Object.keys(nextHashes)) {
    if (!sitemapSet.has(url)) delete nextHashes[url];
  }

  if (missing.length > 0) {
    console.warn(`indexnow: ${missing.length} sitemap URL(s) had no matching dist file (skipped):`);
    for (const u of missing.slice(0, 5)) console.warn(`  - ${u}`);
    if (missing.length > 5) console.warn(`  ... and ${missing.length - 5} more`);
  }

  console.log(`indexnow: ${urls.length} URLs in sitemap, ${toSubmit.length} to submit${ALL ? ' (--all)' : ''}.`);

  if (toSubmit.length === 0) {
    console.log('indexnow: nothing to submit.');
    return;
  }

  if (DRY) {
    console.log('indexnow: --dry-run, would submit:');
    for (const u of toSubmit) console.log(`  ${u}`);
    return;
  }

  for (let i = 0; i < toSubmit.length; i += BATCH_SIZE) {
    const batch = toSubmit.slice(i, i + BATCH_SIZE);
    const { status, body } = await submit(batch, key);
    if (status < 200 || status >= 300) {
      console.error(`indexnow: HTTP ${status} from ${ENDPOINT}`);
      if (body) console.error(`indexnow: response body: ${body.slice(0, 500)}`);
      die('submission failed, state not updated');
    }
    console.log(`indexnow: HTTP ${status} for batch of ${batch.length} URL(s).`);
  }

  state.hashes = nextHashes;
  state.lastSubmittedAt = new Date().toISOString();
  saveState(state);
  console.log(`indexnow: state written to ${STATE_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
