export const APP_STORE_URL =
  'https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=zerobalance-pro-site&mt=8';

export const DOMAIN = 'https://zerobalance.pro';
export const SUPPORT_EMAIL = 'developer.ios.dp@proton.me';
export const ACCENT = '#7A4DE6';

export const LOCALES = [
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
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

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
export const FAQ_PUBLISHED_DATE = '2026-05-14';

export const APP_NAME = 'Zero Balance';
export const APP_TAGLINE_EN = 'Spend Credit';
export const APP_TAGLINE_RU = 'Потратить баланс';
export const APP_ID = '6761912988';

// Bump after notable rating swings. Source of truth: App Store Connect.
export const APP_RATING = 4.9;
export const APP_RATING_COUNT = 517;

export const SOCIAL = {
  github: 'https://github.com/heartsker/zero-balance-site',
};
