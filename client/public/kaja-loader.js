const loaderStyle = document.createElement('style');
loaderStyle.textContent = `
#kaja-loader {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050505;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.42s ease, visibility 0.42s ease;
}

#kaja-loader.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

#kaja-loader img {
  width: clamp(110px, 16vw, 230px);
  height: auto;
  display: block;
  animation: kajaLoaderPulse 1s ease-in-out infinite;
  filter: drop-shadow(0 0 34px rgba(255,255,255,0.18));
}

@keyframes kajaLoaderPulse {
  0%, 100% {
    transform: scale(0.96);
    opacity: 0.62;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}
`;
document.head.appendChild(loaderStyle);

const loader = document.createElement('div');
loader.id = 'kaja-loader';
loader.setAttribute('aria-label', 'Loading KAJA');
loader.innerHTML = `<img src="/src/assets/kaja-logo.png" alt="KAJA" />`;
document.addEventListener('DOMContentLoaded', () => {
  document.body.prepend(loader);
  window.setTimeout(() => {
    loader.classList.add('is-hidden');
    window.setTimeout(() => loader.remove(), 520);
  }, 1000);
});
