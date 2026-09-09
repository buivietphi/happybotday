'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  /** Number of code tokens to spawn. */
  count?: number;
  /** Animation duration in seconds for a full rise + fade. */
  duration?: number;
  /** When false, tokens are static (no animation). */
  playing?: boolean;
  className?: string;
};

// Marketing-style celebration tokens: big-impact emojis + short exclamations.
// Drives the same rise-and-fade animation — only the visible glyphs change.
const TOKENS = [
  '🎉', '🎂', '🎈', '🎁', '✨', '🎊', '🥳', '🎆', '💝', '🎀',
  '🌟', '💖', '💕', '💗', '💐', '🦋', '🌸', '🎶', '🎵', '💫',
  'YAY', 'WOW', 'HÉ', 'HÍ', 'Ố', 'ỜI', 'WOOO', 'LOVE', 'HUGS', 'CHEERS',
];

type PropsWithVariant = {
  /** When false, tokens are static (no animation). */
  playing?: boolean;
  className?: string;
  /** Vertical drift distance override. */
  drift?: number;
};

/**
 * FloatingCode — a column of small code snippets (JS / Java / Python / markup)
 * that rise and fade, replacing the love-theme hearts with a developer vibe.
 *
 * Each token is a styled <span> with a randomized x-offset, drift, rotation,
 * and stagger. Driven by the same GSAP pattern as FloatingHearts — keeps the
 * animation cheap (transforms + opacity) and respects reduced-motion.
 */
export default function FloatingCode({
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
      const els = root.current?.querySelectorAll<HTMLElement>('[data-code]');
      if (!els || els.length === 0) return;
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0, scale: 0.7 },
          {
            y: -260 - Math.random() * 60,
            opacity: 1,
            scale: 0.9 + Math.random() * 0.3,
            rotation: -8 + Math.random() * 16,
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

  // Deterministic-ish per-index assignment so tokens don't reshuffle on re-render.
  const tokens = Array.from({ length: count }, (_, i) => {
    const snippet = TOKENS[(i * 7 + 3) % TOKENS.length];
    const colorVariant = i % 4;
    return {
      key: i,
      snippet,
      left: 28 + ((i * 53) % 48) + ((i * 17) % 6),
      tone:
        colorVariant === 0
          ? 'var(--color-accent)'
          : colorVariant === 1
            ? 'var(--color-accent-deep)'
            : colorVariant === 2
              ? 'var(--color-accent-soft)'
              : 'oklch(82% 0.18 85)', // gold
      size: 14 + ((i * 5) % 7), // 14–20px (bigger for marketing impact)
    };
  });

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
      {tokens.map((t) => (
        <span
          key={t.key}
          data-code
          style={{
            position: 'absolute',
            left: `${t.left}%`,
            bottom: 0,
            transform: 'translate(-50%, 0)',
            opacity: 0,
            fontFamily:
              'var(--font-body), -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
            fontSize: `${t.size}px`,
            fontWeight: 700,
            color: t.tone,
            letterSpacing: '0',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 2px rgba(255,255,255,0.85), 0 1px 6px oklch(22% 0.06 295 / 0.18)',
            userSelect: 'none',
          }}
        >
          {t.snippet}
        </span>
      ))}
    </div>
  );
}
