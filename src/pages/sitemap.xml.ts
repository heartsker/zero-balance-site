import type { APIRoute } from 'astro';
import { DOMAIN } from '../lib/siteConfig';

// @astrojs/sitemap emits `sitemap-index.xml`, and the global site rewrites
// `/sitemap.xml` -> that file via `_redirects`. The Yandex mirror has no edge
// rewrites, so `/sitemap.xml` would 404 there - and Google Search Console
// pre-fills exactly that name, which is why a submission of `sitemap.xml` reads
// as "could not be read". Serving the index at the conventional path on every
// build makes both names resolve everywhere.
const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${DOMAIN}/sitemap-0.xml</loc></sitemap></sitemapindex>
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
