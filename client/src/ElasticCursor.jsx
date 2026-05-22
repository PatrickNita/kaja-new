import React, { useEffect, useRef } from 'react';

export default function ElasticCursor() {
  const cursor = useRef(null);
  const dot = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ring = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const previous = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const raf = useRef(null);
  const running = useRef(false);

  useEffect(() => {
    const move = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }
      if (!running.current) {
        running.current = true;
        raf.current = requestAnimationFrame(tick);
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

      const settled = Math.hypot(mouse.current.x - ring.current.x, mouse.current.y - ring.current.y) < 0.35
        && Math.hypot(dx, dy) < 0.08;
      if (settled) {
        running.current = false;
        return;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', move);

    return () => {
      window.removeEventListener('mousemove', move);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={cursor} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  );
}
