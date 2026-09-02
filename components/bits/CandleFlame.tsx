'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  /** 'lit' (default) renders the flame + glow; 'extinguished' hides both. */
  state?: 'lit' | 'extinguished';
  /** Random offset to desync multiple flames. Default 0. */
  phaseOffset?: number;
};

/**
 * Animated candle flame & ambient glow halo.
 *
 * Geometry:
 *   - Static wrapper at translate(0, -54) [cat candle wick tip].
 *   - Flame base at (0, 0), tip at (0, -38).
 *   - Glow halo at (0, -19) [exact middle of flame body], breathing via SVG radius `r` + opacity.
 *   - Zero displacement, rock solid attachment behind the flame.
 */
export default function CandleFlame({
  state = 'lit',
  phaseOffset = 0,
}: Props) {
  const root = useRef<SVGGElement>(null);
  const flameRef = useRef<SVGGElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const hotspotRef = useRef<SVGEllipseElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const reduced = useReducedMotionSafe();

  const isLit = state === 'lit';

  useGSAP(
    () => {
      if (reduced || !isLit) return;
      const f = flameRef.current;
      const core = coreRef.current;
      const hs = hotspotRef.current;
      const g = glowRef.current;
      if (!f || !g) return;

      const pOffset = phaseOffset * 0.08;

      // Master entrance + loop sequence for flame
      const tl = gsap.timeline();

      // 1. Entrance bloom from wick tip (0px 0px) to full scale
      tl.fromTo(
        f,
        { scaleY: 0.2, scaleX: 0.2, opacity: 0 },
        {
          scaleY: 1,
          scaleX: 1,
          opacity: 1,
          duration: 0.26,
          ease: 'back.out(1.8)',
          transformOrigin: '0px 0px',
        },
      );

      // 2. Continuous steady vertical fire breathing loop (starts AFTER entrance bloom)
      tl.add(() => {
        gsap.to(f, {
          scaleY: 1.06,
          scaleX: 0.98,
          duration: 0.38,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '0px 0px',
          delay: pOffset,
        });
      });

      // Halo breathing directly behind flame center (0, -19) via SVG radius + opacity (zero displacement)
      gsap.fromTo(
        g,
        { opacity: 0, attr: { r: 10 } },
        {
          opacity: 0.85,
          attr: { r: 26 },
          duration: 0.28,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(g, {
              opacity: 0.65,
              attr: { r: 29 },
              duration: 0.48,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
              delay: pOffset,
            });
          },
        },
      );

      // Inner core shimmering pulse
      if (core) {
        gsap.to(core, {
          scaleY: 1.10,
          opacity: 0.95,
          duration: 0.32,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '0px 0px',
          delay: 0.26 + pOffset,
        });
      }

      // Hotspot glow pulse
      if (hs) {
        gsap.to(hs, {
          scale: 1.15,
          opacity: 1,
          duration: 0.28,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '0px -11px',
          delay: 0.26 + pOffset,
        });
      }
    },
    { scope: root, dependencies: [isLit, reduced, phaseOffset] },
  );

  return (
    <g ref={root}>
      <defs>
        {/* Soft radial glow halo */}
        <radialGradient id={`cf-halo-${phaseOffset}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(96% 0.16 85 / 0.85)" />
          <stop offset="35%" stopColor="oklch(82% 0.22 65 / 0.45)" />
          <stop offset="70%" stopColor="oklch(68% 0.24 45 / 0.15)" />
          <stop offset="100%" stopColor="oklch(60% 0.20 40 / 0)" />
        </radialGradient>

        {/* Outer flame gradient */}
        <radialGradient id={`cf-flame-outer-${phaseOffset}`} cx="0.5" cy="0.8" r="0.8">
          <stop offset="0%" stopColor="oklch(99% 0.05 90)" />
          <stop offset="35%" stopColor="oklch(84% 0.20 70)" />
          <stop offset="70%" stopColor="oklch(70% 0.24 50)" />
          <stop offset="100%" stopColor="oklch(58% 0.22 35 / 0.2)" />
        </radialGradient>

        {/* Inner flame core gradient */}
        <linearGradient id={`cf-flame-inner-${phaseOffset}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(98% 0.12 88)" />
          <stop offset="50%" stopColor="oklch(94% 0.16 92)" />
          <stop offset="100%" stopColor="oklch(99% 0.02 95)" />
        </linearGradient>

        {/* Blue base gradient */}
        <radialGradient id={`cf-blue-base-${phaseOffset}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(75% 0.18 240 / 0.85)" />
          <stop offset="60%" stopColor="oklch(60% 0.22 255 / 0.45)" />
          <stop offset="100%" stopColor="oklch(50% 0.22 265 / 0)" />
        </radialGradient>
      </defs>

      {/* Static positioning group at wick tip (y = -54 relative to candle base) */}
      <g transform="translate(0, -54)" style={{ pointerEvents: 'none' }}>
        {/* Glow halo placed directly behind the center of the flame at y = -19 */}
        {isLit && (
          <circle
            ref={glowRef}
            data-glow
            cx="0"
            cy="-19"
            r="26"
            fill={`url(#cf-halo-${phaseOffset})`}
            opacity="0.8"
          />
        )}

        {/* Animated flame group */}
        {isLit && (
          <g
            ref={flameRef}
            data-flame
            style={{ transformOrigin: '0px 0px' }}
          >
            {/* Blue oxygen combustion base hugging wick tip */}
            <ellipse
              cx="0"
              cy="0"
              rx="3.6"
              ry="2.4"
              fill={`url(#cf-blue-base-${phaseOffset})`}
            />

            {/* Outer teardrop flame (base at 0, 0; tip at 0, -38) */}
            <path
              d="M 0 0
                 C -6 -4, -8 -11, -7 -20
                 C -6 -28, -2 -34, 0 -38
                 C 2 -34, 6 -28, 7 -20
                 C 8 -11, 6 -4, 0 0 Z"
              fill={`url(#cf-flame-outer-${phaseOffset})`}
            />

            {/* Mid flame — warm amber body */}
            <path
              d="M 0 -1
                 C -4 -4, -5 -10, -4.5 -17
                 C -4 -24, -1 -30, 0 -34
                 C 1 -30, 4 -24, 4.5 -17
                 C 5 -10, 4 -4, 0 -1 Z"
              fill="var(--color-flame, oklch(78% 0.20 60))"
            />

            {/* Inner core — glowing golden-white heart */}
            <path
              ref={coreRef}
              d="M 0 -2
                 C -2.8 -4, -3.5 -8, -3 -13
                 C -2.4 -18, -1 -24, 0 -27
                 C 1 -24, 2.4 -18, 3 -13
                 C 3.5 -8, 2.8 -4, 0 -2 Z"
              fill={`url(#cf-flame-inner-${phaseOffset})`}
            />

            {/* White-hot center hotspot */}
            <ellipse
              ref={hotspotRef}
              cx="0"
              cy="-11"
              rx="1.5"
              ry="4.2"
              fill="oklch(99% 0.02 95)"
              opacity="0.95"
            />
            <ellipse
              cx="0"
              cy="-5"
              rx="2.2"
              ry="2.8"
              fill="oklch(98% 0.08 90)"
              opacity="0.85"
            />
          </g>
        )}
      </g>
    </g>
  );
}
