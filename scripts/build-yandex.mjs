#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { MIRROR_LOCALES, prepareYandexBuild } from './prepare-yandex-build.mjs';

const root = process.cwd();
const outDir = process.argv[2] || 'dist-ru';
const environment = {
  ...process.env,
  PUBLIC_SITE_DOMAIN: 'https://zerobalanceapp.ru',
  PUBLIC_SITE_LOCALES: MIRROR_LOCALES.join(','),
  PUBLIC_SITE_DEFAULT_LOCALE: 'ru',
  MARKDOWN_DIST_DIR: outDir,
};

execFileSync(process.execPath, [join(root, 'scripts', 'build.mjs'), '--outDir', outDir], {
  cwd: root,
  env: environment,
  stdio: 'inherit',
});
prepareYandexBuild(outDir, root);
