import en, { type Dict } from './en';
import ru from './ru';
import ar from './ar';
import de from './de';
import es from './es';
import fr from './fr';
import hi from './hi';
import it from './it';
import ja from './ja';
import ko from './ko';
import ptBR from './pt-BR';
import tr from './tr';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '../lib/siteConfig';

const dictionaries: Record<Locale, Dict> = {
  en,
  ru,
  ar,
  de,
  es,
  fr,
  hi,
  it,
  ja,
  ko,
  'pt-BR': ptBR,
  tr,
};

export function getDict(lang: Locale): Dict {
  return dictionaries[lang] ?? dictionaries[DEFAULT_LOCALE];
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function getLangFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segment = pathname.split('/').filter(Boolean)[0];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function localizedPath(lang: Locale, path: string): string {
  const trimmed = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!trimmed) return `/${lang}/`;
  return `/${lang}/${trimmed}/`;
}

export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && isLocale(parts[0])) {
    return '/' + parts.slice(1).join('/') + (parts.length > 1 ? '/' : '');
  }
  return pathname;
}

export function alternateLocales(current: Locale): Locale[] {
  return LOCALES.filter((l) => l !== current);
}

export { LOCALES, DEFAULT_LOCALE };
export type { Locale };
