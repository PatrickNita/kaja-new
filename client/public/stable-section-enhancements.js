(() => {
  const style = document.createElement('style');
  style.textContent = `
    .is-contact-section .contact-form-panel,
    .is-contact-section .contact-form-fixed-overlay {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    .segment:not(.is-active) .kaja-section-cta-row,
    .segment:not(.is-active) .section-link-button,
    .segment:not(.is-active) .kaja-contact-socials {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .segment.is-active .kaja-section-cta-row {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    .segment.is-active .kaja-contact-socials {
      display: grid !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    .kaja-section-cta-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: clamp(18px, 3vh, 34px);
      width: min(100%, 560px);
    }

    .kaja-section-cta-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      padding: 0 26px;
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 999px;
      background: rgba(255,255,255,0.94);
      color: #000;
      text-decoration: none;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-family: inherit;
      box-shadow: 0 20px 55px rgba(0,0,0,0.28);
      transition: background 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
      pointer-events: auto;
    }

    .segment:not(.is-active) .kaja-section-cta-button,
    .segment:not(.is-active) .kaja-contact-social-button {
      pointer-events: none !important;
    }

    .kaja-section-cta-button:hover {
      background: #fff;
      border-color: rgba(255,255,255,0.36);
      transform: translateY(-2px);
    }

    .kaja-contact-socials {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-top: clamp(18px, 3vh, 34px);
      width: min(100%, 560px);
    }

    .kaja-contact-social-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      height: 54px;
      min-width: 0;
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 999px;
      background: rgba(255,255,255,0.94);
      color: #000;
      text-decoration: none;
      font-size: 10px;
      font-weight: 850;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-family: inherit;
      box-shadow: 0 20px 55px rgba(0,0,0,0.28);
      transition: background 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
      pointer-events: auto;
    }

    .kaja-contact-social-button:hover {
      background: #fff;
      border-color: rgba(255,255,255,0.36);
      transform: translateY(-2px);
    }

    .kaja-contact-social-button img {
      width: 22px !important;
      height: 22px !important;
      min-width: 22px !important;
      min-height: 22px !important;
      max-width: 22px !important;
      max-height: 22px !important;
      object-fit: contain !important;
      display: block !important;
    }

    @media (max-width: 900px) {
      .kaja-section-cta-row {
        margin-top: 13px;
      }

      .kaja-section-cta-button {
        min-height: 42px;
        padding: 0 18px;
        font-size: 9px;
      }

      .kaja-contact-socials {
        gap: 8px;
        margin-top: 13px;
        width: 100%;
      }

      .kaja-contact-social-button {
        height: 40px;
        border-radius: 999px;
        gap: 5px;
        font-size: 0;
        letter-spacing: 0;
      }

      .kaja-contact-social-button img {
        width: 20px !important;
        height: 20px !important;
        min-width: 20px !important;
        min-height: 20px !important;
        max-width: 20px !important;
        max-height: 20px !important;
      }
    }
  `;
  document.head.appendChild(style);

  const byIndex = (index) => document.querySelectorAll('.segment')[index] || null;

  function localePagePath(page) {
    if (typeof window.__kajaLocale?.pagePath === 'function') {
      return window.__kajaLocale.pagePath(page);
    }

    const match = window.location.pathname.match(/^\/(ro|ru|es|de)(?:\/|$)/);
    const locale = window.__kajaLocale?.locale ?? (match ? match[1] : 'en');
    if (locale === 'en') return `/${page}`;
    return `/${locale}/${page}`;
  }

  function readLocaleCopy() {
    return window.__kajaLocale?.copy ?? {
      cta: { catalogue: 'CHECK CATALOGUE', merch: 'CHECK MERCH' },
      contact: {
        company: 'Company / Details',
        channelsAriaLabel: 'Contact channels',
        social: {
          instagram: 'Instagram',
          whatsapp: 'WhatsApp',
          telegram: 'Telegram',
          email: 'E-mail'
        }
      }
    };
  }

  function addCta(section, className, text, href) {
    const content = section?.querySelector('.segment-content');
    if (!content) return;

    const existingRow = content.querySelector(`.${className}`);
    if (existingRow) {
      const link = existingRow.querySelector('a');
      if (link) {
        if (link.getAttribute('href') !== href) {
          link.setAttribute('href', href);
        }
        if (link.textContent !== text) {
          link.textContent = text;
        }
      }
      return;
    }

    const row = document.createElement('div');
    row.className = `kaja-section-cta-row ${className}`;

    const link = document.createElement('a');
    link.className = 'kaja-section-cta-button';
    link.href = href;
    link.textContent = text;

    row.appendChild(link);
    content.appendChild(row);
  }

  const contactSocialKeys = [
    { key: 'instagram', href: '#instagram', icon: '/socials/instagram.webp' },
    { key: 'whatsapp', href: '#whatsapp', icon: '/socials/whatsapp.webp' },
    { key: 'telegram', href: '#telegram', icon: '/socials/telegram.webp' },
    { key: 'email', href: 'mailto:contact@kaja-tobacco.com', icon: '/socials/mail.webp' }
  ];

  function getContactSocials() {
    const social = readLocaleCopy().contact?.social ?? {};
    return contactSocialKeys.map((item) => ({
      label: social[item.key] ?? item.key,
      href: item.href,
      icon: item.icon
    }));
  }

  function addContactTextField(section) {
    const panel = section?.querySelector('.contact-form-panel');
    const dropdown = panel?.querySelector('select');
    if (!panel || !dropdown || panel.querySelector('.kaja-contact-extra-text')) return;

    const companyLabel = readLocaleCopy().contact?.company ?? 'Company / Details';

    const input = document.createElement('input');
    input.className = 'kaja-contact-extra-text';
    input.type = 'text';
    input.placeholder = companyLabel;
    input.setAttribute('aria-label', companyLabel);
    input.style.cssText = dropdown.getAttribute('style') || '';

    dropdown.insertAdjacentElement('afterend', input);
  }

  function addContactSocialButtons(section) {
    const content = section?.querySelector('.segment-content');
    if (!content || content.querySelector('.kaja-contact-socials')) return;

    section.querySelector('.contact-form-panel .kaja-contact-socials')?.remove();

    const row = document.createElement('div');
    row.className = 'kaja-contact-socials';
    row.setAttribute('aria-label', readLocaleCopy().contact?.channelsAriaLabel ?? 'Contact channels');

    getContactSocials().forEach((social) => {
      const link = document.createElement('a');
      link.className = 'kaja-contact-social-button';
      link.href = social.href;
      link.setAttribute('aria-label', social.label);

      const image = document.createElement('img');
      image.src = social.icon;
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');

      const text = document.createElement('span');
      text.textContent = social.label;

      link.appendChild(image);
      link.appendChild(text);
      row.appendChild(link);
    });

    content.appendChild(row);
  }

  function clearButtonVisibilityOverrides() {
    document.querySelectorAll('.kaja-section-cta-row, .section-link-button, .kaja-contact-socials').forEach((item) => {
      item.style.removeProperty('display');
      item.style.removeProperty('visibility');
      item.style.removeProperty('opacity');
      item.style.removeProperty('pointer-events');
    });
  }

  function ensureContactSectionUi() {
    const contactSection = byIndex(5);
    if (!contactSection) return;
    addContactTextField(contactSection);
    addContactSocialButtons(contactSection);
    clearButtonVisibilityOverrides();
  }

  function enhanceSections() {
    const copy = readLocaleCopy();
    const catalogueSection = byIndex(2);
    const merchSection = byIndex(4);

    addCta(catalogueSection, 'kaja-catalogue-cta', copy.cta?.catalogue ?? 'CHECK CATALOGUE', localePagePath('catalogue'));
    addCta(merchSection, 'kaja-merch-cta', copy.cta?.merch ?? 'CHECK MERCH', localePagePath('merch'));
    ensureContactSectionUi();
  }

  let enhanceTimer = null;
  function scheduleEnhanceSections(delay = 50) {
    if (enhanceTimer !== null) window.clearTimeout(enhanceTimer);
    enhanceTimer = window.setTimeout(() => {
      enhanceTimer = null;
      enhanceSections();
    }, delay);
  }

  const observer = new MutationObserver((mutations) => {
    let classChanged = false;
    let structureChanged = false;

    for (const mutation of mutations) {
      if (mutation.type === 'childList') structureChanged = true;
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') classChanged = true;
    }

    if (classChanged) {
      ensureContactSectionUi();
    }

    if (structureChanged) {
      scheduleEnhanceSections(50);
    } else if (classChanged) {
      scheduleEnhanceSections(0);
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  window.addEventListener('load', enhanceSections);
  enhanceSections();
})();