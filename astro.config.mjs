import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const ALL_LOCALES = ['en', 'ru', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt-BR', 'tr'];

// Read each blog article's own published date from source so the sitemap can
// carry a real <lastmod> per post instead of nothing. Pages without a known
// date fall back to the build time below.
const BLOG_DIR = fileURLToPath(new URL('./src/pages/[lang]/blog', import.meta.url));
const BLOG_DATES = Object.fromEntries(
  readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.astro'))
    .map((f) => readFileSync(`${BLOG_DIR}/${f}`, 'utf8'))
    .map((src) => [
      src.match(/const slug = '([^']+)'/)?.[1],
      src.match(/const (?:modified|published) = '([^']+)'/)?.[1],
    ])
    .filter(([slug, date]) => slug && date),
);
const BUILD_DATE = new Date().toISOString();

// Domain + locale set are env-driven so one source tree builds both targets:
// the global site (all locales, zerobalance.pro) and the Russian-only mirror
// (PUBLIC_SITE_LOCALES=ru, zerobalanceapp.ru). Keep these in sync with src/lib/siteConfig.ts.
const SITE = process.env.PUBLIC_SITE_DOMAIN || 'https://zerobalance.pro';
const IS_RU_SITE = SITE.includes('zerobalanceapp.ru');
const LOCALES = process.env.PUBLIC_SITE_LOCALES
  ? process.env.PUBLIC_SITE_LOCALES.split(',').map((s) => s.trim()).filter(Boolean)
  : ALL_LOCALES;
const DEFAULT_LOCALE = process.env.PUBLIC_SITE_DEFAULT_LOCALE || (IS_RU_SITE ? 'ru' : 'en');

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: LOCALES,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(LOCALES.map((l) => [l, l])),
      },
      // Keep the sitemap to canonical, indexable 200 URLs only.
      // - `/`        : noindex redirect to /<defaultLocale>/ (the Worker owns it on the
      //                global site; the deploy flatten produces the real RU home separately).
      // - /open_app/ : noindex app-redirect helper.
      // Keep this list in sync with any future noindex route (grep dist for `content="noindex`).
      // On a single-locale (RU) build, keep only that locale's URLs so the sitemap never
      // lists pages pruned after build (e.g. the en+ru blog's /en/ pages); that branch
      // already drops the bare `/` redirect (it does not match `/ru/`).
      filter: (page) => {
        const path = new URL(page).pathname;
        if (path === '/open_app/') return false;
        return LOCALES.length > 1
          ? path !== '/'
          : LOCALES.some((l) => page.includes(`/${l}/`));
      },
      // Give every URL a <lastmod>: a blog post's own published date when known,
      // otherwise the build time. Helps Yandex and Google prioritise recrawls.
      serialize(item) {
        const slug = item.url.match(/\/blog\/([^/]+)\/?$/)?.[1];
        item.lastmod = (slug && BLOG_DATES[slug]) || BUILD_DATE;
        return item;
      },
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
