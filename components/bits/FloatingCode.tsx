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

// Pool of programming-language snippets — JS, TS, Java, Python, generic markup.
// Each is short enough to read at a glance and visually distinct.
const SNIPPETS = [
  '</>', '{}', '()', '[]', '=>', '==', '!=', '++', '--', '...', ';;',
  'const', 'let', 'var', 'function', 'return', 'await', 'async', 'import',
  'export', 'from', 'class', 'extends', 'new', 'this', 'null', 'true',
  'public', 'private', 'static', 'void', 'int', 'String', 'System.out',
  'println', 'def', 'self', 'lambda', 'yield', 'None', 'True', 'False',
  '<div/>', '<JSX/>', 'NaN', 'undefined', 'typeof', 'instanceof',
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
    const snippet = SNIPPETS[(i * 7 + 3) % SNIPPETS.length];
    const colorVariant = i % 3;
    return {
      key: i,
      snippet,
      left: 28 + ((i * 53) % 48) + ((i * 17) % 6),
      tone:
        colorVariant === 0
          ? 'var(--color-accent)'
          : colorVariant === 1
            ? 'var(--color-accent-deep)'
            : 'var(--color-accent-soft)',
      size: 12 + ((i * 5) % 6), // 12–17px
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
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            fontSize: `${t.size}px`,
            fontWeight: 600,
            color: t.tone,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            padding: '2px 6px',
            borderRadius: 4,
            background: 'oklch(98% 0.01 350 / 0.55)',
            backdropFilter: 'blur(2px)',
            boxShadow: '0 2px 6px oklch(22% 0.06 295 / 0.18)',
            userSelect: 'none',
          }}
        >
          {t.snippet}
        </span>
      ))}
    </div>
  );
}
