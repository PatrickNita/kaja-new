const introCleanJarStyle = document.createElement('style');
introCleanJarStyle.textContent = `
.is-intro-section .intro-sequence {
  position: relative !important;
  z-index: 4 !important;
  justify-self: center !important;
  align-self: center !important;
  width: min(36vw, 470px) !important;
  aspect-ratio: 9 / 16 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  overflow: visible !important;
  transform-origin: center center !important;
  will-change: transform !important;
}

.is-intro-section .intro-sequence::before {
  content: '' !important;
  position: absolute !important;
  inset: -10% !important;
  background-image: url('/intro-jar.webp') !important;
  background-size: contain !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  filter: drop-shadow(0 46px 70px rgba(0,0,0,0.62)) !important;
  pointer-events: none !important;
}

.is-intro-section .intro-sequence::after,
.is-intro-section .intro-sequence img,
.is-intro-section .intro-frame {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

@media (max-width: 900px) {
  .is-intro-section .intro-sequence {
    width: min(68vw, 300px) !important;
  }

  .is-intro-section .intro-sequence::before {
    inset: -9% !important;
  }
}

@media (max-height: 680px) and (max-width: 900px) {
  .is-intro-section .intro-sequence {
    width: min(55vw, 220px) !important;
  }
}
`;
document.head.appendChild(introCleanJarStyle);

const introCleanJar = {
  progress: 0,
  y: 0,
  scale: 1.06,
  targetY: 0,
  targetScale: 1.06
};

function clampIntroCleanJar(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothIntroCleanJar(value) {
  return value * value * (3 - 2 * value);
}

function readIntroCleanProgress() {
  const hint = document.querySelector('.scroll-hint');
  const text = hint?.textContent || '';
  if (!text.includes('INTRO')) return null;

  const match = text.match(/(\d+)%/);
  return clampIntroCleanJar(match ? Number(match[1]) / 100 : 0, 0, 1);
}

function updateIntroCleanJar() {
  const intro = document.querySelector('.is-intro-section.is-active .intro-sequence');
  const progress = readIntroCleanProgress();

  if (intro && progress !== null) {
    introCleanJar.progress += (progress - introCleanJar.progress) * 0.16;

    const growProgress = smoothIntroCleanJar(clampIntroCleanJar(introCleanJar.progress / 0.64, 0, 1));
    const endProgress = smoothIntroCleanJar(clampIntroCleanJar((introCleanJar.progress - 0.74) / 0.26, 0, 1));

    introCleanJar.targetScale = 1.06 + growProgress * 0.13 - endProgress * 0.17;
    introCleanJar.targetY = endProgress * window.innerHeight * 0.075;

    introCleanJar.scale += (introCleanJar.targetScale - introCleanJar.scale) * 0.16;
    introCleanJar.y += (introCleanJar.targetY - introCleanJar.y) * 0.16;

    intro.style.transform = `translate3d(0, ${introCleanJar.y}px, 0) scale(${introCleanJar.scale})`;
  }

  requestAnimationFrame(updateIntroCleanJar);
}

requestAnimationFrame(updateIntroCleanJar);
