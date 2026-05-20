const catalogueProductDataStyle = document.createElement('style');
catalogueProductDataStyle.textContent = `
.catalogue-ingredient-badges {
  position: absolute !important;
  top: 12px !important;
  left: 12px !important;
  z-index: 12 !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
  max-width: calc(100% - 24px) !important;
  pointer-events: none !important;
}

.catalogue-ingredient-badge {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  max-width: 100% !important;
  padding: 6px 8px !important;
  border: 1px solid rgba(255,255,255,.16) !important;
  border-radius: 999px !important;
  background: rgba(0,0,0,.66) !important;
  color: rgba(255,255,255,.9) !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,.28) !important;
  font-size: 9px !important;
  line-height: 1 !important;
  font-weight: 760 !important;
  letter-spacing: .09em !important;
  text-transform: uppercase !important;
  white-space: nowrap !important;
}

@media (max-width: 700px) {
  .card strong {
    font-size: 10px !important;
    letter-spacing: .075em !important;
    line-height: 1.08 !important;
  }

  .catalogue-ingredient-badges {
    top: 6px !important;
    left: 6px !important;
    gap: 3px !important;
    max-width: calc(100% - 12px) !important;
  }

  .catalogue-ingredient-badge {
    padding: 4px 5px !important;
    font-size: 6px !important;
    letter-spacing: .055em !important;
  }
}
`;
document.head.appendChild(catalogueProductDataStyle);

let catalogueProductsCache = null;

function normalizeProductName(name) {
  return String(name || '').trim().toLowerCase();
}

async function getCatalogueProducts() {
  if (catalogueProductsCache) return catalogueProductsCache;

  const response = await fetch(`/catalogue/products.json?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) return [];

  catalogueProductsCache = await response.json();
  return catalogueProductsCache;
}

async function loadCatalogueProductData() {
  const grid = document.querySelector('.grid[aria-label="Flavour catalogue"]');
  if (!grid) return;

  try {
    const products = await getCatalogueProducts();
    const productMap = new Map(
      products.map((product) => [normalizeProductName(product['Product Name']), product])
    );

    grid.querySelectorAll('.card').forEach((card) => {
      const name = card.querySelector('strong')?.textContent || '';
      const product = productMap.get(normalizeProductName(name));
      const ingredients = Array.isArray(product?.Ingredients)
        ? product.Ingredients.map((ingredient) => String(ingredient).trim()).filter(Boolean)
        : [];

      card.querySelector('.catalogue-ingredient-badges')?.remove();
      if (!ingredients.length) return;

      const badges = document.createElement('div');
      badges.className = 'catalogue-ingredient-badges';
      badges.setAttribute('aria-label', `${name} ingredients`);

      ingredients.forEach((ingredient) => {
        const badge = document.createElement('span');
        badge.className = 'catalogue-ingredient-badge';
        badge.textContent = ingredient;
        badges.appendChild(badge);
      });

      card.appendChild(badges);
    });
  } catch (error) {
    console.warn('Could not load catalogue product data', error);
  }
}

const catalogueBadgeObserver = new MutationObserver(() => {
  window.requestAnimationFrame(loadCatalogueProductData);
});

function initCatalogueBadges() {
  const grid = document.querySelector('.grid[aria-label="Flavour catalogue"]');
  if (grid && grid.dataset.badgeObserverReady !== 'true') {
    grid.dataset.badgeObserverReady = 'true';
    catalogueBadgeObserver.observe(grid, { childList: true });
  }
  loadCatalogueProductData();
}

window.addEventListener('load', initCatalogueBadges);
requestAnimationFrame(initCatalogueBadges);
setTimeout(initCatalogueBadges, 500);
setTimeout(initCatalogueBadges, 1500);
