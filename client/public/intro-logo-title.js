(() => {
  const style = document.createElement('style');
  style.textContent = `
    .segment.is-intro-section .intro-title-logo {
      display: block;
      width: min(34vw, 360px);
      max-width: 82vw;
      height: auto;
      margin: 0;
      filter: drop-shadow(0 18px 42px rgba(0,0,0,.55));
      user-select: none;
      pointer-events: none;
    }

    .segment.is-intro-section .intro-title-hidden {
      display: none !important;
    }

    @media (max-width: 900px) {
      .segment.is-intro-section .intro-title-logo {
        width: min(58vw, 260px);
      }
    }
  `;
  document.head.appendChild(style);

  function getLogoSource() {
    return document.querySelector('.brand img')?.getAttribute('src') || document.querySelector('.brand img')?.src || '';
  }

  function applyIntroLogoTitle() {
    const introContent = document.querySelector('.segment.is-intro-section .segment-content');
    if (!introContent) return;

    const title = introContent.querySelector('h1');
    if (!title) return;

    title.classList.add('intro-title-hidden');

    let logoTitle = introContent.querySelector('.intro-title-logo');
    if (!logoTitle) {
      logoTitle = document.createElement('img');
      logoTitle.className = 'intro-title-logo';
      logoTitle.alt = 'KAJA';
      title.insertAdjacentElement('afterend', logoTitle);
    }

    const source = getLogoSource();
    if (source && logoTitle.getAttribute('src') !== source) {
      logoTitle.src = source;
    }
  }

  const observer = new MutationObserver(applyIntroLogoTitle);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  requestAnimationFrame(function tick() {
    applyIntroLogoTitle();
    requestAnimationFrame(tick);
  });
})();