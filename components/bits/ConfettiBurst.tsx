'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  /** Particles to emit. Default 80. */
  count?: number;
  /** Maximum radial distance in px. Default 320. */
  radius?: number;
  /** Animation lifetime in seconds. Default 1.6. */
  duration?: number;
};

const HUES = [
  '--color-confetti-magenta',
  '--color-confetti-yellow',
  '--color-confetti-cyan',
  '--color-confetti-lime',
  '--color-confetti-violet',
];

/**
 * One-shot radial confetti burst from the host's center. Particles emit
 * outward with gravity + rotation. Designed for the candle blow-out and
 * the Celebration finale.
 */
export default function ConfettiBurst({
  count = 80,
  radius = 320,
  duration = 1.6,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced) return;
      const host = root.current;
      if (!host) return;

      for (let i = 0; i < count; i += 1) {
        const piece = document.createElement('span');
        const hue = HUES[Math.floor(Math.random() * HUES.length)];
        const w = 6 + Math.random() * 8;
        const h = 10 + Math.random() * 14;
        piece.className = 'confetti-burst-piece';
        piece.style.width = `${w}px`;
        piece.style.height = `${h}px`;
        piece.style.background = `var(${hue})`;
        host.appendChild(piece);

        const angle = Math.random() * Math.PI * 2;
        const dist = radius * (0.4 + Math.random() * 0.6);
        const dx = Math.cos(angle) * dist;
        const dy0 = Math.sin(angle) * dist * 0.6;
        const dyFall = 200 + Math.random() * 200;
        const rot = (Math.random() - 0.5) * 1080;

        gsap.fromTo(
          piece,
          { x: 0, y: 0, rotation: 0, opacity: 1 },
          {
            x: dx,
            y: dy0 + dyFall,
            rotation: rot,
            opacity: 0,
            duration: duration + Math.random() * 0.5,
            ease: 'power2.out',
            onComplete: () => piece.remove(),
          },
        );
      }
    },
    { scope: root, dependencies: [count, radius, duration, reduced] },
  );

  return (
    <div
      ref={root}
      aria-hidden
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 9,
      }}
    >
      <style>{`
        .confetti-burst-piece {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 2px;
          transform-origin: center;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
