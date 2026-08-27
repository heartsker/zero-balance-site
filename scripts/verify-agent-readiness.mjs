#!/usr/bin/env node
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const FETCH_ORIGIN = (process.argv[2] || process.env.AGENT_VERIFY_ORIGIN || 'https://zerobalance.pro').replace(/\/$/, '');
const CANONICAL_ORIGIN = (process.env.AGENT_VERIFY_CANONICAL_ORIGIN || FETCH_ORIGIN).replace(/\/$/, '');
const IS_RU_SITE = CANONICAL_ORIGIN.includes('zerobalanceapp.ru');
const HOME_PATH = process.env.AGENT_VERIFY_HOME_PATH || (IS_RU_SITE ? '/' : '/en/');
const MIN_URLS = Number(process.env.AGENT_VERIFY_MIN_URLS || (IS_RU_SITE ? 40 : 600));
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes, use=full';
const CRAWLERS = [
  'ChatGPT-User',
  'GPTBot',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'PerplexityBot',
  'DeepSeekBot',
  'ora-agent',
];

const failures = [];
let assertions = 0;

function check(condition, message) {
  assertions += 1;
  if (!condition) failures.push(message);
}

async function fetchChecked(pathOrUrl, init = {}) {
  const logicalUrl = new URL(pathOrUrl, CANONICAL_ORIGIN);
  const fetchUrl = logicalUrl.origin === CANONICAL_ORIGIN
    ? new URL(`${logicalUrl.pathname}${logicalUrl.search}`, FETCH_ORIGIN)
    : logicalUrl;
  try {
    return await fetch(fetchUrl, { redirect: 'follow', ...init });
  } catch (error) {
    const route = fetchUrl.href === logicalUrl.href
      ? logicalUrl.href
      : `${logicalUrl.href} via ${fetchUrl.href}`;
    failures.push(`${route}: request failed (${error.message})`);
    return null;
  }
}

function locations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&'));
}

async function runPool(items, concurrency, task) {
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
}

function markdownPath(pathname) {
  if (pathname.endsWith('/')) return `${pathname}index.md`;
  if (pathname.endsWith('.html')) return pathname.replace(/\.html$/, '.md');
  return `${pathname}.md`;
}

const sitemapIndex = await fetchChecked('/sitemap-index.xml', { headers: { Accept: 'application/xml' } });
check(sitemapIndex?.status === 200, '/sitemap-index.xml must return 200');
const sitemapIndexBody = sitemapIndex ? await sitemapIndex.text() : '';
const sitemapUrls = locations(sitemapIndexBody);
check(sitemapUrls.length > 0, 'sitemap index must list at least one sitemap');

const pageUrls = [];
for (const sitemapUrl of sitemapUrls) {
  const response = await fetchChecked(sitemapUrl, { headers: { Accept: 'application/xml' } });
  check(response?.status === 200, `${sitemapUrl}: sitemap must return 200`);
  if (response) pageUrls.push(...locations(await response.text()));
}
const canonicalUrls = [...new Set(pageUrls)];
check(canonicalUrls.length >= MIN_URLS, `expected at least ${MIN_URLS} sitemap URLs, received ${canonicalUrls.length}`);
for (const pageUrl of canonicalUrls) {
  check(new URL(pageUrl).origin === CANONICAL_ORIGIN, `${pageUrl}: canonical URL uses the wrong origin`);
}
console.log(`production: checking ${canonicalUrls.length} canonical URLs through ${FETCH_ORIGIN}`);

await runPool(canonicalUrls, 8, async (pageUrl, index) => {
  const html = await fetchChecked(pageUrl, { headers: { Accept: 'text/html' } });
  check(html?.status === 200, `${pageUrl}: HTML status ${html?.status ?? 'request failed'}`);
  check(html?.headers.get('content-type')?.includes('text/html'), `${pageUrl}: HTML content type missing`);
  check(html?.headers.get('content-signal') === CONTENT_SIGNAL, `${pageUrl}: Content-Signal missing`);
  const htmlVary = html?.headers.get('vary')?.toLowerCase() ?? '';
  check(htmlVary.includes('accept'), `${pageUrl}: HTML Vary is missing Accept`);
  check(htmlVary.includes('accept-encoding'), `${pageUrl}: HTML Vary is missing Accept-Encoding`);
  if (html) {
    const body = await html.text();
    check(body.includes('<h1'), `${pageUrl}: raw HTML has no H1`);
    check(body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length > 500, `${pageUrl}: raw HTML content is too short`);
  }

  const markdown = await fetchChecked(pageUrl, { headers: { Accept: 'text/markdown' } });
  check(markdown?.status === 200, `${pageUrl}: negotiated Markdown status ${markdown?.status ?? 'request failed'}`);
  check(markdown?.headers.get('content-type')?.includes('text/markdown'), `${pageUrl}: Markdown content type missing`);
  const vary = markdown?.headers.get('vary')?.toLowerCase() ?? '';
  check(vary.includes('accept'), `${pageUrl}: Vary is missing Accept`);
  check(vary.includes('accept-encoding'), `${pageUrl}: Vary is missing Accept-Encoding`);
  if (markdown) check((await markdown.text()).includes('\n# '), `${pageUrl}: negotiated Markdown has no H1`);

  const directUrl = new URL(markdownPath(new URL(pageUrl).pathname), CANONICAL_ORIGIN);
  const direct = await fetchChecked(directUrl.href, { headers: { Accept: 'text/markdown' } });
  check(direct?.status === 200, `${directUrl.href}: direct Markdown status ${direct?.status ?? 'request failed'}`);
  check(direct?.headers.get('content-type')?.includes('text/markdown'), `${directUrl.href}: direct Markdown content type missing`);
  check(direct?.headers.get('x-robots-tag')?.toLowerCase().includes('noindex'), `${directUrl.href}: direct Markdown must be noindex`);
  if ((index + 1) % 100 === 0) console.log(`production: checked ${index + 1}/${canonicalUrls.length} URLs`);
});

for (const crawler of CRAWLERS) {
  const response = await fetchChecked(HOME_PATH, { headers: { 'User-Agent': crawler, Accept: 'text/html' } });
  check(response?.status === 200, `${crawler}: homepage status ${response?.status ?? 'request failed'}`);
}

for (const [accept, expectedType, expectedStatus] of [
  ['text/html, text/markdown;q=0.5', 'text/html', 200],
  ['text/markdown, text/html;q=0.5', 'text/markdown', 200],
  ['application/json', 'text/markdown', 406],
]) {
  const response = await fetchChecked(HOME_PATH, { headers: { Accept: accept } });
  check(response?.status === expectedStatus, `${accept}: expected ${expectedStatus}, received ${response?.status}`);
  check(response?.headers.get('content-type')?.includes(expectedType), `${accept}: expected ${expectedType}`);
}

const missingPath = `/agent-readiness-missing-${Date.now()}`;
for (const path of [missingPath, `${missingPath}/`]) {
  for (const [accept, type] of [
    ['text/html', 'text/html'],
    ['text/markdown, text/plain;q=0.9, text/html;q=0.8', 'text/markdown'],
  ]) {
    const response = await fetchChecked(path, { headers: { Accept: accept } });
    check(response?.status === 404, `${path} ${accept}: must preserve 404`);
    check(response?.headers.get('content-type')?.includes(type), `${path} ${accept}: wrong content type`);
    if (response) {
      const body = await response.text();
      check(body.includes('llms.txt'), `${path} ${accept}: llms.txt recovery link missing`);
      check(body.includes('sitemap-index.xml'), `${path} ${accept}: sitemap recovery link missing`);
    }
  }
}

const robots = await fetchChecked('/robots.txt');
const robotsBody = robots ? await robots.text() : '';
check(robots?.status === 200, '/robots.txt must return 200');
check(robotsBody.includes('Allow: /'), '/robots.txt must allow crawling');
check(robotsBody.includes('Disallow: /api/'), '/robots.txt must exclude /api/');
check(robotsBody.includes(`Content-Signal: ${CONTENT_SIGNAL}`), '/robots.txt must allow all selected content uses');
check(!/User-agent: (GPTBot|ClaudeBot|Google-Extended|PerplexityBot)/i.test(robotsBody), '/robots.txt still contains managed AI bot blocks');

const llms = await fetchChecked('/llms.txt');
const llmsBody = llms ? await llms.text() : '';
check(llms?.status === 200, '/llms.txt must return 200');
check(llms?.headers.get('content-type')?.includes('text/markdown'), '/llms.txt must be text/markdown');
check(llmsBody.startsWith('# Zero Balance\n\n> '), '/llms.txt must start with H1 then blockquote');
check(llmsBody.includes('**When to use Zero Balance**'), '/llms.txt must include when-to-use guidance');
check(llmsBody.includes('Never request an Apple Account password'), '/llms.txt must forbid credential requests');

const rootMarkdown = await fetchChecked('/index.md', {
  headers: { Accept: 'text/markdown' },
});
const rootMarkdownBody = rootMarkdown ? await rootMarkdown.text() : '';
check(rootMarkdown?.status === 200, '/index.md must return 200');
check(rootMarkdown?.headers.get('content-type')?.includes('text/markdown'), '/index.md must be text/markdown');
check(rootMarkdownBody.includes('\n# '), '/index.md must contain a Markdown H1');

for (const path of IS_RU_SITE
  ? ['/about/', '/contact/', '/privacy/']
  : ['/en/about/', '/en/contact/', '/en/privacy/']) {
  const response = await fetchChecked(path, { headers: { Accept: 'text/html' } });
  check(response?.status === 200, `${path}: trust page must return 200`);
  if (response) {
    const body = await response.text();
    check(body.includes('<h1'), `${path}: trust page has no H1`);
    check(body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length > 500, `${path}: trust page is too short`);
  }
}

const home = await fetchChecked(HOME_PATH, { headers: { Accept: 'text/html' } });
if (home) {
  const body = await home.text();
  const assetPath = body.match(/(?:src|href)="(\/_astro\/[^"?#]+)"/)?.[1];
  check(Boolean(assetPath), `${HOME_PATH}: no static asset reference found`);
  if (assetPath) {
    const asset = await fetchChecked(assetPath);
    check(asset?.status === 200, `${assetPath}: static asset must return 200`);
    check(!(asset?.headers.get('content-type') ?? '').includes('text/html'), `${assetPath}: static asset returned HTML`);
  }
}

const indexNowKey = (await readdir(join(process.cwd(), 'public'))).find((file) => /^[a-f0-9]{32}\.txt$/.test(file));
check(Boolean(indexNowKey), 'IndexNow key file missing from public/');
const machineEndpoints = [
  ['/sitemap.xml', /xml/],
  ['/sitemap-index.xml', /xml/],
  ['/site.webmanifest', /(manifest|json)/],
  ['/.well-known/apple-app-site-association', /json/],
  ['/api/feature_flags.json', /json/],
  ['/api/feature_flags', /json/],
  ...(indexNowKey ? [[`/${indexNowKey}`, /text\/plain/]] : []),
];
for (const [path, contentType] of machineEndpoints) {
  const response = await fetchChecked(path);
  check(response?.status === 200, `${path}: machine endpoint must return 200`);
  check(contentType.test(response?.headers.get('content-type') ?? ''), `${path}: unexpected content type ${response?.headers.get('content-type')}`);
  if (response) {
    const body = await response.text();
    check(body.trim().length > 0, `${path}: machine endpoint is empty`);
    if (path.includes('feature_flags') || path.includes('apple-app-site')) {
      try { JSON.parse(body); } catch { failures.push(`${path}: invalid JSON`); }
    }
  }
}

if (failures.length) {
  console.error(`\nagent verification failed: ${failures.length} failure(s), ${assertions} assertions`);
  for (const failure of failures.slice(0, 100)) console.error(`- ${failure}`);
  if (failures.length > 100) console.error(`- ... ${failures.length - 100} more`);
  process.exit(1);
}

console.log(`agent verification passed: ${assertions} assertions across ${canonicalUrls.length} sitemap URLs and ${CRAWLERS.length} agent user agents`);
