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

  // 15-second slow reading teaser cats
  const [showSlowCats, setShowSlowCats] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSlowCats(true);
      try {
        const audio = new Audio('/sounds/meow_chirp.wav');
        audio.volume = 0.65;
        audio.play().catch(() => {});
      } catch {}
    }, 15000); // 15 seconds

    return () => window.clearTimeout(timer);
  }, []);

  const handleCatTeaseTap = (sound: string) => {
    try {
      const audio = new Audio(sound);
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch {}
  };

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

        @keyframes catPopUpBounce {
          0% { transform: translateY(60px) scale(0.6); opacity: 0; }
          60% { transform: translateY(-8px) scale(1.1); opacity: 1; }
          80% { transform: translateY(3px) scale(0.96); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes catIdleBob {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-4px) rotate(2deg); }
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

      {/* === 15s SLOW READING TEASER CATS (2 CORNERS) === */}
      {showSlowCats && (
        <>
          {/* Left Corner Cat: "Ú òa hết hồn chưaaa! Đọc gì lâu dọ?" */}
          <div
            onClick={() => handleCatTeaseTap('/sounds/meow1.wav')}
            style={{
              position: 'fixed',
              left: 'clamp(8px, 2.5vw, 24px)',
              bottom: 'clamp(10px, 2vh, 20px)',
              zIndex: 45,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              cursor: 'pointer',
              filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.35))',
              animation: 'catPopUpBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
            title="Bé mèo tinh nghịch"
          >
            {/* Comic Speech Bubble */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
                padding: '7px 14px',
                borderRadius: '16px 16px 16px 4px',
                border: '2px solid #ca8a04',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                maxWidth: 'min(210px, 44vw)',
                marginBottom: 4,
                marginLeft: 10,
              }}
            >
              <div style={{ fontWeight: 800, color: '#854d0e', fontSize: '13px', lineHeight: 1.2 }}>
                Ú òa hết hồn chưaaa! 🐱👻
              </div>
              <div style={{ fontWeight: 600, color: '#713f12', fontSize: '11.5px', fontStyle: 'italic', marginTop: 2 }}>
                Đọc gì mà lâu dọ? 😜🐾
              </div>
            </div>

            {/* Handcrafted Playful Winking Cat SVG */}
            <svg
              viewBox="0 0 110 90"
              width="96"
              height="78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animation: 'catIdleBob 2.2s ease-in-out infinite alternate' }}
            >
              <path d="M 28 42 L 18 16 L 44 28 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <path d="M 28 38 L 22 22 L 40 30 Z" fill="#fda4af" />
              <path d="M 72 42 L 82 16 L 56 28 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <path d="M 72 38 L 78 22 L 60 30 Z" fill="#fda4af" />
              <circle cx="50" cy="46" r="26" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <ellipse cx="44" cy="52" rx="9" ry="6" fill="#ffffff" />
              <ellipse cx="56" cy="52" rx="9" ry="6" fill="#ffffff" />
              <path d="M 36 43 Q 41 38 46 43" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="60" cy="42" rx="4.5" ry="5.5" fill="#1c1917" />
              <circle cx="59" cy="40.5" r="1.6" fill="#ffffff" />
              <polygon points="48,48 52,48 50,51" fill="#f43f5e" />
              <path d="M 46 52 Q 50 54 54 52" stroke="#1c1917" strokeWidth="1.8" fill="none" />
              <ellipse cx="50" cy="56" rx="3.5" ry="4.5" fill="#f43f5e" />
              <ellipse cx="32" cy="48" rx="4" ry="2.5" fill="#f43f5e" opacity="0.45" />
              <ellipse cx="68" cy="48" rx="4" ry="2.5" fill="#f43f5e" opacity="0.45" />
              <path d="M 34 50 L 16 48 M 34 53 L 14 54" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 66 50 L 84 48 M 66 53 L 86 54" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
              <ellipse cx="26" cy="74" rx="10" ry="7" fill="#ffffff" stroke="#b45309" strokeWidth="1.8" />
              <ellipse cx="74" cy="74" rx="10" ry="7" fill="#ffffff" stroke="#b45309" strokeWidth="1.8" />
            </svg>
          </div>

          {/* Right Corner Cat: "Xúc động quá đúng hem? Biết mòoo~" */}
          <div
            onClick={() => handleCatTeaseTap('/sounds/meow_chirp.wav')}
            style={{
              position: 'fixed',
              right: 'clamp(8px, 2.5vw, 24px)',
              bottom: 'clamp(76px, 10vh, 90px)',
              zIndex: 45,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              cursor: 'pointer',
              filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.35))',
              animation: 'catPopUpBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards',
            }}
            title="Bé mèo xúc động"
          >
            {/* Comic Speech Bubble */}
            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
                padding: '7px 14px',
                borderRadius: '16px 16px 4px 16px',
                border: '2px solid #f43f5e',
                boxShadow: '0 6px 16px rgba(244,63,94,0.2)',
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                maxWidth: 'min(210px, 44vw)',
                marginBottom: 4,
                marginRight: 10,
              }}
            >
              <div style={{ fontWeight: 800, color: '#e11d48', fontSize: '13px', lineHeight: 1.2 }}>
                Xúc động quá đúng hem? 🥺💖
              </div>
              <div style={{ fontWeight: 600, color: '#881337', fontSize: '11.5px', fontStyle: 'italic', marginTop: 2 }}>
                Biết mòoo~ Cứ đọc nha! 😽✨
              </div>
            </div>

            {/* Handcrafted Watery-Eyed Loving Cat SVG */}
            <svg
              viewBox="0 0 110 90"
              width="96"
              height="78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animation: 'catIdleBob 2.5s ease-in-out infinite alternate 0.3s' }}
            >
              <path d="M 50 14 C 50 8, 44 4, 40 8 C 36 4, 30 8, 30 14 C 30 20, 40 26, 40 26 C 40 26, 50 20, 50 14 Z" fill="#f43f5e" />
              <path d="M 28 44 L 18 18 L 44 30 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <path d="M 28 40 L 22 24 L 40 32 Z" fill="#fda4af" />
              <path d="M 72 44 L 82 18 L 56 30 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <path d="M 72 40 L 78 24 L 60 32 Z" fill="#fda4af" />
              <circle cx="50" cy="48" r="26" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <ellipse cx="44" cy="54" rx="9" ry="6" fill="#ffffff" />
              <ellipse cx="56" cy="54" rx="9" ry="6" fill="#ffffff" />
              <ellipse cx="40" cy="44" rx="5" ry="6" fill="#1c1917" />
              <circle cx="39" cy="42" r="2" fill="#ffffff" />
              <circle cx="42" cy="46" r="1" fill="#ffffff" />
              <ellipse cx="60" cy="44" rx="5" ry="6" fill="#1c1917" />
              <circle cx="59" cy="42" r="2" fill="#ffffff" />
              <circle cx="62" cy="46" r="1" fill="#ffffff" />
              <polygon points="48,50 52,50 50,53" fill="#f43f5e" />
              <path d="M 44 54 Q 50 58 56 54" stroke="#1c1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <ellipse cx="30" cy="50" rx="5" ry="3" fill="#f43f5e" opacity="0.5" />
              <ellipse cx="70" cy="50" rx="5" ry="3" fill="#f43f5e" opacity="0.5" />
              <path d="M 32 52 L 14 50 M 32 55 L 12 56" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 68 52 L 86 50 M 68 55 L 88 56" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" />
              <ellipse cx="38" cy="74" rx="9" ry="6" fill="#ffffff" stroke="#ea580c" strokeWidth="1.8" />
              <ellipse cx="62" cy="74" rx="9" ry="6" fill="#ffffff" stroke="#ea580c" strokeWidth="1.8" />
            </svg>
          </div>
        </>
      )}
    </section>
  );
}