const catalogueProductDataStyle = document.createElement('style');
catalogueProductDataStyle.textContent = `
.catalogue-ingredient-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: calc(100% - 24px);
  pointer-events: none;
}

.catalogue-ingredient-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(255,255,255,.13);
  border-radius: 999px;
  background: rgba(0,0,0,.62);
  color: rgba(255,255,255,.88);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0,0,0,.28);
  font-size: 9px;
  line-height: 1;
  font-weight: 760;
  letter-spacing: .09em;
  text-transform: uppercase;
  white-space: nowrap;
}

@media (max-width: 700px) {
  .card strong {
    font-size: 10px !important;
    letter-spacing: .075em !important;
    line-height: 1.08 !important;
  }

  .catalogue-ingredient-badges {
    top: 6px;
    left: 6px;
    gap: 3px;
    max-width: calc(100% - 12px);
  }

  .catalogue-ingredient-badge {
    padding: 4px 5px;
    font-size: 6px;
    letter-spacing: .055em;
  }
}
`;
document.head.appendChild(catalogueProductDataStyle);

function normalizeProductName(name) {
  return String(name || '').trim().toLowerCase();
}

async function loadCatalogueProductData() {
  const grid = document.querySelector('.grid[aria-label="Flavour catalogue"]');
  if (!grid || grid.dataset.productDataLoaded === 'true') return;
  grid.dataset.productDataLoaded = 'true';

  try {
    const response = await fetch('/catalogue/products.json', { cache: 'no-store' });
    if (!response.ok) return;

    const products = await response.json();
    const productMap = new Map(
      products.map((product) => [normalizeProductName(product['Product Name']), product])
    );

    grid.querySelectorAll('.card').forEach((card) => {
      const name = card.querySelector('strong')?.textContent || '';
      const product = productMap.get(normalizeProductName(name));
      const ingredients = Array.isArray(product?.Ingredients) ? product.Ingredients.filter(Boolean) : [];
      if (!ingredients.length) return;

      card.querySelector('.catalogue-ingredient-badges')?.remove();

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

window.addEventListener('load', loadCatalogueProductData);
requestAnimationFrame(loadCatalogueProductData);
setTimeout(loadCatalogueProductData, 500);
