'use client';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Wrapper tag. Default 'h1'. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
};

/**
 * Shimmer text — gold gradient with a moving highlight sweep.
 * Pure CSS keyframes; no GSAP needed.
 */
export default function ShimmerText({
  children,
  as: Tag = 'h1',
  className,
}: Props) {
  return (
    <Tag
      className={className}
      style={{
        backgroundImage:
          'linear-gradient(110deg, var(--color-gold) 0%, var(--color-accent) 30%, var(--color-gold) 50%, var(--color-accent) 70%, var(--color-gold) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        animation: 'shimmer-sweep 4.5s linear infinite',
        display: 'inline-block',
      }}
    >
      <style>{`
        @keyframes shimmer-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {children}
    </Tag>
  );
}
