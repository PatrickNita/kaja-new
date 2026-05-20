const cursorHoverStyle = document.createElement('style');
cursorHoverStyle.textContent = `
.cursor-ring,
.cursor-dot {
  transition: width 0.22s ease, height 0.22s ease, border-width 0.22s ease, background 0.22s ease, opacity 0.22s ease;
}

body.cursor-clickable-hover .cursor-ring {
  width: 76px !important;
  height: 76px !important;
  border-width: 3px !important;
  opacity: 1 !important;
}

body.cursor-clickable-hover .cursor-dot {
  width: 12px !important;
  height: 12px !important;
  opacity: 1 !important;
}

@media (max-width: 900px), (pointer: coarse) {
  body.cursor-clickable-hover .cursor-ring,
  body.cursor-clickable-hover .cursor-dot {
    width: revert !important;
    height: revert !important;
    border-width: revert !important;
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
  '[role="button"]',
  '[onclick]',
  '.section-link-button',
  '.kaja-contact-social-button',
  '.brand'
].join(',');

function updateClickableCursor(event) {
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
