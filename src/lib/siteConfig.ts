// Fixed cross-domain hosts. The global site serves the world from Cloudflare;
// the Russian mirror (zerobalanceapp.ru) serves RU/CIS from Russian hosting,
// which stays reachable inside Russia where Cloudflare is throttled.
export const GLOBAL_SITE = 'https://zerobalance.pro';
export const RU_SITE = 'https://zerobalanceapp.ru';

// The domain THIS build is stamped for (canonical / OG / sitemap / self-hreflang).
// Driven by env so one source tree builds both targets; defaults to the global site.
export const DOMAIN: string = import.meta.env.PUBLIC_SITE_DOMAIN ?? GLOBAL_SITE;

// True when this build is the Russian-only mirror.
export const IS_RU_SITE = DOMAIN.includes('zerobalanceapp.ru');

// App Store smart-link. A distinct campaign token per site keeps the two
// acquisition funnels separable in App Store Connect -> App Analytics.
export const APP_STORE_URL = `https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=${
  IS_RU_SITE ? 'zerobalanceapp-ru-site' : 'zerobalance-pro-site'
}&mt=8`;

// Stable identity URL for schema, agent instructions, and other places where
// campaign parameters would weaken entity matching.
export const APP_STORE_IDENTITY_URL = 'https://apps.apple.com/app/id6761912988';

export const SUPPORT_EMAIL = 'developer.ios.dp@gmail.com';
export const ACCENT = '#7A4DE6';

// Yandex Metrika counter ID. Set to null to disable the counter entirely.
export const YANDEX_METRIKA_ID: number | null = 109411598;

// Every locale the site CAN render. Drives the `Locale` type and the per-locale
// label maps below, so it stays constant regardless of which subset a build emits.
export const ALL_LOCALES = [
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
] as const;
export type Locale = (typeof ALL_LOCALES)[number];

// The locales THIS build emits. The Russian mirror sets PUBLIC_SITE_LOCALES=ru to
// ship a Russian-only site; the global build emits all of them.
const SITE_LOCALES_ENV = import.meta.env.PUBLIC_SITE_LOCALES as string | undefined;
export const LOCALES: readonly Locale[] = SITE_LOCALES_ENV
  ? (SITE_LOCALES_ENV.split(',')
      .map((s) => s.trim())
      .filter(Boolean) as Locale[])
  : ALL_LOCALES;

export const DEFAULT_LOCALE: Locale =
  (import.meta.env.PUBLIC_SITE_DEFAULT_LOCALE as Locale | undefined) ??
  (IS_RU_SITE ? 'ru' : 'en');

export const RTL_LOCALES: readonly Locale[] = ['ar'];

export const LOCALE_NATIVE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  ar: 'العربية',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  hi: 'हिन्दी',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  'pt-BR': 'Português (Brasil)',
  tr: 'Türkçe',
};

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU',
  ar: 'AR',
  de: 'DE',
  es: 'ES',
  fr: 'FR',
  hi: 'HI',
  it: 'IT',
  ja: 'JA',
  ko: 'KO',
  'pt-BR': 'PT',
  tr: 'TR',
};

export const LOCALE_OG_TAG: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  ar: 'ar_SA',
  de: 'de_DE',
  es: 'es_ES',
  fr: 'fr_FR',
  hi: 'hi_IN',
  it: 'it_IT',
  ja: 'ja_JP',
  ko: 'ko_KR',
  'pt-BR': 'pt_BR',
  tr: 'tr_TR',
};

export const LOCALE_INTL_TAG: Record<Locale, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  ar: 'ar-SA',
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
  hi: 'hi-IN',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  'pt-BR': 'pt-BR',
  tr: 'tr-TR',
};

// Used as datePublished for static QAPage / FAQ structured data.
// Bump when an entry is meaningfully rewritten.
export const FAQ_PUBLISHED_DATE = '2026-05-14T00:00:00+00:00';

export const APP_NAME = 'Zero Balance';
export const APP_TAGLINE_EN = 'Spend Credit';
export const APP_TAGLINE_RU = 'Потратить баланс';
export const APP_ID = '6761912988';

// Bump after notable rating swings. Source of truth: App Store Connect.
export const APP_RATING = 4.7;
export const APP_RATING_COUNT = 127;

export const SOCIAL = {
  github: 'https://github.com/heartsker/zero-balance-site',
};
