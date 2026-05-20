const introCleanJarStyle = document.createElement('style');
introCleanJarStyle.textContent = `
.is-intro-section .intro-sequence,
.is-intro-section .intro-frame-animation {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

.is-intro-section .intro-jar-rebuilt {
  position: relative !important;
  z-index: 6 !important;
  grid-column: 2 !important;
  grid-row: 1 !important;
  justify-self: center !important;
  align-self: center !important;
  width: min(36vw, 470px) !important;
  aspect-ratio: 9 / 16 !important;
  transform-origin: center center !important;
  will-change: transform !important;
  pointer-events: none !important;
}

.is-intro-section .intro-jar-rebuilt img {
  position: absolute !important;
  inset: -10% !important;
  width: 120% !important;
  height: 120% !important;
  object-fit: contain !important;
  object-position: center !important;
  display: block !important;
  filter: drop-shadow(0 46px 70px rgba(0,0,0,0.62)) !important;
  user-select: none !important;
  pointer-events: none !important;
}

@media (max-width: 900px) {
  .is-intro-section .intro-jar-rebuilt {
    grid-column: 1 !important;
    grid-row: 2 !important;
    width: min(68vw, 300px) !important;
  }

  .is-intro-section .intro-jar-rebuilt img {
    inset: -9% !important;
    width: 118% !important;
    height: 118% !important;
  }
}

@media (max-height: 680px) and (max-width: 900px) {
  .is-intro-section .intro-jar-rebuilt {
    width: min(55vw, 220px) !important;
  }
}
`;
document.head.appendChild(introCleanJarStyle);

function clampIntroJar(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothIntroJar(value) {
  return value * value * (3 - 2 * value);
}

function getIntroProgress() {
  const hint = document.querySelector('.scroll-hint');
  const text = hint?.textContent || '';
  if (!text.includes('INTRO')) return null;

  const match = text.match(/(\d+)%/);
  return clampIntroJar(match ? Number(match[1]) / 100 : 0, 0, 1);
}

function ensureRebuiltIntroJar() {
  const section = document.querySelector('.is-intro-section');
  if (!section) return null;

  section.querySelectorAll('.intro-frame-animation').forEach((element) => element.remove());

  let jar = section.querySelector('.intro-jar-rebuilt');
  if (jar) return jar;

  jar = document.createElement('div');
  jar.className = 'intro-jar-rebuilt';
  jar.setAttribute('aria-label', 'KAJA intro jar visual');

  const image = document.createElement('img');
  image.src = '/intro-jar.webp';
  image.alt = 'KAJA product jar';
  image.draggable = false;
  image.decoding = 'async';

  jar.appendChild(image);
  section.appendChild(jar);
  return jar;
}

function updateRebuiltIntroJar() {
  const jar = ensureRebuiltIntroJar();
  const progress = getIntroProgress();

  if (jar && progress !== null) {
    const grow = smoothIntroJar(clampIntroJar(progress / 0.64, 0, 1));
    const end = smoothIntroJar(clampIntroJar((progress - 0.74) / 0.26, 0, 1));
    const scale = 1.06 + grow * 0.13 - end * 0.17;
    const y = end * 7.5;

    jar.style.transform = `translate3d(0, ${y}vh, 0) scale(${scale})`;
  }

  requestAnimationFrame(updateRebuiltIntroJar);
}

requestAnimationFrame(updateRebuiltIntroJar);
