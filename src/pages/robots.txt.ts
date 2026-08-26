import type { APIRoute } from 'astro';
import { DOMAIN } from '../lib/siteConfig';

// Generated (not a static public/ file) so the Sitemap line points at THIS build's
// host: zerobalance.pro for the global site, zerobalanceapp.ru for the RU mirror.
// It also targets the real sitemap-index.xml: the global site rewrites
// /sitemap.xml -> /sitemap-index.xml via _redirects, but that file is Cloudflare-only,
// so on the Yandex mirror only the -index URL actually resolves.
const body = `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes, use=full
Allow: /
Disallow: /api/

Sitemap: ${DOMAIN}/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Signal': 'search=yes, ai-input=yes, ai-train=yes, use=full',
    },
  });
