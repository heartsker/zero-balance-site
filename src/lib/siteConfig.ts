export const APP_STORE_URL =
  'https://apps.apple.com/app/apple-store/id6761912988?pt=128302223&ct=zerobalance-pro-site&mt=8';

export const DOMAIN = 'https://zerobalance.pro';
export const SUPPORT_EMAIL = 'developer.ios.dp@proton.me';
export const ACCENT = '#C32DAC';

export const LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const APP_NAME = 'Zero Balance';
export const APP_TAGLINE_EN = 'Spend Credit';
export const APP_TAGLINE_RU = 'Потратить баланс';
export const APP_ID = '6761912988';

export const SOCIAL = {
  github: 'https://github.com/heartsker/zero-balance-site',
};
