// Cloudflare Worker entry for the static site.
//
// This project is deployed as a Worker with static assets (not Cloudflare
// Pages), so a Pages-style `functions/` directory is never invoked. The Worker
// serves the prebuilt Astro output from the ASSETS binding, and special-cases
// the root path `/` to redirect to the visitor's locale (`/<lang>/`).
//
// Locale priority: zb_locale cookie -> Accept-Language header -> geo (CF country)
// -> 'en'. Accept-Language beats geo on purpose: VPNs make the region signal
// unreliable, while the browser's language preference reflects what the user
// actually reads.
//
// Types are declared locally so `astro check` (which typechecks `**/*`) passes
// without pulling in @cloudflare/workers-types.

import {
  markdownPathFor,
  negotiateRepresentation,
  type Representation,
} from '../serverless/yandex-agent-router/function/agent-http.cjs';

export { markdownPathFor, negotiateRepresentation };
export type { Representation };

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

type Locale =
  | 'en'
  | 'ru'
  | 'ar'
  | 'de'
  | 'es'
  | 'fr'
  | 'hi'
  | 'it'
  | 'ja'
  | 'ko'
  | 'pt-BR'
  | 'tr';

const LOCALES: readonly Locale[] = [
  'en',
  'ru',
  'ar',
  'de',
  'es',
  'fr',
  'hi',
  'it',
  'ja',
  'ko',
  'pt-BR',
  'tr',
];
const DEFAULT_LOCALE: Locale = 'en';
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes, use=full';

const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', UA: 'ru',
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es',
  UY: 'es', PY: 'es', BO: 'es', CR: 'es', CU: 'es', DO: 'es', GT: 'es', HN: 'es',
  NI: 'es', PA: 'es', SV: 'es', PR: 'es',
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', SN: 'fr', CI: 'fr', CM: 'fr',
  IT: 'it', SM: 'it', VA: 'it',
  JP: 'ja',
  KR: 'ko', KP: 'ko',
  BR: 'pt-BR', PT: 'pt-BR', AO: 'pt-BR', MZ: 'pt-BR',
  TR: 'tr', CY: 'tr',
  SA: 'ar', AE: 'ar', EG: 'ar', IQ: 'ar', JO: 'ar', KW: 'ar', LB: 'ar',
  LY: 'ar', MA: 'ar', OM: 'ar', QA: 'ar', SY: 'ar', TN: 'ar', YE: 'ar',
  DZ: 'ar', BH: 'ar', SD: 'ar', PS: 'ar',
  IN: 'hi',
};

function readCookieLocale(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)zb_locale=([A-Za-z-]+)/);
  if (!match) return null;
  const value = match[1];
  return (LOCALES as readonly string[]).includes(value) ? (value as Locale) : null;
}

function pickFromCountry(country: string | null | undefined): Locale | null {
  if (!country) return null;
  return COUNTRY_TO_LOCALE[country.toUpperCase()] ?? null;
}

function pickFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const tags = header.split(',').map((part) => {
    const [tag, ...params] = part.trim().split(';');
    const qParam = params.find((p) => p.trim().startsWith('q='));
    const q = qParam ? parseFloat(qParam.split('=')[1]) || 0 : 1;
    return { tag: tag.toLowerCase(), q };
  });
  tags.sort((a, b) => b.q - a.q);
  for (const { tag } of tags) {
    if (tag.startsWith('pt-br')) return 'pt-BR';
    if (tag.startsWith('pt')) return 'pt-BR';
    const primary = tag.split('-')[0];
    const match = LOCALES.find(
      (l) => l.toLowerCase() === primary || l.toLowerCase().split('-')[0] === primary,
    );
    if (match) return match;
  }
  return null;
}

function mergeVary(headers: Headers) {
  const values = new Set(
    (headers.get('Vary') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
  values.add('Accept');
  values.add('Accept-Encoding');
  headers.set('Vary', [...values].join(', '));
}

function representationHeaders(
  source: Headers,
  markdownPath: string,
  contentType: 'text/html' | 'text/markdown',
) {
  const headers = new Headers(source);
  headers.set('Content-Type', `${contentType}; charset=utf-8`);
  headers.set('Content-Signal', CONTENT_SIGNAL);
  headers.set(
    'Link',
    `<${markdownPath}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`,
  );
  headers.delete('Content-Length');
  headers.delete('Content-Encoding');
  headers.delete('ETag');
  headers.delete('Last-Modified');
  mergeVary(headers);
  return headers;
}

async function responseWithBody(
  source: Response,
  headers: Headers,
  method: string,
  status = source.status,
) {
  return new Response(method === 'HEAD' ? null : await source.arrayBuffer(), {
    status,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Only the bare root is dynamic; everything else is a static asset.
    if (url.pathname === '/') {
      const headers = request.headers;
      const cfCountry = (request as { cf?: { country?: string } }).cf?.country
        ?? headers.get('cf-ipcountry');

      const locale =
        readCookieLocale(headers.get('cookie')) ??
        pickFromAcceptLanguage(headers.get('accept-language')) ??
        pickFromCountry(cfCountry) ??
        DEFAULT_LOCALE;

      // The target depends on cookie/Accept-Language/geo, so this redirect is
      // per-visitor and must never be cached by the edge or the browser.
      return new Response(null, {
        status: 302,
        headers: {
          Location: new URL(`/${locale}/`, url).toString(),
          'Cache-Control': 'no-store',
          Vary: 'Accept-Language, Cookie',
        },
      });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (request.method !== 'GET' && request.method !== 'HEAD') return assetResponse;
    if (!assetResponse.headers.get('Content-Type')?.toLowerCase().includes('text/html')) {
      return assetResponse;
    }

    const representation = negotiateRepresentation(request.headers.get('Accept'));
    const markdownPath = assetResponse.status === 404
      ? '/404.md'
      : markdownPathFor(url.pathname);

    if (representation === null) {
      const headers = representationHeaders(
        new Headers({ 'Cache-Control': 'no-store' }),
        markdownPath,
        'text/markdown',
      );
      return new Response(
        request.method === 'HEAD'
          ? null
          : 'Not acceptable. Request text/html or text/markdown.\n',
        { status: 406, headers },
      );
    }

    if (representation === 'html') {
      return responseWithBody(
        assetResponse,
        representationHeaders(assetResponse.headers, markdownPath, 'text/html'),
        request.method,
      );
    }

    const markdownUrl = new URL(markdownPath, url);
    const markdownRequest = new Request(markdownUrl, {
      method: request.method,
      headers: { Accept: 'text/markdown' },
    });
    const markdownResponse = await env.ASSETS.fetch(markdownRequest);
    if (markdownResponse.status !== 200) {
      const headers = representationHeaders(
        new Headers({ 'Cache-Control': 'no-store' }),
        markdownPath,
        'text/markdown',
      );
      return new Response(
        request.method === 'HEAD' ? null : 'Markdown representation unavailable.\n',
        { status: 406, headers },
      );
    }

    return responseWithBody(
      markdownResponse,
      representationHeaders(markdownResponse.headers, markdownPath, 'text/markdown'),
      request.method,
      assetResponse.status,
    );
  },
};
