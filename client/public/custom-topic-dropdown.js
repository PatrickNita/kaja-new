const topicDropdownStyle = document.createElement('style');
topicDropdownStyle.textContent = `
.kaja-contact-form select[name="topic"] {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  opacity: 0 !important;
  pointer-events: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.kaja-topic-dropdown {
  position: relative !important;
  width: 100% !important;
  margin-top: 15px !important;
  font-family: inherit !important;
  z-index: 20 !important;
}

.kaja-contact-message-input {
  width: 100% !important;
  min-height: 112px !important;
  border: 1px solid rgba(255,255,255,0.14) !important;
  border-radius: 18px !important;
  background: rgba(0,0,0,0.42) !important;
  color: #fff !important;
  padding: 17px 19px !important;
  font-size: 15px !important;
  line-height: 1.35 !important;
  outline: none !important;
  margin-top: 15px !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
  resize: none !important;
}

.kaja-contact-message-input::placeholder {
  color: rgba(255,255,255,0.48) !important;
}

.kaja-contact-form .kaja-topic-trigger {
  width: 100% !important;
  min-height: 0 !important;
  height: auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 14px !important;
  margin: 0 !important;
  border: 1px solid rgba(255,255,255,0.14) !important;
  border-radius: 18px !important;
  background: rgba(0,0,0,0.42) !important;
  color: rgba(255,255,255,0.72) !important;
  padding: 17px 19px !important;
  font-size: 15px !important;
  line-height: 1.2 !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
  outline: none !important;
  font-family: inherit !important;
  text-align: left !important;
  cursor: none !important;
  box-shadow: none !important;
  transition: border-color 0.25s ease, background 0.25s ease, color 0.25s ease !important;
}

.kaja-contact-form .kaja-topic-trigger:hover,
.kaja-contact-form .kaja-topic-dropdown.is-open .kaja-topic-trigger {
  border-color: rgba(255,255,255,0.34) !important;
  background: rgba(0,0,0,0.56) !important;
  color: #fff !important;
  transform: none !important;
}

.kaja-topic-trigger span:first-child {
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}

.kaja-topic-arrow {
  width: 7px !important;
  height: 7px !important;
  border-right: 1.5px solid rgba(255,255,255,0.72) !important;
  border-bottom: 1.5px solid rgba(255,255,255,0.72) !important;
  transform: rotate(45deg) translateY(-2px) !important;
  transition: transform 0.25s ease !important;
  flex: 0 0 auto !important;
}

.kaja-topic-dropdown.is-open .kaja-topic-arrow {
  transform: rotate(225deg) translateY(-2px) !important;
}

.kaja-topic-menu {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  top: calc(100% + 6px) !important;
  display: grid !important;
  gap: 5px !important;
  padding: 6px !important;
  border: 1px solid rgba(255,255,255,0.14) !important;
  border-radius: 18px !important;
  background: rgba(5,5,5,0.94) !important;
  box-shadow: 0 22px 60px rgba(0,0,0,0.58), inset 0 0 36px rgba(255,255,255,0.02) !important;
  backdrop-filter: blur(18px) !important;
  opacity: 0 !important;
  transform: translateY(-6px) scale(0.985) !important;
  pointer-events: none !important;
  transition: opacity 0.22s ease, transform 0.22s ease !important;
}

.kaja-topic-dropdown.is-open .kaja-topic-menu {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
  pointer-events: auto !important;
}

.kaja-contact-form .kaja-topic-option {
  width: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  border-radius: 13px !important;
  background: rgba(255,255,255,0.04) !important;
  color: rgba(255,255,255,0.82) !important;
  padding: 12px 14px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.075em !important;
  text-transform: uppercase !important;
  text-align: left !important;
  font-family: inherit !important;
  cursor: none !important;
  box-shadow: none !important;
  transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease, transform 0.22s ease !important;
}

.kaja-contact-form .kaja-topic-option:hover,
.kaja-contact-form .kaja-topic-option.is-selected {
  background: rgba(255,255,255,0.11) !important;
  border-color: rgba(255,255,255,0.22) !important;
  color: #fff !important;
  transform: translateY(-1px) !important;
}

@media (max-width: 900px) {
  .kaja-topic-dropdown {
    margin-top: 8px !important;
  }

  .kaja-contact-message-input {
    min-height: 84px !important;
    border-radius: 12px !important;
    padding: 10px 12px !important;
    font-size: 12px !important;
    margin-top: 8px !important;
  }

  .kaja-contact-form .kaja-topic-trigger {
    border-radius: 12px !important;
    padding: 10px 12px !important;
    font-size: 12px !important;
    cursor: auto !important;
  }

  .kaja-topic-arrow {
    width: 6px !important;
    height: 6px !important;
    border-width: 1.5px !important;
  }

  .kaja-topic-menu {
    border-radius: 12px !important;
    gap: 4px !important;
    padding: 5px !important;
    top: calc(100% + 5px) !important;
  }

  .kaja-contact-form .kaja-topic-option {
    border-radius: 9px !important;
    padding: 9px 11px !important;
    font-size: 10px !important;
    cursor: auto !important;
  }
}
`;
document.head.appendChild(topicDropdownStyle);

const topicOptions = [
  { value: 'general-contact', label: 'General contact' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'distribution', label: 'Distribution' }
];

function closeAllTopicDropdowns(except) {
  document.querySelectorAll('.kaja-topic-dropdown.is-open').forEach((dropdown) => {
    if (dropdown !== except) dropdown.classList.remove('is-open');
  });
}

function addMessageField(form, dropdown) {
  if (!form || !dropdown || form.querySelector('.kaja-contact-message-input')) return;

  const input = document.createElement('textarea');
  input.name = 'message';
  input.className = 'kaja-contact-message-input';
  input.placeholder = 'Message';
  input.setAttribute('aria-label', 'Message');
  input.rows = 4;

  dropdown.insertAdjacentElement('afterend', input);
}

function buildTopicDropdown(select) {
  if (!select) return;
  const form = select.closest('.kaja-contact-form');

  if (select.dataset.customTopicReady === 'true') {
    addMessageField(form, form?.querySelector('.kaja-topic-dropdown'));
    return;
  }

  select.dataset.customTopicReady = 'true';
  select.value = 'general-contact';
  select.dispatchEvent(new Event('change', { bubbles: true }));

  const dropdown = document.createElement('div');
  dropdown.className = 'kaja-topic-dropdown';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'kaja-topic-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const label = document.createElement('span');
  label.textContent = 'General contact';

  const arrow = document.createElement('span');
  arrow.className = 'kaja-topic-arrow';
  arrow.setAttribute('aria-hidden', 'true');

  trigger.appendChild(label);
  trigger.appendChild(arrow);

  const menu = document.createElement('div');
  menu.className = 'kaja-topic-menu';
  menu.setAttribute('role', 'listbox');

  topicOptions.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = option.value === 'general-contact' ? 'kaja-topic-option is-selected' : 'kaja-topic-option';
    button.textContent = option.label;
    button.dataset.value = option.value;
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', option.value === 'general-contact' ? 'true' : 'false');

    button.addEventListener('click', () => {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      label.textContent = option.label;
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.querySelectorAll('.kaja-topic-option').forEach((item) => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-selected');
      button.setAttribute('aria-selected', 'true');
    });

    menu.appendChild(button);
  });

  trigger.addEventListener('click', () => {
    const willOpen = !dropdown.classList.contains('is-open');
    closeAllTopicDropdowns(dropdown);
    dropdown.classList.toggle('is-open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });

  dropdown.appendChild(trigger);
  dropdown.appendChild(menu);
  select.insertAdjacentElement('afterend', dropdown);
  addMessageField(form, dropdown);
}

function initTopicDropdowns() {
  document.querySelectorAll('.kaja-contact-form select[name="topic"]').forEach(buildTopicDropdown);
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.kaja-topic-dropdown')) closeAllTopicDropdowns();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAllTopicDropdowns();
});

const topicObserver = new MutationObserver(initTopicDropdowns);
topicObserver.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', initTopicDropdowns);
requestAnimationFrame(initTopicDropdowns);
setTimeout(initTopicDropdowns, 500);