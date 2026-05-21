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

  function addCta(section, className, text, href) {
    const content = section?.querySelector('.segment-content');
    if (!content || content.querySelector(`.${className}`)) return;

    const row = document.createElement('div');
    row.className = `kaja-section-cta-row ${className}`;

    const link = document.createElement('a');
    link.className = 'kaja-section-cta-button';
    link.href = href;
    link.textContent = text;

    row.appendChild(link);
    content.appendChild(row);
  }

  const contactSocials = [
    { label: 'Instagram', href: '#instagram', icon: '/socials/instagram.webp' },
    { label: 'WhatsApp', href: '#whatsapp', icon: '/socials/whatsapp.webp' },
    { label: 'Telegram', href: '#telegram', icon: '/socials/telegram.webp' },
    { label: 'E-mail', href: 'mailto:contact@kaja-tobacco.com', icon: '/socials/mail.webp' }
  ];

  function addContactTextField(section) {
    const panel = section?.querySelector('.contact-form-panel');
    const dropdown = panel?.querySelector('select');
    if (!panel || !dropdown || panel.querySelector('.kaja-contact-extra-text')) return;

    const input = document.createElement('input');
    input.className = 'kaja-contact-extra-text';
    input.type = 'text';
    input.placeholder = 'Company / Details';
    input.setAttribute('aria-label', 'Company or details');
    input.style.cssText = dropdown.getAttribute('style') || '';

    dropdown.insertAdjacentElement('afterend', input);
  }

  function addContactSocialButtons(section) {
    const content = section?.querySelector('.segment-content');
    if (!content || content.querySelector('.kaja-contact-socials')) return;

    section.querySelector('.contact-form-panel .kaja-contact-socials')?.remove();

    const row = document.createElement('div');
    row.className = 'kaja-contact-socials';
    row.setAttribute('aria-label', 'Contact channels');

    contactSocials.forEach((social) => {
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

  function enhanceSections() {
    const catalogueSection = byIndex(2);
    const merchSection = byIndex(4);
    const contactSection = byIndex(5);

    addCta(catalogueSection, 'kaja-catalogue-cta', 'Check Catalogue', '#catalogue');
    addCta(merchSection, 'kaja-merch-cta', 'Check Merch', '#merch');
    addContactTextField(contactSection);
    addContactSocialButtons(contactSection);
  }

  const observer = new MutationObserver(enhanceSections);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('load', enhanceSections);
  requestAnimationFrame(function tick() {
    enhanceSections();
    requestAnimationFrame(tick);
  });
})();