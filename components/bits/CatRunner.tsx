'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap } from 'gsap';

export type CatBehavior =
  | 'run'
  | 'walk'
  | 'jump'
  | 'sit'
  | 'scratch'
  | 'sleep'
  | 'stretch'
  | 'idle';

type FurColor = 'orange' | 'black' | 'white' | 'gray' | 'ginger';

type Props = {
  /** Fur color token name. */
  fur?: FurColor;
  /** Initial scale (px). 1 = 200px tall. */
  scale?: number;
  /** Facing direction. 'right' faces east (default), 'left' faces west. */
  facing?: 'left' | 'right';
};

const FUR: Record<FurColor, {
  body: string;
  bodyShadow: string;
  ear: string;
  innerEar: string;
  belly: string;
  accent: string;
  /** dark stripe accents for tabby cats */
  stripes?: string;
}> = {
  orange: {
    body: 'oklch(74% 0.13 50)',
    bodyShadow: 'oklch(58% 0.10 40)',
    ear: 'oklch(74% 0.13 50)',
    innerEar: 'oklch(86% 0.10 25)',
    belly: 'oklch(92% 0.04 80)',
    accent: 'oklch(92% 0.05 80)',
    stripes: 'oklch(48% 0.10 35)',
  },
  black: {
    body: 'oklch(20% 0.02 30)',
    bodyShadow: 'oklch(12% 0.01 30)',
    ear: 'oklch(20% 0.02 30)',
    innerEar: 'oklch(50% 0.06 350)',
    belly: 'oklch(35% 0.02 30)',
    accent: 'oklch(95% 0.005 80)',
  },
  white: {
    body: 'oklch(92% 0.02 80)',
    bodyShadow: 'oklch(78% 0.03 75)',
    ear: 'oklch(92% 0.02 80)',
    innerEar: 'oklch(86% 0.10 350)',
    belly: 'oklch(98% 0.005 80)',
    accent: 'oklch(85% 0.05 350)',
  },
  gray: {
    body: 'oklch(58% 0.05 50)',
    bodyShadow: 'oklch(40% 0.04 50)',
    ear: 'oklch(58% 0.05 50)',
    innerEar: 'oklch(82% 0.05 350)',
    belly: 'oklch(80% 0.03 80)',
    accent: 'oklch(95% 0.005 80)',
    stripes: 'oklch(38% 0.04 50)',
  },
  ginger: {
    body: 'oklch(70% 0.10 25)',
    bodyShadow: 'oklch(54% 0.08 25)',
    ear: 'oklch(70% 0.10 25)',
    innerEar: 'oklch(86% 0.06 25)',
    belly: 'oklch(90% 0.04 70)',
    accent: 'oklch(95% 0.005 80)',
    stripes: 'oklch(45% 0.09 30)',
  },
};

export type CatRunnerHandle = {
  /** Run a single behavior, then idle until next call. Returns the timeline. */
  play: (behavior: CatBehavior) => gsap.core.Timeline;
};

/**
 * CatRunner — an animated SVG cat with a more lifelike anatomy.
 *
 * Improvements over the previous version:
 *   - Bigger, rounder head with proper ear positioning
 *   - Curled tail drawn as a bezier (not a stroke) — looks like a real tail
 *   - Slit pupils (vertical ellipses) — cats have slits, not dots
 *   - Curved whiskers (real cats have slight bends)
 *   - 4 separate legs that gallop diagonally (FL+BR vs FR+BL) instead of
 *     all together, which is what made the old version look mechanical
 *   - Subtle body breathing while running (squash/stretch on bounce)
 *   - Head turns slightly with body movement for momentum
 */
const CatRunner = forwardRef<CatRunnerHandle, Props>(function CatRunner(
  { fur = 'orange', scale = 1, facing = 'right' },
  ref,
) {
  const root = useRef<SVGSVGElement>(null);
  const body = useRef<SVGGElement>(null);
  const tail = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const ears = useRef<SVGGElement>(null);
  const eyes = useRef<SVGGElement>(null);

  // Each leg is its own ref so we can animate diagonal gallop pairs
  const legFL = useRef<SVGGElement>(null); // front-left
  const legFR = useRef<SVGGElement>(null); // front-right
  const legBL = useRef<SVGGElement>(null); // back-left
  const legBR = useRef<SVGGElement>(null); // back-right

  const colors = FUR[fur];
  const baseWidth = 200 * scale;
  const baseHeight = 130 * scale;

  useImperativeHandle(
    ref,
    () => ({
      play(behavior) {
        // Reset all transforms before starting new behavior
        const parts = [body, tail, head, ears, legFL, legFR, legBL, legBR]
          .map((r) => r.current)
          .filter((el): el is SVGGElement => el != null);
        if (parts.length > 0) {
          gsap.set(parts, { clearProps: 'all' });
        }

        const tl = gsap.timeline();
        const T = (target: gsap.TweenTarget, vars: gsap.TweenVars, time: string | number = 0) => {
          if (target == null) return tl;
          // Filter null entries from arrays (gsap.set on a [null, el] array throws).
          const clean = Array.isArray(target) ? target.filter((e) => e != null) : target;
          if (Array.isArray(clean) && clean.length === 0) return tl;
          return tl.to(clean as gsap.TweenTarget, vars, time);
        };

        switch (behavior) {
          case 'run': {
            // Diagonal gallop: FL+BR together, FR+BL together (out of phase)
            const gallop = 0.14;
            const cycles = 6;
            // Body bob (slight up/down with each stride)
            T(body.current, {
              y: '+=5',
              duration: gallop,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: cycles,
            }, 0);
            // Body squash/stretch — subtle, every other stride
            T(body.current, {
              scaleY: 1.04,
              scaleX: 0.97,
              transformOrigin: '50% 100%',
              duration: gallop,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: cycles,
            }, 0);
            // FL+BR — phase A
            T([legFL.current, legBR.current], {
              rotation: 18,
              transformOrigin: '50% 100%',
              duration: gallop,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: cycles,
            }, 0);
            // FR+BL — phase B (offset by half cycle)
            T([legFR.current, legBL.current], {
              rotation: -18,
              transformOrigin: '50% 100%',
              duration: gallop,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: cycles,
            }, 0);
            // Head: small forward nod
            T(head.current, {
              y: '-=3',
              rotation: 4,
              transformOrigin: '50% 100%',
              duration: gallop * 2,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: cycles / 2,
            }, 0);
            // Tail: flicks up while running
            T(tail.current, {
              rotation: 30,
              transformOrigin: '0% 90%',
              duration: 0.4,
              ease: 'power2.out',
            }, 0);
            // Tail tip sway (continuous wave)
            T(tail.current, {
              rotation: -10,
              duration: 0.35,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: 4,
            }, 0.4);
            break;
          }
          case 'walk': {
            const step = 0.35;
            const cycles = 3;
            T(body.current, {
              y: '+=2',
              duration: step,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: cycles,
            }, 0);
            T([legFL.current, legBR.current], {
              rotation: 10,
              transformOrigin: '50% 100%',
              duration: step,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: cycles,
            }, 0);
            T([legFR.current, legBL.current], {
              rotation: -10,
              transformOrigin: '50% 100%',
              duration: step,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: cycles,
            }, 0);
            // Slow tail sway
            T(tail.current, {
              rotation: 8,
              transformOrigin: '0% 90%',
              duration: 0.6,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: 3,
            }, 0);
            break;
          }
          case 'jump': {
            T(body.current, {
              y: -45,
              duration: 0.3,
              ease: 'power2.out',
            }, 0);
            T(body.current, {
              y: 0,
              duration: 0.4,
              ease: 'power2.in',
            }, 0.3);
            // Pre-load: legs tuck
            T([legFL.current, legFR.current, legBL.current, legBR.current], {
              scaleY: 0.7,
              transformOrigin: '50% 100%',
              duration: 0.2,
              ease: 'power2.out',
            }, 0);
            T([legFL.current, legFR.current, legBL.current, legBR.current], {
              scaleY: 1.15,
              transformOrigin: '50% 100%',
              duration: 0.25,
              ease: 'power2.out',
            }, 0.3);
            T(body.current, {
              scaleY: 0.92,
              scaleX: 1.08,
              transformOrigin: '50% 100%',
              duration: 0.15,
              ease: 'power2.out',
            }, 0.45);
            T(body.current, {
              scaleY: 1,
              scaleX: 1,
              transformOrigin: '50% 100%',
              duration: 0.2,
              ease: 'elastic.out(1, 1.6)',
            }, 0.6);
            T(tail.current, {
              rotation: 40,
              transformOrigin: '0% 90%',
              duration: 0.6,
              ease: 'power2.out',
            }, 0);
            break;
          }
          case 'sit': {
            T(body.current, {
              scaleY: 0.86,
              transformOrigin: '50% 100%',
              duration: 0.4,
              ease: 'power2.out',
            }, 0);
            T(head.current, {
              y: -10,
              duration: 0.4,
              ease: 'power2.out',
            }, 0);
            T([legFL.current, legFR.current], {
              rotation: 25,
              transformOrigin: '50% 100%',
              duration: 0.4,
              ease: 'power2.out',
            }, 0);
            T([legBL.current, legBR.current], {
              scaleY: 0.6,
              transformOrigin: '50% 100%',
              duration: 0.4,
              ease: 'power2.out',
            }, 0);
            T(tail.current, {
              rotation: 55,
              transformOrigin: '0% 100%',
              duration: 0.6,
              ease: 'power2.out',
            }, 0);
            break;
          }
          case 'scratch': {
            T(body.current, {
              rotation: -6,
              transformOrigin: '80% 100%',
              duration: 0.15,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: 6,
            }, 0);
            T(head.current, {
              rotation: 5,
              transformOrigin: '50% 100%',
              duration: 0.1,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: 8,
            }, 0);
            T([legFR.current], {
              rotation: 30,
              transformOrigin: '50% 100%',
              duration: 0.12,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: 5,
            }, 0);
            break;
          }
          case 'sleep': {
            T(body.current, {
              scaleY: 0.92,
              y: 8,
              transformOrigin: '50% 100%',
              duration: 0.8,
              ease: 'power2.out',
            }, 0);
            T(head.current, {
              rotation: 20,
              y: -4,
              transformOrigin: '80% 100%',
              duration: 0.8,
              ease: 'power2.out',
            }, 0);
            T([legFL.current, legFR.current, legBL.current, legBR.current], {
              scaleY: 0.7,
              transformOrigin: '50% 100%',
              duration: 0.8,
              ease: 'power2.out',
            }, 0);
            T(tail.current, {
              rotation: 60,
              transformOrigin: '0% 100%',
              duration: 0.8,
              ease: 'power2.out',
            }, 0);
            // Subtle breathing while at rest
            T(body.current, {
              scaleY: 0.95,
              duration: 1.4,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: 2,
            }, 0.8);
            break;
          }
          case 'stretch': {
            T(body.current, {
              scaleX: 1.15,
              scaleY: 0.9,
              transformOrigin: '50% 100%',
              duration: 0.5,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1,
            }, 0);
            T(head.current, {
              y: -10,
              rotation: 6,
              transformOrigin: '50% 100%',
              duration: 0.5,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1,
            }, 0);
            break;
          }
          case 'idle':
          default: {
            // Subtle breathing
            T(body.current, {
              scaleY: 1.02,
              transformOrigin: '50% 100%',
              duration: 1.6,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            }, 0);
            T(tail.current, {
              rotation: 6,
              transformOrigin: '0% 90%',
              duration: 1.4,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            }, 0);
            break;
          }
        }

        return tl;
      },
    }),
    [],
  );

  // SVG flip for facing left
  const flipX = facing === 'left' ? -1 : 1;

  return (
    <svg
      ref={root}
      viewBox="0 0 200 130"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        transform: `scaleX(${flipX})`,
        overflow: 'visible',
      }}
      aria-hidden
    >
      <style>{`
        @keyframes cat-blink-${fur} {
          0%, 92%, 100% { transform: scaleY(1); }
          94%, 98% { transform: scaleY(0.08); }
        }
        .cat-eye-${fur} {
          transform-origin: center;
          animation: cat-blink-${fur} 5.2s infinite;
        }
        .cat-pupil-${fur} {
          transition: opacity 200ms ease;
        }
      `}</style>

      {/* Tail (drawn first so body covers its base) — curl is a filled path */}
      <path
        ref={tail}
        d="M 168 70
           C 184 50, 192 30, 178 18
           C 168 10, 158 22, 162 34
           C 165 42, 172 44, 178 38"
        fill={colors.body}
        stroke={colors.bodyShadow}
        strokeWidth="0.5"
        style={{ transformOrigin: '168px 90%', transformBox: 'fill-box' }}
      />

      <g ref={body} style={{ transformOrigin: '105px 95px' }}>
        {/* Back legs (rear haunches first, so front legs overlap nicely) */}
        <g ref={legBL} style={{ transformOrigin: '80px 95px' }}>
          <rect x="76" y="92" width="9" height="20" rx="4" fill={colors.body} />
          <ellipse cx="80" cy="113" rx="6" ry="2.5" fill={colors.bodyShadow} />
        </g>
        <g ref={legBR} style={{ transformOrigin: '125px 95px' }}>
          <rect x="121" y="92" width="9" height="20" rx="4" fill={colors.body} />
          <ellipse cx="125" cy="113" rx="6" ry="2.5" fill={colors.bodyShadow} />
        </g>

        {/* Body (longer oval, lower position for cat proportions) */}
        <ellipse cx="105" cy="80" rx="50" ry="20" fill={colors.body} />
        {/* Belly highlight */}
        <ellipse cx="105" cy="86" rx="36" ry="9" fill={colors.belly} opacity="0.7" />

        {/* Tabby stripes (only on tabby/ginger/gray) */}
        {colors.stripes ? (
          <g opacity="0.55" fill={colors.stripes}>
            <ellipse cx="80" cy="74" rx="3" ry="2" />
            <ellipse cx="92" cy="70" rx="3.5" ry="2" />
            <ellipse cx="106" cy="68" rx="3.5" ry="2" />
            <ellipse cx="120" cy="70" rx="3.5" ry="2" />
            <ellipse cx="132" cy="74" rx="3" ry="2" />
          </g>
        ) : null}

        {/* Front legs */}
        <g ref={legFL} style={{ transformOrigin: '88px 95px' }}>
          <rect x="84" y="92" width="9" height="20" rx="4" fill={colors.body} />
          <ellipse cx="88" cy="113" rx="6" ry="2.5" fill={colors.bodyShadow} />
        </g>
        <g ref={legFR} style={{ transformOrigin: '115px 95px' }}>
          <rect x="111" y="92" width="9" height="20" rx="4" fill={colors.body} />
          <ellipse cx="115" cy="113" rx="6" ry="2.5" fill={colors.bodyShadow} />
        </g>

        {/* Head */}
        <g ref={head} style={{ transformOrigin: '60px 60px' }}>
          {/* Ears (slightly larger and properly triangular) */}
          <g ref={ears}>
            <path d="M 36 56 L 44 24 L 60 52 Z" fill={colors.ear} stroke={colors.bodyShadow} strokeWidth="0.6" strokeLinejoin="round" />
            <path d="M 42 50 L 47 32 L 55 50 Z" fill={colors.innerEar} />
            <path d="M 84 56 L 76 24 L 60 52 Z" fill={colors.ear} stroke={colors.bodyShadow} strokeWidth="0.6" strokeLinejoin="round" />
            <path d="M 78 50 L 73 32 L 65 50 Z" fill={colors.innerEar} />
          </g>

          {/* Head circle (slightly squished to look more cat-like) */}
          <ellipse cx="60" cy="60" rx="22" ry="20" fill={colors.body} />
          {/* Cheek/jaw shading */}
          <ellipse cx="60" cy="68" rx="14" ry="6" fill={colors.bodyShadow} opacity="0.25" />
          {/* Chin highlight */}
          <ellipse cx="60" cy="72" rx="8" ry="3" fill={colors.belly} opacity="0.45" />

          {/* Eyes (slit pupils) */}
          <g className={`cat-eye-${fur}`}>
            <ellipse cx="50" cy="58" rx="4" ry="5" fill={colors.accent} opacity="0.95" />
            <ellipse cx="51" cy="58" rx="0.8" ry="4.5" fill="oklch(15% 0.02 30)" />
            <ellipse cx="70" cy="58" rx="4" ry="5" fill={colors.accent} opacity="0.95" />
            <ellipse cx="71" cy="58" rx="0.8" ry="4.5" fill="oklch(15% 0.02 30)" />
          </g>

          {/* Nose (small pink heart, slightly bigger and more visible) */}
          <path
            d="M 60 67 C 58 65, 55 66, 60 71 L 60 73 L 60 71 C 65 66, 62 65, 60 67 Z"
            fill="oklch(78% 0.16 350)"
          />

          {/* Mouth (W-shape under nose) */}
          <path
            d="M 60 72 Q 56 76 53 74 M 60 72 Q 64 76 67 74"
            stroke={colors.bodyShadow}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Whiskers — slightly curved like real whiskers */}
          <g stroke={colors.bodyShadow} strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.65">
            <path d="M 38 64 Q 48 64 56 66" />
            <path d="M 38 68 Q 48 68 56 68" />
            <path d="M 38 72 Q 48 72 56 70" />
            <path d="M 82 64 Q 72 64 64 66" />
            <path d="M 82 68 Q 72 68 64 68" />
            <path d="M 82 72 Q 72 72 64 70" />
          </g>
        </g>
      </g>
    </svg>
  );
});

export default CatRunner;