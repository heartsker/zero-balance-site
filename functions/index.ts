// Cloudflare Pages Function for the root path `/`.
// Picks the user's locale at the edge and redirects to /en/ or /ru/.
// Priority: zb_locale cookie -> Accept-Language header -> 'en'.
//
// PagesFunction is provided by Cloudflare's runtime at deploy time. We
// declare a minimal local fallback so `astro check` passes without
// pulling in @cloudflare/workers-types.

type CloudflarePagesContext = {
  request: Request;
};
type CloudflarePagesFunction = (ctx: CloudflarePagesContext) => Response | Promise<Response>;

type Locale = 'en' | 'ru';
const LOCALES: readonly Locale[] = ['en', 'ru'];
const DEFAULT_LOCALE: Locale = 'en';

function readCookieLocale(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)zb_locale=(en|ru)/);
  return match ? (match[1] as Locale) : null;
}

function pickFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const tags = header.split(',').map((part) => {
    const [tag, ...params] = part.trim().split(';');
    const qParam = params.find((p) => p.trim().startsWith('q='));
    const q = qParam ? parseFloat(qParam.split('=')[1]) || 0 : 1;
    return { tag: tag.toLowerCase(), q };
  });
  tags.sort((a, b) => b.q - a.q);
  for (const { tag } of tags) {
    const primary = tag.split('-')[0] as Locale;
    if (LOCALES.includes(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

export const onRequestGet: CloudflarePagesFunction = (context) => {
  const url = new URL(context.request.url);
  const headers = context.request.headers;

  const fromCookie = readCookieLocale(headers.get('cookie'));
  const locale = fromCookie ?? pickFromAcceptLanguage(headers.get('accept-language'));

  return Response.redirect(new URL(`/${locale}/`, url).toString(), 302);
};
