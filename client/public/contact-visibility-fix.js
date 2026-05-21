(() => {
  const style = document.createElement('style');
  style.textContent = `
    .is-contact-section:not(.is-active) .contact-form-panel,
    .is-contact-section:not(.is-active) .contact-form-fixed-overlay {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .is-contact-section.is-active .contact-form-panel,
    .is-contact-section.is-active .contact-form-fixed-overlay {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(style);

  function syncContactVisibility() {
    document.querySelectorAll('.is-contact-section').forEach((section) => {
      const visible = section.classList.contains('is-active');
      section.querySelectorAll('.contact-form-panel, .contact-form-fixed-overlay').forEach((item) => {
        item.style.setProperty('display', visible ? 'block' : 'none', 'important');
        item.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important');
        item.style.setProperty('opacity', visible ? '1' : '0', 'important');
        item.style.setProperty('pointer-events', visible ? 'auto' : 'none', 'important');
      });
    });
  }

  const observer = new MutationObserver(syncContactVisibility);
  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style'] });

  window.addEventListener('load', syncContactVisibility);
  requestAnimationFrame(function tick() {
    syncContactVisibility();
    requestAnimationFrame(tick);
  });
})();