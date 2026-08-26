#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { load } from 'cheerio';
import TurndownService from 'turndown';

const ROOT = process.cwd();
const DIST = join(ROOT, process.env.MARKDOWN_DIST_DIR || 'dist');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function markdownOutputPath(htmlPath) {
  return htmlPath.endsWith('/index.html')
    ? join(dirname(htmlPath), 'index.md')
    : htmlPath.replace(/\.html$/, '.md');
}

function yamlValue(value) {
  return JSON.stringify(value.replace(/\s+/g, ' ').trim());
}

function absoluteUrl(value, base) {
  if (!value || value.startsWith('#') || /^(mailto|tel|data|javascript):/i.test(value)) {
    return value;
  }
  try {
    return new URL(value, base).href;
  } catch {
    return value;
  }
}

function createMarkdown(html, sourcePath) {
  const $ = load(html);
  let content = $('main#main').first();
  if (!content.length && sourcePath === '404.html') content = $('body').first();
  if (!content.length) return null;

  const canonical = $('link[rel="canonical"]').attr('href') ?? 'https://zerobalance.pro/';
  const title = $('title').first().text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim();
  const image = $('meta[property="og:image"]').attr('content')?.trim();
  const fragment = content.clone();

  fragment.find('script, style, noscript, template, svg, dialog, button').remove();
  fragment.find('[aria-hidden="true"]').remove();
  fragment.find('a[href]').each((_, element) => {
    const link = $(element);
    link.attr('href', absoluteUrl(link.attr('href'), canonical));
  });
  fragment.find('img[src]').each((_, element) => {
    const imageElement = $(element);
    imageElement.attr('src', absoluteUrl(imageElement.attr('src'), canonical));
    imageElement.removeAttr('srcset');
  });

  const converter = new TurndownService({
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    headingStyle: 'atx',
    strongDelimiter: '**',
  });
  const body = converter
    .turndown(fragment.html() ?? '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!body) return null;

  const frontmatter = [
    '---',
    title ? `title: ${yamlValue(title)}` : null,
    description ? `description: ${yamlValue(description)}` : null,
    `canonical: ${yamlValue(canonical)}`,
    image ? `image: ${yamlValue(image)}` : null,
    '---',
  ].filter(Boolean).join('\n');

  const schemas = $('script[type="application/ld+json"]')
    .map((_, element) => $(element).text().trim())
    .get()
    .filter(Boolean);
  const structuredData = schemas.length
    ? `\n\n\`\`\`json\n${schemas.join('\n')}\n\`\`\``
    : '';

  return `${frontmatter}\n\n${body}${structuredData}\n`;
}

const htmlFiles = (await walk(DIST)).filter((path) => path.endsWith('.html'));
let generated = 0;
let skipped = 0;

for (const htmlPath of htmlFiles) {
  const sourcePath = relative(DIST, htmlPath);
  const markdown = createMarkdown(await readFile(htmlPath, 'utf8'), sourcePath);
  if (!markdown) {
    skipped += 1;
    continue;
  }
  await writeFile(markdownOutputPath(htmlPath), markdown, 'utf8');
  generated += 1;
}

console.log(`markdown: generated ${generated} representation(s), skipped ${skipped} non-content HTML file(s)`);
