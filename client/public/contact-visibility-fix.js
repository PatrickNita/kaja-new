(() => {
  const style = document.createElement('style');
  style.textContent = `
    .is-contact-section .contact-form-panel,
    .is-contact-section .contact-form-fixed-overlay {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .is-contact-section:not(.is-active) .kaja-contact-form {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .is-contact-section.is-active .kaja-contact-form {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      transform-origin: center center !important;
      will-change: transform !important;
    }
  `;
  document.head.appendChild(style);

  function getContactSection() {
    return document.querySelectorAll('.segment')[5] || document.querySelector('.is-contact-section');
  }

  function option(value, label, disabled = false, selected = false) {
    const item = document.createElement('option');
    item.value = value;
    item.textContent = label;
    item.disabled = disabled;
    item.selected = selected;
    return item;
  }

  function ensureKajaContactForm() {
    const section = getContactSection();
    if (!section) return null;

    section.querySelectorAll('.contact-form-panel, .contact-form-fixed-overlay').forEach((item) => item.remove());
    section.querySelectorAll('.kaja-contact-form .contact-social-links, .kaja-contact-form .kaja-contact-socials').forEach((item) => item.remove());

    let form = section.querySelector(':scope > .kaja-contact-form');
    if (form) return form;

    form = document.createElement('form');
    form.className = 'kaja-contact-form';
    form.addEventListener('submit', (event) => event.preventDefault());

    const title = document.createElement('p');
    title.className = 'kaja-contact-label';
    title.textContent = 'Contact KAJA';
    form.appendChild(title);

    const name = document.createElement('input');
    name.name = 'name';
    name.placeholder = 'Name';
    name.setAttribute('aria-label', 'Name');
    form.appendChild(name);

    const email = document.createElement('input');
    email.name = 'email';
    email.type = 'email';
    email.placeholder = 'Email';
    email.setAttribute('aria-label', 'Email');
    form.appendChild(email);

    const phone = document.createElement('input');
    phone.name = 'phone';
    phone.type = 'tel';
    phone.placeholder = 'Phone number';
    phone.setAttribute('aria-label', 'Phone number');
    form.appendChild(phone);

    const select = document.createElement('select');
    select.name = 'topic';
    select.required = true;
    select.setAttribute('aria-label', 'Topic');
    select.appendChild(option('', 'Topic', true, true));
    select.appendChild(option('general-contact', 'General contact'));
    select.appendChild(option('collaboration', 'Collaboration'));
    select.appendChild(option('distribution', 'Distribution'));
    form.appendChild(select);

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Send request';
    form.appendChild(button);

    section.appendChild(form);
    return form;
  }

  function readScrollPercent() {
    const spans = Array.from(document.querySelectorAll('.scroll-hint span'));
    const text = spans.at(-1)?.textContent || '0%';
    const value = Number.parseFloat(text.replace('%', '')) || 0;
    return Math.min(Math.max(value / 100, 0), 1);
  }

  let smoothScale = 1;

  function syncKajaContactForm() {
    const section = getContactSection();
    const form = ensureKajaContactForm();
    if (!section || !form) return;

    const visible = section.classList.contains('is-active');
    form.style.setProperty('display', visible ? 'flex' : 'none', 'important');
    form.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important');
    form.style.setProperty('opacity', visible ? '1' : '0', 'important');
    form.style.setProperty('pointer-events', visible ? 'auto' : 'none', 'important');

    if (!visible) {
      smoothScale += (1 - smoothScale) * 0.18;
      form.style.setProperty('transform', `scale(${smoothScale})`, 'important');
      return;
    }

    const targetScale = 1 + readScrollPercent() * 0.025;
    smoothScale += (targetScale - smoothScale) * 0.14;
    form.style.setProperty('transform', `scale(${smoothScale})`, 'important');
  }

  const observer = new MutationObserver(syncKajaContactForm);
  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style'] });

  window.addEventListener('load', syncKajaContactForm);
  requestAnimationFrame(function tick() {
    syncKajaContactForm();
    requestAnimationFrame(tick);
  });
})();