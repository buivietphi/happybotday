'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import WishCard from '@/components/bits/WishCard';
import FloatingHearts from '@/components/bits/FloatingHearts';

type Wish = { text: string };

type Props = {
  wishes: Wish[];
  onComplete: () => void;
};

/**
 * Hallmark Luxury Wishes Deck — 5 Heartfelt Birthday Wish Cards with Adorable Animated Cat Mascots.
 *
 * Choreography:
 *   - 3D stack perspective with depth layers and strict zIndex ordering (Card 1 always on top first).
 *   - GSAP flip-and-glide transition when navigating between cards.
 *   - Back / Next navigation + interactive paw-print indicator pills.
 *   - Last card transitions to "Mở Vòng Quay May Mắn 🎁 ✨".
 */
export default function WishesStack({ wishes, onComplete }: Props) {
  const root = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotionSafe();

  const [topIndex, setTopIndex] = useState(0);
  const total = wishes.length;
  const isLast = topIndex >= total - 1;

  // Advance to next wish card
  const handleNext = useCallback(() => {
    if (isLast) {
      if (nextBtnRef.current) {
        gsap.to(nextBtnRef.current, {
          scale: 0.94,
          duration: 0.1,
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(nextBtnRef.current, {
              scale: 1.1,
              opacity: 0,
              duration: 0.2,
              onComplete: onComplete,
            });
          },
        });
      } else {
        onComplete();
      }
      return;
    }

    const stack = stackRef.current;
    if (!stack || reduced) {
      setTopIndex((i) => Math.min(total - 1, i + 1));
      return;
    }

    const activeCardEl = stack.querySelector<HTMLElement>(`[data-card-index="${topIndex}"]`);
    if (activeCardEl) {
      gsap.to(activeCardEl, {
        x: -120,
        y: -30,
        rotateY: -35,
        rotateZ: -6,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          setTopIndex((i) => Math.min(total - 1, i + 1));
        },
      });
    } else {
      setTopIndex((i) => Math.min(total - 1, i + 1));
    }
  }, [isLast, onComplete, reduced, topIndex, total]);

  // Go to previous wish card
  const handlePrev = useCallback(() => {
    if (topIndex <= 0) return;
    setTopIndex((i) => Math.max(0, i - 1));
  }, [topIndex]);

  // Jump directly to card by clicking paw dot
  const handleJump = useCallback((targetIndex: number) => {
    setTopIndex(targetIndex);
  }, []);

  // Entrance
  useGSAP(
    () => {
      if (reduced) return;
      const el = root.current;
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
      );
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
        justifyContent: 'space-between',
        padding: '28px 20px 36px',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 100% at 50% 0%, oklch(98% 0.02 80) 0%, oklch(94% 0.04 75) 50%, oklch(90% 0.06 70) 100%)',
        gap: 16,
      }}
    >
      <style>{`
        @keyframes shimmerGlow {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        .cta-shimmer {
          position: absolute;
          top: 0; left: 0; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: shimmerGlow 3s infinite ease-in-out;
          pointer-events: none;
        }
      `}</style>

      {/* Floating subtle ambient hearts */}
      <FloatingHearts count={6} playing duration={4.2} />

      {/* === TOP EYEBROW HEADER === */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          textAlign: 'center',
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '11px',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'var(--color-accent-deep)',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '4px 16px',
            borderRadius: '999px',
            border: '1px solid oklch(88% 0.12 85)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <span>💌</span>
          <span>5 Lời Chúc Sinh Nhật Ngọt Ngào</span>
          <span>✨</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontWeight: 600,
            fontStyle: 'italic',
            fontSize: 'clamp(24px, 3.8vw, 36px)',
            color: 'oklch(22% 0.06 295)',
            margin: 0,
            lineHeight: 1.15,
            textShadow: '0 2px 10px rgba(255,255,255,0.8)',
          }}
        >
          Gửi Riêng Cho Em, KIỀU LEE
        </h2>
      </div>

      {/* === 3D WISH CARDS DECK === */}
      <div
        ref={stackRef}
        style={{
          position: 'relative',
          width: 'min(580px, 92vw)',
          height: 'clamp(320px, 48vh, 390px)',
          perspective: 1400,
          zIndex: 3,
        }}
      >
        {wishes.map((w, i) => {
          if (i < topIndex || i > topIndex + 2) return null;
          const depth = i - topIndex;
          // Strict zIndex calculation: top card has highest zIndex
          const zOrder = 100 - depth * 10;
          return (
            <div
              key={i}
              data-card-index={i}
              onClick={handleNext}
              role="button"
              tabIndex={depth === 0 ? 0 : -1}
              aria-label={depth === 0 ? 'Chạm vào thiệp để xem lời chúc tiếp theo' : undefined}
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
                cursor: depth === 0 ? 'pointer' : 'default',
                zIndex: zOrder,
              }}
            >
              <WishCard
                text={w.text}
                index={i}
                total={total}
                active={depth === 0}
                depth={depth}
              />
            </div>
          );
        })}
      </div>

      {/* === BOTTOM CONTROLS: Paw Progress Dots + Next/Prev Buttons === */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 3,
          width: '100%',
          maxWidth: '580px',
        }}
      >
        {/* 5 Cute Interactive Paw-Print Progress Dots */}
        <div
          role="tablist"
          aria-label="Chọn thiệp chúc mừng"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(255, 255, 255, 0.75)',
            padding: '6px 16px',
            borderRadius: '999px',
            border: '1px solid oklch(88% 0.10 85)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          {wishes.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === topIndex}
              aria-label={`Thiệp số ${i + 1}`}
              onClick={() => handleJump(i)}
              style={{
                appearance: 'none',
                background: i === topIndex ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : 'transparent',
                border: 'none',
                borderRadius: '999px',
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '12px',
                fontWeight: 700,
                color: i === topIndex ? '#ffffff' : 'var(--color-text-soft)',
                boxShadow: i === topIndex ? '0 2px 8px rgba(225, 29, 72, 0.35)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <span>🐾</span>
              {i === topIndex && <span>{i + 1}</span>}
            </button>
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            width: '100%',
          }}
        >
          {/* Previous Button (Visible when topIndex > 0) */}
          {topIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Xem lại thiệp trước"
              style={{
                appearance: 'none',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1.5px solid oklch(85% 0.08 85)',
                color: 'oklch(35% 0.06 295)',
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '15px',
                padding: '10px 18px',
                borderRadius: '999px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s ease, background 0.2s ease',
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span>←</span>
              <span>Thiệp trước</span>
            </button>
          )}

          {/* Next / Proceed Button */}
          <button
            ref={nextBtnRef}
            type="button"
            onClick={handleNext}
            style={{
              position: 'relative',
              appearance: 'none',
              border: isLast ? '2px solid oklch(92% 0.16 85)' : '1.5px solid oklch(84% 0.12 350)',
              background: isLast
                ? 'linear-gradient(135deg, oklch(62% 0.24 350) 0%, oklch(52% 0.26 15) 50%, oklch(66% 0.22 340) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
              color: isLast ? '#ffffff' : 'oklch(28% 0.08 350)',
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 'clamp(15px, 2vw, 17px)',
              padding: isLast ? '12px 28px' : '10px 24px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: isLast
                ? '0 10px 28px oklch(52% 0.26 15 / 0.40), 0 0 20px oklch(90% 0.16 85 / 0.45)'
                : '0 6px 16px rgba(225, 29, 72, 0.12)',
              overflow: 'hidden',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isLast && <div className="cta-shimmer" />}
            {isLast ? (
              <>
                <span>🎁</span>
                <span>Khám Phá Món Quà Cuối Cùng</span>
                <span>✨</span>
              </>
            ) : (
              <>
                <span>Lời chúc tiếp theo</span>
                <span aria-hidden style={{ fontSize: '18px', lineHeight: 1 }}>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}