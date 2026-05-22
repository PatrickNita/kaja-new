window.KajaMerchSlug = (() => {
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

    const match = items.find((item) => imageKeyToSlug(item.imageKey ?? item.title) === normalizedSlug);
    return match?.imageKey ?? match?.title ?? '';
  }

  function getLocaleFromPath(pathname = window.location.pathname) {
    const localizedProduct = pathname.match(/^\/(ro|ru|es|de)\/merch\/[^/]+\/?$/);
    if (localizedProduct) return localizedProduct[1];

    const localizedMerch = pathname.match(/^\/(ro|ru|es|de)\/merch\/?$/);
    if (localizedMerch) return localizedMerch[1];

    const localizedSubpage = pathname.match(/^\/(ro|ru|es|de)\/(catalogue|merch)\/?$/);
    if (localizedSubpage) return localizedSubpage[1];

    const localizedHome = pathname.match(/^\/(ro|ru|es|de)(?:\/|$)/);
    if (localizedHome) return localizedHome[1];

    return DEFAULT_LOCALE;
  }

  function getProductSlugFromPath(pathname = window.location.pathname) {
    const localizedMatch = pathname.match(/^\/(?:ro|ru|es|de)\/merch\/([^/]+)\/?$/);
    if (localizedMatch) return decodeURIComponent(localizedMatch[1]);

    const englishMatch = pathname.match(/^\/merch\/([^/]+)\/?$/);
    if (englishMatch) return decodeURIComponent(englishMatch[1]);

    return '';
  }

  function getMerchPath(locale = DEFAULT_LOCALE) {
    return locale === DEFAULT_LOCALE ? '/merch' : `/${locale}/merch`;
  }

  function getProductPath(slug, locale = DEFAULT_LOCALE) {
    const cleanSlug = String(slug || '').replace(/^\/+|\/+$/g, '');
    return `${getMerchPath(locale)}/${cleanSlug}`;
  }

  function getItemImageKey(item) {
    return item?.dataset?.imageKey || item?.getAttribute('data-image-key') || '';
  }

  function getProductImageUrl(imageKey, extension = 'webp') {
    return `/merch/products/${encodeURIComponent(imageKey)}.${extension}`;
  }

  return {
    DEFAULT_LOCALE,
    RESERVED_SLUGS,
    normalizeKey,
    imageKeyToSlug,
    slugToImageKey,
    getLocaleFromPath,
    getProductSlugFromPath,
    getMerchPath,
    getProductPath,
    getItemImageKey,
    getProductImageUrl
  };
})();
