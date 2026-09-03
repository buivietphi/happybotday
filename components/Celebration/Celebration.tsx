'use client';

import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import ShimmerText from '@/components/bits/ShimmerText';
import QueenAnt from '@/components/bits/QueenAnt';
import GrandFireworksShow from '@/components/bits/GrandFireworksShow';
import type { WheelPrize } from '@/lib/types';

type Props = {
  name: string;
  outroWish: string;
  prizes?: WheelPrize[];
  onReplay: () => void;
};

/**
 * Celebration Finale — Grand Showcase with Adorable Queen Ant:
 *   - Con Kiến Chúa Đáng Yêu (Queen Ant with 24K Royal Crown & Ermine Cape) in the spotlight.
 *   - Grand Fireworks Show & Outro Wish.
 *   - Tông đồng nghiệp chị/em vui vẻ cho Dẹo Dẹo.
 */
export default function Celebration({ name, outroWish, onReplay }: Props) {
  const root = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const [fireworkKey, setFireworkKey] = useState<number>(0);

  // Firework >3 clicks teaser ant (8s, only once)
  const [fireworkClicks, setFireworkClicks] = useState(0);
  const [showFireworkAnt, setShowFireworkAnt] = useState(false);
  const [hasShownFireworkAnt, setHasShownFireworkAnt] = useState(false);

  const triggerFireworkBurst = () => {
    setFireworkKey(Date.now());
    if (!hasShownFireworkAnt) {
      setFireworkClicks((prev) => {
        const next = prev + 1;
        if (next > 3) {
          setShowFireworkAnt(true);
          setHasShownFireworkAnt(true);
          try {
            const audio = new Audio('/sounds/ant_chirp.wav');
            audio.volume = 0.7;
            audio.play().catch(() => {});
          } catch {}

          window.setTimeout(() => {
            setShowFireworkAnt(false);
          }, 8000); // 8s visible, then hides!
        }
        return next;
      });
    }
  };



  useGSAP(
    () => {
      if (reduced) return;
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.5)' },
        );
      }
    },
    { scope: cardRef },
  );

  return (
    <section
      ref={root}
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(12px, 2.5vh, 20px) 16px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        background:
          'radial-gradient(130% 110% at 50% 15%, oklch(28% 0.16 345) 0%, oklch(18% 0.10 310) 45%, oklch(10% 0.05 280) 100%)',
        color: '#ffffff',
        textAlign: 'center',
      }}
    >
      <style>{`
        @keyframes goldShineSweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        .celebration-shimmer {
          position: absolute;
          top: 0; left: 0; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: goldShineSweep 3s infinite ease-in-out;
          pointer-events: none;
        }

        @keyframes promptAntPop {
          0% { transform: translateX(-50%) scale(0) translateY(24px); opacity: 0; }
          60% { transform: translateX(-50%) scale(1.12) translateY(-4px); opacity: 1; }
          80% { transform: translateX(-50%) scale(0.96) translateY(2px); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }

        .hallmark-glow-card {
          background: rgba(255, 255, 255, 0.09);
          border: 1.5px solid oklch(90% 0.16 85 / 0.55);
          backdrop-filter: blur(16px);
          border-radius: 26px;
          box-shadow: 0 20px 50px -12px oklch(65% 0.28 350 / 0.40), 0 0 30px oklch(90% 0.16 85 / 0.22), inset 0 1px 2px rgba(255,255,255,0.5);
          box-sizing: border-box;
        }

        .hallmark-primary-btn {
          position: relative;
          background: linear-gradient(135deg, oklch(62% 0.24 350) 0%, oklch(52% 0.26 15) 50%, oklch(66% 0.22 340) 100%);
          color: #ffffff;
          border: 2px solid oklch(92% 0.16 85);
          padding: 10px 24px;
          border-radius: 999px;
          font-family: var(--font-display, "Cormorant Garamond", serif);
          font-style: italic;
          font-size: clamp(14px, 1.8vh, 16px);
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 24px oklch(52% 0.26 15 / 0.45), 0 0 20px oklch(90% 0.16 85 / 0.35);
          letter-spacing: 0.02em;
          overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        }
        .hallmark-primary-btn:hover {
          transform: scale(1.05) translateY(-1px);
          box-shadow: 0 14px 32px oklch(52% 0.26 15 / 0.55), 0 0 26px oklch(92% 0.18 85 / 0.50);
        }
        .hallmark-primary-btn:active {
          transform: scale(0.96) translateY(1px);
        }

        .hallmark-secondary-btn {
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
          border: 1.5px solid oklch(92% 0.16 85 / 0.65);
          padding: 9px 20px;
          border-radius: 999px;
          font-family: var(--font-display, "Cormorant Garamond", serif);
          font-style: italic;
          font-size: clamp(13px, 1.6vh, 15px);
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .hallmark-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.24);
          transform: scale(1.04);
        }
        .hallmark-secondary-btn:active {
          transform: scale(0.96);
        }
      `}</style>

      {/* === GRAND FIREWORKS SHOW === */}
      <GrandFireworksShow triggerKey={fireworkKey} autoLoop={true} />

      {/* Ambient Starlight Glow Halo */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '38%',
          transform: 'translate(-50%, -50%)',
          width: 'min(640px, 92vw)',
          aspectRatio: '1',
          background:
            'radial-gradient(closest-side, oklch(65% 0.30 350 / 0.30), oklch(65% 0.30 350 / 0) 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* === MAIN CELEBRATION SHOWCASE CARD === */}
      <div
        ref={cardRef}
        className="hallmark-glow-card"
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '520px',
          width: 'min(520px, 92vw)',
          maxHeight: 'min(90dvh, 620px)',
          padding: 'clamp(20px, 3vh, 32px) clamp(16px, 4vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(10px, 1.6vh, 14px)',
        }}
      >
        {/* Top Royal Badge */}
        <span
          style={{
            fontSize: '10.5px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            fontWeight: 700,
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '4px 16px',
            borderRadius: '999px',
            border: '1px solid oklch(90% 0.16 85 / 0.4)',
          }}
        >
          ✨ ĐẠI TIỆC CHÚC MỪNG SINH NHẬT ✨
        </span>

        {/* CON KIẾN CHÚA ĐÁNG YÊU (Thay thế Avatar) */}
        <div style={{ position: 'relative' }}>
          <QueenAnt size="lg" />
        </div>

        {/* Shimmering Royal Headline */}
        <div>
          <ShimmerText as="h1" className="celebration-headline">
            Chúc Mừng Sinh Nhật {name}! 🎉
          </ShimmerText>
          <style>{`
            .celebration-headline {
              font-family: var(--font-display, "Cormorant Garamond", serif);
              font-style: italic;
              font-weight: 700;
              font-size: clamp(24px, 4vh, 36px);
              line-height: 1.15;
              margin: 0;
              color: #ffffff;
            }
          `}</style>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 'clamp(13px, 1.8vh, 15px)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: 'var(--color-accent-soft)',
              letterSpacing: '0.04em',
            }}
          >
            Hôm nay là ngày tỏa sáng nhất của {name} ✨
          </p>
        </div>

        {/* Heartfelt Outro Wish Scroll Decree */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            border: '1px solid rgba(254, 240, 138, 0.4)',
            borderRadius: '16px',
            padding: '12px 18px',
            margin: '2px 0',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(13.5px, 1.8vh, 15.5px)',
              fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)',
              fontStyle: 'italic',
              lineHeight: 1.55,
              color: '#fef08a',
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}
          >
            “{outroWish}”
          </p>
          <div
            style={{
              marginTop: 6,
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#fde047',
              fontWeight: 700,
            }}
          >
            — Phi 🌟 —
          </div>
        </div>

        {/* Action Buttons: Pháo hoa, Trái tim & Chơi lại */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            marginTop: 4,
          }}
        >
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              type="button"
              className="hallmark-primary-btn"
              onClick={triggerFireworkBurst}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div className="celebration-shimmer" />
              <span>Bắn Pháo Hoa 🎆</span>
            </button>

            {/* Funny Sunglasses Ant pops up on >3 clicks */}
            {showFireworkAnt && <FireworkSunglassesAnt />}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="hallmark-secondary-btn"
              onClick={onReplay}
            >
              Chơi Lại Từ Đầu ↺
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Sub-component: Firework Sunglasses Shocked Ant (Bé Kiến Đeo Kính Râm)
 * ------------------------------------------------------------------ */
function FireworkSunglassesAnt() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 12px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.65))',
        animation: 'promptAntPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      {/* Comic Speech Bubble */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
          color: '#1c1917',
          padding: '8px 18px',
          borderRadius: 18,
          border: '2px solid #ca8a04',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
          fontWeight: 800,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '14px', color: '#854d0e', fontWeight: 800 }}>
          Bắn gì mà dữ dằn dạ má?! 🐜💥🎆
        </div>
        <div style={{ fontSize: '12px', color: '#713f12', fontStyle: 'italic', marginTop: 2 }}>
          Mù con mắt tui gòy! Đẹp thì đẹp mà chói quáaa! 😎💖
        </div>
        {/* Bubble pointer triangle */}
        <div
          style={{
            position: 'absolute',
            bottom: -7,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '7px solid #ca8a04',
          }}
        />
      </div>

      {/* Handcrafted Sunglasses Firework Ant SVG */}
      <svg viewBox="0 0 130 100" width="126" height="96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 2 }}>
        {/* Ambient Sparkles */}
        <path d="M 20 20 L 22 25 L 27 27 L 22 29 L 20 34 L 18 29 L 13 27 L 18 25 Z" fill="#facc15" />
        <path d="M 112 24 L 113 28 L 117 29 L 113 30 L 112 34 L 111 30 L 107 29 L 111 28 Z" fill="#f43f5e" />

        {/* Ant Antennae */}
        <path d="M 52 30 Q 36 12 44 4" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="4" r="3.5" fill="#facc15" stroke="#ea580c" strokeWidth="1" />
        <path d="M 78 30 Q 94 12 86 4" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="86" cy="4" r="3.5" fill="#facc15" stroke="#ea580c" strokeWidth="1" />

        {/* Ant Body */}
        <ellipse cx="65" cy="74" rx="34" ry="22" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
        <ellipse cx="65" cy="76" rx="20" ry="14" fill="#ffedd5" />

        {/* Head */}
        <ellipse cx="65" cy="48" rx="28" ry="24" fill="#f97316" stroke="#c2410c" strokeWidth="2" />

        {/* Cool Black Sunglasses */}
        <ellipse cx="52" cy="46" rx="12" ry="9" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
        <ellipse cx="78" cy="46" rx="12" ry="9" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M 64 45 L 66 45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="46" y1="42" x2="52" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="72" y1="42" x2="78" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />

        {/* Laughing Ant Mouth */}
        <path d="M 58 56 Q 65 62 72 56" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="65" cy="58" r="2" fill="#f43f5e" />

        {/* Waving Clapping Ant Legs */}
        <g transform="translate(38, 54)">
          <ellipse cx="8" cy="10" rx="8" ry="7" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.6" />
          <circle cx="8" cy="10" r="2.5" fill="#f43f5e" />
        </g>
        <g transform="translate(76, 54)">
          <ellipse cx="8" cy="10" rx="8" ry="7" fill="#ffedd5" stroke="#c2410c" strokeWidth="1.6" />
          <circle cx="8" cy="10" r="2.5" fill="#f43f5e" />
        </g>
      </svg>
    </div>
  );
}