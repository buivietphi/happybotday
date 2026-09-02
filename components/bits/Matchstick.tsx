'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  /** Total height in px (defaults to 200). Matchstick scales to fit. */
  size?: number;
  /** When false, the flame is hidden (unlit matchstick). */
  lit?: boolean;
  /** Random phase offset so multiple matches don't sync. */
  phaseOffset?: number;
  className?: string;
};

/**
 * Ultra-premium vector Matchstick:
 *
 * Anatomy:
 *   - 3D Beveled Wooden Stick: Natural pine grain with highlight & shadow bevels.
 *   - Charred Wood Transition: Burnt carbon tip with pulsing hot orange-red embers (when lit).
 *   - 3D Sulfur Match Head: Glossy teardrop bulb centered at (20, 15).
 *   - Multi-layered Fire: Anchored at translate(20, 15) with transformOrigin: "0px 0px" to embrace the match head seamlessly.
 *   - Floating micro-sparks (Sparks_match) drifting upward and twinkling.
 *
 * Coordinate system:
 *   - viewBox: "-30 -55 100 230"
 *   - Match head center: (20, 15)
 *   - Head tip: (20, 7)
 *   - Stick reaches down to y = 160
 */
export default function Matchstick({
  size = 200,
  lit = true,
  phaseOffset = 0,
  className,
}: Props) {
  const root = useRef<SVGSVGElement>(null);
  const flameRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const emberPulseRef = useRef<SVGEllipseElement>(null);
  const spark1Ref = useRef<SVGCircleElement>(null);
  const spark2Ref = useRef<SVGCircleElement>(null);
  const spark3Ref = useRef<SVGCircleElement>(null);
  const spark4Ref = useRef<SVGCircleElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced || !lit) return;
      const f = flameRef.current;
      const g = glowRef.current;
      const ember = emberPulseRef.current;
      if (!f || !g) return;

      const pOffset = phaseOffset * 0.05;

      // 1. Ignition bloom pop when match is touched / lit
      const tl = gsap.timeline();

      tl.fromTo(
        f,
        { scaleY: 0.2, scaleX: 0.2, opacity: 0 },
        {
          scaleY: 1,
          scaleX: 1,
          opacity: 1,
          duration: 0.25,
          ease: 'back.out(2)',
          transformOrigin: '0px 0px',
        },
      );

      // 2. Continuous flame flickering & dancing anchored at (0px 0px)
      tl.add(() => {
        gsap.to(f, {
          scaleY: 1.12,
          scaleX: 1.05,
          duration: 0.36,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '0px 0px',
          delay: pOffset,
        });
      });

      // Halo breathing via SVG radius + opacity (zero displacement)
      gsap.fromTo(
        g,
        { opacity: 0, attr: { r: 15 } },
        {
          opacity: 0.85,
          attr: { r: 38 },
          duration: 0.28,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(g, {
              opacity: 0.65,
              attr: { r: 42 },
              duration: 0.48,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
              delay: pOffset,
            });
          },
        },
      );

      // Charred wood glowing ember pulse
      if (ember) {
        gsap.to(ember, {
          opacity: 0.9,
          scaleX: 1.25,
          scaleY: 1.2,
          duration: 0.42,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '20px 22px',
          delay: 0.25,
        });
      }

      // Micro floating sparks drifting and twinkling upwards
      if (spark1Ref.current) {
        gsap.to(spark1Ref.current, {
          y: -42,
          x: -6,
          opacity: 0,
          scale: 0.2,
          duration: 0.85,
          repeat: -1,
          ease: 'power1.out',
          delay: 0.2 + pOffset,
        });
      }
      if (spark2Ref.current) {
        gsap.to(spark2Ref.current, {
          y: -48,
          x: 7,
          opacity: 0,
          scale: 0.2,
          duration: 1.05,
          repeat: -1,
          ease: 'power1.out',
          delay: 0.55 + pOffset,
        });
      }
      if (spark3Ref.current) {
        gsap.to(spark3Ref.current, {
          y: -36,
          x: 2,
          opacity: 0,
          scale: 0.3,
          duration: 0.72,
          repeat: -1,
          ease: 'power1.out',
          delay: 0.85 + pOffset,
        });
      }
      if (spark4Ref.current) {
        gsap.to(spark4Ref.current, {
          y: -44,
          x: -4,
          opacity: 0,
          scale: 0.25,
          duration: 0.95,
          repeat: -1,
          ease: 'power1.out',
          delay: 0.4 + pOffset,
        });
      }
    },
    { scope: root, dependencies: [lit, reduced, phaseOffset] },
  );

  const w = (size * 100) / 230;
  const h = size;

  return (
    <svg
      ref={root}
      width={w}
      height={h}
      viewBox="-30 -55 100 230"
      className={className}
      aria-hidden
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Wood stick gradient — pale honey birch wood */}
        <linearGradient id="ms-wood-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="35%" stopColor="#fde68a" />
          <stop offset="85%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Charred wood burnt transition gradient */}
        <linearGradient id="ms-charred" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1917" />
          <stop offset="35%" stopColor="#292524" />
          <stop offset="70%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </linearGradient>

        {/* 3D Sulfur Match Head Gradient (Glossy Red Bulb) */}
        <radialGradient id="ms-head-3d" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="70%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>

        {/* Outer flame gradient */}
        <radialGradient id="ms-flame-outer" cx="0.5" cy="0.8" r="0.8">
          <stop offset="0%" stopColor="oklch(99% 0.04 90)" />
          <stop offset="40%" stopColor="oklch(84% 0.20 65)" />
          <stop offset="75%" stopColor="oklch(68% 0.24 45)" />
          <stop offset="100%" stopColor="oklch(55% 0.22 35 / 0.1)" />
        </radialGradient>

        {/* Inner flame core gradient */}
        <linearGradient id="ms-flame-inner" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(96% 0.12 88)" />
          <stop offset="50%" stopColor="oklch(92% 0.16 92)" />
          <stop offset="100%" stopColor="oklch(99% 0.02 90)" />
        </linearGradient>

        {/* Halo glow gradient */}
        <radialGradient id="ms-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(95% 0.14 85 / 0.85)" />
          <stop offset="35%" stopColor="oklch(80% 0.20 60 / 0.45)" />
          <stop offset="70%" stopColor="oklch(65% 0.22 40 / 0.15)" />
          <stop offset="100%" stopColor="oklch(60% 0.20 40 / 0)" />
        </radialGradient>

        {/* Blue base gradient */}
        <radialGradient id="ms-blue-base" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(75% 0.18 235 / 0.85)" />
          <stop offset="60%" stopColor="oklch(60% 0.22 255 / 0.45)" />
          <stop offset="100%" stopColor="oklch(50% 0.22 265 / 0)" />
        </radialGradient>

        {/* Soft shadow */}
        <filter id="ms-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* === WOODEN MATCHSTICK BODY === */}
      <g filter="url(#ms-shadow)">
        {/* Main Wood Stem */}
        <rect
          x="16.5"
          y="15"
          width="7"
          height="145"
          rx="2"
          fill="url(#ms-wood-body)"
        />

        {/* Left edge bevel highlight (gives 3D cylindrical/square depth) */}
        <rect
          x="16.5"
          y="15"
          width="1.8"
          height="144"
          rx="1"
          fill="#fffbeb"
          opacity="0.7"
        />

        {/* Right edge shadow bevel */}
        <rect
          x="21.7"
          y="15"
          width="1.8"
          height="144"
          rx="1"
          fill="#78350f"
          opacity="0.45"
        />

        {/* Delicate natural wood grain fibers */}
        <line x1="19" y1="35" x2="19" y2="148" stroke="#d97706" strokeWidth="0.6" opacity="0.35" />
        <line x1="20.5" y1="45" x2="20.5" y2="135" stroke="#b45309" strokeWidth="0.5" opacity="0.25" />

        {/* === Charred Burnt Wood Zone (shows when lit) === */}
        {lit && (
          <rect
            x="16.5"
            y="15"
            width="7"
            height="28"
            rx="1"
            fill="url(#ms-charred)"
          />
        )}

        {/* Glowing Ember in Charred Wood */}
        {lit && (
          <g>
            <ellipse
              ref={emberPulseRef}
              cx="20"
              cy="22"
              rx="2.8"
              ry="4.5"
              fill="oklch(75% 0.22 45)"
              opacity="0.75"
            />
            <circle cx="19.5" cy="20" r="1.2" fill="#ffedd5" opacity="0.9" />
          </g>
        )}

        {/* === 3D SULFUR MATCH HEAD BULB === */}
        {/* Sulfur Bulb Shape */}
        <path
          d="M 20 7
             C 14.5 7, 13.5 12, 14 16
             C 14.5 20, 17 23, 20 23
             C 23 23, 25.5 20, 26 16
             C 26.5 12, 25.5 7, 20 7 Z"
          fill="url(#ms-head-3d)"
        />

        {/* Glossy specular highlight on top-left of head */}
        <ellipse
          cx="18"
          cy="11"
          rx="2.2"
          ry="3.2"
          fill="#ffffff"
          opacity="0.75"
          transform="rotate(-20 18 11)"
        />
        <circle cx="17.2" cy="9.5" r="0.8" fill="#ffffff" opacity="0.9" />
      </g>

      {/* === ANIMATED MATCHSTICK FLAME (Anchored at match head center 20, 15) === */}
      {lit && (
        <g transform="translate(20, 15)" style={{ pointerEvents: 'none' }}>
          {/* Halo glow behind flame — centered at y = -18 (in middle of flame body) */}
          <circle
            ref={glowRef}
            cx="0"
            cy="-18"
            r="38"
            fill="url(#ms-halo)"
            opacity="0.8"
          />

          {/* Flame group */}
          <g ref={flameRef} style={{ transformOrigin: '0px 0px' }}>
            {/* Blue oxygen combustion base hugging the sulfur head */}
            <ellipse
              cx="0"
              cy="0"
              rx="7"
              ry="5.5"
              fill="url(#ms-blue-base)"
            />

            {/* Outer flame — rich leaping teardrop embracing the head */}
            <path
              d="M 0 5
                 C -12 1, -16 -14, -14 -30
                 C -11 -46, -3 -54, 0 -58
                 C 3 -54, 11 -46, 14 -30
                 C 16 -14, 12 1, 0 5 Z"
              fill="url(#ms-flame-outer)"
            />

            {/* Mid flame — warm amber body */}
            <path
              d="M 0 2
                 C -9 -2, -12 -14, -10 -27
                 C -8 -40, -2 -47, 0 -50
                 C 2 -47, 8 -40, 10 -27
                 C 12 -14, 9 -2, 0 2 Z"
              fill="var(--color-flame, oklch(78% 0.20 60))"
            />

            {/* Inner core — glowing golden-yellow heart */}
            <path
              d="M 0 -1
                 C -7 -5, -9 -14, -8 -23
                 C -6 -32, -2 -39, 0 -42
                 C 2 -39, 6 -32, 8 -23
                 C 9 -14, 7 -5, 0 -1 Z"
              fill="url(#ms-flame-inner)"
            />

            {/* White-hot center hotspot */}
            <ellipse
              cx="0"
              cy="-22"
              rx="2.6"
              ry="7"
              fill="oklch(99% 0.02 95)"
              opacity="0.95"
            />
            <ellipse
              cx="0"
              cy="-12"
              rx="3.6"
              ry="5"
              fill="oklch(98% 0.08 90)"
              opacity="0.85"
            />

            {/* Floating micro-sparks (Sparks_match) */}
            <circle
              ref={spark1Ref}
              cx="-1"
              cy="-40"
              r="1.5"
              fill="oklch(99% 0.06 90)"
              opacity="0.85"
            />
            <circle
              ref={spark2Ref}
              cx="2"
              cy="-46"
              r="1.3"
              fill="oklch(95% 0.16 70)"
              opacity="0.8"
            />
            <circle
              ref={spark3Ref}
              cx="0"
              cy="-34"
              r="1.1"
              fill="oklch(98% 0.12 85)"
              opacity="0.75"
            />
            <circle
              ref={spark4Ref}
              cx="-2"
              cy="-28"
              r="1.2"
              fill="oklch(95% 0.18 55)"
              opacity="0.8"
            />
          </g>
        </g>
      )}
    </svg>
  );
}
