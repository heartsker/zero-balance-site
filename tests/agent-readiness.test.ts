import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { load } from 'cheerio';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import worker, { markdownPathFor, negotiateRepresentation } from '../worker/index';

const DIST = join(process.cwd(), 'dist');
const RU_DIST = join(process.cwd(), 'dist-test-ru');
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes, use=full';
const require = createRequire(import.meta.url);

interface RouterResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  isBase64Encoded: boolean;
}

const { createHandler } = require('../serverless/yandex-agent-router/function/index.js') as {
  createHandler(options: { siteRoot: string }):
    (event: Record<string, unknown>) => Promise<RouterResponse>;
};

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return files.flat();
}

function envFor(routes: Record<string, { body: string; status?: number; type: string }>) {
  return {
    ASSETS: {
      async fetch(request: Request) {
        const route = routes[new URL(request.url).pathname] ?? {
          body: '<main id="main"><h1>Page not found</h1><a href="/llms.txt">Agent instructions</a></main>',
          status: 404,
          type: 'text/html',
        };
        return new Response(request.method === 'HEAD' ? null : route.body, {
          status: route.status ?? 200,
          headers: { 'Content-Type': `${route.type}; charset=utf-8` },
        });
      },
    },
  };
}

const routes = {
  '/en/': {
    body: '<main id="main"><h1>Zero Balance</h1><h2>Plan</h2><p>HTML</p></main>',
    type: 'text/html',
  },
  '/en/index.md': {
    body: '# Zero Balance\n\n## Plan\n\nMarkdown\n',
    type: 'text/markdown',
  },
  '/404.md': {
    body: '# Page not found\n\n- [Homepage](https://zerobalance.pro/en/)\n- [Sitemap](https://zerobalance.pro/sitemap-index.xml)\n- [Agent instructions](https://zerobalance.pro/llms.txt)\n',
    type: 'text/markdown',
  },
};

describe('Accept negotiation', () => {
  it.each([
    [null, 'html'],
    ['text/html', 'html'],
    ['text/markdown', 'markdown'],
    ['text/html, text/markdown;q=0.5', 'html'],
    ['text/markdown, text/html;q=0.5', 'markdown'],
    ['text/*;q=0.8, text/markdown;q=0.9', 'markdown'],
    ['text/markdown;q=0, text/html;q=0.7', 'html'],
    ['*/*', 'html'],
    ['application/json', null],
    ['text/html;q=0, text/markdown;q=0', null],
  ])('selects %s as %s', (accept, expected) => {
    expect(negotiateRepresentation(accept)).toBe(expected);
  });

  it.each([
    ['/en/', '/en/index.md'],
    ['/en/help/', '/en/help/index.md'],
    ['/en/help.html', '/en/help.md'],
    ['/404/', '/404.md'],
  ])('maps %s to %s', (path, expected) => {
    expect(markdownPathFor(path)).toBe(expected);
  });
});

describe('Worker representations', () => {
  it('returns HTML by default with cache-safe discovery headers', async () => {
    const response = await worker.fetch(new Request('https://zerobalance.pro/en/'), envFor(routes));
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/html');
    expect(response.headers.get('Vary')).toContain('Accept');
    expect(response.headers.get('Vary')).toContain('Accept-Encoding');
    expect(response.headers.get('Link')).toContain('/en/index.md');
    expect(response.headers.get('Link')).toContain('/llms.txt');
    expect(response.headers.get('Content-Signal')).toBe(CONTENT_SIGNAL);
    expect(await response.text()).toContain('HTML');
  });

  it('returns generated Markdown from the same URL', async () => {
    const response = await worker.fetch(
      new Request('https://zerobalance.pro/en/', { headers: { Accept: 'text/markdown' } }),
      envFor(routes),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/markdown');
    expect(response.headers.get('Vary')).toBe('Accept, Accept-Encoding');
    expect(await response.text()).toContain('# Zero Balance');
  });

  it('returns 406 when neither published representation is acceptable', async () => {
    const response = await worker.fetch(
      new Request('https://zerobalance.pro/en/', { headers: { Accept: 'application/json' } }),
      envFor(routes),
    );
    expect(response.status).toBe(406);
    expect(response.headers.get('Vary')).toContain('Accept');
    expect(await response.text()).toContain('text/html or text/markdown');
  });

  it.each([
    ['text/html', 'text/html', 'Page not found'],
    ['text/markdown', 'text/markdown', 'sitemap-index.xml'],
  ])('preserves a real 404 for %s recovery', async (accept, type, recoveryText) => {
    const response = await worker.fetch(
      new Request('https://zerobalance.pro/missing-agent-test/', { headers: { Accept: accept } }),
      envFor(routes),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain(type);
    expect(response.headers.get('Vary')).toContain('Accept');
    expect(await response.text()).toContain(recoveryText);
  });
});

describe('Yandex agent router', () => {
  let fixture: string;
  let route: (event: Record<string, unknown>) => Promise<RouterResponse>;

  beforeAll(async () => {
    fixture = await mkdtemp(join(tmpdir(), 'zero-balance-agent-router-'));
    await mkdir(join(fixture, 'about'), { recursive: true });
    await mkdir(join(fixture, 'api'), { recursive: true });
    await writeFile(join(fixture, 'index.html'), '<main><h1>Zero Balance RU</h1><p>HTML</p></main>');
    await writeFile(join(fixture, 'index.md'), '# Zero Balance RU\n\nMarkdown\n');
    await writeFile(join(fixture, 'about', 'index.html'), '<main><h1>About</h1></main>');
    await writeFile(join(fixture, 'about', 'index.md'), '# About\n');
    await writeFile(join(fixture, '404.html'), '<main><h1>Page not found</h1><a href="/sitemap-index.xml">Sitemap</a><a href="/llms.txt">Agent instructions</a></main>');
    await writeFile(join(fixture, '404.md'), '# Page not found\n\n- [Sitemap](/sitemap-index.xml)\n- [Agent instructions](/llms.txt)\n');
    await writeFile(join(fixture, 'api', 'feature_flags.json'), '{"enabled":true}\n');
    route = createHandler({ siteRoot: fixture });
  });

  afterAll(async () => {
    await rm(fixture, { recursive: true, force: true });
  });

  const request = (path: string, accept = 'text/html', method = 'GET') => ({
    path,
    httpMethod: method,
    headers: { Accept: accept },
  });

  it('serves HTML and negotiated Markdown with the shared contract', async () => {
    const html = await route(request('/'));
    expect(html.statusCode).toBe(200);
    expect(html.headers['Content-Type']).toContain('text/html');
    expect(html.headers.Vary).toBe('Accept, Accept-Encoding');
    expect(html.headers.Link).toContain('/index.md');
    expect(html.headers['Content-Signal']).toBe(CONTENT_SIGNAL);
    expect(html.body).toContain('Zero Balance RU');

    const markdown = await route(request('/', 'text/markdown'));
    expect(markdown.statusCode).toBe(200);
    expect(markdown.headers['Content-Type']).toContain('text/markdown');
    expect(markdown.headers['X-Robots-Tag']).toContain('noindex');
    expect(markdown.body).toContain('# Zero Balance RU');
  });

  it('returns negotiated recovery bodies with a real 404 status', async () => {
    const html = await route(request('/missing/'));
    expect(html.statusCode).toBe(404);
    expect(html.headers['Content-Type']).toContain('text/html');
    expect(html.body).toContain('llms.txt');

    const markdown = await route(request('/missing/', 'text/markdown'));
    expect(markdown.statusCode).toBe(404);
    expect(markdown.headers['Content-Type']).toContain('text/markdown');
    expect(markdown.body).toContain('sitemap-index.xml');
  });

  it('supports HEAD, canonical slash redirects, aliases, and 406 responses', async () => {
    const head = await route(request('/', 'text/markdown', 'HEAD'));
    expect(head.statusCode).toBe(200);
    expect(head.body).toBe('');

    const redirect = await route(request('/about'));
    expect(redirect.statusCode).toBe(308);
    expect(redirect.headers.Location).toBe('/about/');

    const flags = await route(request('/api/feature_flags', 'application/json'));
    expect(flags.statusCode).toBe(200);
    expect(flags.headers['Content-Type']).toContain('application/json');
    expect(JSON.parse(flags.body)).toEqual({ enabled: true });

    const unacceptable = await route(request('/', 'application/json'));
    expect(unacceptable.statusCode).toBe(406);
    expect(unacceptable.body).toContain('text/html or text/markdown');
  });

  it('rejects traversal and methods outside the public contract', async () => {
    expect((await route(request('/%2e%2e/secret'))).statusCode).toBe(400);
    const post = await route(request('/', 'text/html', 'POST'));
    expect(post.statusCode).toBe(405);
    expect(post.headers.Allow).toBe('GET, HEAD');
  });
});

describe('built agent surfaces', () => {
  it('generates a direct noindex Markdown alternative for every content page', async () => {
    const files = await walk(DIST);
    const htmlFiles = files.filter((file) => file.endsWith('.html'));
    let checked = 0;
    for (const htmlFile of htmlFiles) {
      const source = relative(DIST, htmlFile);
      const $ = load(await readFile(htmlFile, 'utf8'));
      if (!$('main#main').length && source !== '404.html') continue;
      const markdownFile = htmlFile.endsWith('/index.html')
        ? join(htmlFile.slice(0, -'index.html'.length), 'index.md')
        : htmlFile.replace(/\.html$/, '.md');
      const markdown = await readFile(markdownFile, 'utf8');
      expect(markdown).toMatch(/^---\n/);
      expect(markdown).toMatch(/\n# /);
      checked += 1;
    }
    expect(checked).toBeGreaterThan(600);

    const headers = await readFile(join(DIST, '_headers'), 'utf8');
    expect(headers).toContain('/*.md');
    expect(headers).toContain('X-Robots-Tag: noindex, nofollow');
  });

  it('publishes a root Markdown alias for the default-locale homepage', async () => {
    const rootMarkdown = await readFile(join(DIST, 'index.md'), 'utf8');
    const defaultLocaleMarkdown = await readFile(join(DIST, 'en/index.md'), 'utf8');
    expect(rootMarkdown).toBe(defaultLocaleMarkdown);
    expect(rootMarkdown).toMatch(/^---\n/);
    expect(rootMarkdown).toContain('\n# ');
  });

  it.each([
    'en/index.html',
    'en/about/index.html',
    'en/contact/index.html',
    'en/privacy/index.html',
    'ru/about/index.html',
    'ru/contact/index.html',
  ])('%s has one H1, structured headings, and substantial raw content', async (path) => {
    const $ = load(await readFile(join(DIST, path), 'utf8'));
    expect($('h1')).toHaveLength(1);
    expect($('h2').length).toBeGreaterThan(0);
    expect($('h3').length).toBeGreaterThan(0);

    const levels = $('h1, h2, h3').map((_, heading) => Number(heading.tagName.slice(1))).get();
    for (let index = 1; index < levels.length; index += 1) {
      expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
    }
    expect($('main#main').text().replace(/\s+/g, ' ').trim().length).toBeGreaterThan(500);
  });

  it('publishes llms.txt v2 guidance with valid curated Markdown links', async () => {
    const llms = await readFile(join(DIST, 'llms.txt'), 'utf8');
    const nonblank = llms.split('\n').filter((line) => line.trim());
    expect(nonblank[0]).toBe('# Zero Balance');
    expect(nonblank[1]).toMatch(/^> /);
    expect(llms).toContain('**When to use Zero Balance**');
    expect(llms).toContain('Never request an Apple Account password');
    expect(llms).toContain('## Essential');
    expect(llms).toContain('## Optional');

    const links = [...llms.matchAll(/\]\((https:\/\/zerobalance\.pro\/[^)]+\.md)\)/g)];
    expect(links.length).toBeGreaterThanOrEqual(6);
    for (const [, link] of links) {
      await expect(readFile(join(DIST, new URL(link).pathname), 'utf8')).resolves.toContain('---');
    }
  });

  it('publishes crawler-positive robots and sitemap trust routes', async () => {
    const robots = await readFile(join(DIST, 'robots.txt'), 'utf8');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Disallow: /api/');
    expect(robots).toContain(`Content-Signal: ${CONTENT_SIGNAL}`);
    expect(robots).not.toMatch(/User-agent: (GPTBot|ClaudeBot|Google-Extended|PerplexityBot)/);

    const sitemapFiles = (await walk(DIST)).filter((file) => /sitemap-\d+\.xml$/.test(file));
    const sitemap = (await Promise.all(sitemapFiles.map((file) => readFile(file, 'utf8')))).join('\n');
    for (const locale of ['en', 'ru', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt-BR', 'tr']) {
      expect(sitemap).toContain(`https://zerobalance.pro/${locale}/about/`);
      expect(sitemap).toContain(`https://zerobalance.pro/${locale}/contact/`);
    }
  });

  it('publishes canonical discovery metadata and an email-only entity graph', async () => {
    const $ = load(await readFile(join(DIST, 'en/about/index.html'), 'utf8'));
    expect($('link[rel="canonical"]').attr('href')).toBe('https://zerobalance.pro/en/about/');
    expect($('link[rel="alternate"][type="text/markdown"]').attr('href')).toBe('https://zerobalance.pro/en/about/index.md');
    expect($('link[rel="describedby"]').attr('href')).toBe('https://zerobalance.pro/llms.txt');
    expect($('title').text()).toContain('Zero Balance');
    expect($('meta[name="description"]').attr('content')).toContain('Apple Account balance');

    const schemas = $('script[type="application/ld+json"]').map((_, element) =>
      JSON.parse($(element).text()) as Record<string, unknown>
    ).get() as Array<Record<string, unknown>>;
    const organization = schemas.find((schema) => schema['@type'] === 'Organization');
    const website = schemas.find((schema) => schema['@type'] === 'WebSite');
    expect(organization).toMatchObject({
      '@id': 'https://zerobalance.pro/#org',
      name: 'Zero Balance',
      alternateName: 'Zero Balance: Spend Credit',
      email: 'developer.ios.dp@gmail.com',
      contactPoint: { contactType: 'customer support', email: 'developer.ios.dp@gmail.com' },
    });
    expect(organization).not.toHaveProperty('address');
    expect(organization).not.toHaveProperty('telephone');
    expect(organization?.['contactPoint']).not.toHaveProperty('telephone');
    expect(website?.['publisher']).toEqual({ '@id': 'https://zerobalance.pro/#org' });
  });
});

describe('flattened Russian mirror', () => {
  it('serves Russian at the root and preserves English under /en', async () => {
    const rootHtml = await readFile(join(RU_DIST, 'index.html'), 'utf8');
    const $ = load(rootHtml);
    expect($('html').attr('lang')).toBe('ru');
    expect($('link[rel="canonical"]').attr('href')).toBe('https://zerobalanceapp.ru/');
    expect($('link[rel="alternate"][type="text/markdown"]').attr('href')).toBe('https://zerobalanceapp.ru/index.md');
    expect(rootHtml).not.toMatch(/zerobalanceapp\.ru\/ru\//);
    await expect(readFile(join(RU_DIST, 'en/index.html'), 'utf8')).resolves.toContain('lang="en"');
    await expect(readFile(join(RU_DIST, 'ru/index.html'), 'utf8')).rejects.toThrow();
  });

  it('publishes root Markdown, agent instructions, and canonical sitemap URLs', async () => {
    const rootMarkdown = await readFile(join(RU_DIST, 'index.md'), 'utf8');
    expect(rootMarkdown).toMatch(/^---\n/);
    expect(rootMarkdown).toContain('\n# ');

    const llms = await readFile(join(RU_DIST, 'llms.txt'), 'utf8');
    expect(llms).toContain('**When to use Zero Balance**');
    expect(llms).toContain('Zero Balance has no public API');
    expect(llms).not.toContain('zerobalanceapp.ru/ru/');
    const links = [...llms.matchAll(/\]\((https:\/\/zerobalanceapp\.ru\/[^)]+\.md)\)/g)];
    expect(links.length).toBeGreaterThanOrEqual(6);
    for (const [, link] of links) {
      await expect(readFile(join(RU_DIST, new URL(link).pathname), 'utf8')).resolves.toContain('---');
    }

    const sitemap = await readFile(join(RU_DIST, 'sitemap-0.xml'), 'utf8');
    expect(sitemap).toContain('<loc>https://zerobalanceapp.ru/</loc>');
    expect(sitemap).toContain('<loc>https://zerobalanceapp.ru/about/</loc>');
    expect(sitemap).toContain('<loc>https://zerobalanceapp.ru/en/</loc>');
    expect(sitemap).not.toContain('zerobalanceapp.ru/ru/');
  });

  it.each(['about/index.html', 'contact/index.html', 'privacy/index.html']) (
    '%s is a substantial Russian trust page',
    async (path) => {
      const $ = load(await readFile(join(RU_DIST, path), 'utf8'));
      expect($('html').attr('lang')).toBe('ru');
      expect($('h1')).toHaveLength(1);
      expect($('h2').length).toBeGreaterThan(0);
      expect($('main#main').text().replace(/\s+/g, ' ').trim().length).toBeGreaterThan(500);
    },
  );

  it('keeps the Russian entity graph email-only', async () => {
    const $ = load(await readFile(join(RU_DIST, 'about/index.html'), 'utf8'));
    const schemas = $('script[type="application/ld+json"]').map((_, element) =>
      JSON.parse($(element).text()) as Record<string, unknown>
    ).get() as Array<Record<string, unknown>>;
    const organization = schemas.find((schema) => schema['@type'] === 'Organization');
    expect(organization).toMatchObject({
      '@id': 'https://zerobalanceapp.ru/#org',
      email: 'developer.ios.dp@gmail.com',
      contactPoint: { email: 'developer.ios.dp@gmail.com' },
    });
    expect(organization).not.toHaveProperty('address');
    expect(organization).not.toHaveProperty('telephone');
  });
});
