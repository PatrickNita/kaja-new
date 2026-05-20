import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './styles.css';
import logo from './assets/kaja-logo.png';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const sections = [
  {
    label: 'Origin',
    eyebrow: '01 / Concept',
    title: 'Designed to hold attention.',
    copy: 'KAJA opens with a quiet black stage, then reveals the product through controlled, tactile movement.',
    accent: 'Precision',
    shape: 'panel'
  },
  {
    label: 'Material',
    eyebrow: '02 / Texture',
    title: 'Soft motion, sharp product logic.',
    copy: 'Every scroll gesture drives the animation timeline forward or backward before the page moves on.',
    accent: 'Elastic',
    shape: 'orb'
  },
  {
    label: 'Performance',
    eyebrow: '03 / Engine',
    title: 'Responsive by rhythm, not by accident.',
    copy: 'The experience blocks free scrolling and snaps into the next fixed scene only after the current reveal is complete.',
    accent: 'Controlled',
    shape: 'stack'
  },
  {
    label: 'Details',
    eyebrow: '04 / Interface',
    title: 'A cursor with weight and memory.',
    copy: 'The center point stays exact while the surrounding ring stretches and softens according to mouse velocity.',
    accent: 'Fluid',
    shape: 'cursor'
  },
  {
    label: 'Launch',
    eyebrow: '05 / Story',
    title: 'Six scenes, one product narrative.',
    copy: 'Each segment behaves like a cinematic frame, with image motion scrubbed directly by the user\'s scroll.',
    accent: 'Cinematic',
    shape: 'strips'
  },
  {
    label: 'Contact',
    eyebrow: '06 / Conversion',
    title: 'Ready for a high-end product reveal.',
    copy: 'The final section closes with a focused call-to-action and a GitHub-ready React + Node structure.',
    accent: 'Ready',
    shape: 'final'
  }
];

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
  return (
    <header className={`top-nav ${fixed ? 'is-fixed' : ''}`}>
      <button className="brand" onClick={() => goTo(0)} aria-label="Go to first segment">
        <img src={logo} alt="KAJA" />
      </button>
      <nav>
        {sections.map((section, index) => (
          <button
            key={section.label}
            className={active === index ? 'active' : ''}
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

function ProductVisual({ type, progress, index }) {
  const rotate = useTransform(progress, [0, 1], [-22, 18]);
  const x = useTransform(progress, [0, 1], ['-18vw', '12vw']);
  const y = useTransform(progress, [0, 1], ['10vh', '-8vh']);
  const scale = useTransform(progress, [0, 0.55, 1], [0.76, 1.08, 0.92]);
  const opacity = useTransform(progress, [0, 0.14, 0.9, 1], [0.08, 1, 1, 0.7]);
  const blur = useTransform(progress, [0, 0.3, 1], ['blur(22px)', 'blur(0px)', 'blur(0px)']);
  const reveal = useTransform(progress, [0, 1], ['inset(38% 35% 38% 35% round 32px)', 'inset(0% 0% 0% 0% round 32px)']);

  return (
    <motion.div className={`visual visual-${type}`} style={{ rotate, x, y, scale, opacity, filter: blur, clipPath: reveal }}>
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

function Segment({ section, index, active, rawProgress }) {
  const progress = useMotionValue(rawProgress);
  const spring = useSpring(progress, { stiffness: 90, damping: 22, mass: 0.6 });
  const titleY = useTransform(spring, [0, 1], [80, -24]);
  const titleOpacity = useTransform(spring, [0, 0.22, 1], [0, 1, 1]);
  const copyY = useTransform(spring, [0, 1], [46, -12]);
  const accentX = useTransform(spring, [0, 1], ['-105%', '0%']);
  const counterScale = useTransform(spring, [0, 1], [0.72, 1.18]);

  useEffect(() => {
    progress.set(rawProgress);
  }, [rawProgress, progress]);

  return (
    <section className={`segment ${active ? 'is-active' : ''}`} aria-hidden={!active}>
      <div className="segment-backdrop">
        <motion.div className="grid-mask" style={{ opacity: spring }} />
      </div>
      <div className="segment-content">
        <motion.p className="eyebrow" style={{ y: copyY, opacity: titleOpacity }}>{section.eyebrow}</motion.p>
        <motion.h1 style={{ y: titleY, opacity: titleOpacity }}>{section.title}</motion.h1>
        <motion.p className="copy" style={{ y: copyY, opacity: titleOpacity }}>{section.copy}</motion.p>
        <div className="progress-track">
          <motion.span style={{ scaleX: spring }} />
        </div>
      </div>
      <ProductVisual type={section.shape} progress={spring} index={index} />
      <motion.div className="huge-accent" style={{ x: accentX }}>{section.accent}</motion.div>
      <motion.div className="counter" style={{ scale: counterScale }}>{String(index + 1).padStart(2, '0')}</motion.div>
    </section>
  );
}

function ScrollHint({ active, progress }) {
  return (
    <div className="scroll-hint">
      <span>Segment {active + 1}/6</span>
      <div><i style={{ height: `${Math.round(progress * 100)}%` }} /></div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

function App() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fixed, setFixed] = useState(false);
  const activeRef = useRef(0);
  const progressRef = useRef(0);
  const lock = useRef(false);

  const goTo = (target) => {
    const next = clamp(target, 0, sections.length - 1);
    activeRef.current = next;
    progressRef.current = 0;
    setActive(next);
    setProgress(0);
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

    const onWheel = (event) => {
      event.preventDefault();
      if (lock.current) return;

      const direction = Math.sign(event.deltaY);
      const amount = clamp(Math.abs(event.deltaY) / 760, 0.035, 0.16);
      let nextActive = activeRef.current;
      let nextProgress = progressRef.current + amount * direction;

      if (nextProgress >= 1) {
        if (nextActive < sections.length - 1) {
          nextActive += 1;
          nextProgress = 0;
        } else {
          nextProgress = 1;
        }
        lock.current = true;
        window.setTimeout(() => { lock.current = false; }, 360);
      }

      if (nextProgress <= 0) {
        if (nextActive > 0 && direction < 0) {
          nextActive -= 1;
          nextProgress = 1;
        } else {
          nextProgress = 0;
        }
        lock.current = true;
        window.setTimeout(() => { lock.current = false; }, 220);
      }

      update(nextActive, clamp(nextProgress, 0, 1));
    };

    const onKeyDown = (event) => {
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        if (progressRef.current < 1) update(activeRef.current, 1);
        else goTo(activeRef.current + 1);
      }
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        if (progressRef.current > 0) update(activeRef.current, 0);
        else goTo(activeRef.current - 1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    document.body.classList.add('no-scroll');

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const visibleSections = useMemo(() => sections.map((section, index) => ({ section, index })), []);

  return (
    <main>
      <ElasticCursor />
      <Navigation active={active} fixed={fixed} goTo={goTo} />
      <div className="stage">
        {visibleSections.map(({ section, index }) => (
          <Segment
            key={section.label}
            section={section}
            index={index}
            active={active === index}
            rawProgress={active === index ? progress : active > index ? 1 : 0}
          />
        ))}
      </div>
      <ScrollHint active={active} progress={progress} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
