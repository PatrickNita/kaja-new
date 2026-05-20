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
.mobile-merch-track {
  display: none;
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

function getMerchProgress() {
  const spans = Array.from(document.querySelectorAll('.scroll-hint span'));
  const first = spans[0]?.textContent || '';
  const last = spans[spans.length - 1]?.textContent || '0%';
  if (!first.includes('MERCH')) return null;
  const percent = Number.parseFloat(last.replace('%', '')) || 0;
  return Math.min(Math.max(percent / 100, 0), 1);
}

function getMerchSection() {
  return Array.from(document.querySelectorAll('.segment')).find((item) => item.querySelector('h1')?.textContent?.trim() === 'A full collection on the line.');
}

function ensureMobileMerchTrack() {
  const merchSection = getMerchSection();
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

function moveMobileMerchTrack() {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const merchSection = getMerchSection();
  const progress = getMerchProgress();
  const mobileTrack = ensureMobileMerchTrack();

  if (isMobile && merchSection?.classList.contains('is-active') && mobileTrack && progress !== null) {
    const items = Array.from(mobileTrack.querySelectorAll('.mobile-merch-item'));
    const step = items[1] ? items[1].offsetLeft - items[0].offsetLeft : window.innerWidth * 0.45;
    const startX = window.innerWidth * 0.82;
    const endX = window.innerWidth * 0.5 - step * 5;
    const x = startX + (endX - startX) * progress;
    mobileTrack.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  requestAnimationFrame(moveMobileMerchTrack);
}

const observer = new MutationObserver(addSectionButtons);
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', addSectionButtons);
requestAnimationFrame(addSectionButtons);
requestAnimationFrame(moveMobileMerchTrack);
setTimeout(addSectionButtons, 500);
