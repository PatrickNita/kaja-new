const introJarMotionStyle = document.createElement('style');
introJarMotionStyle.textContent = `
.is-intro-section .intro-sequence {
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

.is-intro-section .intro-sequence::after {
  display: none !important;
}

.is-intro-section .intro-sequence img,
.is-intro-section .intro-frame {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

@media (max-width: 900px) {
  .is-intro-section .intro-sequence {
    width: min(68vw, 300px) !important;
    align-self: center !important;
    justify-self: center !important;
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
document.head.appendChild(introJarMotionStyle);

const introJarState = {
  y: 0,
  scale: 1.06,
  targetY: 0,
  targetScale: 1.06
};

function clampIntroJar(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothIntroJar(value) {
  return value * value * (3 - 2 * value);
}

function getIntroScrollProgress() {
  const hint = document.querySelector('.scroll-hint');
  if (!hint) return null;

  const text = hint.textContent || '';
  if (!text.includes('INTRO')) return null;

  const match = text.match(/(\d+)%/);
  if (!match) return 0;

  return clampIntroJar(Number(match[1]) / 100, 0, 1);
}

function updateIntroJarMotion() {
  const intro = document.querySelector('.is-intro-section.is-active .intro-sequence');
  const progress = getIntroScrollProgress();

  if (intro && progress !== null) {
    const growProgress = smoothIntroJar(clampIntroJar(progress / 0.62, 0, 1));
    const endProgress = smoothIntroJar(clampIntroJar((progress - 0.72) / 0.28, 0, 1));

    const baseScale = 1.06;
    const maxExtraScale = 0.13;
    const endShrink = 0.17;

    introJarState.targetScale = baseScale + growProgress * maxExtraScale - endProgress * endShrink;
    introJarState.targetY = endProgress * window.innerHeight * 0.075;

    introJarState.scale += (introJarState.targetScale - introJarState.scale) * 0.13;
    introJarState.y += (introJarState.targetY - introJarState.y) * 0.13;

    intro.style.setProperty('transform', `translate3d(0, ${introJarState.y}px, 0) scale(${introJarState.scale})`, 'important');
  }

  requestAnimationFrame(updateIntroJarMotion);
}

requestAnimationFrame(updateIntroJarMotion);
