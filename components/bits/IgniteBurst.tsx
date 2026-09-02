'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  /** Auto-play the burst on mount. Default true. */
  autoPlay?: boolean;
};

/**
 * Ignite burst — a brief radial flash + sparkle particles that play when a
 * candle first catches flame. Renders at the parent position (typically
 * placed at the wick top of the candle being lit).
 *
 * The flash expands and fades; sparkles shoot outward and fade. Total
 * duration ~0.6s — short enough to layer over the candle-lighting chain
 * without overwhelming the choreography.
 */
export default function IgniteBurst({ autoPlay = true }: Props) {
  const root = useRef<SVGGElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced || !autoPlay) return;
      const flash = root.current?.querySelector('[data-flash]');
      const ring = root.current?.querySelector('[data-ring]');
      const sparkles = root.current?.querySelectorAll('[data-spark]');
      if (!flash || !ring) return;

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      // Inner flash — bright, quick bloom upward
      tl.fromTo(
        flash,
        { opacity: 0, scaleY: 0.2, scaleX: 0.6 },
        { opacity: 1, scaleY: 1.4, scaleX: 1.1, duration: 0.18, ease: 'power3.out' },
        0,
      );
      tl.to(
        flash,
        { opacity: 0, scaleY: 1.8, scaleX: 1.4, duration: 0.42, ease: 'power1.out' },
        0.18,
      );
      // Outer ring — radial glow burst
      tl.fromTo(
        ring,
        { opacity: 0.85, scale: 0.2 },
        { opacity: 0, scale: 2.2, duration: 0.55, ease: 'power2.out' },
        0.04,
      );
      // Sparkles — shoot outward
      if (sparkles && sparkles.length) {
        sparkles.forEach((sp, i) => {
          const angle = (i / sparkles.length) * Math.PI * 2;
          const distance = 18 + (i % 3) * 4;
          tl.fromTo(
            sp,
            { opacity: 1, x: 0, y: 0, scale: 1 },
            {
              opacity: 0,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 6,
              scale: 0.4,
              duration: 0.5,
              ease: 'power2.out',
            },
            0.05 + i * 0.012,
          );
        });
      }
    },
    { scope: root, dependencies: [autoPlay, reduced] },
  );

  return (
    <g ref={root}>
      {/* Inner bright flash (vertical bloom) */}
      <g
        data-flash
        style={{
          transformOrigin: '0px -56px',
          transformBox: 'fill-box',
          opacity: 0,
        }}
      >
        <ellipse cx="0" cy="-62" rx="5" ry="11" fill="oklch(99% 0.04 90)" />
        <ellipse cx="0" cy="-62" rx="3.5" ry="9" fill="var(--color-flame-core)" />
      </g>

      {/* Outer radial ring */}
      <circle
        data-ring
        cx="0"
        cy="-56"
        r="14"
        fill="var(--color-flame-glow)"
        opacity="0"
        style={{
          transformOrigin: '0px -56px',
          transformBox: 'fill-box',
        }}
      />

      {/* Sparkles */}
      <g data-sparkles>
        <circle data-spark cx="0" cy="-56" r="1.4" fill="oklch(99% 0.04 90)" opacity="0" />
        <circle data-spark cx="0" cy="-56" r="1.1" fill="oklch(99% 0.04 90)" opacity="0" />
        <circle data-spark cx="0" cy="-56" r="1.6" fill="var(--color-flame-core)" opacity="0" />
        <circle data-spark cx="0" cy="-56" r="1.2" fill="oklch(99% 0.04 90)" opacity="0" />
        <circle data-spark cx="0" cy="-56" r="1.3" fill="var(--color-flame-core)" opacity="0" />
        <circle data-spark cx="0" cy="-56" r="1.0" fill="oklch(99% 0.04 90)" opacity="0" />
        <circle data-spark cx="0" cy="-56" r="1.5" fill="var(--color-flame-core)" opacity="0" />
        <circle data-spark cx="0" cy="-56" r="1.1" fill="oklch(99% 0.04 90)" opacity="0" />
      </g>
    </g>
  );
}
