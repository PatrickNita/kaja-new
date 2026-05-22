window.KajaCatalogueSlug = (() => {
  const DEFAULT_LOCALE = 'en';
  const RESERVED_SLUGS = new Set(['products', 'product']);

  function normalizeKey(value) {
    return String(value || '').trim().toLowerCase();
  }

  function imageKeyToSlug(imageKey) {
    return normalizeKey(imageKey)
      .replace(/['’]/g, '')
      .replace(/&/g, '-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function slugToImageKey(slug, items = []) {
    const normalizedSlug = normalizeKey(slug);
    if (!normalizedSlug || RESERVED_SLUGS.has(normalizedSlug)) return '';

    const match = items.find((item) => imageKeyToSlug(item.imageKey ?? item.name) === normalizedSlug);
    return match?.imageKey ?? match?.name ?? '';
  }

  function getLocaleFromPath(pathname = window.location.pathname) {
    const localizedProduct = pathname.match(/^\/(ro|ru|es|de)\/catalogue\/[^/]+\/?$/);
    if (localizedProduct) return localizedProduct[1];

    const localizedCatalogue = pathname.match(/^\/(ro|ru|es|de)\/catalogue\/?$/);
    if (localizedCatalogue) return localizedCatalogue[1];

    const localizedSubpage = pathname.match(/^\/(ro|ru|es|de)\/(catalogue|merch)\/?$/);
    if (localizedSubpage) return localizedSubpage[1];

    const localizedHome = pathname.match(/^\/(ro|ru|es|de)(?:\/|$)/);
    if (localizedHome) return localizedHome[1];

    return DEFAULT_LOCALE;
  }

  function getProductSlugFromPath(pathname = window.location.pathname) {
    const localizedMatch = pathname.match(/^\/(?:ro|ru|es|de)\/catalogue\/([^/]+)\/?$/);
    if (localizedMatch) return decodeURIComponent(localizedMatch[1]);

    const englishMatch = pathname.match(/^\/catalogue\/([^/]+)\/?$/);
    if (englishMatch) return decodeURIComponent(englishMatch[1]);

    return '';
  }

  function getCataloguePath(locale = DEFAULT_LOCALE) {
    return locale === DEFAULT_LOCALE ? '/catalogue' : `/${locale}/catalogue`;
  }

  function getProductPath(slug, locale = DEFAULT_LOCALE) {
    const cleanSlug = String(slug || '').replace(/^\/+|\/+$/g, '');
    return `${getCataloguePath(locale)}/${cleanSlug}`;
  }

  function getCardImageKey(card) {
    const style = card.getAttribute('style') || '';
    const match = style.match(/\/products\/([^?)]+)\.(?:webp|jpg)/i);
    if (!match) return '';
    return normalizeKey(decodeURIComponent(match[1]));
  }

  function getProductImageUrl(imageKey, extension = 'webp') {
    return `/catalogue/products/${encodeURIComponent(imageKey)}.${extension}`;
  }

  return {
    DEFAULT_LOCALE,
    RESERVED_SLUGS,
    normalizeKey,
    imageKeyToSlug,
    slugToImageKey,
    getLocaleFromPath,
    getProductSlugFromPath,
    getCataloguePath,
    getProductPath,
    getCardImageKey,
    getProductImageUrl
  };
})();
