export const LOCALES = ['en', 'ro', 'ru', 'es', 'de'];
export const DEFAULT_LOCALE = 'en';
export const PREFIXED_LOCALES = ['ro', 'ru', 'es', 'de'];
export const LOCALIZED_PAGES = ['catalogue', 'merch'];
export const LOCALE_PATTERN = /^\/(ro|ru|es|de)(?:\/|$)/;
export const ENGLISH_ALIASES = /^\/en\/?$/;
export const LOCALIZED_PAGE_PATTERN = /^\/(ro|ru|es|de)\/(catalogue|merch)\/?$/;

export const SECTION_SHAPES = [
  { shape: 'intro', accent: 'Intro' },
  { shape: 'stack', accent: 'Strong' },
  { shape: 'strips', accent: 'Catalogue' },
  { shape: 'orb', accent: 'Available' },
  { shape: 'hanger', accent: 'Merch' },
  { shape: 'contact', accent: 'Contact' }
];

export const SECTION_COUNT = SECTION_SHAPES.length;
export const CONTACT_INDEX = SECTION_COUNT - 1;
