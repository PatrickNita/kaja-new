import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './siteProtection.js';
import EntryGate from './EntryGate.jsx';
import ElasticCursor from './ElasticCursor.jsx';
import { isEntryApproved } from './entryGate.js';
import {
  buildSections,
  CONTACT_INDEX,
  ENGLISH_ALIASES,
  getLocaleCopy,
  getLocaleFromPath,
  getLocalePath,
  getLocaleSwitchPath,
  publishLocale,
  SECTION_COUNT
} from './i18n';
import './railPatch.js';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';
import './styles.css';
import logo from './assets/kaja-logo.png';
import hanger from './assets/hanger.png';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ro', label: 'RO' },
  { code: 'ru', label: 'RU' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' }
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (p, from, to) => from + (to - from) * clamp(p, 0, 1);

function getSectionScrollDuration(fromIndex, toIndex, behavior, sectionScrollMs) {
  if (behavior !== 'smooth') return 100;
  const distance = Math.max(1, Math.abs(toIndex - fromIndex));
  return Math.min(2200, sectionScrollMs * distance + 80);
}

function waitForScrollSettle(targetTop, maxWaitMs, onDone) {
  const start = performance.now();
  let stableFrames = 0;
  let lastY = window.scrollY;
  let rafId = null;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
    onDone();
  };

  const cancel = () => {
    if (done) return;
    done = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
  };

  const tick = () => {
    const y = window.scrollY;
    const elapsed = performance.now() - start;
    const atTarget = Math.abs(y - targetTop) <= 12;

    if (Math.abs(y - lastY) < 0.75) stableFrames += 1;
    else stableFrames = 0;
    lastY = y;

    if ((atTarget && stableFrames >= 4) || elapsed >= maxWaitMs) {
      finish();
      return;
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
  return cancel;
}

function segmentMotionValues(p, isMobile) {
  const progress = clamp(p, 0, 1);
  const productScale = progress <= 0.55
    ? lerp(progress / 0.55, 0.92, 1.06)
    : lerp((progress - 0.55) / 0.45, 1.06, 0.94);

  return {
    introBgScale: 1 + progress * 0.075,
    introOverlayOpacity: 0.08 + progress * 0.22,
    progressScale: progress,
    titleY: isMobile ? 2 + progress * -7 : 6 + progress * -24,
    copyY: isMobile ? 1 + progress * -4 : 3 + progress * -13,
    counterScale: isMobile ? 0.96 + progress * 0.1 : 0.9 + progress * 0.28,
    counterY: isMobile ? `calc(0.5vh + ${progress * -2}vh)` : `calc(2vh + ${progress * -7}vh)`,
    gridOpacity: 0.32 + progress * 0.68,
    gridY: isMobile ? `calc(0.6vh + ${progress * -1.2}vh)` : `calc(2vh + ${progress * -4}vh)`,
    hangerX: `${30 - progress * 98}vw`,
    productY: `${8 - progress * 18}vh`,
    productScale,
    productOpacity: progress <= 0.82 ? 1 : lerp((progress - 0.82) / 0.18, 1, 0.8),
    contactX: `${-2.5 + progress * 5}vw`
  };
}
const SPRING_CONFIG = { stiffness: 58, damping: 12, mass: 0.45 };
const SCROLL_SPRING = { stiffness: 132, damping: 28, mass: 0.72, restDelta: 0.001, restSpeed: 0.01 };
const SECTION_COMPLETE = 1;
const SECTION_START = 0;
const EDGE_EPSILON = 0.001;
const VISUAL_EDGE_EPSILON = 0.012;
const SCROLL_SPEED = 4;
const MAX_TARGET_LEAD = 0.055 * SCROLL_SPEED;
const WHEEL_STEP_MIN = 0.006 * SCROLL_SPEED;
const WHEEL_STEP_MAX = 0.036 * SCROLL_SPEED;
const GESTURE_IDLE_MS = 160;
const FRAME_PROGRESS_MAX = 0.038 * SCROLL_SPEED;
const WHEEL_PROGRESS_DIVISOR = 1700 / SCROLL_SPEED;
const TOUCH_PROGRESS_DIVISOR = 900 / SCROLL_SPEED;
const MOBILE_TOUCH_PROGRESS_DIVISOR = 480 / SCROLL_SPEED;
const MOBILE_TOUCH_STEP_MAX = 0.058 * SCROLL_SPEED;
const MOBILE_MAX_TARGET_LEAD = 0.09 * SCROLL_SPEED;

const hangerObjects = Array.from({ length: 6 }, (_, index) => index + 1);
const hangerRailWrapStyle = {
  WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 10%, black 100%)',
  maskImage: 'linear-gradient(90deg, transparent 0%, black 10%, black 100%)'
};
const hangerObjectStyle = {
  transform: 'translateY(-28px)'
};
const hangerImageStyle = {
  width: 'clamp(170px, 20vw, 320px)',
  height: 'auto',
  display: 'block',
  filter: 'brightness(0) saturate(100%) invert(34%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(82%) contrast(86%)',
  opacity: 0.95,
  mixBlendMode: 'screen'
};

const contactFormStyle = {
  position: 'relative',
  zIndex: 4,
  justifySelf: 'center',
  width: 'min(46vw, 560px)',
  padding: 'clamp(20px, 3vw, 38px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 'clamp(22px, 3vw, 34px)',
  background: 'rgba(38, 38, 38, 0.86)',
  boxShadow: '0 28px 72px rgba(0,0,0,0.55)'
};

const contactFieldStyle = {
  width: '100%',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '16px',
  background: '#1a1a1a',
  color: '#fff',
  padding: '14px 16px',
  fontSize: '14px',
  outline: 'none',
  marginTop: '12px',
  fontFamily: 'inherit'
};

const contactButtonStyle = {
  width: '100%',
  marginTop: '14px',
  border: 0,
  borderRadius: '999px',
  background: '#fff',
  color: '#000',
  padding: '14px 18px',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontFamily: 'inherit'
};

const contactSocialLinks = [
  { label: 'Instagram', src: '/socials/telegram.webp', href: '#instagram' },
  { label: 'E-mail', src: '/socials/mail.webp', href: '#email' },
  { label: 'Telegram', src: '/socials/telegram.webp', href: '#telegram' },
  { label: 'WhatsApp', src: '/socials/whatsapp.webp', href: '#whatsapp' }
];

const contactSocialRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginTop: '18px',
  paddingTop: '16px',
  borderTop: '1px solid rgba(255,255,255,0.12)'
};

const contactSocialLinkStyle = {
  width: '42px',
  height: '42px',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: '999px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.06)',
  boxShadow: 'inset 0 0 22px rgba(255,255,255,0.035)',
  pointerEvents: 'auto'
};

const contactSocialIconStyle = {
  width: '22px',
  height: '22px',
  objectFit: 'contain',
  display: 'block',
  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.45))'
};

const footerBaseStyle = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 'clamp(6px, 1vw, 12px)',
  padding: 'clamp(24px, 5vh, 60px) clamp(16px, 5vw, 64px) calc(clamp(26px, 6vh, 70px) + env(safe-area-inset-bottom))',
  textAlign: 'center',
  color: 'rgba(255,255,255,0.62)',
  background: '#000',
  pointerEvents: 'auto'
};

const footerNoticeStyle = {
  margin: 0,
  fontSize: 'clamp(12px, 3vw, 18px)',
  lineHeight: 1.25,
  letterSpacing: '0.16em',
  fontWeight: 800,
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.9)'
};

const footerDetailsStyle = {
  margin: 0,
  maxWidth: 'min(980px, 92vw)',
  fontSize: 'clamp(9px, 2.3vw, 12px)',
  lineHeight: 1.55,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.52)'
};


function LanguageFlag({ code, label, className = '' }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={`lang-flag ${className}`.trim()} aria-hidden="true">
      {failed ? (
        <span className="lang-flag-placeholder" />
      ) : (
        <img
          src={`/language-selector/${code}.webp`}
          alt=""
          width={48}
          height={48}
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
      <span className="lang-flag-code">{label}</span>
    </span>
  );
}

function LanguageSelector({ language, onLanguageChange, languageCopy }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const activeLanguage = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`lang-selector ${open ? 'is-open' : ''}`}
    >
      <button
        type="button"
        className="lang-selector-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={(languageCopy?.current ?? 'Language: {label}').replace('{label}', activeLanguage.label)}
        onClick={() => setOpen((value) => !value)}
      >
        <LanguageFlag code={activeLanguage.code} label={activeLanguage.label} />
        <span className="lang-selector-arrow" aria-hidden="true" />
      </button>
      <ul className="lang-selector-menu" role="listbox" aria-label={languageCopy?.select ?? 'Select language'}>
        {LANGUAGES.map((item) => (
          <li key={item.code} role="option" aria-selected={item.code === language}>
            <button
              type="button"
              className={item.code === language ? 'is-active' : ''}
              onClick={() => {
                onLanguageChange(item.code);
                setOpen(false);
              }}
            >
              <LanguageFlag code={item.code} label={item.label} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Navigation({ active, fixed, goTo, language, onLanguageChange, sections, languageCopy }) {
  const navRef = useRef(null);
  const navActive = Math.min(active, sections.length - 1);

  useEffect(() => {
    const activeButton = navRef.current?.querySelector('button.active');
    activeButton?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [navActive]);

  return (
    <header className={`top-nav ${fixed ? 'is-fixed' : ''}`}>
      <button className="brand" onClick={() => goTo(0)} aria-label="Go to first segment">
        <img src={logo} alt="KAJA" />
      </button>
      <div className="top-nav-end">
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} languageCopy={languageCopy} />
        <nav ref={navRef} aria-label="Section navigation">
          {sections.map((section, index) => (
            <button
              key={section.label}
              className={navActive === index ? 'active' : ''}
              onClick={() => goTo(index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ProductVisual({ type, progress, index }) {
  const y = useTransform(progress, [0, 1], ['8vh', '-10vh']);
  const scale = useTransform(progress, [0, 0.55, 1], [0.92, 1.06, 0.94]);
  const opacity = useTransform(progress, [0, 0.82, 1], [1, 1, 0.8]);
  const blur = useTransform(progress, [0, 1], ['blur(0px)', 'blur(0px)']);
  const reveal = useTransform(progress, [0, 1], ['inset(0% 0% 0% 0% round 32px)', 'inset(0% 0% 0% 0% round 32px)']);

  return (
    <motion.div className={`visual visual-${type}`} style={{ y, scale, opacity, filter: blur, clipPath: reveal }}>
      <div className="visual-glow" />
      <div className="visual-core">
        <img src={logo} alt="KAJA product mark" />
      </div>
      <div className="visual-line line-a" />
      <div className="visual-line line-b" />
      <span className="visual-index">{String(index + 1).padStart(2, '0')}</span>
    </motion.div>
  );
}

function HangerVisual({ progress }) {
  const trackX = useTransform(progress, [0, 1], ['30vw', '-68vw']);

  return (
    <div className="hanger-scene">
      <div className="hanger-rail-wrap" style={hangerRailWrapStyle}>
        <div className="hanger-rail" />
        <motion.div className="hanger-track" style={{ x: trackX }}>
          {hangerObjects.map((item) => (
            <div className={`hanger-object hanger-object-${item}`} key={item} style={hangerObjectStyle}>
              <img src={hanger} alt="" aria-hidden="true" style={hangerImageStyle} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ContactVisual({ progress }) {
  const x = useTransform(progress, [0, 1], ['-2.5vw', '2.5vw']);

  return (
    <motion.form className="contact-form-panel" style={{ x, ...contactFormStyle }} onSubmit={(event) => event.preventDefault()}>
      <p style={{ margin: '0 0 14px', color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '12px' }}>Contact KAJA</p>
      <input style={contactFieldStyle} placeholder="Name" aria-label="Name" />
      <input style={contactFieldStyle} placeholder="Email" aria-label="Email" type="email" />
      <select style={contactFieldStyle} aria-label="Topic" defaultValue="">
        <option value="" disabled>Topic</option>
        <option>Catalogue access</option>
        <option>Availability</option>
        <option>Merch collaboration</option>
        <option>General contact</option>
      </select>
      <textarea style={{ ...contactFieldStyle, minHeight: '118px', resize: 'none' }} placeholder="Message" aria-label="Message" />
      <button style={contactButtonStyle} type="submit">Send request</button>
      <div className="contact-social-links" style={contactSocialRowStyle}>
        {contactSocialLinks.map((item) => (
          <a className="contact-social-link" href={item.href} aria-label={item.label} title={item.label} style={contactSocialLinkStyle} key={item.label}>
            <img src={item.src} alt="" aria-hidden="true" draggable="false" style={contactSocialIconStyle} />
          </a>
        ))}
      </div>
    </motion.form>
  );
}

function Segment({ section, index, sectionRef, isActive, segmentProgress, frozenProgress, isMobile }) {
  const effectiveProgress = frozenProgress ?? segmentProgress;
  const motion = segmentMotionValues(effectiveProgress, isMobile);
  const isIntroSection = section.shape === 'intro';
  const isHangerSection = section.shape === 'hanger';
  const isContactSection = section.shape === 'contact';
  const isSequenceSection = section.shape === 'strips' || section.shape === 'orb';
  const sectionProgressAttr = isSequenceSection
    ? String(Math.round(effectiveProgress * 120) / 120)
    : String(motion.progressScale);
  const isJarManaged = isIntroSection || section.shape === 'stack' || section.shape === 'strips' || section.shape === 'orb';
  const sectionClassName = `segment ${isActive ? 'is-active' : ''} ${isIntroSection ? 'is-intro-section' : ''} ${isHangerSection ? 'is-hanger-section' : ''} ${isContactSection ? 'is-contact-section' : ''}`;

  useLayoutEffect(() => {
    if (!isHangerSection) return;
    if (!isActive && frozenProgress == null) return;
    window.__kajaSyncMerchHangers?.(effectiveProgress);
  }, [isHangerSection, isActive, effectiveProgress, frozenProgress]);

  return (
    <section
      ref={sectionRef}
      data-section-index={index}
      data-section-shape={section.shape}
      data-section-progress={sectionProgressAttr}
      data-frozen-progress={frozenProgress != null ? String(frozenProgress) : undefined}
      className={sectionClassName}
    >
      <div className="segment-backdrop">
        {isIntroSection ? (
          <>
            <div
              className="intro-backdrop-art"
              style={{ transform: `scale(${motion.introBgScale})`, transformOrigin: 'center bottom' }}
              aria-hidden="true"
            />
            <div
              className="intro-backdrop-overlay"
              style={{ opacity: motion.introOverlayOpacity }}
              aria-hidden="true"
            />
            <div className="intro-backdrop-vignette" aria-hidden="true" />
          </>
        ) : null}
        <div className="grid-mask" style={{ opacity: motion.gridOpacity, transform: `translateY(${motion.gridY})` }} />
      </div>
      <div className="segment-content">
        <p className="eyebrow" style={{ transform: `translateY(${motion.copyY}px)` }}>{section.eyebrow}</p>
        <h1 style={{ transform: `translateY(${motion.titleY}px)` }}>{section.title}</h1>
        <p className="copy" style={{ transform: `translateY(${motion.copyY}px)` }}>{section.copy}</p>
        <div className="progress-track">
          <span style={{ transform: `scaleX(${motion.progressScale})`, transformOrigin: 'left center', display: 'block', height: '100%' }} />
        </div>
      </div>
      {isHangerSection ? (
        <div className="hanger-scene">
          <div className="hanger-rail-wrap" style={hangerRailWrapStyle}>
            <div className="hanger-rail" />
            <div className="hanger-track">
              {hangerObjects.map((item) => (
                <div className={`hanger-object hanger-object-${item}`} key={item} style={hangerObjectStyle}>
                  <img src={hanger} alt="" aria-hidden="true" style={hangerImageStyle} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isJarManaged || isContactSection ? null : (
        <div
          className={`visual visual-${section.shape}`}
          style={{
            transform: `translateY(${motion.productY}) scale(${motion.productScale})`,
            opacity: motion.productOpacity
          }}
        >
          <div className="visual-glow" />
          <div className="visual-core">
            <img src={logo} alt="KAJA product mark" />
          </div>
          <div className="visual-line line-a" />
          <div className="visual-line line-b" />
          <span className="visual-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
      )}
      <div className="counter" style={{ transform: `translateY(${motion.counterY}) scale(${motion.counterScale})` }}>
        {String(index + 1).padStart(2, '0')}
      </div>
    </section>
  );
}

const SegmentMemo = React.memo(Segment, (prev, next) => (
  prev.isActive === next.isActive
  && prev.segmentProgress === next.segmentProgress
  && prev.frozenProgress === next.frozenProgress
  && prev.isMobile === next.isMobile
  && prev.index === next.index
));

function SpringPercent({ value, fallback = '0%' }) {
  const ref = useRef(null);

  useMotionValueEvent(value, 'change', (next) => {
    if (ref.current) ref.current.textContent = `${Math.round(clamp(next, 0, 1) * 100)}%`;
  });

  useEffect(() => {
    if (ref.current && typeof value.get === 'function') {
      ref.current.textContent = `${Math.round(clamp(value.get(), 0, 1) * 100)}%`;
    }
  }, [value]);

  return <span ref={ref}>{fallback}</span>;
}

function ScrollHint({
  active,
  displayProgress,
  scrollHintRef,
  logicProgress,
  useAnimatedBar,
  nativeScrollUnlocked,
  returnedFromFooter,
  sections,
  scrollHintCopy
}) {
  const contactComplete = active === CONTACT_INDEX && logicProgress >= SECTION_COMPLETE - EDGE_EPSILON;
  const showFooterHint = (nativeScrollUnlocked || contactComplete) && !returnedFromFooter;
  const barScale = useTransform(displayProgress, (value) => clamp(value, 0, 1));
  const staticBarScale = clamp(logicProgress, 0, 1);
  const logicValue = contactComplete ? 1 : clamp(logicProgress, 0, 1);

  if (showFooterHint) {
    return (
      <div
        ref={scrollHintRef}
        className="scroll-hint"
        data-hint-mode="footer"
        data-section-progress={contactComplete ? '1' : undefined}
        data-progress="1"
      >
        <span>{scrollHintCopy?.footer ?? 'Footer'}</span>
        <div><motion.i style={{ scaleY: 1, transformOrigin: 'bottom' }} /></div>
        <span>{scrollHintCopy?.end ?? 'End'}</span>
      </div>
    );
  }

  const section = sections[active] ?? sections[sections.length - 1];

  return (
    <div
      ref={scrollHintRef}
      className="scroll-hint"
      data-hint-mode="section"
      data-section-index={String(active)}
      data-section-shape={section.shape}
      data-section-progress={contactComplete ? '1' : undefined}
      data-progress={String(logicValue)}
    >
      <span>{section.label} {active + 1}/{sections.length}</span>
      <div>
        <motion.i
          style={{
            scaleY: useAnimatedBar ? barScale : staticBarScale,
            transformOrigin: 'bottom'
          }}
        />
      </div>
      {contactComplete ? <span>100%</span> : (
        useAnimatedBar ? <SpringPercent value={displayProgress} /> : <span>{`${Math.round(staticBarScale * 100)}%`}</span>
      )}
    </div>
  );
}

function LegalFooter({ footerRef, footerCopy }) {
  return (
    <footer ref={footerRef} className="site-footer" style={footerBaseStyle}>
      <p style={footerNoticeStyle}>{footerCopy?.notice ?? 'PAGE IS DESTINATED FOR PEOPLE OF AGE 18+'}</p>
      <p style={footerDetailsStyle}>{footerCopy?.details ?? 'KAJA Studio SRL • Strada Atelierului 18, Bucharest • CUI RO48291035 • Trade Registry J40/18422/2026 • contact@kaja.example • Support Monday-Friday 09:00-17:00'}</p>
    </footer>
  );
}

function MainSite() {
  const locale = getLocaleFromPath();
  const copy = useMemo(() => getLocaleCopy(locale), [locale]);
  const sections = useMemo(() => buildSections(copy), [copy]);

  useEffect(() => {
    publishLocale(locale, copy);
  }, [locale, copy]);

  useEffect(() => {
    const path = window.location.pathname;
    if (ENGLISH_ALIASES.test(path)) {
      window.location.replace('/');
    }
  }, []);

  const [active, setActive] = useState(0);
  const [presentedActive, setPresentedActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sectionProgresses, setSectionProgresses] = useState(() => Array(SECTION_COUNT).fill(0));
  const [fixed, setFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [nativeScrollUnlocked, setNativeScrollUnlocked] = useState(false);
  const [returnedFromFooter, setReturnedFromFooter] = useState(false);
  const activeRef = useRef(0);
  const presentedActiveRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const nativeScrollRef = useRef(false);
  const returnedFromFooterRef = useRef(false);
  const sectionRefs = useRef([]);
  const footerRef = useRef(null);
  const scrollHintRef = useRef(null);
  const pendingFooterScroll = useRef(false);
  const lock = useRef(false);
  const touchStart = useRef(null);
  const touchLast = useRef(null);
  const armedDirectionRef = useRef(null);
  const wheelGestureActiveRef = useRef(false);
  const gestureIdleTimerRef = useRef(null);
  const pendingWheelDeltaRef = useRef(0);
  const wheelFlushRafRef = useRef(null);
  const touchIsFirstMoveRef = useRef(true);
  const progressUiRef = useRef(0);
  const sectionTransitionTimerRef = useRef(null);
  const cancelScrollSettleRef = useRef(null);
  const sectionTransitionIdRef = useRef(0);
  const isMobileRef = useRef(false);
  const frozenSectionRef = useRef(null);
  const headerDeferredRef = useRef(false);
  const [frozenSection, setFrozenSection] = useState(null);
  const sectionProgressesRef = useRef(Array(SECTION_COUNT).fill(0));
  const progressTarget = useMotionValue(0);
  const displayProgress = useSpring(progressTarget, SCROLL_SPRING);
  const SECTION_SCROLL_MS = 520;

  const snapProgressMotion = useCallback((value) => {
    const next = clamp(value, 0, 1);
    if (typeof progressTarget.jump === 'function') progressTarget.jump(next);
    else progressTarget.set(next);
    if (typeof displayProgress.jump === 'function') displayProgress.jump(next);
    else displayProgress.set(next);
  }, [progressTarget, displayProgress]);

  const setProgressTarget = useCallback((value) => {
    const next = clamp(value, 0, 1);
    progressTarget.set(next);
  }, [progressTarget]);

  const syncHintProgress = useCallback((value) => {
    if (scrollHintRef.current) {
      scrollHintRef.current.dataset.progress = String(clamp(value, 0, 1));
    }
  }, []);

  const syncPresentedHintProgress = useCallback(() => {
    syncHintProgress(sectionProgressesRef.current[presentedActiveRef.current] ?? 0);
  }, [syncHintProgress]);

  const applySectionProgresses = useCallback((updater) => {
    const next = updater(sectionProgressesRef.current);
    sectionProgressesRef.current = next;
    setSectionProgresses(next);
    return next;
  }, []);

  const anchorScrollToActiveSection = useCallback(() => {
    if (nativeScrollRef.current || lock.current) return;
    const el = sectionRefs.current[activeRef.current];
    if (!el) return;
    const top = el.offsetTop;
    if (Math.abs(window.scrollY - top) > 6) {
      window.scrollTo({ top, behavior: 'auto' });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => anchorScrollToActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [anchorScrollToActiveSection]);

  const enforceFrozenSectionProgress = useCallback(() => {
    const frozen = frozenSectionRef.current;
    if (!frozen) return;
    if (Math.abs((sectionProgressesRef.current[frozen.index] ?? 0) - frozen.progress) < 0.0004) return;
    applySectionProgresses((prev) => {
      const updated = [...prev];
      updated[frozen.index] = frozen.progress;
      return updated;
    });
  }, [applySectionProgresses]);

  useEffect(() => {
    return displayProgress.on('change', (value) => {
      enforceFrozenSectionProgress();

      const idx = activeRef.current;
      const next = clamp(value, 0, 1);
      const target = progressRef.current;

      if (next >= SECTION_COMPLETE - VISUAL_EDGE_EPSILON && target >= SECTION_COMPLETE - EDGE_EPSILON) {
        armedDirectionRef.current = 'down';
      } else if (next <= SECTION_START + VISUAL_EDGE_EPSILON && target <= SECTION_START + EDGE_EPSILON) {
        armedDirectionRef.current = 'up';
      } else if (next > SECTION_START + VISUAL_EDGE_EPSILON && next < SECTION_COMPLETE - VISUAL_EDGE_EPSILON) {
        armedDirectionRef.current = null;
      }

      if (Math.abs(sectionProgressesRef.current[idx] - next) < 0.0004) return;
      applySectionProgresses((prev) => {
        const updated = [...prev];
        updated[idx] = next;
        return updated;
      });
      if (idx === presentedActiveRef.current) {
        syncPresentedHintProgress();
      }
    });
  }, [displayProgress, applySectionProgresses, syncPresentedHintProgress, enforceFrozenSectionProgress]);

  const setSectionState = useCallback((index, nextProgress, { snap = false, deferHeader = false } = {}) => {
    const next = clamp(nextProgress, 0, 1);
    const previousIndex = activeRef.current;
    activeRef.current = index;
    progressRef.current = next;
    targetProgressRef.current = next;
    setActive(index);
    if (!deferHeader) {
      setFixed(index > 0 || next > 0.05);
    }

    const uiStep = Math.round(next * 100) / 100;
    if (uiStep !== progressUiRef.current) {
      progressUiRef.current = uiStep;
      setProgress(next);
    } else if (snap || next === SECTION_START || next === SECTION_COMPLETE) {
      setProgress(next);
    }

    if (next > EDGE_EPSILON && next < SECTION_COMPLETE - EDGE_EPSILON) {
      armedDirectionRef.current = null;
    }

    if (snap) {
      snapProgressMotion(next);
      applySectionProgresses((prev) => {
        const updated = [...prev];
        updated[index] = next;
        return updated;
      });
      syncPresentedHintProgress();
    } else {
      setProgressTarget(next);
    }

    if (previousIndex !== index) {
      anchorScrollToActiveSection();
    }
  }, [setProgressTarget, snapProgressMotion, syncPresentedHintProgress, anchorScrollToActiveSection, applySectionProgresses]);

  const unlockNativeScroll = useCallback(() => {
    if (nativeScrollRef.current) return;
    returnedFromFooterRef.current = false;
    setReturnedFromFooter(false);
    nativeScrollRef.current = true;
    setNativeScrollUnlocked(true);
    document.documentElement.classList.add('kaja-footer-scroll');
    document.body.classList.add('kaja-footer-active');
    setSectionState(CONTACT_INDEX, 1, { snap: true });
    pendingFooterScroll.current = true;
  }, [setSectionState]);

  useEffect(() => {
    if (!nativeScrollUnlocked || !pendingFooterScroll.current) return;
    pendingFooterScroll.current = false;

    requestAnimationFrame(() => {
      const footer = footerRef.current;
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => {
          const maxScrollY = Math.max(0, footer.offsetTop + footer.offsetHeight - window.innerHeight);
          if (window.scrollY > maxScrollY + 1) {
            window.scrollTo({ top: maxScrollY, behavior: 'auto' });
          }
        }, SECTION_SCROLL_MS + 60);
        return;
      }
      const contactEl = sectionRefs.current[CONTACT_INDEX];
      if (contactEl) {
        window.scrollTo({
          top: contactEl.offsetTop + contactEl.offsetHeight,
          behavior: 'smooth'
        });
      }
    });
  }, [nativeScrollUnlocked]);

  const applySectionState = useCallback((index, nextProgress, snap = false, options = {}) => {
    setSectionState(index, nextProgress, { snap, ...options });
  }, [setSectionState]);

  const applyIntroHeaderState = useCallback((instant = false) => {
    const progress = sectionProgressesRef.current[0] ?? 0;
    const nextFixed = progress > 0.05;
    const nav = document.querySelector('.top-nav');

    if (instant && nav) nav.classList.add('is-instant');
    flushSync(() => setFixed(nextFixed));
    if (instant && nav) {
      requestAnimationFrame(() => {
        nav.classList.remove('is-instant');
        window.dispatchEvent(new Event('resize'));
      });
    }
  }, []);

  const finishSectionTransition = useCallback((index, onComplete) => {
    sectionTransitionTimerRef.current = null;
    if (cancelScrollSettleRef.current) {
      cancelScrollSettleRef.current();
      cancelScrollSettleRef.current = null;
    }

    frozenSectionRef.current = null;
    setFrozenSection(null);
    presentedActiveRef.current = index;
    setPresentedActive(index);
    syncPresentedHintProgress();

    if (headerDeferredRef.current && index === 0) {
      headerDeferredRef.current = false;
      applyIntroHeaderState(true);
    }

    lock.current = false;

    const el = sectionRefs.current[index];
    if (el) {
      const top = el.offsetTop;
      if (Math.abs(window.scrollY - top) > 6) {
        window.scrollTo({ top, behavior: 'auto' });
      }
    }

    onComplete?.();
  }, [syncPresentedHintProgress, applyIntroHeaderState]);

  const scrollToSection = useCallback((index, toProgress = 0, behavior = 'smooth', { preserveProgress = false, onComplete } = {}) => {
    const el = sectionRefs.current[index];
    if (!el) return;

    const transitionId = sectionTransitionIdRef.current + 1;
    sectionTransitionIdRef.current = transitionId;

    touchStart.current = null;
    touchLast.current = null;
    touchIsFirstMoveRef.current = true;
    pendingWheelDeltaRef.current = 0;
    wheelGestureActiveRef.current = false;
    armedDirectionRef.current = null;
    if (gestureIdleTimerRef.current !== null) {
      window.clearTimeout(gestureIdleTimerRef.current);
      gestureIdleTimerRef.current = null;
    }
    if (wheelFlushRafRef.current !== null) {
      cancelAnimationFrame(wheelFlushRafRef.current);
      wheelFlushRafRef.current = null;
    }

    if (sectionTransitionTimerRef.current !== null) {
      window.clearTimeout(sectionTransitionTimerRef.current);
      sectionTransitionTimerRef.current = null;
    }
    if (cancelScrollSettleRef.current) {
      cancelScrollSettleRef.current();
      cancelScrollSettleRef.current = null;
    }

    const leavingIndex = activeRef.current;
    const leavingProgress = preserveProgress
      ? (sectionProgressesRef.current[leavingIndex] ?? 0)
      : (toProgress === SECTION_START ? SECTION_COMPLETE : SECTION_START);
    const frozen = { index: leavingIndex, progress: leavingProgress };
    frozenSectionRef.current = frozen;
    flushSync(() => {
      setFrozenSection(frozen);
      applySectionProgresses((prev) => {
        const next = [...prev];
        next[leavingIndex] = leavingProgress;
        next[index] = clamp(toProgress, 0, 1);
        return next;
      });
      presentedActiveRef.current = index;
      setPresentedActive(index);
      syncPresentedHintProgress();
    });

    lock.current = true;
    armedDirectionRef.current = null;
    const deferHeader = index === 0 && leavingIndex > 0;
    headerDeferredRef.current = deferHeader;
    applySectionState(index, toProgress, true, { deferHeader });

    const resolvedBehavior = isMobileRef.current ? 'auto' : behavior;
    const targetTop = el.offsetTop;
    const maxWait = getSectionScrollDuration(leavingIndex, index, resolvedBehavior, SECTION_SCROLL_MS);
    window.scrollTo({ top: targetTop, behavior: resolvedBehavior === 'smooth' ? 'smooth' : 'auto' });

    let finished = false;
    const complete = () => {
      if (finished || sectionTransitionIdRef.current !== transitionId) return;
      finished = true;
      if (preserveProgress) {
        snapProgressMotion(toProgress);
      }
      finishSectionTransition(index, onComplete);
    };

    cancelScrollSettleRef.current = waitForScrollSettle(targetTop, maxWait, complete);
    sectionTransitionTimerRef.current = window.setTimeout(complete, maxWait);
  }, [applySectionState, finishSectionTransition, applySectionProgresses, syncPresentedHintProgress, snapProgressMotion]);

  const shouldReengageScrollFromFooter = useCallback(() => {
    const contactEl = sectionRefs.current[CONTACT_INDEX];
    if (!contactEl) return false;

    const footerEl = footerRef.current;
    const contactTop = contactEl.offsetTop;
    const footerTop = footerEl?.offsetTop ?? contactTop + contactEl.offsetHeight;

    return window.scrollY >= footerTop - 48 || window.scrollY > contactTop + 16;
  }, []);

  const getFooterMaxScrollY = useCallback(() => {
    const footerEl = footerRef.current;
    if (footerEl) {
      return Math.max(0, footerEl.offsetTop + footerEl.offsetHeight - window.innerHeight);
    }
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }, []);

  const clampFooterScroll = useCallback(() => {
    if (!nativeScrollRef.current || lock.current) return;
    const maxScrollY = getFooterMaxScrollY();
    if (window.scrollY > maxScrollY + 1) {
      window.scrollTo({ top: maxScrollY, behavior: 'auto' });
    }
  }, [getFooterMaxScrollY]);

  const lockNativeScroll = useCallback((behavior = 'smooth') => {
    if (!nativeScrollRef.current || lock.current) return;
    lock.current = true;

    returnedFromFooterRef.current = true;
    setReturnedFromFooter(true);
    applySectionState(CONTACT_INDEX, 1, true);

    const contactEl = sectionRefs.current[CONTACT_INDEX];
    const scrollBehavior = behavior === 'auto' ? 'auto' : 'smooth';

    if (contactEl) {
      if (scrollBehavior === 'smooth') {
        contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: contactEl.offsetTop, behavior: 'auto' });
      }
    }

    const delay = scrollBehavior === 'smooth' ? SECTION_SCROLL_MS : 80;

    window.setTimeout(() => {
      presentedActiveRef.current = CONTACT_INDEX;
      setPresentedActive(CONTACT_INDEX);
      syncPresentedHintProgress();
      nativeScrollRef.current = false;
      setNativeScrollUnlocked(false);
      document.documentElement.classList.remove('kaja-footer-scroll');
      document.body.classList.remove('kaja-footer-active');
      armedDirectionRef.current = null;
      lock.current = false;

      const el = sectionRefs.current[CONTACT_INDEX];
      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior: 'auto' });
      }
    }, delay);
  }, [applySectionState, syncPresentedHintProgress]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      if (nativeScrollRef.current && !lock.current) {
        clampFooterScroll();
        const currentY = window.scrollY;
        const scrollingUp = currentY < lastScrollY - 1;

        if (scrollingUp && shouldReengageScrollFromFooter()) {
          lockNativeScroll('smooth');
          lastScrollY = currentY;
          return;
        }
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lockNativeScroll, shouldReengageScrollFromFooter, clampFooterScroll]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 900px)').matches;
      isMobileRef.current = mobile;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goTo = useCallback((target) => {
    const next = clamp(target, 0, sections.length - 1);
    if (nativeScrollRef.current) lockNativeScroll();
    returnedFromFooterRef.current = false;
    setReturnedFromFooter(false);

    touchStart.current = null;
    touchLast.current = null;
    touchIsFirstMoveRef.current = true;
    pendingWheelDeltaRef.current = 0;
    wheelGestureActiveRef.current = false;
    armedDirectionRef.current = null;
    if (gestureIdleTimerRef.current !== null) {
      window.clearTimeout(gestureIdleTimerRef.current);
      gestureIdleTimerRef.current = null;
    }
    if (wheelFlushRafRef.current !== null) {
      cancelAnimationFrame(wheelFlushRafRef.current);
      wheelFlushRafRef.current = null;
    }

    if (next === activeRef.current) return;

    const progress = sectionProgressesRef.current[next] ?? 0;
    scrollToSection(next, progress, 'smooth', { preserveProgress: true });
  }, [lockNativeScroll, scrollToSection, sections.length]);

  useEffect(() => {
    const readVisualProgress = () => clamp(displayProgress.get(), 0, 1);
    const footerMaxScrollY = () => {
      const footerEl = footerRef.current;
      if (footerEl) {
        return Math.max(0, footerEl.offsetTop + footerEl.offsetHeight - window.innerHeight);
      }
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    };
    const isAtFooterBottom = () => window.scrollY >= footerMaxScrollY() - 2;

    const commitProgress = (sectionIndex, requestedProgress) => {
      const visual = readVisualProgress();
      let next = clamp(requestedProgress, 0, 1);
      const lead = next - visual;
      const maxLead = isMobileRef.current ? MOBILE_MAX_TARGET_LEAD : MAX_TARGET_LEAD;
      if (lead > maxLead) next = visual + maxLead;
      else if (lead < -maxLead) next = visual - maxLead;
      applySectionState(sectionIndex, next);
    };

    const armAtEdge = () => {
      const visual = readVisualProgress();
      const target = progressRef.current;
      if (visual >= SECTION_COMPLETE - VISUAL_EDGE_EPSILON && target >= SECTION_COMPLETE - EDGE_EPSILON) {
        armedDirectionRef.current = 'down';
        return;
      }
      if (visual <= SECTION_START + VISUAL_EDGE_EPSILON && target <= SECTION_START + EDGE_EPSILON) {
        armedDirectionRef.current = 'up';
        return;
      }
      armedDirectionRef.current = null;
    };

    const tryCommitSectionAdvance = (direction) => {
      if (direction > 0 && armedDirectionRef.current !== 'down') return false;
      if (direction < 0 && armedDirectionRef.current !== 'up') return false;

      const sectionIndex = activeRef.current;
      const visual = readVisualProgress();
      const target = progressRef.current;

      if (direction > 0) {
        if (visual < SECTION_COMPLETE - VISUAL_EDGE_EPSILON) return false;
        if (target < SECTION_COMPLETE - EDGE_EPSILON) return false;
        armedDirectionRef.current = null;
        if (sectionIndex === CONTACT_INDEX) {
          unlockNativeScroll();
        } else if (sectionIndex < CONTACT_INDEX) {
          scrollToSection(sectionIndex + 1, 0);
        }
        return true;
      }

      if (visual > SECTION_START + VISUAL_EDGE_EPSILON) return false;
      if (target > SECTION_START + EDGE_EPSILON) return false;
      armedDirectionRef.current = null;
      if (sectionIndex > 0) scrollToSection(sectionIndex - 1, 1);
      return true;
    };

    const applyProgressDelta = (delta, divisor = WHEEL_PROGRESS_DIVISOR, maxStep = WHEEL_STEP_MAX) => {
      if (lock.current || !delta || nativeScrollRef.current) return;

      const direction = Math.sign(delta);
      const amount = clamp(Math.abs(delta) / divisor, WHEEL_STEP_MIN, maxStep);
      const sectionIndex = activeRef.current;
      const current = progressRef.current;

      if (direction > 0) {
        if (current >= SECTION_COMPLETE - EDGE_EPSILON) return;
        commitProgress(sectionIndex, Math.min(SECTION_COMPLETE, current + amount));
        return;
      }

      if (current <= SECTION_START + EDGE_EPSILON) return;
      commitProgress(sectionIndex, Math.max(SECTION_START, current - amount));
    };

    const flushWheelDelta = () => {
      wheelFlushRafRef.current = null;
      const delta = pendingWheelDeltaRef.current;
      if (!delta) return;

      const direction = Math.sign(delta);
      const totalAmount = Math.abs(delta) / WHEEL_PROGRESS_DIVISOR;
      const appliedAmount = Math.min(totalAmount, FRAME_PROGRESS_MAX);
      const remainingAmount = Math.max(0, totalAmount - appliedAmount);

      applyProgressDelta(direction * appliedAmount * WHEEL_PROGRESS_DIVISOR, WHEEL_PROGRESS_DIVISOR, FRAME_PROGRESS_MAX);

      pendingWheelDeltaRef.current = remainingAmount > 0 ? direction * remainingAmount * WHEEL_PROGRESS_DIVISOR : 0;
      if (pendingWheelDeltaRef.current !== 0) {
        wheelFlushRafRef.current = requestAnimationFrame(flushWheelDelta);
      }
    };

    const queueWheelDelta = (delta) => {
      pendingWheelDeltaRef.current += delta;
      if (wheelFlushRafRef.current !== null) return;
      wheelFlushRafRef.current = requestAnimationFrame(flushWheelDelta);
    };

    const scheduleGestureEnd = () => {
      if (gestureIdleTimerRef.current !== null) {
        window.clearTimeout(gestureIdleTimerRef.current);
      }
      gestureIdleTimerRef.current = window.setTimeout(() => {
        gestureIdleTimerRef.current = null;
        wheelGestureActiveRef.current = false;
        armAtEdge();
      }, GESTURE_IDLE_MS);
    };

    const onWheel = (event) => {
      if (nativeScrollRef.current) {
        if (event.deltaY > 0 && isAtFooterBottom()) {
          event.preventDefault();
          return;
        }
        if (event.deltaY < 0) {
          event.preventDefault();
          if (shouldReengageScrollFromFooter()) {
            lockNativeScroll('smooth');
            return;
          }
          lockNativeScroll('smooth');
          if (tryCommitSectionAdvance(-1)) return;
          applyProgressDelta(event.deltaY, WHEEL_PROGRESS_DIVISOR);
        }
        return;
      }

      event.preventDefault();

      const isNewGesture = !wheelGestureActiveRef.current;
      wheelGestureActiveRef.current = true;
      scheduleGestureEnd();

      if (isNewGesture && tryCommitSectionAdvance(Math.sign(event.deltaY))) {
        return;
      }

      queueWheelDelta(event.deltaY);
    };

    const onTouchStart = (event) => {
      if (lock.current) return;
      if (event.target.closest('nav, .lang-selector')) return;
      const touch = event.touches[0];
      touchStart.current = touch.clientY;
      touchLast.current = touch.clientY;
      touchIsFirstMoveRef.current = true;
    };

    const onTouchMove = (event) => {
      if (lock.current) return;
      if (event.target.closest('nav, .lang-selector')) return;
      if (touchLast.current === null) return;

      const touch = event.touches[0];
      const delta = touchLast.current - touch.clientY;
      touchLast.current = touch.clientY;

      if (nativeScrollRef.current) {
        const maxScrollY = footerMaxScrollY();
        const atBottom = window.scrollY >= maxScrollY - 2;

        if (delta > 0 && (atBottom || window.scrollY + delta > maxScrollY)) {
          event.preventDefault();
          if (window.scrollY > maxScrollY + 1) {
            window.scrollTo({ top: maxScrollY, behavior: 'auto' });
          }
          return;
        }

        if (delta < 0 && shouldReengageScrollFromFooter()) {
          event.preventDefault();
          lockNativeScroll('smooth');
        }
        return;
      }

      event.preventDefault();

      if (touchIsFirstMoveRef.current) {
        touchIsFirstMoveRef.current = false;
        if (tryCommitSectionAdvance(Math.sign(delta))) return;
      }

      const touchDivisor = isMobileRef.current ? MOBILE_TOUCH_PROGRESS_DIVISOR : TOUCH_PROGRESS_DIVISOR;
      const touchStepMax = isMobileRef.current ? MOBILE_TOUCH_STEP_MAX : WHEEL_STEP_MAX;
      applyProgressDelta(delta, touchDivisor, touchStepMax);
    };

    const onTouchEnd = () => {
      touchStart.current = null;
      touchLast.current = null;
      touchIsFirstMoveRef.current = true;
      armAtEdge();
    };

    const onKeyDown = (event) => {
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        if (nativeScrollRef.current) return;
        event.preventDefault();
        if (tryCommitSectionAdvance(1)) return;
        applyProgressDelta(120 * SCROLL_SPEED, 1);
        armAtEdge();
      }
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        if (nativeScrollRef.current) {
          event.preventDefault();
          const contactTop = sectionRefs.current[CONTACT_INDEX]?.offsetTop ?? 0;
          const footerTop = footerRef.current?.offsetTop ?? Infinity;
          if (window.scrollY >= footerTop - 48 || window.scrollY > contactTop + 16) {
            lockNativeScroll('smooth');
            return;
          }
          lockNativeScroll('smooth');
          if (tryCommitSectionAdvance(-1)) return;
          applyProgressDelta(-120 * SCROLL_SPEED, 1);
          return;
        }
        event.preventDefault();
        if (tryCommitSectionAdvance(-1)) return;
        applyProgressDelta(-120 * SCROLL_SPEED, 1);
        armAtEdge();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      if (gestureIdleTimerRef.current !== null) {
        window.clearTimeout(gestureIdleTimerRef.current);
      }
      if (wheelFlushRafRef.current !== null) {
        cancelAnimationFrame(wheelFlushRafRef.current);
      }
      if (sectionTransitionTimerRef.current !== null) {
        window.clearTimeout(sectionTransitionTimerRef.current);
      }
      if (cancelScrollSettleRef.current) {
        cancelScrollSettleRef.current();
      }
    };
  }, [applySectionState, scrollToSection, unlockNativeScroll, lockNativeScroll, shouldReengageScrollFromFooter, displayProgress]);

  const navigateToLocale = useCallback((code) => {
    if (code === locale) return;
    window.location.assign(getLocaleSwitchPath(code));
  }, [locale]);

  const visibleSections = useMemo(() => sections.map((section, index) => ({ section, index })), [sections]);

  return (
    <main className={nativeScrollUnlocked ? 'has-footer-scroll' : ''}>
      <ElasticCursor />
      <Navigation
        active={active}
        fixed={fixed || nativeScrollUnlocked}
        goTo={goTo}
        language={locale}
        onLanguageChange={navigateToLocale}
        sections={sections}
        languageCopy={copy.language}
      />
      <div className="stage">
        {visibleSections.map(({ section, index }) => (
          <SegmentMemo
            key={`${section.shape}-${index}`}
            section={section}
            index={index}
            sectionRef={(element) => {
              sectionRefs.current[index] = element;
            }}
            isActive={active === index}
            segmentProgress={sectionProgresses[index] ?? 0}
            frozenProgress={frozenSection?.index === index ? frozenSection.progress : null}
            isMobile={isMobile}
          />
        ))}
      </div>
      <ScrollHint
        active={presentedActive}
        displayProgress={displayProgress}
        scrollHintRef={scrollHintRef}
        logicProgress={sectionProgresses[presentedActive] ?? 0}
        useAnimatedBar={presentedActive === active}
        nativeScrollUnlocked={nativeScrollUnlocked}
        returnedFromFooter={returnedFromFooter}
        sections={sections}
        scrollHintCopy={copy.scrollHint}
      />
      {nativeScrollUnlocked ? <LegalFooter footerRef={footerRef} footerCopy={copy.footer} /> : null}
    </main>
  );
}

function App() {
  const [approved, setApproved] = useState(() => isEntryApproved());

  if (!approved) {
    return <EntryGate onApproved={() => setApproved(true)} />;
  }

  return <MainSite />;
}

createRoot(document.getElementById('root')).render(<App />);
