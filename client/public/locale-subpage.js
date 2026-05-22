(() => {
  const DEFAULT_LOCALE = 'en';

  function getLocaleFromPath(pathname = window.location.pathname) {
    if (window.KajaMerchSlug) {
      const merchLocale = window.KajaMerchSlug.getLocaleFromPath(pathname);
      if (merchLocale !== 'en' || /\/merch(?:\/|$)/.test(pathname)) {
        return merchLocale;
      }
    }

    if (window.KajaCatalogueSlug) {
      return window.KajaCatalogueSlug.getLocaleFromPath(pathname);
    }

    const localizedSubpage = pathname.match(/^\/(ro|ru|es|de)\/(catalogue|merch)\/?$/);
    if (localizedSubpage) return localizedSubpage[1];

    const localizedHome = pathname.match(/^\/(ro|ru|es|de)(?:\/|$)/);
    if (localizedHome) return localizedHome[1];

    if (/^\/en\/?$/.test(pathname)) return DEFAULT_LOCALE;
    return DEFAULT_LOCALE;
  }

  function getPageFromPath(pathname = window.location.pathname) {
    if (/\/merch\/[^/]+\/?$/.test(pathname)) return 'merch';
    if (/\/merch\/?$/.test(pathname)) return 'merch';
    if (/\/catalogue\/[^/]+\/?$/.test(pathname)) return 'catalogue';
    if (/\/catalogue\/?$/.test(pathname)) return 'catalogue';
    return null;
  }

  function isCatalogueProductPage(pathname = window.location.pathname) {
    return /\/catalogue\/[^/]+\/?$/.test(pathname);
  }

  function isMerchProductPage(pathname = window.location.pathname) {
    return /\/merch\/[^/]+\/?$/.test(pathname);
  }

  function getItemImageKey(item) {
    return normalizeKey(item?.dataset?.imageKey || item?.getAttribute('data-image-key') || '');
  }

  function readNestedValue(source, key) {
    return String(key).split('.').reduce((value, part) => value?.[part], source);
  }

  function normalizeKey(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getCardImageKey(card) {
    const style = card.getAttribute('style') || '';
    const match = style.match(/\/products\/([^?)]+)\.(?:webp|jpg)/i);
    if (!match) return '';
    return normalizeKey(decodeURIComponent(match[1]));
  }

  function applyPageCopy(pageCopy, page) {
    if (!pageCopy) return;

    document.documentElement.lang = getLocaleFromPath();

    if (pageCopy.documentTitle) {
      document.title = pageCopy.documentTitle;
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = readNestedValue(pageCopy, element.dataset.i18n);
      if (typeof value === 'string') {
        element.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const value = readNestedValue(pageCopy, element.dataset.i18nAria);
      if (typeof value === 'string') {
        element.setAttribute('aria-label', value);
      }
    });

    if (page === 'merch' && Array.isArray(pageCopy.items)) {
      const itemMap = new Map(
        pageCopy.items.map((entry) => [normalizeKey(entry.imageKey ?? entry.title), entry])
      );

      document.querySelectorAll('.masonry .item').forEach((item) => {
        const entry = itemMap.get(getItemImageKey(item));
        if (!entry) return;

        const label = item.querySelector('span');
        const title = item.querySelector('strong');
        const copy = item.querySelector('p');

        if (label && entry.label) label.textContent = entry.label;
        if (title && entry.title) title.textContent = entry.title;
        if (copy && entry.copy) copy.textContent = entry.copy;
      });
    }

    if (page === 'catalogue' && Array.isArray(pageCopy.items)) {
      const itemMap = new Map(
        pageCopy.items.map((entry) => [normalizeKey(entry.imageKey ?? entry.name), entry])
      );

      document.querySelectorAll('.grid .card').forEach((card) => {
        const entry = itemMap.get(getCardImageKey(card));
        if (!entry?.name) return;

        const title = card.querySelector('strong');
        if (title) title.textContent = entry.name;
      });
    }
  }

  async function initSubpageLocale() {
    const page = getPageFromPath();
    if (!page) return;

    const locale = getLocaleFromPath();
    const catalogueProductPage = isCatalogueProductPage();
    const merchProductPage = isMerchProductPage();

    try {
      const response = await fetch(`/locales/${locale}.json`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Locale fetch failed: ${response.status}`);
      const copy = await response.json();
      applyPageCopy(copy.pages?.[page], page);

      if (catalogueProductPage) {
        const pageCopy = copy.pages?.catalogue;
        document.querySelectorAll('[data-i18n]').forEach((element) => {
          const value = readNestedValue(pageCopy, element.dataset.i18n);
          if (typeof value === 'string') {
            element.textContent = value;
          }
        });
      }

      if (merchProductPage) {
        const pageCopy = copy.pages?.merch;
        document.querySelectorAll('[data-i18n]').forEach((element) => {
          const value = readNestedValue(pageCopy, element.dataset.i18n);
          if (typeof value === 'string') {
            element.textContent = value;
          }
        });
      }
    } catch {
      if (locale === DEFAULT_LOCALE) return;

      try {
        const response = await fetch(`/locales/${DEFAULT_LOCALE}.json`, { cache: 'no-store' });
        if (!response.ok) return;
        const copy = await response.json();
        applyPageCopy(copy.pages?.[page], page);

        if (catalogueProductPage) {
          const pageCopy = copy.pages?.catalogue;
          document.querySelectorAll('[data-i18n]').forEach((element) => {
            const value = readNestedValue(pageCopy, element.dataset.i18n);
            if (typeof value === 'string') {
              element.textContent = value;
            }
          });
        }

        if (merchProductPage) {
          const pageCopy = copy.pages?.merch;
          document.querySelectorAll('[data-i18n]').forEach((element) => {
            const value = readNestedValue(pageCopy, element.dataset.i18n);
            if (typeof value === 'string') {
              element.textContent = value;
            }
          });
        }
      } catch {
        // Keep built-in English markup as fallback.
      }
    }
  }

  initSubpageLocale();
})();
