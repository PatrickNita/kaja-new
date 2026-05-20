const introPerspectiveStyle = document.createElement('style');
introPerspectiveStyle.textContent = `
.is-intro-section {
  perspective: 1200px !important;
  transform-style: preserve-3d !important;
}

.is-intro-section .segment-content,
.is-intro-section .intro-jar-clean,
.is-intro-section .huge-accent,
.is-intro-section .counter {
  transform-style: preserve-3d !important;
  will-change: transform !important;
}
`;
document.head.appendChild(introPerspectiveStyle);

const introPerspective = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0
};

function clampIntroPerspective(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isIntroActive() {
  return (document.querySelector('.scroll-hint span')?.textContent || '').includes('INTRO');
}

function setIntroPointer(clientX, clientY) {
  const nx = (clientX / window.innerWidth - 0.5) * 2;
  const ny = (clientY / window.innerHeight - 0.5) * 2;
  introPerspective.targetX = clampIntroPerspective(nx, -1, 1);
  introPerspective.targetY = clampIntroPerspective(ny, -1, 1);
}

window.addEventListener('mousemove', (event) => {
  setIntroPointer(event.clientX, event.clientY);
}, { passive: true });

window.addEventListener('touchmove', (event) => {
  const touch = event.touches?.[0];
  if (touch) setIntroPointer(touch.clientX, touch.clientY);
}, { passive: true });

function applyIntroPerspective() {
  const active = isIntroActive();
  const content = document.querySelector('.is-intro-section .segment-content');
  const jar = document.querySelector('.is-intro-section .intro-jar-clean');
  const accent = document.querySelector('.is-intro-section .huge-accent');
  const counter = document.querySelector('.is-intro-section .counter');

  const targetX = active ? introPerspective.targetX : 0;
  const targetY = active ? introPerspective.targetY : 0;

  introPerspective.x += (targetX - introPerspective.x) * 0.08;
  introPerspective.y += (targetY - introPerspective.y) * 0.08;

  const x = introPerspective.x;
  const y = introPerspective.y;

  if (content) {
    content.style.setProperty(
      'transform',
      `translate3d(${x * -12}px, ${y * -8}px, 42px) rotateX(${y * -2.2}deg) rotateY(${x * 3.2}deg)`,
      'important'
    );
  }

  if (jar) {
    jar.style.setProperty(
      'transform',
      `translate3d(${x * 18}px, ${y * 12}px, 72px) rotateX(${y * 3.4}deg) rotateY(${x * -5.2}deg)`,
      'important'
    );
  }

  if (accent) {
    accent.style.setProperty(
      'transform',
      `translate3d(${x * -8}px, ${y * -6}px, -28px)`,
      'important'
    );
  }

  if (counter) {
    counter.style.setProperty(
      'transform',
      `translate3d(${x * 10}px, ${y * 8}px, 34px)`,
      'important'
    );
  }

  requestAnimationFrame(applyIntroPerspective);
}

requestAnimationFrame(applyIntroPerspective);
