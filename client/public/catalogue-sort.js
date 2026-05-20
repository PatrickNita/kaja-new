const catalogueSortStyle = document.createElement('style');
catalogueSortStyle.textContent = `
.catalogue-sort-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin: -18px 0 clamp(18px, 3vw, 28px);
  flex-wrap: wrap;
}

.catalogue-sort-label {
  color: rgba(255,255,255,.48);
  font-size: 11px;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.catalogue-sort-button {
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px;
  background: rgba(255,255,255,.045);
  color: rgba(255,255,255,.72);
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .12em;
  text-transform: uppercase;
  font-family: inherit;
  cursor: none;
  transition: background .35s ease, color .35s ease, border-color .35s ease, transform .35s ease;
}

.catalogue-sort-button:hover,
.catalogue-sort-button.is-active {
  background: #fff;
  color: #000;
  border-color: #fff;
  transform: translateY(-2px);
}

@media (max-width: 700px) {
  .catalogue-sort-bar {
    margin: -10px 0 16px;
    gap: 7px;
  }

  .catalogue-sort-label {
    width: 100%;
    font-size: 9px;
  }

  .catalogue-sort-button {
    cursor: auto;
    padding: 8px 10px;
    font-size: 9px;
    letter-spacing: .09em;
  }
}
`;
document.head.appendChild(catalogueSortStyle);

function addCatalogueSortControls() {
  const grid = document.querySelector('.grid[aria-label="Flavour catalogue"]');
  if (!grid || document.querySelector('.catalogue-sort-bar')) return;

  const sortBar = document.createElement('div');
  sortBar.className = 'catalogue-sort-bar';
  sortBar.setAttribute('aria-label', 'Sort catalogue by name');

  const label = document.createElement('span');
  label.className = 'catalogue-sort-label';
  label.textContent = 'Sort by name';

  const ascending = document.createElement('button');
  ascending.type = 'button';
  ascending.className = 'catalogue-sort-button is-active';
  ascending.textContent = 'A–Z';

  const descending = document.createElement('button');
  descending.type = 'button';
  descending.className = 'catalogue-sort-button';
  descending.textContent = 'Z–A';

  const sortCards = (direction) => {
    const cards = Array.from(grid.querySelectorAll('.card'));
    cards
      .sort((a, b) => {
        const nameA = a.querySelector('strong')?.textContent?.trim() || '';
        const nameB = b.querySelector('strong')?.textContent?.trim() || '';
        return direction === 'asc'
          ? nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' })
          : nameB.localeCompare(nameA, undefined, { numeric: true, sensitivity: 'base' });
      })
      .forEach((card) => grid.appendChild(card));

    ascending.classList.toggle('is-active', direction === 'asc');
    descending.classList.toggle('is-active', direction === 'desc');
  };

  ascending.addEventListener('click', () => sortCards('asc'));
  descending.addEventListener('click', () => sortCards('desc'));

  sortBar.appendChild(label);
  sortBar.appendChild(ascending);
  sortBar.appendChild(descending);
  grid.parentNode.insertBefore(sortBar, grid);
  sortCards('asc');
}

window.addEventListener('load', addCatalogueSortControls);
requestAnimationFrame(addCatalogueSortControls);
setTimeout(addCatalogueSortControls, 500);
