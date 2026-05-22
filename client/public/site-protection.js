(function protectSite() {
  if (document.documentElement.dataset.siteProtection === 'on') return;
  document.documentElement.dataset.siteProtection = 'on';

  const editableSelector = 'input, textarea, select, [contenteditable="true"]';
  const capture = { capture: true };

  function isEditable(target) {
    return target instanceof Element && Boolean(target.closest(editableSelector));
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

  function lockMedia(root) {
    root.querySelectorAll('img, svg, video, canvas').forEach((node) => {
      node.setAttribute('draggable', 'false');
      if (node instanceof HTMLImageElement) {
        node.referrerPolicy = 'no-referrer';
      }
    });
  }

  document.addEventListener('contextmenu', blockUnlessEditable, capture);
  document.addEventListener('selectstart', blockUnlessEditable, capture);
  document.addEventListener('copy', blockUnlessEditable, capture);
  document.addEventListener('cut', blockUnlessEditable, capture);
  document.addEventListener('dragstart', blockImageDrag, capture);
  document.addEventListener('keydown', blockShortcuts, capture);
  document.addEventListener('auxclick', (event) => {
    if (event.button === 1) blockUnlessEditable(event);
  }, capture);

  lockMedia(document);
  new MutationObserver(() => lockMedia(document.body)).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
