'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import ShimmerText from '@/components/bits/ShimmerText';
import QueenAnt from '@/components/bits/QueenAnt';
import GrandFireworksShow from '@/components/bits/GrandFireworksShow';
import LuckyWheel, { type LuckyWheelHandle } from '@/components/bits/LuckyWheel';
import type { WheelPrize } from '@/lib/types';

type Props = {
  name: string;
  outroWish: string;
  prizes?: WheelPrize[];
  onReplay: () => void;
};

type Sub = 'intro' | 'wheel' | 'reveal';

/**
 * Celebration Finale — 3-State Screen Swap:
 *   1. intro  — Showcase card with "Mở Vòng Quay May Mắn" CTA.
 *   2. wheel  — Full-screen Lucky Wheel with spin button + back to intro.
 *   3. reveal — Prize card with replay-wheel / replay-all / firework buttons.
 *
 * Tông bạn bè anh-em vui vẻ cho Mỹ Hương, kèm Vòng Quay May Mắn.
 */
export default function Celebration({ name, outroWish, prizes = [], onReplay }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const [sub, setSub] = useState<Sub>('intro');
  const [won, setWon] = useState<WheelPrize | null>(null);
  const [replayKey, setReplayKey] = useState(0); // bumps to force WheelStage remount so spin resets
  const [fireworkKey, setFireworkKey] = useState<number>(0);

  // Firework >3 clicks teaser ant (8s, only once)
  const [showFireworkAnt, setShowFireworkAnt] = useState(false);
  const [hasShownFireworkAnt, setHasShownFireworkAnt] = useState(false);

  const triggerFireworkBurst = () => {
    setFireworkKey(Date.now());
    if (!hasShownFireworkAnt) {
      setHasShownFireworkAnt(true);
      setShowFireworkAnt(true);
      try {
        const audio = new Audio('/sounds/ant_chirp.wav');
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } catch {}
      window.setTimeout(() => setShowFireworkAnt(false), 8000);
    }
  };

  const openWheel = () => {
    setSub('wheel');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };
  const goIntro = () => {
    setSub('intro');
    setWon(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };
  const handleWheelResult = (prize: WheelPrize) => {
    setWon(prize);
    setSub('reveal');
    setFireworkKey(Date.now()); // celebration burst on win
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };
  const replayWheel = () => {
    setWon(null);
    setReplayKey((n) => n + 1);
    setSub('wheel');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // Lock body scroll while in any celebration stage so the screen feels like a finale.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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

      {sub === 'intro' && (
        <IntroStage
          name={name}
          outroWish={outroWish}
          reduced={reduced}
          hasWheel={prizes.length >= 2}
          onOpenWheel={openWheel}
          onFirework={triggerFireworkBurst}
          showFireworkAnt={showFireworkAnt}
        />
      )}

      {sub === 'wheel' && prizes.length >= 2 && (
        <WheelStage
          key={replayKey}
          prizes={prizes}
          reduced={reduced}
          onResult={handleWheelResult}
          onBack={goIntro}
        />
      )}

      {sub === 'reveal' && won && (
        <RevealStage
          name={name}
          prize={won}
          outroWish={outroWish}
          reduced={reduced}
          onReplayWheel={replayWheel}
          onReplay={onReplay}
          onFirework={triggerFireworkBurst}
          showFireworkAnt={showFireworkAnt}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Sub-component: INTRO — showcase card with "Mở Vòng Quay" CTA
 * ------------------------------------------------------------------ */
function IntroStage({
  name,
  outroWish,
  reduced,
  hasWheel,
  onOpenWheel,
  onFirework,
  showFireworkAnt,
}: {
  name: string;
  outroWish: string;
  reduced: boolean;
  hasWheel: boolean;
  onOpenWheel: () => void;
  onFirework: () => void;
  showFireworkAnt: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced || !cardRef.current) return;
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.5)' },
      );
    },
    { scope: cardRef },
  );

  return (
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

      {/* CON KIẾN CHÚA ĐÁNG YÊU */}
      <div style={{ position: 'relative' }}>
        <QueenAnt size="md" />
      </div>

      {/* Shimmering Headline */}
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

      {/* Outro Wish Box */}
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
          — Anh Phi 🌟 —
        </div>
      </div>

      {/* Action Buttons */}
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
        {hasWheel && (
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              type="button"
              className="hallmark-primary-btn"
              onClick={onOpenWheel}
              aria-label="Mở vòng quay may mắn"
            >
              <div className="celebration-shimmer" />
              <span>🎁 Mở Vòng Quay May Mắn ✨</span>
            </button>
          </div>
        )}

        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <button
            type="button"
            className="hallmark-secondary-btn"
            onClick={onFirework}
          >
            🎆 Bắn Pháo Hoa
          </button>
          {showFireworkAnt && <FireworkSunglassesAnt />}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sub-component: WHEEL — full-screen Lucky Wheel
 * ------------------------------------------------------------------ */
function WheelStage({
  prizes,
  reduced,
  onResult,
  onBack,
}: {
  prizes: WheelPrize[];
  reduced: boolean;
  onResult: (prize: WheelPrize) => void;
  onBack: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<LuckyWheelHandle | null>(null);
  const [spinning, setSpinning] = useState(false);

  useGSAP(
    () => {
      if (reduced || !stageRef.current) return;
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, scale: 0.94, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.3)' },
      );
    },
    { scope: stageRef },
  );

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    wheelRef.current?.spin();
  };

  return (
    <div
      ref={stageRef}
      className="hallmark-glow-card"
      style={{
        position: 'relative',
        zIndex: 3,
        maxWidth: '500px',
        width: 'min(500px, 92vw)',
        maxHeight: 'min(90dvh, 600px)',
        padding: 'clamp(14px, 2vh, 22px) clamp(14px, 3vw, 20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(8px, 1.4vh, 12px)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
          fontWeight: 700,
          fontStyle: 'italic',
          fontSize: 'clamp(20px, 3vh, 28px)',
          margin: 0,
          color: '#fde047',
          textShadow: '0 0 14px rgba(234, 179, 8, 0.55)',
        }}
      >
        ✨ Vòng Quay May Mắn ✨
      </h2>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
          fontSize: 'clamp(12px, 1.5vh, 14px)',
          fontStyle: 'italic',
          color: '#ffffff',
          opacity: 0.85,
          maxWidth: 380,
        }}
      >
        Mỹ Hương nhấn nút để quay — xem hôm nay nhận được phần quà nào nha! 🎁
      </p>

      <LuckyWheel
        ref={wheelRef}
        prizes={prizes}
        onResult={(prize) => {
          setSpinning(false);
          onResult(prize);
        }}
      />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          className="hallmark-primary-btn"
          onClick={handleSpin}
          disabled={spinning}
          aria-label={spinning ? 'Đang quay' : 'Quay ngay'}
        >
          <div className="celebration-shimmer" />
          <span>{spinning ? '🎲 Đang Quay…' : '🎉 Quay Ngay ✨'}</span>
        </button>
        <button
          type="button"
          className="hallmark-secondary-btn"
          onClick={onBack}
          disabled={spinning}
        >
          ← Quay Lại
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sub-component: REVEAL — prize card with replay options
 * ------------------------------------------------------------------ */
function RevealStage({
  name,
  prize,
  outroWish,
  reduced,
  onReplayWheel,
  onReplay,
  onFirework,
  showFireworkAnt,
}: {
  name: string;
  prize: WheelPrize;
  outroWish: string;
  reduced: boolean;
  onReplayWheel: () => void;
  onReplay: () => void;
  onFirework: () => void;
  showFireworkAnt: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced || !cardRef.current) return;
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24, scale: 0.92, rotate: -1 },
        { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.85, ease: 'back.out(1.5)' },
      );
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className="hallmark-glow-card"
      style={{
        position: 'relative',
        zIndex: 3,
        maxWidth: '520px',
        width: 'min(520px, 92vw)',
        maxHeight: 'min(90dvh, 620px)',
        padding: 'clamp(18px, 2.8vh, 28px) clamp(16px, 4vw, 26px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(8px, 1.4vh, 12px)',
      }}
    >
      {/* Golden Prize Seal */}
      <div
        aria-hidden
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 35% 30%, #fef08a, #eab308 50%, #854d0e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 8px 24px oklch(65% 0.28 350 / 0.55), 0 0 18px rgba(234, 179, 8, 0.6)',
          border: '2px solid #ffffff',
          fontSize: 34,
        }}
      >
        {prize.emoji || '🎁'}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 11,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#fde047',
          fontWeight: 700,
        }}
      >
        🎉 Chúc Mừng Em Đã Trúng Thưởng 🎉
      </p>

      <ShimmerText as="h2" className="reveal-prize">
        {prize.label}
      </ShimmerText>
      <style>{`
        .reveal-prize {
          font-family: var(--font-display, "Cormorant Garamond", serif);
          font-style: italic;
          font-weight: 700;
          font-size: clamp(22px, 3.6vh, 34px);
          line-height: 1.15;
          margin: 0;
          color: #ffffff;
          text-shadow: 0 0 18px oklch(65% 0.30 350 / 0.85);
          text-align: center;
        }
      `}</style>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.10)',
          border: '1px solid rgba(254, 240, 138, 0.4)',
          borderRadius: '14px',
          padding: '10px 16px',
          margin: '2px 0',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(13px, 1.7vh, 14.5px)',
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            color: '#fef08a',
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
            textAlign: 'right',
          }}
        >
          — Anh Phi 🌟 —
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 6,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          type="button"
          className="hallmark-secondary-btn"
          onClick={onReplayWheel}
        >
          🎲 Quay Lại Vòng
        </button>
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <button
            type="button"
            className="hallmark-secondary-btn"
            onClick={onFirework}
          >
            🎆 Pháo Hoa
          </button>
          {showFireworkAnt && <FireworkSunglassesAnt />}
        </div>
        <button
          type="button"
          className="hallmark-primary-btn"
          onClick={onReplay}
          aria-label="Xem lại từ đầu"
        >
          <div className="celebration-shimmer" />
          <span>🔄 Chơi Lại Từ Đầu</span>
        </button>
      </div>
    </div>
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
