'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  /** Particles per batch (re-spawned in a loop). Default 60. */
  count?: number;
  /** Total lifetime of each batch in seconds. Default 6. */
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
 * Confetti rain — continuous particles falling with gravity + rotation.
 * Spawns `count` particles at the top of the viewport, each with random
 * horizontal drift, fall duration, and rotation. Looped forever.
 */
export default function ConfettiRain({ count = 60, duration = 6 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced) return;
      const host = root.current;
      if (!host) return;

      const spawn = () => {
        for (let i = 0; i < count; i += 1) {
          const piece = document.createElement('span');
          const hue = HUES[Math.floor(Math.random() * HUES.length)];
          const startX = Math.random() * 100;
          const w = 6 + Math.random() * 6;
          const h = 10 + Math.random() * 10;
          piece.className = 'confetti-piece';
          piece.style.left = `${startX}vw`;
          piece.style.top = `-${h}px`;
          piece.style.width = `${w}px`;
          piece.style.height = `${h}px`;
          piece.style.background = `var(${hue})`;
          host.appendChild(piece);

          const dx = (Math.random() - 0.5) * 240;
          const rot = (Math.random() - 0.5) * 720;
          const fallDur = duration + Math.random() * 3;

          gsap.to(piece, {
            y: `110vh`,
            x: `+=${dx}`,
            rotation: rot,
            opacity: 1,
            duration: fallDur,
            ease: 'power1.in',
            delay: Math.random() * 2,
            onComplete: () => piece.remove(),
          });
        }
      };

      spawn();
      const id = window.setInterval(spawn, duration * 1000 * 0.6);
      return () => window.clearInterval(id);
    },
    { scope: root, dependencies: [count, duration, reduced] },
  );

  return (
    <div
      ref={root}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <style>{`
        .confetti-piece {
          position: absolute;
          border-radius: 2px;
          transform-origin: center;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
