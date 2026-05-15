export const APP_STORE_URL =
  'https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=zerobalance-pro-site&mt=8';

export const DOMAIN = 'https://zerobalance.pro';
export const SUPPORT_EMAIL = 'developer.ios.dp@proton.me';
export const ACCENT = '#7A4DE6';

export const LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

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
