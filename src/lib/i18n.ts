import 'server-only';

export type Locale = 'es' | 'en' | 'pt' | 'fr';

const SUPPORTED_LOCALES: Locale[] = ['es', 'en', 'pt', 'fr'];
export const DEFAULT_LOCALE: Locale = 'es';

const dictionaries: Record<Locale, () => Promise<Record<string, unknown>>> = {
  es: () => import('@/messages/es.json').then((m) => m.default as Record<string, unknown>),
  en: () => import('@/messages/en.json').then((m) => m.default as Record<string, unknown>),
  pt: () => import('@/messages/pt.json').then((m) => m.default as Record<string, unknown>),
  fr: () => import('@/messages/fr.json').then((m) => m.default as Record<string, unknown>),
};

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export function getLocaleFromHeader(acceptLanguage: string): Locale {
  const preferred = acceptLanguage.split(',')[0].split('-')[0].trim().toLowerCase();
  return isValidLocale(preferred) ? preferred : DEFAULT_LOCALE;
}
