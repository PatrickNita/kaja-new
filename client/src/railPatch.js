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
.kaja-contact-form {
  display: none;
}
.is-contact-section .contact-form-panel,
.is-contact-section .contact-form-fixed-overlay {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
.is-contact-section.is-active .kaja-contact-form {
  position: relative;
  z-index: 8;
  justify-self: center;
  align-self: center;
  display: flex;
  flex-direction: column;
  width: min(54vw, 700px);
  min-height: 350px;
  padding: clamp(34px, 4.1vw, 58px);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: clamp(24px, 3.2vw, 38px);
  background: linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04));
  box-shadow: 0 52px 120px rgba(0,0,0,0.64), inset 0 0 70px rgba(255,255,255,0.035);
  backdrop-filter: blur(18px);
  transform-origin: center center;
  will-change: transform, min-height, padding, background;
}
.kaja-contact-label {
  margin: 0 0 18px;
  color: rgba(255,255,255,0.58);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 13px;
}
.kaja-contact-form input,
.kaja-contact-form select {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px;
  background: rgba(0,0,0,0.42);
  color: #fff;
  padding: 17px 19px;
  font-size: 15px;
  outline: none;
  margin-top: 15px;
  font-family: inherit;
  transition: border-color 0.25s ease, background 0.25s ease;
}
.kaja-contact-form select {
  appearance: none;
  -webkit-appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.72) 50%), linear-gradient(135deg, rgba(255,255,255,0.72) 50%, transparent 50%);
  background-position: calc(100% - 23px) 52%, calc(100% - 16px) 52%;
  background-size: 7px 7px, 7px 7px;
  background-repeat: no-repeat;
  padding-right: 46px;
}
.kaja-contact-form select option {
  color: #fff;
  background: #111;
}
.kaja-contact-form input:focus,
.kaja-contact-form select:focus {
  border-color: rgba(255,255,255,0.36);
  background-color: rgba(0,0,0,0.56);
}
.kaja-contact-form button {
  width: 100%;
  margin-top: 18px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #000;
  padding: 17px 20px;
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
  .is-contact-section.is-active .kaja-contact-form {
    width: min(92vw, 430px);
    min-height: 250px;
    padding: 18px;
  }
  .kaja-contact-label {
    margin-bottom: 8px;
    font-size: 10px;
  }
  .kaja-contact-form input,
  .kaja-contact-form select {
    padding: 10px 12px;
    margin-top: 8px;
    font-size: 12px;
    border-radius: 12px;
  }
  .kaja-contact-form select {
    background-position: calc(100% - 18px) 52%, calc(100% - 12px) 52%;
    padding-right: 36px;
  }
  .kaja-contact-form button {
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

function ensureContactForm() {
  const contactSection = getSectionByTitle('Start the conversation.');
  const oldForm = contactSection?.querySelector('.contact-form-panel');
  if (!contactSection) return null;

  let form = contactSection.querySelector(':scope > .kaja-contact-form');
  if (form) return form;

  form = document.createElement('form');
  form.className = 'kaja-contact-form';
  form.innerHTML = `
    <p class="kaja-contact-label">Contact KAJA</p>
    <input placeholder="Name" aria-label="Name" name="name" />
    <input placeholder="Email" aria-label="Email" name="email" type="email" />
    <input placeholder="Phone number" aria-label="Phone number" name="phone" type="tel" />
    <select aria-label="Topic" name="topic" required>
      <option value="" disabled selected>Topic</option>
      <option value="general-contact">General contact</option>
      <option value="collaboration">Collaboration</option>
      <option value="distribution">Distribution</option>
    </select>
    <button type="submit">Send request</button>
  `;
  form.addEventListener('submit', (event) => event.preventDefault());

  if (oldForm) {
    contactSection.insertBefore(form, oldForm.nextSibling);
  } else {
    contactSection.appendChild(form);
  }

  return form;
}

const merchMotion = { current: 0, target: 0 };
const contactMotion = { scale: 1, height: 0, darkness: 0, targetScale: 1, targetHeight: 0, targetDarkness: 0 };

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
    const endX = window.innerWidth * 0.38 - step * 5.45;
    const easedProgress = Math.pow(progress, 1.38);
    merchMotion.target = startX + (endX - startX) * easedProgress;
    merchMotion.current += (merchMotion.target - merchMotion.current) * 0.13;
    mobileTrack.style.transform = `translate3d(${merchMotion.current}px, 0, 0)`;
  }

  requestAnimationFrame(moveMobileMerchTrack);
}

function growContactForm() {
  const contactSection = getSectionByTitle('Start the conversation.');
  const form = ensureContactForm();
  const progress = getProgressForLabel('CONTACT');

  if (contactSection?.classList.contains('is-active') && form && progress !== null) {
    contactMotion.targetScale = 1 + progress * 0.035;
    contactMotion.targetHeight = progress * 16;
    contactMotion.targetDarkness = progress;

    contactMotion.scale += (contactMotion.targetScale - contactMotion.scale) * 0.12;
    contactMotion.height += (contactMotion.targetHeight - contactMotion.height) * 0.12;
    contactMotion.darkness += (contactMotion.targetDarkness - contactMotion.darkness) * 0.12;

    const topAlpha = 0.14 - contactMotion.darkness * 0.035;
    const bottomAlpha = 0.04 - contactMotion.darkness * 0.025;
    const blackAlpha = 0.42 + contactMotion.darkness * 0.16;

    form.style.transform = `scale(${contactMotion.scale})`;
    form.style.minHeight = `${350 + contactMotion.height}px`;
    form.style.paddingTop = `calc(clamp(34px, 4.1vw, 58px) + ${contactMotion.height * 0.22}px)`;
    form.style.paddingBottom = `calc(clamp(34px, 4.1vw, 58px) + ${contactMotion.height * 0.22}px)`;
    form.style.background = `linear-gradient(145deg, rgba(255,255,255,${topAlpha}), rgba(255,255,255,${bottomAlpha})), rgba(0,0,0,${blackAlpha})`;
  }

  requestAnimationFrame(growContactForm);
}

const observer = new MutationObserver(() => {
  addSectionButtons();
  ensureContactForm();
});
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', () => {
  addSectionButtons();
  ensureContactForm();
});
requestAnimationFrame(addSectionButtons);
requestAnimationFrame(moveMobileMerchTrack);
requestAnimationFrame(growContactForm);
setTimeout(addSectionButtons, 500);
setTimeout(ensureContactForm, 500);
