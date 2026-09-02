'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  /** Number of hearts to spawn. */
  count?: number;
  /** Animation duration in seconds for a full rise + fade. */
  duration?: number;
  /** When false, hearts are static (no animation). */
  playing?: boolean;
  className?: string;
};

/**
 * FloatingHearts — a column of small pink hearts that rise and fade.
 *
 * Each heart is a small SVG path with a randomized x-offset, drift,
 * rotation, and stagger. Pure CSS-driven via the `hearts-rise`
 * keyframes plus staggered animation-delay. No JS RAF — cheap and
 * perfect for ambient love theme.
 */
export default function FloatingHearts({
  count = 8,
  duration = 4.2,
  playing = true,
  className,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced || !playing) return;
      const els = root.current?.querySelectorAll<HTMLElement>('[data-heart]');
      if (!els || els.length === 0) return;
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0, scale: 0.6 },
          {
            y: -260 - Math.random() * 60,
            opacity: 1,
            scale: 0.9 + Math.random() * 0.4,
            rotation: -10 + Math.random() * 20,
            duration: duration + Math.random() * 1.2,
            ease: 'power1.out',
            repeat: -1,
            delay: i * 0.45,
          },
        );
      });
    },
    { scope: root, dependencies: [playing, reduced, duration] },
  );

  const hearts = Array.from({ length: count }, (_, i) => ({
    key: i,
    left: 30 + ((i * 47) % 50) + Math.random() * 6,
    color: i % 3 === 0
      ? 'var(--color-accent)'
      : i % 3 === 1
        ? 'var(--color-accent-deep)'
        : 'var(--color-accent-soft)',
    size: 14 + ((i * 7) % 10),
  }));

  return (
    <div
      ref={root}
      className={className}
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '38%',
        height: 280,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {hearts.map((h) => (
        <svg
          key={h.key}
          data-heart
          width={h.size}
          height={h.size}
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            left: `${h.left}%`,
            bottom: 0,
            transform: 'translate(-50%, 0)',
            opacity: 0,
            filter: 'drop-shadow(0 4px 8px oklch(22% 0.06 295 / 0.18))',
          }}
        >
          <path
            d="M 12 21 C 5 16, 1 11, 4 6 C 7 2, 11 4, 12 7 C 13 4, 17 2, 20 6 C 23 11, 19 16, 12 21 Z"
            fill={h.color}
          />
        </svg>
      ))}
    </div>
  );
}
