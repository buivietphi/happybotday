'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import SplitText from '@/components/bits/SplitText';
import MagneticButton from '@/components/bits/MagneticButton';
import CakeSVG from '@/components/bits/CakeSVG';
import CandleFlame from '@/components/bits/CandleFlame';
import FloatingBalloons from '@/components/bits/FloatingBalloons';
import ConfettiRain from '@/components/bits/ConfettiRain';

type Props = {
  name: string;
  headline: string;
  onAdvance: () => void;
};

const CANDLE_COUNT = 10;

/**
 * Birthday hero — animated headline, SVG cake with 10 lit candles, balloons
 * rising from the bottom, confetti raining down, and a CTA that advances to
 * the blow-out moment.
 */
export default function BirthdayHero({
  name,
  headline,
  onAdvance,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          0,
        );
      }
      if (cakeRef.current) {
        tl.fromTo(
          cakeRef.current,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.4)' },
          0.2,
        );
      }
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          1.0,
        );
      }
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        overflow: 'hidden',
        background: 'var(--color-paper)',
        textAlign: 'center',
        gap: 32,
      }}
    >
      <FloatingBalloons />
      <ConfettiRain />

      {/* Subtle paw-print watermark behind content */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 64 64'><g fill='%23e34d8c'><circle cx='32' cy='38' r='10'/><circle cx='20' cy='24' r='5'/><circle cx='32' cy='16' r='5'/><circle cx='44' cy='24' r='5'/></g></svg>\")",
          backgroundSize: '160px 160px',
          backgroundRepeat: 'repeat',
          zIndex: 1,
        }}
      />

      <span
        ref={eyebrowRef}
        style={{
          fontSize: '12px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'var(--color-text-soft)',
          fontWeight: 600,
          zIndex: 3,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 64 64" aria-hidden>
          <g fill="currentColor" opacity="0.7">
            <circle cx="32" cy="38" r="10" />
            <circle cx="20" cy="24" r="5" />
            <circle cx="32" cy="16" r="5" />
            <circle cx="44" cy="24" r="5" />
          </g>
        </svg>
        <span>Hôm nay là ngày của {name} ✨</span>
      </span>

      <h1
        style={{
          fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
          fontWeight: 600,
          fontSize: 'clamp(40px, 8vw, 88px)',
          lineHeight: 1.04,
          letterSpacing: '-0.015em',
          color: 'var(--color-text)',
          maxWidth: 960,
          margin: 0,
          zIndex: 3,
          textShadow: '0 1px 0 oklch(98% 0.008 80 / 0.6)',
        }}
      >
        <SplitText text={headline} unit="word" y={24} rotateX={-30} duration={0.8} stagger={0.07} />
      </h1>

      <div
        ref={cakeRef}
        style={{
          width: 'min(520px, 92vw)',
          aspectRatio: '5 / 4',
          position: 'relative',
          zIndex: 3,
          filter: 'drop-shadow(0 24px 30px oklch(22% 0.06 295 / 0.18))',
        }}
      >
        <CakeSVG candleCount={CANDLE_COUNT} />
        {/* flames layered on top of each candle slot */}
        <svg
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          aria-hidden
        >
          {Array.from({ length: CANDLE_COUNT }, (_, i) => {
            const x = 270 + (60 / (CANDLE_COUNT - 1)) * i;
            return (
              <g key={i} transform={`translate(${x}, 275)`}>
                <CandleFlame state="lit" phaseOffset={i} />
              </g>
            );
          })}
        </svg>
      </div>

      <div ref={ctaRef} style={{ zIndex: 3 }}>
        <MagneticButton
          onClick={onAdvance}
          ariaLabel="Bắt đầu thổi nến"
          strength={8}
          className="birthday-cta"
        >
          Thổi nến đi nào
        </MagneticButton>
      </div>

      <style>{`
        .birthday-cta {
          background: var(--color-accent);
          color: var(--color-text-invert);
          border: 0;
          padding: 16px 32px;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          box-shadow: 0 16px 30px -12px oklch(65% 0.30 350 / 0.45);
        }
        .birthday-cta:hover {
          background: var(--color-accent-deep);
          transform: translateY(-1px);
          box-shadow: 0 20px 36px -12px oklch(65% 0.30 350 / 0.55);
        }
        .birthday-cta:active { transform: translateY(0); }
        .birthday-cta:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 4px;
        }
      `}</style>
    </section>
  );
}
