#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const outDirIndex = process.argv.indexOf('--outDir');
const outDir = outDirIndex >= 0 ? process.argv[outDirIndex + 1] : 'dist';

if (!outDir || outDir.startsWith('-')) {
  throw new Error('Usage: npm run build -- [--outDir directory]');
}

const astro = join(ROOT, 'node_modules', '.bin', 'astro');
execFileSync(astro, ['check'], { cwd: ROOT, env: process.env, stdio: 'inherit' });
execFileSync(astro, ['build', '--outDir', outDir], {
  cwd: ROOT,
  env: process.env,
  stdio: 'inherit',
});
execFileSync(process.execPath, [join(ROOT, 'scripts', 'generate-markdown.mjs')], {
  cwd: ROOT,
  env: { ...process.env, MARKDOWN_DIST_DIR: outDir },
  stdio: 'inherit',
});
