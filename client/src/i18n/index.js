import en from '../../locales/en.json';
import ro from '../../locales/ro.json';
import ru from '../../locales/ru.json';
import es from '../../locales/es.json';
import de from '../../locales/de.json';
import {
  CONTACT_INDEX,
  DEFAULT_LOCALE,
  ENGLISH_ALIASES,
  LOCALES,
  LOCALIZED_PAGE_PATTERN,
  LOCALIZED_PAGES,
  LOCALE_PATTERN,
  PREFIXED_LOCALES,
  SECTION_COUNT,
  SECTION_SHAPES
} from './config.js';

const copies = { en, ro, ru, es, de };

export {
  CONTACT_INDEX,
  DEFAULT_LOCALE,
  ENGLISH_ALIASES,
  LOCALES,
  LOCALE_PATTERN,
  PREFIXED_LOCALES,
  SECTION_COUNT,
  SECTION_SHAPES
};

export function getLocaleFromPath(pathname = window.location.pathname) {
  if (pathname === '/' || ENGLISH_ALIASES.test(pathname)) return DEFAULT_LOCALE;
  const match = pathname.match(LOCALE_PATTERN);
  return match ? match[1] : DEFAULT_LOCALE;
}

export function getLocalePath(locale = DEFAULT_LOCALE) {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;
}

export function stripLocalePrefix(pathname = window.location.pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/' || ENGLISH_ALIASES.test(normalized)) return '/';

  const match = normalized.match(LOCALE_PATTERN);
  if (!match) return normalized;

  const rest = normalized.slice(match[0].length);
  if (!rest) return '/';
  return rest.startsWith('/') ? rest : `/${rest}`;
}

export function getLocaleSwitchPath(targetLocale, pathname = window.location.pathname) {
  const relativePath = stripLocalePrefix(pathname);
  if (relativePath === '/') return getLocalePath(targetLocale);

  const cleanPath = relativePath.replace(/^\//, '');
  return getLocalePagePath(cleanPath, targetLocale);
}

export function getLocalePagePath(page, locale = DEFAULT_LOCALE) {
  const slug = String(page).replace(/^\//, '');
  if (locale === DEFAULT_LOCALE) return `/${slug}`;
  return `/${locale}/${slug}`;
}

export function getLocaleCopy(locale = DEFAULT_LOCALE) {
  return copies[locale] ?? copies[DEFAULT_LOCALE];
}

export function buildSections(copy) {
  return SECTION_SHAPES.map((template, index) => ({
    ...template,
    ...(copy.sections[index] ?? {})
  }));
}

export function publishLocale(locale, copy) {
  window.__kajaLocale = {
    locale,
    copy,
    pagePath(page) {
      return getLocalePagePath(page, locale);
    }
  };
  document.documentElement.lang = locale;
}

if (typeof window !== 'undefined') {
  const locale = getLocaleFromPath();
  publishLocale(locale, getLocaleCopy(locale));
}
