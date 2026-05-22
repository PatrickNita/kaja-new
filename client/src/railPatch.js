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
.kaja-contact-form,
.intro-frame-animation {
  display: none;
}
.segment.is-active .visual-panel {
  visibility: hidden !important;
  pointer-events: none !important;
}
.segment.is-active .intro-frame-animation {
  position: relative;
  z-index: 4;
  justify-self: center;
  align-self: center;
  display: block;
  width: min(34vw, 430px);
  aspect-ratio: 9 / 16;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: clamp(22px, 3vw, 34px);
  overflow: hidden;
  background: linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.035));
  box-shadow: 0 58px 135px rgba(0,0,0,0.68), inset 0 0 70px rgba(255,255,255,0.035);
  transform-origin: center center;
  will-change: transform;
}
.intro-frame-animation img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  transform: scale(1.01);
  user-select: none;
  pointer-events: none;
}
.intro-frame-animation::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), transparent 18%, rgba(0,0,0,0.22));
  pointer-events: none;
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
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: clamp(24px, 3.2vw, 38px);
  background: rgba(38, 38, 38, 0.86);
  box-shadow: 0 28px 72px rgba(0,0,0,0.55);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  transform-origin: center center;
  will-change: transform, min-height, padding;
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
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px;
  background: #1a1a1a;
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
  border-color: rgba(255,255,255,0.28);
  background-color: #141414;
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
  .segment.is-active .intro-frame-animation {
    width: min(58vw, 250px);
    border-radius: 22px;
  }
  .is-hanger-section.is-active .hanger-track {
    visibility: hidden !important;
  }
  .is-hanger-section.is-active:not(:has(.mobile-merch-track)) .hanger-track {
    visibility: visible !important;
  }
  .is-hanger-section.is-active .mobile-merch-track {
    position: absolute;
    left: 0;
    top: 50px;
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
    grid-column: 1;
    width: 100%;
    max-width: min(420px, calc(100% - 8px));
    min-height: 200px;
    padding: 12px 14px;
    align-self: start;
    justify-self: center;
    margin-inline: auto;
    margin-top: clamp(8px, 2vh, 14px);
    transform-origin: top center;
    box-sizing: border-box;
  }
  .kaja-contact-label {
    margin-bottom: 6px;
    font-size: 9px;
    letter-spacing: 0.14em;
  }
  .kaja-contact-form input,
  .kaja-contact-form select {
    padding: 9px 11px;
    margin-top: 7px;
    font-size: 11px;
    border-radius: 11px;
  }
  .kaja-contact-form select {
    background-position: calc(100% - 16px) 52%, calc(100% - 11px) 52%;
    padding-right: 32px;
  }
  .kaja-contact-form button {
    padding: 10px 12px;
    margin-top: 8px;
    font-size: 9px;
  }
}
`;
document.head.appendChild(patchStyle);

const buttonTargets = [];

function addSectionButtons() {
  const sections = Array.from(document.querySelectorAll('.segment'));

  buttonTargets.forEach((target) => {
    const section = sections.find((item) => item.querySelector('h1')?.textContent?.trim() === target.title);
    const content = section?.querySelector('.segment-content');
    if (!content) return;

    const existing = content.querySelector(`[data-section-button="${target.label}"]`);
    if (existing) {
      if (existing.getAttribute('href') !== target.href) {
        existing.setAttribute('href', target.href);
      }
      return;
    }

    const link = document.createElement('a');
    link.className = 'section-link-button';
    link.href = target.href;
    link.dataset.sectionButton = target.label;
    link.textContent = target.label;
    content.appendChild(link);
  });
}

function readContactCopy() {
  return window.__kajaLocale?.copy?.contact ?? {
    heading: 'Contact KAJA',
    name: 'Name',
    email: 'Email',
    phone: 'Phone number',
    topic: 'Topic',
    submit: 'Send request',
    topics: [
      { value: 'general-contact', label: 'General contact' },
      { value: 'collaboration', label: 'Collaboration' },
      { value: 'distribution', label: 'Distribution' }
    ]
  };
}

function readHintProgress() {
  const activeSection = document.querySelector('.segment.is-active');
  const frozenValue = activeSection?.dataset.frozenProgress;
  if (frozenValue != null && frozenValue !== '') {
    const parsed = Number.parseFloat(frozenValue);
    if (!Number.isNaN(parsed)) return Math.min(Math.max(parsed, 0), 1);
  }

  const sectionValue = activeSection?.dataset.sectionProgress;
  if (sectionValue != null && sectionValue !== '') {
    const parsed = Number.parseFloat(sectionValue);
    if (!Number.isNaN(parsed)) return Math.min(Math.max(parsed, 0), 1);
  }

  const hint = document.querySelector('.scroll-hint');
  const datasetValue = hint?.dataset.progress;
  if (datasetValue != null && datasetValue !== '') {
    const parsed = Number.parseFloat(datasetValue);
    if (!Number.isNaN(parsed)) return Math.min(Math.max(parsed, 0), 1);
  }

  if (hint?.dataset.sectionProgress === '1') return 1;
  if (document.body.classList.contains('kaja-footer-active')) return 1;
  if (hint?.dataset.hintMode === 'footer') return 1;

  const spans = Array.from(document.querySelectorAll('.scroll-hint span'));
  const last = spans[spans.length - 1]?.textContent || '0%';
  const percent = Number.parseFloat(last.replace('%', '')) || 0;
  return Math.min(Math.max(percent / 100, 0), 1);
}

function getMerchSection() {
  return document.querySelector('.is-hanger-section')
    || getSectionByTitle('MERCH')
    || getSectionByTitle('A full collection on the line.');
}

function getContactSection() {
  return document.querySelector('.is-contact-section')
    || getSectionByTitle('Start the conversation.');
}

function getProgressForShape(shape) {
  const hint = document.querySelector('.scroll-hint');
  if (hint?.dataset.sectionProgress === '1' && shape === 'contact') return 1;
  if (shape === 'contact' && document.body.classList.contains('kaja-footer-active')) return 1;

  if (shape === 'hanger') {
    const merchSection = getMerchSection();
    if (merchSection?.classList.contains('is-active')) {
      return readHintProgress();
    }
  }

  if (shape === 'contact') {
    const contactSection = getContactSection();
    if (contactSection?.classList.contains('is-active')) {
      return readHintProgress();
    }
  }

  if (shape === 'intro') {
    const introSection = document.querySelector('.is-intro-section');
    if (introSection?.classList.contains('is-active')) {
      return readHintProgress();
    }
  }

  if (hint?.dataset.hintMode === 'footer') return shape === 'contact' ? 1 : null;
  if (hint?.dataset.sectionShape !== shape) return null;

  return readHintProgress();
}

function getSectionByTitle(title) {
  const wanted = title.trim().toLowerCase();
  return Array.from(document.querySelectorAll('.segment')).find(
    (item) => item.querySelector('h1')?.textContent?.trim().toLowerCase() === wanted
  );
}

function ensureIntroFrameAnimation() {
  const introSection = getSectionByTitle('A sharper way to present KAJA.');
  const oldVisual = introSection?.querySelector('.visual-panel');
  if (!introSection || !oldVisual) return null;

  let frame = introSection.querySelector(':scope > .intro-frame-animation');
  if (frame) return frame;

  frame = document.createElement('div');
  frame.className = 'intro-frame-animation';

  const image = document.createElement('img');
  image.alt = 'KAJA product animation frame';
  image.decoding = 'async';
  image.loading = 'eager';
  image.src = '/intro-frames/frame-01.webp';

  frame.appendChild(image);
  introSection.insertBefore(frame, oldVisual.nextSibling);

  return frame;
}

let introFramesPreloaded = false;
function preloadIntroFrames() {
  if (introFramesPreloaded) return;
  introFramesPreloaded = true;
  for (let index = 1; index <= 20; index += 1) {
    const preload = new Image();
    preload.src = `/intro-frames/frame-${String(index).padStart(2, '0')}.webp`;
  }
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
  merchTrackLayoutCache.clear();
  return mobileTrack;
}

function ensureContactForm() {
  const contactSection = getContactSection();
  const oldForm = contactSection?.querySelector('.contact-form-panel');
  if (!contactSection) return null;

  let form = contactSection.querySelector(':scope > .kaja-contact-form');
  if (form) return form;

  form = document.createElement('form');
  form.className = 'kaja-contact-form';
  const contact = readContactCopy();
  const topicOptions = contact.topics.map((item) => `<option value="${item.value}">${item.label}</option>`).join('');
  form.innerHTML = `
    <p class="kaja-contact-label">${contact.heading}</p>
    <input placeholder="${contact.name}" aria-label="${contact.name}" name="name" />
    <input placeholder="${contact.email}" aria-label="${contact.email}" name="email" type="email" />
    <input placeholder="${contact.phone}" aria-label="${contact.phone}" name="phone" type="tel" />
    <select aria-label="${contact.topic}" name="topic" required>
      <option value="" disabled selected>${contact.topic}</option>
      ${topicOptions}
    </select>
    <button type="submit">${contact.submit}</button>
  `;
  form.addEventListener('submit', (event) => event.preventDefault());

  if (oldForm) {
    contactSection.insertBefore(form, oldForm.nextSibling);
  } else {
    contactSection.appendChild(form);
  }

  return form;
}

const contactMotion = { scale: 1, height: 0, targetScale: 1, targetHeight: 0 };
const introMotion = { scale: 0.96, targetScale: 0.96 };
let patchLoopActive = false;
let contactSectionWasActive = false;
let lastSyncedMerchProgress = -1;
const merchTrackLayoutCache = new Map();

function readMerchSectionProgress(merchSection) {
  const section = merchSection?.classList.contains('is-active')
    ? merchSection
    : (document.querySelector('.segment.is-active.is-hanger-section') || merchSection);
  if (!section) return 0;

  const frozen = section.dataset.frozenProgress;
  if (frozen != null && frozen !== '') {
    const parsed = Number.parseFloat(frozen);
    if (!Number.isNaN(parsed)) return Math.min(Math.max(parsed, 0), 1);
  }

  const value = section.dataset.sectionProgress;
  if (value != null && value !== '') {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) return Math.min(Math.max(parsed, 0), 1);
  }

  return readHintProgress();
}

function shouldSyncMerchSection(merchSection) {
  if (!merchSection?.classList.contains('is-hanger-section')) return false;
  return merchSection.classList.contains('is-active') || merchSection.dataset.frozenProgress != null;
}

const MERCH_LAYOUT_CACHE_VERSION = 4;

function getMerchTrackLayoutKey(railWrap, useMobileTrack) {
  if (!railWrap) return '';
  return `${MERCH_LAYOUT_CACHE_VERSION}:${useMobileTrack ? 'mobile' : 'desktop'}:${Math.round(railWrap.getBoundingClientRect().width)}`;
}

function isValidMerchTrackLayout(layout) {
  return layout && Number.isFinite(layout.startX) && Number.isFinite(layout.endX)
    && Math.abs(layout.endX - layout.startX) >= 8;
}

function measureMerchTrackRange(merchSection, useMobileTrack = false) {
  const railWrap = merchSection?.querySelector('.hanger-rail-wrap');
  const track = useMobileTrack
    ? (merchSection?.querySelector('.mobile-merch-track') || ensureMobileMerchTrack())
    : merchSection?.querySelector('.hanger-track');
  const itemSelector = useMobileTrack ? '.mobile-merch-item' : '.hanger-object';
  const cacheKey = getMerchTrackLayoutKey(railWrap, useMobileTrack);
  if (!cacheKey || !railWrap || !track) return null;

  const cached = merchTrackLayoutCache.get(cacheKey);
  if (isValidMerchTrackLayout(cached)) return cached;

  const items = Array.from(track.querySelectorAll(itemSelector));
  if (items.length < 6) return null;

  const saved = track.style.transform;
  track.style.transform = 'translate3d(0, 0, 0)';
  void railWrap.offsetWidth;

  const wrapWidth = railWrap.getBoundingClientRect().width;
  if (wrapWidth < 100) {
    track.style.transform = saved;
    return null;
  }

  const trackOrigin = track.getBoundingClientRect().left;
  const offsets = items.map((item) => {
    const rect = item.getBoundingClientRect();
    return {
      left: rect.left - trackOrigin,
      right: rect.right - trackOrigin
    };
  });

  track.style.transform = saved;

  const inset = Math.min(18, wrapWidth * 0.04);
  const viewLeft = inset;
  const viewRight = wrapWidth - inset;
  const step = (offsets[1]?.left ?? offsets[0].right) - offsets[0].left || (offsets[0].right - offsets[0].left);

  // 0%: first three hangers in view (third hanger aligns to the right edge).
  let startX = viewRight - offsets[2].right;
  if (offsets[0].left + startX < viewLeft) {
    startX = viewLeft - offsets[0].left;
  }

  // 100%: pan until the last three hangers are fully in view (full size, no scaling).
  let endX = viewRight - offsets[5].right;

  if (endX >= startX - 1) {
    endX = startX - step * 3;
  }

  const layout = { startX, endX, step };
  if (!isValidMerchTrackLayout(layout)) {
    merchTrackLayoutCache.delete(cacheKey);
    return null;
  }

  merchTrackLayoutCache.set(cacheKey, layout);
  return layout;
}

function formatMerchTrackTransform(offset) {
  return {
    transform: `translate3d(${offset.value}${offset.unit}, 0, 0)`,
    origin: ''
  };
}

function getMerchTrackOffset(merchSection, useMobileTrack = false, progress = readMerchSectionProgress(merchSection)) {
  const layout = measureMerchTrackRange(merchSection, useMobileTrack);
  if (!layout) {
    const startVw = 14;
    const panVw = 50;
    return { value: startVw - progress * panVw, unit: 'vw' };
  }

  const eased = progress * progress * (3 - 2 * progress);
  const panX = layout.startX + (layout.endX - layout.startX) * eased;
  return { value: panX, unit: 'px' };
}

function applyMerchTrackTransform(track, merchSection, useMobileTrack, progress = readMerchSectionProgress(merchSection)) {
  if (!track) return;
  const offset = getMerchTrackOffset(merchSection, useMobileTrack, progress);
  const { transform, origin } = formatMerchTrackTransform(offset);
  track.style.transformOrigin = origin;
  track.style.transform = transform;
}

function syncMerchHangerTracks(merchSection = getMerchSection(), progressOverride) {
  if (!merchSection) return null;

  const progress = progressOverride != null
    ? Math.min(Math.max(Number(progressOverride) || 0, 0), 1)
    : readMerchSectionProgress(merchSection);
  const desktopOffset = getMerchTrackOffset(merchSection, false, progress);
  const desktopFormatted = formatMerchTrackTransform(desktopOffset);
  merchSection.style.setProperty('--merch-track-x', `${desktopOffset.value}${desktopOffset.unit}`);

  const desktopTrack = merchSection.querySelector('.hanger-track');
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const mobileTrack = isMobile
    ? (merchSection.querySelector('.mobile-merch-track') || ensureMobileMerchTrack())
    : null;
  const mobileOffset = mobileTrack ? getMerchTrackOffset(merchSection, true, progress) : null;
  const mobileFormatted = mobileOffset
    ? formatMerchTrackTransform(mobileOffset)
    : desktopFormatted;

  if (desktopTrack) {
    desktopTrack.style.transformOrigin = desktopFormatted.origin || '';
    desktopTrack.style.transform = desktopFormatted.transform;
  }
  if (mobileTrack) {
    mobileTrack.style.transformOrigin = mobileFormatted.origin || '';
    mobileTrack.style.transform = mobileFormatted.transform;
  }

  lastSyncedMerchProgress = progress;
  return mobileTrack || desktopTrack;
}

function patchNeedsAnimation() {
  let needs = false;

  const introSection = getSectionByTitle('A sharper way to present KAJA.');
  const introProgress = getProgressForShape('intro');
  if (introSection?.classList.contains('is-active') && introProgress !== null) {
    if (!introSection.querySelector(':scope > .intro-frame-animation') && !ensureIntroFrameAnimation()) {
      needs = true;
    } else {
      const pulse = Math.sin(introProgress * Math.PI);
      const targetScale = 0.96 + pulse * 0.105 - introProgress * 0.018;
      if (Math.abs(introMotion.scale - targetScale) > 0.002) needs = true;
    }
  }

  const merchSection = getMerchSection();
  if (merchSection && shouldSyncMerchSection(merchSection)) {
    if (!merchSection.querySelector('.hanger-track')) needs = true;
    else needs = true;
  }

  const contactSection = getContactSection();
  const contactProgress = getProgressForShape('contact');
  if (contactSection?.classList.contains('is-active') && contactProgress !== null) {
    const form = contactSection.querySelector(':scope > .kaja-contact-form') || ensureContactForm();
    if (!form) {
      needs = true;
    } else {
      const targetScale = 1 + contactProgress * 0.035;
      const targetHeight = contactProgress * 16;
      if (Math.abs(contactMotion.scale - targetScale) > 0.002 || Math.abs(contactMotion.height - targetHeight) > 0.2) needs = true;
    }
  }

  return needs;
}

function runPatchAnimations() {
  const introSection = getSectionByTitle('A sharper way to present KAJA.');
  const frame = ensureIntroFrameAnimation();
  const introProgress = getProgressForShape('intro');

  if (introSection?.classList.contains('is-active') && frame && introProgress !== null) {
    preloadIntroFrames();
    const image = frame.querySelector('img');
    const frameIndex = Math.min(20, Math.max(1, Math.floor(introProgress * 19) + 1));
    const nextSrc = `/intro-frames/frame-${String(frameIndex).padStart(2, '0')}.webp`;
    if (image && !image.src.endsWith(nextSrc)) image.src = nextSrc;

    const pulse = Math.sin(introProgress * Math.PI);
    introMotion.targetScale = 0.96 + pulse * 0.105 - introProgress * 0.018;
    introMotion.scale += (introMotion.targetScale - introMotion.scale) * 0.12;
    frame.style.transform = `translate3d(0, 0, 0) scale(${introMotion.scale})`;
  }

  const merchSection = getMerchSection();
  if (merchSection && shouldSyncMerchSection(merchSection)) {
    syncMerchHangerTracks(merchSection);
  }

  const contactSection = getContactSection();
  const form = ensureContactForm();
  const contactProgress = getProgressForShape('contact');
  const isContactActive = contactSection?.classList.contains('is-active');

  if (isContactActive && form && contactProgress !== null) {
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    contactMotion.targetScale = 1 + contactProgress * (isMobile ? 0.018 : 0.035);
    contactMotion.targetHeight = contactProgress * (isMobile ? 6 : 16);

    if (!contactSectionWasActive) {
      contactMotion.scale = contactMotion.targetScale;
      contactMotion.height = contactMotion.targetHeight;
    } else {
      contactMotion.scale += (contactMotion.targetScale - contactMotion.scale) * 0.12;
      contactMotion.height += (contactMotion.targetHeight - contactMotion.height) * 0.12;
    }

    form.style.transform = `scale(${contactMotion.scale})`;
    if (isMobile) {
      form.style.minHeight = `${200 + contactMotion.height}px`;
      form.style.paddingTop = `${12 + contactMotion.height * 0.08}px`;
      form.style.paddingBottom = `${12 + contactMotion.height * 0.08}px`;
      form.style.marginTop = `${Math.max(8, 6 + contactMotion.height * 0.6)}px`;
      form.style.transformOrigin = 'top center';
    } else {
      form.style.minHeight = `${350 + contactMotion.height}px`;
      form.style.paddingTop = `calc(clamp(34px, 4.1vw, 58px) + ${contactMotion.height * 0.22}px)`;
      form.style.paddingBottom = `calc(clamp(34px, 4.1vw, 58px) + ${contactMotion.height * 0.22}px)`;
    }
  }

  contactSectionWasActive = Boolean(isContactActive && form && contactProgress !== null);
}

function schedulePatchLoop() {
  if (patchLoopActive) return;
  patchLoopActive = true;
  requestAnimationFrame(function patchLoop() {
    runPatchAnimations();
    if (patchNeedsAnimation()) {
      requestAnimationFrame(patchLoop);
    } else {
      patchLoopActive = false;
    }
  });
}

function setupPatchEnhancements() {
  addSectionButtons();
  ensureIntroFrameAnimation();
  ensureContactForm();
  if (window.matchMedia('(max-width: 900px)').matches) {
    ensureMobileMerchTrack();
  }
  const merchSection = getMerchSection();
  if (merchSection && shouldSyncMerchSection(merchSection)) {
    syncMerchHangerTracks(merchSection);
  }
  schedulePatchLoop();
}

let patchObserverTimer = null;
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type !== 'attributes') continue;
    const target = mutation.target;
    if (!target?.classList?.contains?.('is-hanger-section')) continue;
    if (
      mutation.attributeName === 'class'
      || mutation.attributeName === 'data-section-progress'
      || mutation.attributeName === 'data-frozen-progress'
    ) {
      if (mutation.attributeName === 'class' && target.classList.contains('is-active')) {
        merchTrackLayoutCache.clear();
      }
      if (shouldSyncMerchSection(target) || (mutation.attributeName === 'class' && target.classList.contains('is-active'))) {
        syncMerchHangerTracks(target);
        schedulePatchLoop();
        return;
      }
    }
  }

  if (patchObserverTimer !== null) window.clearTimeout(patchObserverTimer);
  patchObserverTimer = window.setTimeout(() => {
    patchObserverTimer = null;
    setupPatchEnhancements();
  }, 60);
});
observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-section-progress', 'data-frozen-progress'] });
window.addEventListener('load', setupPatchEnhancements);
window.addEventListener('resize', () => {
  merchTrackLayoutCache.clear();
  const merchSection = getMerchSection();
  if (merchSection && shouldSyncMerchSection(merchSection)) {
    syncMerchHangerTracks(merchSection);
  }
  schedulePatchLoop();
});
window.__kajaSyncMerchHangers = (progressOverride) => {
  const merchSection = getMerchSection();
  if (!merchSection || !shouldSyncMerchSection(merchSection)) return null;
  syncMerchHangerTracks(merchSection, progressOverride);
  schedulePatchLoop();
  return merchSection;
};

setupPatchEnhancements();
setTimeout(setupPatchEnhancements, 500);
