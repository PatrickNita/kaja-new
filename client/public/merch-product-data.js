const merchProductDataStyle = document.createElement('style');
merchProductDataStyle.textContent = `
.masonry[aria-label="Merch products"] .item-link {
  display: block;
  color: inherit;
  text-decoration: none;
}
`;
document.head.appendChild(merchProductDataStyle);

const DEFAULT_LOCALE = 'en';

function getLocaleFromPath(pathname = window.location.pathname) {
  if (window.KajaMerchSlug) {
    return window.KajaMerchSlug.getLocaleFromPath(pathname);
  }

  const localizedSubpage = pathname.match(/^\/(ro|ru|es|de)\/(catalogue|merch)\/?$/);
  if (localizedSubpage) return localizedSubpage[1];

  const localizedHome = pathname.match(/^\/(ro|ru|es|de)(?:\/|$)/);
  if (localizedHome) return localizedHome[1];

  return DEFAULT_LOCALE;
}

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase();
}

function getItemKey(item) {
  return normalizeKey(item?.dataset?.imageKey || item?.getAttribute('data-image-key') || '');
}

async function getMerchProducts() {
  const locale = getLocaleFromPath();

  try {
    const response = await fetch(`/locales/${locale}.json?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Locale fetch failed: ${response.status}`);
    const copy = await response.json();
    return copy.pages?.merch?.items ?? [];
  } catch {
    if (locale === DEFAULT_LOCALE) return [];

    try {
      const response = await fetch(`/locales/${DEFAULT_LOCALE}.json?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return [];
      const copy = await response.json();
      return copy.pages?.merch?.items ?? [];
    } catch {
      return [];
    }
  }
}

async function loadMerchProductLinks() {
  const grid = document.querySelector('.masonry[aria-label="Merch products"]');
  if (!grid) return;

  const slugApi = window.KajaMerchSlug;
  if (!slugApi) return;

  try {
    const products = await getMerchProducts();
    const productMap = new Map(
      products.map((product) => [normalizeKey(product.imageKey ?? product.title), product])
    );
    const locale = getLocaleFromPath();

    grid.querySelectorAll('.item').forEach((item) => {
      const product = productMap.get(getItemKey(item));
      const imageKey = product?.imageKey ?? getItemKey(item);
      if (!imageKey) return;

      const itemLink = item.closest('.item-link') ?? document.createElement('a');
      if (!item.closest('.item-link')) {
        itemLink.className = 'item-link';
        item.parentNode.insertBefore(itemLink, item);
        itemLink.appendChild(item);
      }

      itemLink.href = slugApi.getProductPath(slugApi.imageKeyToSlug(imageKey), locale);
      itemLink.setAttribute('aria-label', product?.title ?? item.querySelector('strong')?.textContent ?? imageKey);
    });
  } catch (error) {
    console.warn('Could not load merch product links', error);
  }
}

window.addEventListener('load', loadMerchProductLinks);
requestAnimationFrame(loadMerchProductLinks);
setTimeout(loadMerchProductLinks, 500);
