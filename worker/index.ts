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

export default {
  fetch(request: Request, env: Env): Response | Promise<Response> {
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

      return Response.redirect(new URL(`/${locale}/`, url).toString(), 302);
    }

    return env.ASSETS.fetch(request);
  },
};
