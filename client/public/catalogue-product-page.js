(async function initCatalogueProductPage() {
  const slugApi = window.KajaCatalogueSlug;
  if (!slugApi) return;

  const slug = slugApi.getProductSlugFromPath();
  if (!slug) return;

  const locale = slugApi.getLocaleFromPath();
  const loadingEl = document.getElementById('product-loading');
  const mainEl = document.getElementById('product-main');
  const notFoundEl = document.getElementById('product-not-found');
  const titleEl = document.getElementById('product-title');
  const descriptionEl = document.getElementById('product-description');
  const descriptionSection = document.getElementById('product-description-section');
  const ingredientsEl = document.getElementById('product-ingredients');
  const ingredientsSection = document.getElementById('product-ingredients-section');
  const packagingEl = document.getElementById('product-packaging');
  const packagingSection = document.getElementById('product-packaging-section');
  const imageEl = document.getElementById('product-image');

  function readNestedValue(source, key) {
    return String(key).split('.').reduce((value, part) => value?.[part], source);
  }

  function applyCatalogueLabels(catalogueCopy) {
    document.documentElement.lang = locale;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = readNestedValue(catalogueCopy, element.dataset.i18n);
      if (typeof value === 'string') {
        element.textContent = value;
      }
    });
  }

  function setSectionContent(section, container, values, renderItem, emptyLabel) {
    if (!section || !container) return;

    container.innerHTML = '';
    const items = Array.isArray(values)
      ? values.map((item) => String(item).trim()).filter(Boolean)
      : [];

    if (!items.length) {
      section.hidden = false;
      const empty = document.createElement('p');
      empty.className = 'product-empty';
      empty.textContent = emptyLabel;
      container.appendChild(empty);
      return;
    }

    section.hidden = false;
    items.forEach((value) => {
      container.appendChild(renderItem(value));
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

  function showNotFound(catalogueCopy) {
    if (catalogueCopy) applyCatalogueLabels(catalogueCopy);
    if (loadingEl) loadingEl.hidden = true;
    if (mainEl) mainEl.hidden = true;
    if (notFoundEl) notFoundEl.hidden = false;
    if (catalogueCopy?.documentTitle) {
      document.title = catalogueCopy.documentTitle;
    }
  }

  function showProduct(product, catalogueCopy) {
    applyCatalogueLabels(catalogueCopy);

    const baseTitle = catalogueCopy.documentTitle || 'KAJA Catalogue';
    document.title = `${product.name ?? product.imageKey ?? slug} | ${baseTitle}`;

    if (titleEl) titleEl.textContent = product.name ?? product.imageKey ?? slug;

    const description = String(product.description ?? '').trim();
    if (descriptionSection && descriptionEl) {
      descriptionSection.hidden = false;
      if (description) {
        descriptionEl.textContent = description;
        descriptionEl.classList.remove('product-empty');
      } else {
        descriptionEl.textContent = catalogueCopy.productDescriptionEmpty || 'No description yet.';
        descriptionEl.classList.add('product-empty');
      }
    }

    setSectionContent(
      ingredientsSection,
      ingredientsEl,
      product.ingredients,
      (ingredient) => {
        const badge = document.createElement('span');
        badge.className = 'product-ingredient';
        badge.textContent = ingredient;
        return badge;
      },
      catalogueCopy.productIngredientsEmpty || 'No ingredients listed.'
    );

    setSectionContent(
      packagingSection,
      packagingEl,
      product.availablePackaging,
      (packaging) => {
        const item = document.createElement('li');
        item.className = 'product-packaging-item';
        item.textContent = packaging;
        return item;
      },
      catalogueCopy.productPackagingEmpty || 'No packaging listed.'
    );

    if (imageEl && product.imageKey) {
      const webpSrc = slugApi.getProductImageUrl(product.imageKey, 'webp');
      const jpgSrc = slugApi.getProductImageUrl(product.imageKey, 'jpg');
      imageEl.alt = product.name ?? product.imageKey;
      imageEl.src = webpSrc;
      imageEl.onerror = () => {
        imageEl.onerror = null;
        imageEl.src = jpgSrc;
      };
    }

    if (loadingEl) loadingEl.hidden = true;
    if (notFoundEl) notFoundEl.hidden = true;
    if (mainEl) mainEl.hidden = false;
  }

  try {
    const copy = await loadLocaleCopy();
    const catalogueCopy = copy?.pages?.catalogue ?? {};
    const items = Array.isArray(catalogueCopy.items) ? catalogueCopy.items : [];
    const imageKey = slugApi.slugToImageKey(slug, items);
    const product = items.find(
      (item) => slugApi.normalizeKey(item.imageKey ?? item.name) === slugApi.normalizeKey(imageKey)
    );

    if (!product) {
      showNotFound(catalogueCopy);
      return;
    }

    showProduct(product, catalogueCopy);
  } catch {
    showNotFound(null);
  }
})();
