'use client';

import { useRef } from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  /** CSS class for outer wrapper. */
  className?: string;
  /** Maximum translation in px. Default 6. */
  strength?: number;
  /** Type attribute. Default 'button'. */
  type?: 'button' | 'submit' | 'reset';
  /** Disabled flag. */
  disabled?: boolean;
};

/**
 * React Bits-style Magnet button. On pointermove, the inner content slides
 * toward the cursor (clamped to `strength`). On pointerleave, it springs back.
 *
 * Pure CSS-driven — no GSAP needed for this micro-interaction. Keeps the
 * global bundle lean.
 */
export default function MagneticButton({
  children,
  onClick,
  ariaLabel,
  className,
  strength = 6,
  type = 'button',
  disabled,
}: Props) {
  const innerRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const inner = innerRef.current;
    if (!inner) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const norm = Math.min(1, Math.hypot(x, y) / (rect.width / 2));
    const dx = (x / Math.max(1, Math.hypot(x, y))) * strength * norm;
    const dy = (y / Math.max(1, Math.hypot(x, y))) * strength * norm;
    inner.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const onLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = 'translate(0, 0)';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span ref={innerRef} style={{ display: 'inline-block', transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {children}
      </span>
    </button>
  );
}
