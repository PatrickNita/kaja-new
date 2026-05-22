const HIDDEN_CURSOR = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E\"), none";

const cursorHoverStyle = document.createElement('style');
cursorHoverStyle.textContent = `
.cursor-ring,
.cursor-dot {
  transition: width 0.22s ease, height 0.22s ease, border-width 0.22s ease, background 0.22s ease, opacity 0.22s ease;
}

body.cursor-clickable-hover .cursor-ring {
  width: 66px !important;
  height: 66px !important;
  border-width: 2.25px !important;
  opacity: 1 !important;
}

body.cursor-clickable-hover .cursor-dot {
  width: 9px !important;
  height: 9px !important;
  opacity: 1 !important;
}

input,
select,
textarea,
[contenteditable="true"] {
  cursor: none !important;
}

html.entry-gate-active,
html.entry-gate-active *,
html.entry-gate-active :is(a, button, input, select, textarea, label, summary, [role="button"], [role="option"], [href], .lang-selector-trigger, .entry-gate-button) {
  cursor: ${HIDDEN_CURSOR} !important;
}

@media (max-width: 900px), (pointer: coarse) {
  body.cursor-clickable-hover .cursor-ring,
  body.cursor-clickable-hover .cursor-dot {
    width: revert !important;
    height: revert !important;
    border-width: revert !important;
  }

  input,
  select,
  textarea,
  [contenteditable="true"] {
    cursor: auto !important;
  }

  html.entry-gate-active,
  html.entry-gate-active *,
  html.entry-gate-active :is(a, button, input, select, textarea, label, summary, [role="button"], [role="option"], [href], .lang-selector-trigger, .entry-gate-button) {
    cursor: ${HIDDEN_CURSOR} !important;
  }
}
`;
document.head.appendChild(cursorHoverStyle);

const clickableSelector = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[role="button"]',
  '[onclick]',
  '.section-link-button',
  '.kaja-contact-social-button',
  '.brand'
].join(',');

function updateClickableCursor(event) {
  if (document.documentElement.classList.contains('entry-gate-active')) {
    const gateClickable = Boolean(event.target.closest('.entry-gate .entry-gate-control'));
    document.body.classList.toggle('cursor-clickable-hover', gateClickable);
    return;
  }

  const isClickable = Boolean(event.target.closest(clickableSelector));
  document.body.classList.toggle('cursor-clickable-hover', isClickable);
}

document.addEventListener('pointermove', updateClickableCursor, { passive: true });
document.addEventListener('pointerover', updateClickableCursor, { passive: true });
document.addEventListener('pointerout', () => {
  document.body.classList.remove('cursor-clickable-hover');
}, { passive: true });
document.addEventListener('mouseleave', () => {
  document.body.classList.remove('cursor-clickable-hover');
});
