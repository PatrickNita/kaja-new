const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const CAPTURE = { capture: true };

function isEditable(target) {
  return target instanceof Element && Boolean(target.closest(EDITABLE_SELECTOR));
}

function blockUnlessEditable(event) {
  if (isEditable(event.target)) return;
  event.preventDefault();
}

function blockImageDrag(event) {
  const target = event.target;
  if (target instanceof HTMLImageElement || target instanceof SVGElement || target?.closest?.('picture, svg')) {
    event.preventDefault();
  }
}

function blockShortcuts(event) {
  if (isEditable(event.target)) return;

  const key = event.key.toLowerCase();
  const mod = event.ctrlKey || event.metaKey;

  if (key === 'f12' || key === 'f7') {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (!mod) return;

  if (key === 'u' || key === 's' || key === 'p') {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (event.shiftKey && ['i', 'j', 'c', 'k', 'u'].includes(key)) {
    event.preventDefault();
    event.stopPropagation();
  }
}

function lockMedia(root = document) {
  root.querySelectorAll('img, svg, video, canvas').forEach((node) => {
    node.setAttribute('draggable', 'false');
    if (node instanceof HTMLImageElement) {
      node.referrerPolicy = 'no-referrer';
    }
  });
}

export function initSiteProtection() {
  if (typeof document === 'undefined' || document.documentElement.dataset.siteProtection === 'on') return;
  document.documentElement.dataset.siteProtection = 'on';

  document.addEventListener('contextmenu', blockUnlessEditable, CAPTURE);
  document.addEventListener('selectstart', blockUnlessEditable, CAPTURE);
  document.addEventListener('copy', blockUnlessEditable, CAPTURE);
  document.addEventListener('cut', blockUnlessEditable, CAPTURE);
  document.addEventListener('dragstart', blockImageDrag, CAPTURE);
  document.addEventListener('keydown', blockShortcuts, CAPTURE);
  document.addEventListener('auxclick', (event) => {
    if (event.button === 1) blockUnlessEditable(event);
  }, CAPTURE);

  lockMedia();
  new MutationObserver(() => lockMedia(document.body)).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

initSiteProtection();
