'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  /** Horizontal drift direction / amount (e.g. +15 for rightward wind, -15 for leftward). */
  xDrift?: number;
  /** Auto-play animation after mount. Default true. */
  autoPlay?: boolean;
};

/**
 * Smoke wisp — stylized billowing smoke curls inspired by the MeLy Birthday Rive animation.
 * Billows upward from the wick tip (y = -52 relative to CANDLE_BASE_Y) upon being blown out.
 */
export default function SmokeWisp({ xDrift = -12, autoPlay = true }: Props) {
  const root = useRef<SVGGElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced || !autoPlay || !root.current) return;
      const el = root.current;
      const puffs = el.querySelectorAll('[data-smoke-puff]');
      const trail = el.querySelector('[data-smoke-trail]');

      const tl = gsap.timeline();

      // Main smoke billow trail
      if (trail) {
        tl.fromTo(
          trail,
          { opacity: 0.8, scaleY: 0.3, scaleX: 0.4, y: 0, x: 0 },
          {
            opacity: 0,
            scaleY: 2.2,
            scaleX: 1.8,
            y: -65,
            x: xDrift * 1.8,
            duration: 1.6,
            ease: 'power1.out',
            transformOrigin: '0px -52px',
          },
          0,
        );
      }

      // Individual staggered smoke bubbles drifting and expanding
      puffs.forEach((puff, i) => {
        const delay = i * 0.08;
        const drift = xDrift * (1 + i * 0.4);
        const yRise = -45 - i * 14;

        tl.fromTo(
          puff,
          { opacity: 0.75 - i * 0.1, scale: 0.3, x: 0, y: 0 },
          {
            opacity: 0,
            scale: 1.6 + i * 0.3,
            x: drift,
            y: yRise,
            duration: 1.5 + i * 0.2,
            ease: 'power2.out',
          },
          delay,
        );
      });
    },
    { scope: root, dependencies: [xDrift, reduced, autoPlay] },
  );

  return (
    <g ref={root} style={{ pointerEvents: 'none' }}>
      {/* S-curve smoke plume trail */}
      <path
        data-smoke-trail
        d="M 0 -52
           Q -4 -64, 2 -78
           T 4 -98
           Q -2 -112, 6 -128"
        fill="none"
        stroke="oklch(90% 0.015 220 / 0.55)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Billowing smoke puffs */}
      <circle
        data-smoke-puff
        cx="0"
        cy="-54"
        r="3.6"
        fill="oklch(92% 0.015 220 / 0.65)"
      />
      <circle
        data-smoke-puff
        cx="-2"
        cy="-60"
        r="4.2"
        fill="oklch(90% 0.015 220 / 0.55)"
      />
      <circle
        data-smoke-puff
        cx="3"
        cy="-68"
        r="5.0"
        fill="oklch(88% 0.015 220 / 0.45)"
      />
      <circle
        data-smoke-puff
        cx="-1"
        cy="-78"
        r="5.8"
        fill="oklch(86% 0.015 220 / 0.35)"
      />
      <circle
        data-smoke-puff
        cx="4"
        cy="-90"
        r="6.5"
        fill="oklch(84% 0.015 220 / 0.25)"
      />
    </g>
  );
}
