(() => {
  const style = document.createElement('style');
  style.textContent = `
    .kaja-contact-form .kaja-topic-trigger,
    .kaja-contact-form .kaja-topic-trigger:hover,
    .kaja-contact-form .kaja-topic-trigger:focus,
    .kaja-contact-form .kaja-topic-trigger:focus-visible,
    .kaja-contact-form .kaja-topic-trigger:active,
    .kaja-contact-form .kaja-topic-dropdown.is-open .kaja-topic-trigger {
      background: rgba(0,0,0,0.56) !important;
      color: #fff !important;
      border-color: rgba(255,255,255,0.34) !important;
      box-shadow: none !important;
      transform: none !important;
    }

    .kaja-contact-form .kaja-topic-menu,
    .kaja-contact-form .kaja-topic-menu:hover {
      background: rgba(5,5,5,0.94) !important;
    }

    .kaja-contact-form .kaja-topic-option,
    .kaja-contact-form .kaja-topic-option:hover,
    .kaja-contact-form .kaja-topic-option:focus,
    .kaja-contact-form .kaja-topic-option:focus-visible,
    .kaja-contact-form .kaja-topic-option:active,
    .kaja-contact-form .kaja-topic-option.is-selected {
      background: rgba(255,255,255,0.07) !important;
      color: #fff !important;
      border-color: rgba(255,255,255,0.16) !important;
      box-shadow: none !important;
      transform: none !important;
    }

    .kaja-contact-form .kaja-topic-option:hover,
    .kaja-contact-form .kaja-topic-option:focus,
    .kaja-contact-form .kaja-topic-option:focus-visible,
    .kaja-contact-form .kaja-topic-option:active,
    .kaja-contact-form .kaja-topic-option.is-selected {
      background: rgba(255,255,255,0.11) !important;
      border-color: rgba(255,255,255,0.24) !important;
    }
  `;
  document.head.appendChild(style);
})();