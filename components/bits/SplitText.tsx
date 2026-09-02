'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

gsap.registerPlugin(useGSAP);

type Props = {
  text: string;
  /** 'word' (default) splits by whitespace; 'char' splits per character. */
  unit?: 'word' | 'char';
  /** Element tag for the wrapper. Default 'span'. */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  /** GSAP stagger between units in seconds. Default 0.04. */
  stagger?: number;
  /** Initial Y offset (px). Default 18. */
  y?: number;
  /** Initial rotateX (deg). Default -25. */
  rotateX?: number;
  /** GSAP duration for each unit. Default 0.7. */
  duration?: number;
  className?: string;
};

/**
 * React Bits-style SplitText. Splits a string into words (or chars) and
 * stagger-reveals each unit with GSAP. Renders inline so it slots inside
 * any headline.
 */
export default function SplitText({
  text,
  unit = 'word',
  as = 'span',
  stagger = 0.04,
  y = 18,
  rotateX = -25,
  duration = 0.7,
  className,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const Tag = as as 'span';
  const tokens =
    unit === 'word' ? text.split(/(\s+)/) : Array.from(text);

  useGSAP(
    () => {
      if (reduced) return;
      const els = root.current?.querySelectorAll('[data-st-unit]');
      if (!els || els.length === 0) return;
      gsap.fromTo(
        els,
        { opacity: 0, y, rotateX },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration,
          ease: 'power3.out',
          stagger,
        },
      );
    },
    { scope: root, dependencies: [text, unit, reduced] },
  );

  return (
    <Tag ref={root as never} className={className}>
      {tokens.map((t, i) => (
        <span
          key={i}
          data-st-unit
          style={{ display: 'inline-block' }}
        >
          {t === ' ' ? ' ' : t}
        </span>
      ))}
    </Tag>
  );
}
