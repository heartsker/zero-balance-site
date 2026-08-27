#!/usr/bin/env node
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const ALL_LOCALES = ['en', 'ru', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt-BR', 'tr'];
export const MIRROR_LOCALES = ['ru', 'en'];

function stripRuPrefixRefs(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      stripRuPrefixRefs(path);
    } else if (/\.(html|xml|txt|md)$/.test(entry.name)) {
      const before = readFileSync(path, 'utf8');
      const after = before
        .split('https://zerobalanceapp.ru/ru/').join('https://zerobalanceapp.ru/')
        .replace(/(?<!\w)\/ru\//g, '/');
      if (after !== before) writeFileSync(path, after);
    }
  }
}

export function prepareYandexBuild(outDir, root = process.cwd()) {
  const output = resolve(root, outDir);
  if (!existsSync(output)) throw new Error(`Yandex build output does not exist: ${output}`);

  for (const locale of ALL_LOCALES) {
    if (MIRROR_LOCALES.includes(locale)) continue;
    const directory = join(output, locale);
    if (existsSync(directory)) {
      rmSync(directory, { recursive: true, force: true });
      console.log(`pruned ${outDir}/${locale}/`);
    }
  }

  const russianDirectory = join(output, 'ru');
  if (!existsSync(russianDirectory)) {
    throw new Error(`Russian locale output is missing: ${russianDirectory}`);
  }

  cpSync(russianDirectory, output, { recursive: true, force: true });
  rmSync(russianDirectory, { recursive: true, force: true });
  stripRuPrefixRefs(output);
  console.log(`flattened ${outDir}/ru/ -> ${outDir}/`);
}

const isEntrypoint = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isEntrypoint) {
  prepareYandexBuild(process.argv[2] || 'dist-ru');
}
