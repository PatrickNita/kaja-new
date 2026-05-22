(() => {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --kaja-intro-logo-url: none;
    }

    .segment.is-intro-section .segment-content h1 {
      position: relative !important;
      display: block !important;
      width: min(34vw, 360px) !important;
      max-width: 82vw !important;
      height: clamp(74px, 10vw, 136px) !important;
      margin: 0 !important;
      color: transparent !important;
      font-size: 0 !important;
      line-height: 0 !important;
      letter-spacing: 0 !important;
      overflow: visible !important;
    }

    .segment.is-intro-section .segment-content h1::after {
      content: '' !important;
      position: absolute !important;
      inset: 0 !important;
      background-image: var(--kaja-intro-logo-url) !important;
      background-size: contain !important;
      background-position: left center !important;
      background-repeat: no-repeat !important;
      filter: drop-shadow(0 18px 42px rgba(0,0,0,.55)) !important;
      pointer-events: none !important;
    }

    @media (max-width: 900px) {
      .segment.is-intro-section .segment-content h1 {
        width: min(58vw, 260px) !important;
        height: clamp(54px, 17vw, 94px) !important;
      }
    }
  `;
  document.head.appendChild(style);

  let lastSource = '';

  function setIntroLogoSource() {
    const logo = document.querySelector('.brand img');
    const source = logo?.currentSrc || logo?.src || logo?.getAttribute('src');
    if (!source || source === lastSource) return;
    lastSource = source;
    document.documentElement.style.setProperty('--kaja-intro-logo-url', `url("${source}")`);
  }

  const observer = new MutationObserver(setIntroLogoSource);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

  window.addEventListener('load', setIntroLogoSource);
  setIntroLogoSource();
})();