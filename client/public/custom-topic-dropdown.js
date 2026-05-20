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
  position: relative;
  width: 100%;
  margin-top: 15px;
  font-family: inherit;
  z-index: 20;
}

.kaja-topic-trigger {
  width: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px;
  background: rgba(0,0,0,0.42);
  color: rgba(255,255,255,0.72);
  padding: 0 19px;
  font-size: 15px;
  line-height: 1;
  outline: none;
  font-family: inherit;
  text-align: left;
  cursor: none;
  transition: border-color 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.kaja-topic-trigger:hover,
.kaja-topic-dropdown.is-open .kaja-topic-trigger {
  border-color: rgba(255,255,255,0.34);
  background: rgba(0,0,0,0.58);
  color: #fff;
}

.kaja-topic-trigger span:first-child {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.kaja-topic-arrow {
  width: 9px;
  height: 9px;
  border-right: 2px solid rgba(255,255,255,0.72);
  border-bottom: 2px solid rgba(255,255,255,0.72);
  transform: rotate(45deg) translateY(-2px);
  transition: transform 0.25s ease;
  flex: 0 0 auto;
}

.kaja-topic-dropdown.is-open .kaja-topic-arrow {
  transform: rotate(225deg) translateY(-2px);
}

.kaja-topic-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  display: grid;
  gap: 7px;
  padding: 9px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px;
  background: rgba(5,5,5,0.94);
  box-shadow: 0 24px 70px rgba(0,0,0,0.65), inset 0 0 45px rgba(255,255,255,0.025);
  backdrop-filter: blur(18px);
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
  pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.kaja-topic-dropdown.is-open .kaja-topic-menu {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.kaja-topic-option {
  width: 100%;
  min-height: 44px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 13px;
  background: rgba(255,255,255,0.045);
  color: rgba(255,255,255,0.82);
  padding: 0 14px;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: left;
  font-family: inherit;
  cursor: none;
  transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease, transform 0.22s ease;
}

.kaja-topic-option:hover,
.kaja-topic-option.is-selected {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.24);
  color: #fff;
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .kaja-topic-dropdown {
    margin-top: 8px;
  }

  .kaja-topic-trigger {
    min-height: 38px;
    border-radius: 12px;
    padding: 0 12px;
    font-size: 12px;
    cursor: auto;
  }

  .kaja-topic-menu {
    border-radius: 12px;
    gap: 5px;
    padding: 7px;
  }

  .kaja-topic-option {
    min-height: 36px;
    border-radius: 9px;
    font-size: 10px;
    cursor: auto;
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

function buildTopicDropdown(select) {
  if (!select || select.dataset.customTopicReady === 'true') return;
  select.dataset.customTopicReady = 'true';

  const dropdown = document.createElement('div');
  dropdown.className = 'kaja-topic-dropdown';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'kaja-topic-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const label = document.createElement('span');
  label.textContent = 'Topic';

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
    button.className = 'kaja-topic-option';
    button.textContent = option.label;
    button.dataset.value = option.value;
    button.setAttribute('role', 'option');

    button.addEventListener('click', () => {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      label.textContent = option.label;
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.querySelectorAll('.kaja-topic-option').forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
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
