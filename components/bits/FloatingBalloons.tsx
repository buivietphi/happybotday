'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  count?: number;
  /** Override hue list (CSS variable names). Cycles through. */
  hues?: string[];
};

const DEFAULT_HUES = [
  '--color-balloon-1',
  '--color-balloon-2',
  '--color-balloon-3',
  '--color-balloon-4',
  '--color-balloon-5',
];

/**
 * Floating balloons rising from the bottom of the viewport with gentle sway.
 * Continuous loop — each balloon re-rises after clearing the top.
 */
export default function FloatingBalloons({
  count = 10,
  hues = DEFAULT_HUES,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced) return;
      const balloons = root.current?.querySelectorAll<HTMLElement>('[data-balloon]');
      if (!balloons || balloons.length === 0) return;

      balloons.forEach((b, i) => {
        const dur = 10 + Math.random() * 6; // 10–16s rise
        const swayDur = 2.5 + Math.random() * 1.5;
        const swayAmp = 18 + Math.random() * 18;
        const startX = parseFloat(b.dataset.x ?? '50');
        const delay = (dur / balloons.length) * i; // stagger entries

        gsap.set(b, { x: `${startX}vw`, y: '110vh' });

        gsap.to(b, {
          y: '-20vh',
          duration: dur,
          delay,
          ease: 'none',
          repeat: -1,
          modifiers: {
            y: gsap.utils.unitize((y) => {
              // wrap around so balloon re-enters from bottom
              if (parseFloat(y) < -20) return '110';
              return y;
            }),
          },
        });

        gsap.to(b, {
          x: `+=${swayAmp}`,
          duration: swayDur,
          delay,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    },
    { scope: root, dependencies: [count, reduced] },
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
        zIndex: 1,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const xPct = (100 / (count + 1)) * (i + 1);
        const hue = hues[i % hues.length];
        return (
          <div
            key={i}
            data-balloon
            data-x={xPct}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 48,
              height: 64,
              willChange: 'transform',
            }}
          >
            <svg viewBox="0 0 48 64" width="48" height="64">
              {/* balloon body */}
              <ellipse
                cx="24"
                cy="24"
                rx="18"
                ry="22"
                fill={`var(${hue})`}
              />
              {/* highlight */}
              <ellipse
                cx="18"
                cy="18"
                rx="4"
                ry="6"
                fill="oklch(98% 0.008 80 / 0.45)"
              />
              {/* knot */}
              <polygon
                points="22,46 26,46 24,50"
                fill={`var(${hue})`}
              />
              {/* string */}
              <line
                x1="24"
                y1="50"
                x2="24"
                y2="62"
                stroke="var(--color-text-soft)"
                strokeWidth="1"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
