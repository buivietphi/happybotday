'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  children: ReactNode;
  /** Number of sparkle particles per burst. Default 8. */
  count?: number;
  /** Maximum travel distance in px. Default 40. */
  spread?: number;
  /** Sparkle hue CSS variable. Default --color-confetti-yellow. */
  hueVar?: string;
};

/**
 * Click-coord sparkle burst. Wraps children; on click anywhere inside, fires
 * a radial sparkle from the click point.
 */
export default function Sparkle({
  children,
  count = 8,
  spread = 40,
  hueVar = '--color-confetti-yellow',
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced) return;
      const host = root.current;
      if (!host) return;

      const onClick = (e: MouseEvent) => {
        const rect = host.getBoundingClientRect();
        const ox = e.clientX - rect.left;
        const oy = e.clientY - rect.top;
        for (let i = 0; i < count; i += 1) {
          const angle = (Math.PI * 2 * i) / count;
          const dist = spread * (0.7 + Math.random() * 0.3);
          const dx = Math.cos(angle) * dist;
          const dy = Math.sin(angle) * dist;
          const p = document.createElement('span');
          p.className = 'sparkle-dot';
          p.style.left = `${ox}px`;
          p.style.top = `${oy}px`;
          p.style.setProperty('--dx', `${dx}px`);
          p.style.setProperty('--dy', `${dy}px`);
          p.style.setProperty('--sparkle-hue', `var(${hueVar})`);
          host.appendChild(p);
          gsap.to(p, {
            x: dx,
            y: dy,
            scale: 0.2,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            onComplete: () => p.remove(),
          });
        }
      };

      host.addEventListener('click', onClick);
      return () => host.removeEventListener('click', onClick);
    },
    { scope: root, dependencies: [count, spread, reduced, hueVar] },
  );

  return (
    <div
      ref={root}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <style>{`
        .sparkle-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--sparkle-hue, var(--color-confetti-yellow));
          box-shadow: 0 0 8px var(--sparkle-hue, var(--color-confetti-yellow));
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
      `}</style>
      {children}
    </div>
  );
}
