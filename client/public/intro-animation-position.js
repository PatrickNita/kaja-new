const introAnimationPositionStyle = document.createElement('style');
introAnimationPositionStyle.textContent = `
.segment:first-of-type {
  grid-template-columns: minmax(280px, 0.9fr) minmax(280px, 1.1fr) !important;
  align-items: center !important;
}

.segment:first-of-type .segment-content {
  grid-column: 1 !important;
  grid-row: 1 !important;
  align-self: center !important;
}

.segment:first-of-type .visual-panel,
.segment:first-of-type .visual {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

.segment:first-of-type .intro-frame-animation {
  position: relative !important;
  z-index: 7 !important;
  grid-column: 2 !important;
  grid-row: 1 !important;
  justify-self: center !important;
  align-self: center !important;
  display: block !important;
  width: min(33vw, 420px) !important;
  aspect-ratio: 9 / 16 !important;
  margin: 0 !important;
  border: 1px solid rgba(255,255,255,0.16) !important;
  border-radius: clamp(22px, 3vw, 34px) !important;
  overflow: hidden !important;
  background: #050505 !important;
  box-shadow: 0 58px 135px rgba(0,0,0,0.68), inset 0 0 70px rgba(255,255,255,0.035) !important;
  transform-origin: center center !important;
  will-change: transform !important;
}

.segment:first-of-type .intro-frame-animation img {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  object-fit: cover !important;
  object-position: center !important;
  user-select: none !important;
  pointer-events: none !important;
}

.segment:first-of-type .intro-frame-animation::after {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  background: linear-gradient(180deg, rgba(255,255,255,0.07), transparent 18%, rgba(0,0,0,0.2)) !important;
  pointer-events: none !important;
}

@media (max-width: 900px) {
  .segment:first-of-type {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto minmax(230px, 1fr) !important;
  }

  .segment:first-of-type .segment-content {
    grid-column: 1 !important;
    grid-row: 1 !important;
  }

  .segment:first-of-type .intro-frame-animation {
    grid-column: 1 !important;
    grid-row: 2 !important;
    width: min(56vw, 245px) !important;
    justify-self: center !important;
    align-self: center !important;
    margin: 0 auto !important;
    border-radius: 22px !important;
  }
}

@media (max-height: 680px) and (max-width: 900px) {
  .segment:first-of-type .intro-frame-animation {
    width: min(45vw, 190px) !important;
  }
}
`;
document.head.appendChild(introAnimationPositionStyle);

const introAnimationMotion = {
  scale: 0.965,
  targetScale: 0.965,
  frame: 1
};

function findIntroSection() {
  return document.querySelector('.segment');
}

function getIntroProgress() {
  const spans = Array.from(document.querySelectorAll('.scroll-hint span'));
  const first = spans[0]?.textContent || '';
  const last = spans[spans.length - 1]?.textContent || '0%';
  if (!first.includes('INTRO')) return null;
  const percent = Number.parseFloat(last.replace('%', '')) || 0;
  return Math.min(Math.max(percent / 100, 0), 1);
}

function ensureCleanIntroSection() {
  const section = findIntroSection();
  if (!section) return null;

  const eyebrow = section.querySelector('.eyebrow');
  if (eyebrow) eyebrow.textContent = 'INTRO';

  const heading = section.querySelector('.segment-content h1');
  if (heading) heading.textContent = 'INTRO';

  const copy = section.querySelector('.copy');
  if (copy) copy.textContent = 'A scroll-driven KAJA product sequence with frame-by-frame motion and a fluid spring scale.';

  let frame = section.querySelector(':scope > .intro-frame-animation');
  if (!frame) {
    frame = document.createElement('div');
    frame.className = 'intro-frame-animation';
    const image = document.createElement('img');
    image.alt = 'KAJA intro animation frame';
    image.decoding = 'async';
    image.loading = 'eager';
    image.src = '/intro-frames/frame-01.webp';
    frame.appendChild(image);
    section.appendChild(frame);
  }

  for (let index = 1; index <= 20; index += 1) {
    const preload = new Image();
    preload.src = `/intro-frames/frame-${String(index).padStart(2, '0')}.webp`;
  }

  return frame;
}

function animateIntroSequence() {
  const section = findIntroSection();
  const frame = ensureCleanIntroSection();
  const progress = getIntroProgress();

  if (section?.classList.contains('is-active') && frame && progress !== null) {
    const image = frame.querySelector('img');
    const frameNumber = Math.min(20, Math.max(1, Math.floor(progress * 19) + 1));
    const src = `/intro-frames/frame-${String(frameNumber).padStart(2, '0')}.webp`;
    if (image && !image.src.endsWith(src)) image.src = src;

    const growThenShrink = Math.sin(progress * Math.PI);
    introAnimationMotion.targetScale = 0.965 + growThenShrink * 0.105 - progress * 0.014;
    introAnimationMotion.scale += (introAnimationMotion.targetScale - introAnimationMotion.scale) * 0.14;
    frame.style.transform = `translate3d(0, 0, 0) scale(${introAnimationMotion.scale})`;
  }

  requestAnimationFrame(animateIntroSequence);
}

const introRedoObserver = new MutationObserver(ensureCleanIntroSection);
introRedoObserver.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', ensureCleanIntroSection);
requestAnimationFrame(ensureCleanIntroSection);
requestAnimationFrame(animateIntroSequence);
setTimeout(ensureCleanIntroSection, 500);
