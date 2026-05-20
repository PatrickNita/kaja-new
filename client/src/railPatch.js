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
@media (max-width: 900px) {
  .section-link-button {
    margin-top: 13px;
    padding: 10px 14px;
    font-size: 10px;
    letter-spacing: 0.1em;
  }
  .is-hanger-section.is-active .hanger-track {
    transition: none !important;
    will-change: transform !important;
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
  const last = spans.at(-1)?.textContent || '0%';
  if (!first.includes('MERCH')) return null;
  const percent = Number.parseFloat(last.replace('%', '')) || 0;
  return Math.min(Math.max(percent / 100, 0), 1);
}

function forceMobileMerchTravel() {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const merchSection = Array.from(document.querySelectorAll('.segment')).find((item) => item.querySelector('h1')?.textContent?.trim() === 'A full collection on the line.');
  const track = merchSection?.querySelector('.hanger-track');
  const progress = getMerchProgress();

  if (isMobile && merchSection?.classList.contains('is-active') && track && progress !== null) {
    const rail = merchSection.querySelector('.hanger-rail-wrap');
    const railWidth = rail?.getBoundingClientRect().width || window.innerWidth;
    const trackWidth = track.scrollWidth || track.getBoundingClientRect().width || railWidth * 3;
    const startX = window.innerWidth * 0.58;
    const endX = Math.min(window.innerWidth * 0.06, railWidth - trackWidth - window.innerWidth * 0.06);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const x = startX + (endX - startX) * eased;
    track.style.setProperty('transform', `translate3d(${x}px, 0, 0)`, 'important');
  }

  requestAnimationFrame(forceMobileMerchTravel);
}

const observer = new MutationObserver(addSectionButtons);
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', addSectionButtons);
requestAnimationFrame(addSectionButtons);
requestAnimationFrame(forceMobileMerchTravel);
setTimeout(addSectionButtons, 500);
