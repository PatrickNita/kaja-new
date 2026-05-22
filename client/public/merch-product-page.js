(async function initMerchProductPage() {
  const slugApi = window.KajaMerchSlug;
  if (!slugApi) return;

  const slug = slugApi.getProductSlugFromPath();
  if (!slug) return;

  const locale = slugApi.getLocaleFromPath();
  const loadingEl = document.getElementById('product-loading');
  const mainEl = document.getElementById('product-main');
  const notFoundEl = document.getElementById('product-not-found');
  const labelEl = document.getElementById('product-label');
  const titleEl = document.getElementById('product-title');
  const copyEl = document.getElementById('product-copy');
  const copySection = document.getElementById('product-copy-section');
  const imageEl = document.getElementById('product-image');
  const visualEl = document.getElementById('product-visual');

  function readNestedValue(source, key) {
    return String(key).split('.').reduce((value, part) => value?.[part], source);
  }

  function applyMerchLabels(merchCopy) {
    document.documentElement.lang = locale;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = readNestedValue(merchCopy, element.dataset.i18n);
      if (typeof value === 'string') {
        element.textContent = value;
      }
    });
  }

  async function loadLocaleCopy() {
    try {
      const response = await fetch(`/locales/${locale}.json?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Locale fetch failed');
      return response.json();
    } catch {
      if (locale === slugApi.DEFAULT_LOCALE) return null;
      const response = await fetch(`/locales/${slugApi.DEFAULT_LOCALE}.json?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return null;
      return response.json();
    }
  }

  function showNotFound(merchCopy) {
    if (merchCopy) applyMerchLabels(merchCopy);
    if (loadingEl) loadingEl.hidden = true;
    if (mainEl) mainEl.hidden = true;
    if (notFoundEl) notFoundEl.hidden = false;
    if (merchCopy?.documentTitle) {
      document.title = merchCopy.documentTitle;
    }
  }

  function setProductImage(product) {
    if (!imageEl || !visualEl || !product.imageKey) {
      if (visualEl) visualEl.hidden = true;
      return;
    }

    const webpSrc = slugApi.getProductImageUrl(product.imageKey, 'webp');
    const jpgSrc = slugApi.getProductImageUrl(product.imageKey, 'jpg');
    imageEl.alt = product.title ?? product.imageKey;
    imageEl.src = webpSrc;
    imageEl.onerror = () => {
      imageEl.onerror = () => {
        visualEl.hidden = true;
      };
      imageEl.src = jpgSrc;
    };
    visualEl.hidden = false;
  }

  function showProduct(product, merchCopy) {
    applyMerchLabels(merchCopy);

    const baseTitle = merchCopy.documentTitle || 'KAJA Merch';
    document.title = `${product.title ?? product.imageKey ?? slug} | ${baseTitle}`;

    if (labelEl) labelEl.textContent = product.label ?? merchCopy.productKicker ?? 'Merch';
    if (titleEl) titleEl.textContent = product.title ?? product.imageKey ?? slug;

    const copy = String(product.copy ?? '').trim();
    if (copySection && copyEl) {
      copySection.hidden = false;
      if (copy) {
        copyEl.textContent = copy;
        copyEl.classList.remove('product-empty');
      } else {
        copyEl.textContent = merchCopy.productCopyEmpty || 'No details yet.';
        copyEl.classList.add('product-empty');
      }
    }

    setProductImage(product);

    if (loadingEl) loadingEl.hidden = true;
    if (notFoundEl) notFoundEl.hidden = true;
    if (mainEl) mainEl.hidden = false;
  }

  try {
    const copy = await loadLocaleCopy();
    const merchCopy = copy?.pages?.merch ?? {};
    const items = Array.isArray(merchCopy.items) ? merchCopy.items : [];
    const imageKey = slugApi.slugToImageKey(slug, items);
    const product = items.find(
      (item) => slugApi.normalizeKey(item.imageKey ?? item.title) === slugApi.normalizeKey(imageKey)
    );

    if (!product) {
      showNotFound(merchCopy);
      return;
    }

    showProduct(product, merchCopy);
  } catch {
    showNotFound(null);
  }
})();
