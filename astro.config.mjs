import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const ALL_LOCALES = ['en', 'ru', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt-BR', 'tr'];

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
      // On a single-locale (RU) build, keep only that locale's URLs so the sitemap
      // never lists pages pruned after build (e.g. the en+ru blog's /en/ pages).
      filter: (page) =>
        LOCALES.length > 1 || LOCALES.some((l) => page.includes(`/${l}/`)),
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
