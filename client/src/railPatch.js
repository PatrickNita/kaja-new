const patchStyle = document.createElement('style');
patchStyle.textContent = `
.section-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: clamp(18px, 3vh, 34px);
  padding: 13px 20px;
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 999px;
  background: rgba(255,255,255,0.94);
  color: #000;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 20px 55px rgba(0,0,0,0.28);
  transition: transform 0.22s ease, background 0.22s ease;
}
.section-link-button:hover {
  transform: translateY(-2px);
  background: #fff;
}
.mobile-merch-track,
.contact-form-fixed-overlay {
  display: none;
}
.is-contact-section.is-active > .contact-form-panel {
  visibility: hidden !important;
  pointer-events: none !important;
}
.is-contact-section.is-active .contact-form-fixed-overlay {
  position: relative;
  z-index: 4;
  justify-self: center;
  display: block;
  width: min(46vw, 560px);
  padding: clamp(20px, 3vw, 38px);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: clamp(22px, 3vw, 34px);
  background: linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.035));
  box-shadow: 0 52px 120px rgba(0,0,0,0.64), inset 0 0 70px rgba(255,255,255,0.035);
  backdrop-filter: blur(18px);
  transform-origin: center center;
  will-change: transform;
}
.contact-form-fixed-overlay p {
  margin: 0 0 14px;
  color: rgba(255,255,255,0.58);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 12px;
}
.contact-form-fixed-overlay input,
.contact-form-fixed-overlay select,
.contact-form-fixed-overlay textarea {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 16px;
  background: rgba(0,0,0,0.42);
  color: #fff;
  padding: 14px 16px;
  font-size: 14px;
  outline: none;
  margin-top: 12px;
  font-family: inherit;
}
.contact-form-fixed-overlay textarea {
  min-height: 118px;
  resize: none;
}
.contact-form-fixed-overlay button {
  width: 100%;
  margin-top: 14px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #000;
  padding: 14px 18px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-family: inherit;
}
@media (max-width: 900px) {
  .section-link-button {
    margin-top: 13px;
    padding: 10px 14px;
    font-size: 10px;
    letter-spacing: 0.1em;
  }
  .is-hanger-section.is-active .hanger-track {
    visibility: hidden !important;
  }
  .is-hanger-section.is-active .mobile-merch-track {
    position: absolute;
    left: 0;
    top: 42px;
    z-index: 5;
    display: flex;
    align-items: flex-start;
    gap: 26px;
    width: max-content;
    padding: 0 24vw;
    will-change: transform;
    pointer-events: none;
  }
  .mobile-merch-item {
    flex: 0 0 auto;
    width: clamp(132px, 38vw, 170px);
    transform: translateY(-28px);
  }
  .mobile-merch-item img {
    width: clamp(170px, 20vw, 320px);
    height: auto;
    display: block;
    filter: brightness(0) saturate(100%) invert(34%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(82%) contrast(86%);
    opacity: 0.95;
    mix-blend-mode: screen;
  }
  .is-contact-section.is-active .contact-form-fixed-overlay {
    width: min(92vw, 420px);
    padding: 16px;
  }
  .contact-form-fixed-overlay input,
  .contact-form-fixed-overlay select,
  .contact-form-fixed-overlay textarea {
    padding: 10px 12px;
    margin-top: 8px;
    font-size: 12px;
    border-radius: 12px;
  }
  .contact-form-fixed-overlay textarea {
    min-height: 78px;
  }
  .contact-form-fixed-overlay button {
    padding: 11px 14px;
    margin-top: 10px;
    font-size: 10px;
  }
}
`;
document.head.appendChild(patchStyle);

const buttonTargets = [
  {
    title: 'A clean path through the collection.',
    label: 'CHECK CATALOGUE',
    href: '../catalogue'
  },
  {
    title: 'A full collection on the line.',
    label: 'CHECK MERCH',
    href: '../merch'
  }
];

function addSectionButtons() {
  const sections = Array.from(document.querySelectorAll('.segment'));

  buttonTargets.forEach((target) => {
    const section = sections.find((item) => item.querySelector('h1')?.textContent?.trim() === target.title);
    const content = section?.querySelector('.segment-content');
    if (!content || content.querySelector(`[data-section-button="${target.label}"]`)) return;

    const link = document.createElement('a');
    link.className = 'section-link-button';
    link.href = target.href;
    link.dataset.sectionButton = target.label;
    link.textContent = target.label;
    content.appendChild(link);
  });
}

function getProgressForLabel(label) {
  const spans = Array.from(document.querySelectorAll('.scroll-hint span'));
  const first = spans[0]?.textContent || '';
  const last = spans[spans.length - 1]?.textContent || '0%';
  if (!first.includes(label)) return null;
  const percent = Number.parseFloat(last.replace('%', '')) || 0;
  return Math.min(Math.max(percent / 100, 0), 1);
}

function getSectionByTitle(title) {
  return Array.from(document.querySelectorAll('.segment')).find((item) => item.querySelector('h1')?.textContent?.trim() === title);
}

function ensureMobileMerchTrack() {
  const merchSection = getSectionByTitle('A full collection on the line.');
  const railWrap = merchSection?.querySelector('.hanger-rail-wrap');
  const sourceImg = merchSection?.querySelector('.hanger-track img');
  if (!railWrap || !sourceImg) return null;

  let mobileTrack = railWrap.querySelector('.mobile-merch-track');
  if (mobileTrack) return mobileTrack;

  mobileTrack = document.createElement('div');
  mobileTrack.className = 'mobile-merch-track';

  for (let index = 0; index < 6; index += 1) {
    const item = document.createElement('div');
    item.className = 'mobile-merch-item';
    const image = document.createElement('img');
    image.src = sourceImg.src;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    item.appendChild(image);
    mobileTrack.appendChild(item);
  }

  railWrap.appendChild(mobileTrack);
  return mobileTrack;
}

function ensureContactOverlay() {
  const contactSection = getSectionByTitle('Start the conversation.');
  const originalForm = contactSection?.querySelector(':scope > .contact-form-panel');
  if (!contactSection || !originalForm) return null;

  let overlay = contactSection.querySelector(':scope > .contact-form-fixed-overlay');
  if (overlay) return overlay;

  overlay = document.createElement('form');
  overlay.className = 'contact-form-fixed-overlay';
  overlay.innerHTML = originalForm.innerHTML;
  overlay.addEventListener('submit', (event) => event.preventDefault());
  contactSection.insertBefore(overlay, originalForm.nextSibling);
  return overlay;
}

function moveMobileMerchTrack() {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const merchSection = getSectionByTitle('A full collection on the line.');
  const progress = getProgressForLabel('MERCH');
  const mobileTrack = ensureMobileMerchTrack();

  if (isMobile && merchSection?.classList.contains('is-active') && mobileTrack && progress !== null) {
    const items = Array.from(mobileTrack.querySelectorAll('.mobile-merch-item'));
    const step = items[1] ? items[1].offsetLeft - items[0].offsetLeft : window.innerWidth * 0.45;
    const firstItemStartOffset = window.innerWidth * 0.24;
    const firstVisibleLeft = window.innerWidth * 0.04;
    const startX = firstVisibleLeft - firstItemStartOffset;
    const endX = window.innerWidth * 0.5 - step * 5;
    const easedProgress = Math.pow(progress, 1.75);
    const x = startX + (endX - startX) * easedProgress;
    mobileTrack.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  requestAnimationFrame(moveMobileMerchTrack);
}

function growContactOverlay() {
  const contactSection = getSectionByTitle('Start the conversation.');
  const overlay = ensureContactOverlay();
  const progress = getProgressForLabel('CONTACT');

  if (contactSection?.classList.contains('is-active') && overlay && progress !== null) {
    const scale = 0.88 + progress * 0.16;
    const extraHeight = progress * 24;
    overlay.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
    overlay.style.paddingTop = `calc(clamp(20px, 3vw, 38px) + ${extraHeight}px)`;
    overlay.style.paddingBottom = `calc(clamp(20px, 3vw, 38px) + ${extraHeight}px)`;
  }

  requestAnimationFrame(growContactOverlay);
}

const observer = new MutationObserver(() => {
  addSectionButtons();
  ensureContactOverlay();
});
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', () => {
  addSectionButtons();
  ensureContactOverlay();
});
requestAnimationFrame(addSectionButtons);
requestAnimationFrame(moveMobileMerchTrack);
requestAnimationFrame(growContactOverlay);
setTimeout(addSectionButtons, 500);
setTimeout(ensureContactOverlay, 500);
