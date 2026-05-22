export const HIDDEN_CURSOR = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E\"), none";

export function applyHiddenCursor(element) {
  if (!(element instanceof Element)) return;
  element.style.setProperty('cursor', HIDDEN_CURSOR, 'important');
}

export function installEntryGateCursorLock(gateRoot) {
  document.documentElement.classList.add('entry-gate-active');
  document.body.classList.add('entry-gate-active');
  document.body.classList.remove('cursor-clickable-hover');

  const style = document.createElement('style');
  style.id = 'entry-gate-cursor-lock';
  style.textContent = `
    html.entry-gate-active,
    html.entry-gate-active *,
    html.entry-gate-active *::before,
    html.entry-gate-active *::after,
    html.entry-gate-active :is(.entry-gate-control, [role="button"], [role="option"]) {
      cursor: ${HIDDEN_CURSOR} !important;
    }

    html.entry-gate-active .entry-gate img {
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);

  const lockWithinGate = (event) => {
    if (!(gateRoot instanceof Element) || !(event.target instanceof Element)) return;
    if (!gateRoot.contains(event.target)) return;

    let node = event.target;
    while (node instanceof Element) {
      applyHiddenCursor(node);
      if (node === gateRoot) break;
      node = node.parentElement;
    }
  };

  const lockAll = () => {
    if (!(gateRoot instanceof Element)) return;
    applyHiddenCursor(document.documentElement);
    applyHiddenCursor(document.body);
    applyHiddenCursor(gateRoot);
    gateRoot.querySelectorAll('*').forEach(applyHiddenCursor);
  };

  lockAll();

  let rafId = null;
  const lockFrame = () => {
    applyHiddenCursor(document.documentElement);
    applyHiddenCursor(document.body);
    lockAll();
    rafId = requestAnimationFrame(lockFrame);
  };
  rafId = requestAnimationFrame(lockFrame);

  const observer = new MutationObserver(lockAll);
  observer.observe(gateRoot, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });

  document.addEventListener('pointerover', lockWithinGate, true);
  document.addEventListener('pointermove', lockWithinGate, true);
  document.addEventListener('mouseover', lockWithinGate, true);

  return () => {
    document.documentElement.classList.remove('entry-gate-active');
    document.body.classList.remove('entry-gate-active');
    style.remove();
    observer.disconnect();
    if (rafId !== null) cancelAnimationFrame(rafId);
    document.removeEventListener('pointerover', lockWithinGate, true);
    document.removeEventListener('pointermove', lockWithinGate, true);
    document.removeEventListener('mouseover', lockWithinGate, true);
  };
}
