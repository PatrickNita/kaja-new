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

    body.kaja-footer-active .is-contact-section .progress-track span,
    body.kaja-footer-returning .is-contact-section .progress-track span {
      transform: scaleX(1) !important;
    }

    .is-contact-section:not(.is-active) .kaja-contact-form {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .is-contact-section .kaja-contact-form,
    .is-contact-section.is-active .kaja-contact-form {
      position: relative !important;
      z-index: 80 !important;
      transform-origin: center center !important;
      will-change: transform !important;
      isolation: isolate !important;
      background: rgba(38, 38, 38, 0.86) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      box-shadow: 0 28px 72px rgba(0,0,0,0.55) !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }

    .is-contact-section.is-active .kaja-contact-form {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    .kaja-contact-form input,
    .kaja-contact-form select,
    .kaja-contact-form textarea,
    .kaja-contact-form .kaja-contact-message-input {
      background: #1a1a1a !important;
      border-color: rgba(255,255,255,0.12) !important;
    }

    .kaja-contact-form .kaja-topic-trigger,
    .kaja-contact-form .kaja-topic-trigger:hover,
    .kaja-contact-form .kaja-topic-trigger:focus,
    .kaja-contact-form .kaja-topic-trigger:focus-visible,
    .kaja-contact-form .kaja-topic-trigger:active,
    .kaja-contact-form .kaja-topic-dropdown.is-open .kaja-topic-trigger {
      background: #1a1a1a !important;
      color: #fff !important;
      border-color: rgba(255,255,255,0.22) !important;
      box-shadow: none !important;
      transform: none !important;
    }

    .kaja-contact-form .kaja-topic-menu {
      background: #1f1f1f !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-shadow: 0 18px 48px rgba(0,0,0,0.5) !important;
    }

    .kaja-contact-form .kaja-topic-option,
    .kaja-contact-form .kaja-topic-option:hover,
    .kaja-contact-form .kaja-topic-option:focus,
    .kaja-contact-form .kaja-topic-option:focus-visible,
    .kaja-contact-form .kaja-topic-option:active,
    .kaja-contact-form .kaja-topic-option.is-selected {
      background: #2e2e2e !important;
      color: #fff !important;
      border-color: rgba(255,255,255,0.12) !important;
      box-shadow: none !important;
      transform: none !important;
    }

    .is-contact-section .kaja-contact-form button {
      cursor: none !important;
      transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease !important;
      will-change: transform !important;
    }

    .is-contact-section .kaja-contact-form button:hover {
      transform: translateY(-2px) !important;
      background: #fff !important;
      box-shadow: 0 20px 55px rgba(0,0,0,0.28) !important;
    }

    @media (max-width: 900px) {
      .is-contact-section .kaja-contact-form,
      .is-contact-section.is-active .kaja-contact-form {
        grid-column: 1 !important;
        justify-self: center !important;
        align-self: start !important;
        width: 100% !important;
        max-width: min(420px, calc(100% - 8px)) !important;
        margin-left: auto !important;
        margin-right: auto !important;
        transform-origin: top center !important;
        box-sizing: border-box !important;
      }
    }
  `;
  document.head.appendChild(style);

  function readContactCopy() {
    return window.__kajaLocale?.copy?.contact ?? {
      heading: 'Contact KAJA',
      name: 'Name',
      email: 'Email',
      phone: 'Phone number',
      topic: 'Topic',
      submit: 'Send request',
      topics: [
        { value: 'general-contact', label: 'General contact' },
        { value: 'collaboration', label: 'Collaboration' },
        { value: 'distribution', label: 'Distribution' }
      ]
    };
  }

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

    section.style.setProperty('isolation', 'isolate', 'important');
    section.querySelectorAll('.contact-form-panel, .contact-form-fixed-overlay').forEach((item) => item.remove());
    section.querySelectorAll('.kaja-contact-form .contact-social-links, .kaja-contact-form .kaja-contact-socials').forEach((item) => item.remove());

    let form = section.querySelector(':scope > .kaja-contact-form');
    if (form) return form;

    form = document.createElement('form');
    form.className = 'kaja-contact-form';
    form.addEventListener('submit', (event) => event.preventDefault());

    const contact = readContactCopy();

    const title = document.createElement('p');
    title.className = 'kaja-contact-label';
    title.textContent = contact.heading;
    form.appendChild(title);

    const name = document.createElement('input');
    name.name = 'name';
    name.placeholder = contact.name;
    name.setAttribute('aria-label', contact.name);
    form.appendChild(name);

    const email = document.createElement('input');
    email.name = 'email';
    email.type = 'email';
    email.placeholder = contact.email;
    email.setAttribute('aria-label', contact.email);
    form.appendChild(email);

    const phone = document.createElement('input');
    phone.name = 'phone';
    phone.type = 'tel';
    phone.placeholder = contact.phone;
    phone.setAttribute('aria-label', contact.phone);
    form.appendChild(phone);

    const select = document.createElement('select');
    select.name = 'topic';
    select.required = true;
    select.setAttribute('aria-label', contact.topic);
    select.appendChild(option('', contact.topic, true, true));
    contact.topics.forEach((item) => {
      select.appendChild(option(item.value, item.label));
    });
    form.appendChild(select);

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = contact.submit;
    form.appendChild(button);

    section.appendChild(form);
    return form;
  }

  function readScrollPercent() {
    const activeSection = document.querySelector('.segment.is-active');
    const frozenValue = activeSection?.dataset.frozenProgress;
    if (frozenValue != null && frozenValue !== '') {
      const parsed = Number.parseFloat(frozenValue);
      if (!Number.isNaN(parsed)) return Math.min(Math.max(parsed, 0), 1);
    }

    const sectionValue = activeSection?.dataset.sectionProgress;
    if (sectionValue != null && sectionValue !== '') {
      const parsed = Number.parseFloat(sectionValue);
      if (!Number.isNaN(parsed)) return Math.min(Math.max(parsed, 0), 1);
    }

    const hint = document.querySelector('.scroll-hint');
    const datasetValue = hint?.dataset.progress;
    if (datasetValue != null && datasetValue !== '') {
      const parsed = Number.parseFloat(datasetValue);
      if (!Number.isNaN(parsed)) return Math.min(Math.max(parsed, 0), 1);
    }

    if (hint?.dataset.sectionProgress === '1') return 1;
    if (document.body.classList.contains('kaja-footer-active')) return 1;
    if (hint?.dataset.hintMode === 'footer') return 1;

    const spans = Array.from(document.querySelectorAll('.scroll-hint span'));
    const text = spans.at(-1)?.textContent || '0%';
    const value = Number.parseFloat(text.replace('%', '')) || 0;
    return Math.min(Math.max(value / 100, 0), 1);
  }

  let footerWasActive = false;
  let holdContactLoader = false;

  function syncFooterState() {
    const hint = document.querySelector('.scroll-hint');
    const footerActive = hint?.dataset.hintMode === 'footer';
    const contactActive = hint?.dataset.sectionShape === 'contact';
    const percent = readScrollPercent();

    if (footerActive) {
      footerWasActive = true;
      holdContactLoader = true;
    } else if (footerWasActive && contactActive) {
      holdContactLoader = percent < 0.995;
      if (!holdContactLoader) footerWasActive = false;
    } else if (!contactActive) {
      footerWasActive = false;
      holdContactLoader = false;
    }

    document.body.classList.toggle('kaja-footer-active', footerActive);
    document.body.classList.toggle('kaja-footer-returning', holdContactLoader && contactActive);
  }

  let smoothScale = 1;
  let contactLoopActive = false;

  function contactNeedsAnimation() {
    const section = getContactSection();
    if (!section) return false;
    if (section.classList.contains('is-active')) return true;
    if (document.body.classList.contains('kaja-footer-active')) return true;
    if (document.body.classList.contains('kaja-footer-returning')) return true;
    return Math.abs(smoothScale - 1) > 0.002;
  }

  function scheduleContactSync() {
    if (contactLoopActive) return;
    contactLoopActive = true;
    requestAnimationFrame(function contactLoop() {
      syncKajaContactForm();
      if (contactNeedsAnimation()) {
        requestAnimationFrame(contactLoop);
      } else {
        contactLoopActive = false;
      }
    });
  }

  function clearFormVisibilityOverrides(form) {
    ['display', 'visibility', 'opacity', 'pointer-events'].forEach((prop) => {
      form.style.removeProperty(prop);
    });
  }

  function snapContactFormPresentation() {
    const section = getContactSection();
    if (!section?.classList.contains('is-active')) return;

    const form = ensureKajaContactForm();
    if (!form) return;

    clearFormVisibilityOverrides(form);
    smoothScale = 1 + readScrollPercent() * 0.025;
    form.style.setProperty('transform', `scale(${smoothScale})`, 'important');
  }

  function syncKajaContactForm() {
    syncFooterState();

    const section = getContactSection();
    const form = ensureKajaContactForm();
    if (!section || !form) return;

    form.querySelectorAll('.kaja-topic-trigger').forEach((item) => {
      item.style.setProperty('background', '#1a1a1a', 'important');
      item.style.setProperty('color', '#fff', 'important');
      item.style.setProperty('box-shadow', 'none', 'important');
    });

    form.querySelectorAll('.kaja-topic-option').forEach((item) => {
      item.style.setProperty('background', '#2e2e2e', 'important');
      item.style.setProperty('color', '#fff', 'important');
      item.style.setProperty('box-shadow', 'none', 'important');
    });

    const visible = section.classList.contains('is-active');
    if (visible) clearFormVisibilityOverrides(form);
    form.style.setProperty('position', 'relative', 'important');
    form.style.setProperty('z-index', '80', 'important');

    if (!visible) {
      smoothScale += (1 - smoothScale) * 0.18;
      form.style.setProperty('transform', `scale(${smoothScale})`, 'important');
      return;
    }

    const targetScale = 1 + readScrollPercent() * 0.025;
    smoothScale += (targetScale - smoothScale) * 0.14;
    form.style.setProperty('transform', `scale(${smoothScale})`, 'important');
  }

  let observerTimer = null;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') continue;
      const target = mutation.target;
      if (!target?.classList?.contains?.('is-contact-section')) continue;
      if (target.classList.contains('is-active')) {
        snapContactFormPresentation();
        scheduleContactSync();
        return;
      }
    }

    if (observerTimer !== null) window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(() => {
      observerTimer = null;
      scheduleContactSync();
    }, 40);
  });
  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style', 'data-section-progress', 'data-frozen-progress'] });

  window.addEventListener('load', () => {
    ensureKajaContactForm();
    scheduleContactSync();
  });
  ensureKajaContactForm();
  scheduleContactSync();
})();