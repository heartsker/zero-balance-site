#!/usr/bin/env node
// Purge the Yandex CDN edge cache for the RU mirror (zerobalanceapp.ru) via `yc`.
//
// The CDN fronting the bucket caches every path for ~24h at the edge AND ignores
// query strings, so a fresh deploy stays invisible for up to a day without a purge
// - most visibly on the heavily-hit root `/`. `npm run deploy:yandex` runs this
// automatically; use this script to purge on demand (e.g. after a manual upload,
// or to flush a single page).
//
// Usage:
//   node scripts/purge-cdn.mjs                          # purge everything (/*)
//   node scripts/purge-cdn.mjs --path=/ --path=/blog/   # purge only these paths
//   node scripts/purge-cdn.mjs --resource-id=<id>       # override the CDN resource
//   node scripts/purge-cdn.mjs --dry-run                # print the yc command, don't run
//
// Requires the `yc` (Yandex Cloud) CLI, authenticated with access to the CDN
// resource. The resource id is not a secret; it defaults to the zerobalanceapp.ru
// resource and can be overridden with --resource-id or YANDEX_CDN_RESOURCE_ID.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// The zerobalanceapp.ru CDN resource. Not a secret (the CNAME is public); kept
// here so the script works out of the box. Override via --resource-id or env.
const DEFAULT_RESOURCE_ID = 'bc8raiqxbyivnvuxk2xh';

// Pull YANDEX_CDN_RESOURCE_ID from the gitignored .env so a standalone run sees
// the same override `deploy.mjs` does. Pre-existing shell env wins, so an explicit
// export is never clobbered.
function loadEnv() {
  const f = join(ROOT, '.env');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
}
loadEnv();

const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((a) => !a.includes('=')));
const valued = rawArgs
  .filter((a) => a.startsWith('--') && a.includes('='))
  .map((a) => {
    const i = a.indexOf('=');
    return [a.slice(2, i), a.slice(i + 1)];
  });

const DRY = flags.has('--dry-run');
const resourceId =
  valued.find(([k]) => k === 'resource-id')?.[1] ||
  process.env.YANDEX_CDN_RESOURCE_ID ||
  DEFAULT_RESOURCE_ID;

// `--path` may repeat; default to a full purge.
const paths = valued.filter(([k]) => k === 'path').map(([, v]) => v);
if (paths.length === 0) paths.push('/*');

if (!resourceId) {
  console.error('purge-cdn: no CDN resource id (set --resource-id or YANDEX_CDN_RESOURCE_ID).');
  process.exit(1);
}

const pathArgs = paths.map((p) => `--path '${p}'`).join(' ');
const cmd = `yc cdn cache purge --resource-id ${resourceId} ${pathArgs}`;

console.log(`purge-cdn: ${DRY ? '[dry-run] ' : ''}${cmd}`);
if (DRY) process.exit(0);

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`purge-cdn: purged ${paths.join(', ')} on ${resourceId}`);
} catch (err) {
  console.error(`purge-cdn: failed (is \`yc\` installed and authenticated?): ${err.message}`);
  process.exit(1);
}
