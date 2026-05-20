import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from "@astrojs/cloudflare";

const LOCALES = ['en', 'ru', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt-BR', 'tr'];

export default defineConfig({
  site: 'https://zerobalance.pro',
  trailingSlash: 'always',

  build: {
    format: 'directory',
  },

  i18n: {
    defaultLocale: 'en',
    locales: LOCALES,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: Object.fromEntries(LOCALES.map((l) => [l, l])),
      },
    }),
    mdx(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare()
});