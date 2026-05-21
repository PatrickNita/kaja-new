import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './styles.css';
import logo from './assets/kaja-logo.png';
import hanger from './assets/hanger.png';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const FOOTER_INDEX = 6;
const SPRING_CONFIG = { stiffness: 82, damping: 24, mass: 0.68 };

const sections = [
  {
    label: 'INTRO',
    eyebrow: '01 / Intro',
    title: 'INTRO',
    copy: 'A scroll-driven KAJA product sequence with frame-by-frame motion and a fluid spring scale.',
    accent: 'Intro',
    shape: 'intro'
  },
  {
    label: 'STRENGTH',
    eyebrow: '02 / Strength',
    title: 'Built with structure and confidence.',
    copy: 'Strong visual pacing, controlled transitions, and solid interaction logic keep the experience feeling deliberate.',
    accent: 'Strong',
    shape: 'stack'
  },
  {
    label: 'CATALOGUE',
    eyebrow: '03 / Catalogue',
    title: 'A clean path through the collection.',
    copy: 'Catalogue moments are designed to feel organized, visual, and easy to explore across every screen size.',
    accent: 'Catalogue',
    shape: 'strips'
  },
  {
    label: 'AVAILABILITY',
    eyebrow: '04 / Availability',
    title: 'Ready when the demand arrives.',
    copy: 'Availability messaging stays simple and direct, giving visitors a clear sense of timing, access, and next steps.',
    accent: 'Available',
    shape: 'orb'
  },
  {
    label: 'MERCH',
    eyebrow: '05 / Merch',
    title: 'A full collection on the line.',
    copy: 'A fixed full-width rail holds six grey hangers that glide horizontally from right to left as you scroll.',
    accent: 'Merch',
    shape: 'hanger'
  },
  {
    label: 'CONTACT',
    eyebrow: '06 / Contact',
    title: 'Start the conversation.',
    copy: 'Send a message for launch details, catalogue access, collaboration, or product availability.',
    accent: 'Contact',
    shape: 'contact'
  }
];

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
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 'clamp(22px, 3vw, 34px)',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.13), rgba(255,255,255,0.035))',
  boxShadow: '0 52px 120px rgba(0,0,0,0.64), inset 0 0 70px rgba(255,255,255,0.035)',
  backdropFilter: 'blur(18px)'
};

const contactFieldStyle = {
  width: '100%',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '16px',
  background: 'rgba(0,0,0,0.42)',
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
  position: 'absolute',
  inset: 0,
  zIndex: 80,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 'clamp(6px, 1vw, 12px)',
  padding: 'clamp(24px, 5vh, 60px) clamp(16px, 5vw, 64px) calc(clamp(26px, 6vh, 70px) + env(safe-area-inset-bottom))',
  textAlign: 'center',
  color: 'rgba(255,255,255,0.62)',
  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 36%, rgba(0,0,0,0.94) 100%)',
  pointerEvents: 'none',
  transition: 'opacity 0.35s ease, transform 0.35s ease'
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

function jumpProgress(value, ...motionValues) {
  const next = clamp(value, 0, 1);
  motionValues.forEach((motionValue) => {
    if (!motionValue) return;
    if (typeof motionValue.jump === 'function') motionValue.jump(next);
    else motionValue.set(next);
  });
}

function ElasticCursor() {
  const cursor = useRef(null);
  const dot = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ring = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const previous = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const raf = useRef(null);

  useEffect(() => {
    const move = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.17;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.17;

      const dx = mouse.current.x - previous.current.x;
      const dy = mouse.current.y - previous.current.y;
      const speed = Math.min(Math.hypot(dx, dy), 80);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const stretch = 1 + speed / 210;
      const squash = 1 - speed / 420;

      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretch}, ${squash})`;
      }

      previous.current.x += dx * 0.35;
      previous.current.y += dy * 0.35;
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', move);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={cursor} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  );
}

function Navigation({ active, fixed, goTo }) {
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
    </header>
  );
}

function IntroVisual() {
  return <div className="intro-sequence" aria-label="KAJA intro jar visual" />;
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

function Segment({ section, index, active, rawProgress, sharedProgress, isMobile }) {
  const localProgress = useMotionValue(rawProgress);
  const localSpring = useSpring(localProgress, SPRING_CONFIG);
  const spring = active && sharedProgress ? sharedProgress : localSpring;
  const titleY = useTransform(spring, [0, 1], isMobile ? [2, -5] : [6, -18]);
  const titleOpacity = useTransform(spring, [0, 1], [1, 1]);
  const copyY = useTransform(spring, [0, 1], isMobile ? [1, -3] : [3, -10]);
  const accentY = useTransform(spring, [0, 1], isMobile ? ['0.5vh', '-1.5vh'] : ['1vh', '-5vh']);
  const counterScale = useTransform(spring, [0, 1], isMobile ? [0.96, 1.06] : [0.9, 1.18]);
  const counterY = useTransform(spring, [0, 1], isMobile ? ['0.5vh', '-1.5vh'] : ['2vh', '-5vh']);
  const gridOpacity = useTransform(spring, [0, 1], [0.32, 1]);
  const gridY = useTransform(spring, [0, 1], isMobile ? ['0.6vh', '-0.6vh'] : ['2vh', '-2vh']);
  const isIntroSection = section.shape === 'intro';
  const isHangerSection = section.shape === 'hanger';
  const isContactSection = section.shape === 'contact';

  useEffect(() => {
    localProgress.set(rawProgress);
  }, [rawProgress, localProgress]);

  return (
    <section className={`segment ${active ? 'is-active' : ''} ${isIntroSection ? 'is-intro-section' : ''} ${isHangerSection ? 'is-hanger-section' : ''} ${isContactSection ? 'is-contact-section' : ''}`} aria-hidden={!active}>
      <div className="segment-backdrop">
        <motion.div className="grid-mask" style={{ opacity: gridOpacity, y: gridY }} />
      </div>
      <div className="segment-content">
        <motion.p className="eyebrow" style={{ y: copyY, opacity: titleOpacity }}>{section.eyebrow}</motion.p>
        <motion.h1 style={{ y: titleY, opacity: titleOpacity }}>{section.title}</motion.h1>
        <motion.p className="copy" style={{ y: copyY, opacity: titleOpacity }}>{section.copy}</motion.p>
        <div className="progress-track">
          <motion.span style={{ scaleX: spring }} />
        </div>
      </div>
      {isIntroSection ? (
        <IntroVisual />
      ) : isHangerSection ? (
        <HangerVisual progress={spring} />
      ) : isContactSection ? (
        <ContactVisual progress={spring} />
      ) : (
        <ProductVisual type={section.shape} progress={spring} index={index} />
      )}
      <motion.div className="huge-accent" style={{ y: accentY }}>{section.accent}</motion.div>
      <motion.div className="counter" style={{ y: counterY, scale: counterScale }}>{String(index + 1).padStart(2, '0')}</motion.div>
    </section>
  );
}

function ScrollHint({ active, progress }) {
  if (active === FOOTER_INDEX) {
    return (
      <div className="scroll-hint">
        <span>Footer</span>
        <div><i style={{ height: '100%' }} /></div>
        <span>End</span>
      </div>
    );
  }

  const section = sections[active] ?? sections[sections.length - 1];
  const displayPercent = Math.round(clamp(progress, 0, 1) * 100);

  return (
    <div className="scroll-hint">
      <span>{section.label} {active + 1}/{sections.length}</span>
      <div><i style={{ height: `${displayPercent}%` }} /></div>
      <span>{displayPercent}%</span>
    </div>
  );
}

function LegalFooter({ visible }) {
  return (
    <footer style={{ ...footerBaseStyle, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(44px)' }}>
      <p style={footerNoticeStyle}>PAGE IS DESTINATED FOR PEOPLE OF AGE 18+</p>
      <p style={footerDetailsStyle}>KAJA Studio SRL • Strada Atelierului 18, Bucharest • CUI RO48291035 • Trade Registry J40/18422/2026 • contact@kaja.example • Support Monday-Friday 09:00-17:00</p>
    </footer>
  );
}

function App() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sharedDisplayProgress, setSharedDisplayProgress] = useState(0);
  const [fixed, setFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const activeRef = useRef(0);
  const progressRef = useRef(0);
  const sharedProgressRef = useRef(0);
  const lock = useRef(false);
  const pendingTransition = useRef(null);
  const touchStart = useRef(null);
  const touchLast = useRef(null);
  const sharedProgressSource = useMotionValue(0);
  const sharedProgress = useSpring(sharedProgressSource, SPRING_CONFIG);

  const resetSharedProgress = (value) => {
    sharedProgressRef.current = clamp(value, 0, 1);
    setSharedDisplayProgress(sharedProgressRef.current);
    jumpProgress(sharedProgressRef.current, sharedProgressSource, sharedProgress);
  };

  useEffect(() => {
    sharedProgressSource.set(progress);
  }, [progress, sharedProgressSource]);

  useEffect(() => {
    const unsubscribe = sharedProgress.on('change', (value) => {
      const next = clamp(value, 0, 1);
      sharedProgressRef.current = next;
      setSharedDisplayProgress(next);

      const pending = pendingTransition.current;
      if (!pending) return;

      if (pending.direction > 0 && next >= 0.995) {
        const nextProgress = pending.to === FOOTER_INDEX ? 1 : 0;
        pendingTransition.current = null;
        activeRef.current = pending.to;
        progressRef.current = nextProgress;
        setActive(pending.to);
        setProgress(nextProgress);
        setFixed(pending.to > 0 || nextProgress > 0.05);
        resetSharedProgress(nextProgress);
        window.setTimeout(() => { lock.current = false; }, 80);
      }

      if (pending.direction < 0 && next <= 0.005) {
        pendingTransition.current = null;
        activeRef.current = pending.to;
        progressRef.current = pending.toProgress;
        setActive(pending.to);
        setProgress(pending.toProgress);
        setFixed(pending.to > 0 || pending.toProgress > 0.05);
        resetSharedProgress(pending.toProgress);
        window.setTimeout(() => { lock.current = false; }, 80);
      }
    });

    return unsubscribe;
  }, [sharedProgress, sharedProgressSource]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 900px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goTo = (target) => {
    const next = clamp(target, 0, sections.length - 1);
    pendingTransition.current = null;
    lock.current = false;
    activeRef.current = next;
    progressRef.current = 0;
    setActive(next);
    setProgress(0);
    resetSharedProgress(0);
    setFixed(next > 0);
  };

  useEffect(() => {
    const update = (nextActive, nextProgress) => {
      activeRef.current = nextActive;
      progressRef.current = nextProgress;
      setActive(nextActive);
      setProgress(nextProgress);
      setFixed(nextActive > 0 || nextProgress > 0.05);
    };

    const waitForSharedProgress = (to, direction, toProgress = 0) => {
      pendingTransition.current = { to, direction, toProgress };
      lock.current = true;
      update(activeRef.current, direction > 0 ? 1 : 0);
    };

    const advance = (delta, divisor = 1700) => {
      if (lock.current || !delta) return;

      const direction = Math.sign(delta);
      const amount = clamp(Math.abs(delta) / divisor, 0.014, 0.078);
      let nextActive = activeRef.current;
      let nextProgress = progressRef.current + amount * direction;

      if (direction > 0 && nextActive === FOOTER_INDEX) return;

      if (direction < 0 && nextActive === FOOTER_INDEX) {
        waitForSharedProgress(sections.length - 1, -1, 1);
        return;
      }

      if (nextProgress >= 1) {
        const target = nextActive < sections.length - 1 ? nextActive + 1 : FOOTER_INDEX;
        waitForSharedProgress(target, 1, target === FOOTER_INDEX ? 1 : 0);
        return;
      }

      if (nextProgress <= 0) {
        if (nextActive > 0 && direction < 0) {
          waitForSharedProgress(nextActive - 1, -1, 1);
          return;
        }
        nextProgress = 0;
      }

      update(nextActive, clamp(nextProgress, 0, 1));
    };

    const onWheel = (event) => {
      event.preventDefault();
      advance(event.deltaY, 1700);
    };

    const onTouchStart = (event) => {
      if (event.target.closest('nav')) return;
      const touch = event.touches[0];
      touchStart.current = touch.clientY;
      touchLast.current = touch.clientY;
    };

    const onTouchMove = (event) => {
      if (event.target.closest('nav')) return;
      if (touchLast.current === null) return;
      event.preventDefault();
      const touch = event.touches[0];
      const delta = touchLast.current - touch.clientY;
      touchLast.current = touch.clientY;
      advance(delta, 540);
    };

    const onTouchEnd = () => {
      touchStart.current = null;
      touchLast.current = null;
    };

    const onKeyDown = (event) => {
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        if (activeRef.current === FOOTER_INDEX) return;
        if (progressRef.current < 1) {
          update(activeRef.current, 1);
        } else {
          const target = activeRef.current < sections.length - 1 ? activeRef.current + 1 : FOOTER_INDEX;
          waitForSharedProgress(target, 1, target === FOOTER_INDEX ? 1 : 0);
        }
      }
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        if (activeRef.current === FOOTER_INDEX) {
          waitForSharedProgress(sections.length - 1, -1, 1);
        } else if (progressRef.current > 0) {
          update(activeRef.current, 0);
        } else if (activeRef.current > 0) {
          waitForSharedProgress(activeRef.current - 1, -1, 1);
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    document.body.classList.add('no-scroll');

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const visibleSections = useMemo(() => sections.map((section, index) => ({ section, index })), []);
  const footerVisible = active === FOOTER_INDEX;

  return (
    <main>
      <ElasticCursor />
      <Navigation active={active} fixed={fixed || footerVisible} goTo={goTo} />
      <div className="stage">
        {visibleSections.map(({ section, index }) => (
          <Segment
            key={section.label}
            section={section}
            index={index}
            active={footerVisible ? index === sections.length - 1 : active === index}
            rawProgress={footerVisible ? 1 : active === index ? progress : active > index ? 1 : 0}
            sharedProgress={sharedProgress}
            isMobile={isMobile}
          />
        ))}
      </div>
      <ScrollHint active={active} progress={footerVisible ? 1 : sharedDisplayProgress} />
      <LegalFooter visible={footerVisible} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);