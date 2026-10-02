import data from '../data/iap-catalog.json';
import { parseAmount } from './balanceChecker';
export const catalog = data;
export type CatalogLocale = 'en' | 'ru';
export type Storefront = typeof data.storefronts[number];
export function currencyDigits(currency: string): number {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
}
export function pricesFor(storefront: Storefront) {
  const digits = currencyDigits(storefront.currency);
  return data.products.map(product => {
    // ASC can serialize JPY/KRW as "50.00"; remove only insignificant trailing zeros.
    const value = storefront.prices[product.id as keyof typeof storefront.prices].replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    const minor = parseAmount(value, digits);
    if (minor === null || minor <= 0) throw new Error(`Invalid audited price: ${storefront.code}/${product.id}`);
    return { id: product.id, minor };
  }).sort((a, b) => a.minor - b.minor || a.id.localeCompare(b.id));
}
export function money(minor: number, currency: string, lang: CatalogLocale): string {
  return new Intl.NumberFormat(lang, { style: 'currency', currency }).format(minor / 10 ** currencyDigits(currency));
}
