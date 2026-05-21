(() => {
  const style = document.createElement('style');
  style.textContent = `
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

    .contact-form-panel.kaja-contact-form-fallback {
      position: relative !important;
      z-index: 4 !important;
      grid-column: 2 !important;
      grid-row: 1 !important;
      justify-self: center !important;
      align-self: center !important;
      width: min(46vw, 560px) !important;
      padding: clamp(20px, 3vw, 38px) !important;
      border: 1px solid rgba(255,255,255,0.16) !important;
      border-radius: clamp(22px, 3vw, 34px) !important;
      background: linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.035)) !important;
      box-shadow: 0 52px 120px rgba(0,0,0,0.64), inset 0 0 70px rgba(255,255,255,0.035) !important;
      backdrop-filter: blur(18px) !important;
      pointer-events: auto !important;
    }

    .kaja-contact-field {
      width: 100% !important;
      border: 1px solid rgba(255,255,255,0.14) !important;
      border-radius: 16px !important;
      background: rgba(0,0,0,0.42) !important;
      color: #fff !important;
      padding: 14px 16px !important;
      font-size: 14px !important;
      outline: none !important;
      margin-top: 12px !important;
      font-family: inherit !important;
    }

    .kaja-contact-submit {
      width: 100% !important;
      margin-top: 14px !important;
      border: 0 !important;
      border-radius: 999px !important;
      background: #fff !important;
      color: #000 !important;
      padding: 14px 18px !important;
      font-size: 12px !important;
      font-weight: 800 !important;
      letter-spacing: 0.16em !important;
      text-transform: uppercase !important;
      font-family: inherit !important;
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

      .contact-form-panel.kaja-contact-form-fallback {
        grid-column: 1 !important;
        grid-row: 2 !important;
        width: min(84vw, 400px) !important;
        padding: 18px !important;
        border-radius: 22px !important;
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

  function createContactForm(section) {
    if (!section || section.querySelector('.contact-form-panel')) return;

    const form = document.createElement('form');
    form.className = 'contact-form-panel kaja-contact-form-fallback';
    form.addEventListener('submit', (event) => event.preventDefault());

    form.innerHTML = `
      <p style="margin:0 0 14px;color:rgba(255,255,255,0.58);text-transform:uppercase;letter-spacing:0.18em;font-size:12px">Contact KAJA</p>
      <input class="kaja-contact-field" placeholder="Name" aria-label="Name" />
      <input class="kaja-contact-field" placeholder="Email" aria-label="Email" type="email" />
      <select class="kaja-contact-field" aria-label="Topic">
        <option value="" disabled selected>Topic</option>
        <option>Catalogue access</option>
        <option>Availability</option>
        <option>Merch collaboration</option>
        <option>General contact</option>
      </select>
      <textarea class="kaja-contact-field" style="min-height:118px;resize:none" placeholder="Message" aria-label="Message"></textarea>
      <button class="kaja-contact-submit" type="submit">Send request</button>
    `;

    section.appendChild(form);
  }

  function addContactTextField(section) {
    const panel = section?.querySelector('.contact-form-panel');
    const dropdown = panel?.querySelector('select');
    if (!panel || !dropdown || panel.querySelector('.kaja-contact-extra-text')) return;

    const input = document.createElement('input');
    input.className = 'kaja-contact-extra-text kaja-contact-field';
    input.type = 'text';
    input.placeholder = 'Company / Details';
    input.setAttribute('aria-label', 'Company or details');
    if (!panel.classList.contains('kaja-contact-form-fallback')) {
      input.style.cssText = dropdown.getAttribute('style') || '';
    }

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
    createContactForm(contactSection);
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