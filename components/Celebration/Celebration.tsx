'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import ShimmerText from '@/components/bits/ShimmerText';
import Avatar from '@/components/bits/Avatar';
import LuckyWheel, { type LuckyWheelHandle } from '@/components/bits/LuckyWheel';
import MischiefCatsParty from '@/components/bits/MischiefCatsParty';
import GrandFireworksShow from '@/components/bits/GrandFireworksShow';
import type { WheelPrize } from '@/lib/types';

type Props = {
  name: string;
  outroWish: string;
  prizes: WheelPrize[];
  onReplay: () => void;
};

type Sub = 'intro' | 'wheel' | 'reveal';

/**
 * Celebration Finale — Single Screen Showcase (Zero Scrolling):
 *   - Grand Fireworks & Cascading Glowing Hearts Show.
 *   - Mischievous Playful Cats Party (Chasing, playful biting, licking, batting yarn, somersaults).
 *   - Royal Crowned Avatar, Golden Shimmer Typography, Lucky Gift Wheel & Royal Certificate Prize Reveal.
 */
export default function Celebration({ name, outroWish, prizes, onReplay }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const [sub, setSub] = useState<Sub>('intro');
  const [won, setWon] = useState<WheelPrize | null>(null);
  const [fireworkKey, setFireworkKey] = useState<number>(0);

  const openWheel = () => setSub('wheel');
  const handleWheelResult = (prize: WheelPrize) => {
    setWon(prize);
    setSub('reveal');
    setFireworkKey(Date.now());
  };
  const replayWheel = () => {
    setWon(null);
    setSub('wheel');
  };

  // Firework >3 clicks teaser cat (8s, only once)
  const [fireworkClicks, setFireworkClicks] = useState(0);
  const [showFireworkCat, setShowFireworkCat] = useState(false);
  const [hasShownFireworkCat, setHasShownFireworkCat] = useState(false);

  const triggerFireworkBurst = () => {
    setFireworkKey(Date.now());
    if (!hasShownFireworkCat) {
      setFireworkClicks((prev) => {
        const next = prev + 1;
        if (next > 3) {
          setShowFireworkCat(true);
          setHasShownFireworkCat(true);
          try {
            const audio = new Audio('/sounds/dog_bark.wav');
            audio.volume = 0.7;
            audio.play().catch(() => {});
          } catch {}

          window.setTimeout(() => {
            setShowFireworkCat(false);
          }, 8000); // 8s visible, then hides!
        }
        return next;
      });
    }
  };

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

        @keyframes promptCatPop {
          0% { transform: translateX(-50%) scale(0) translateY(24px); opacity: 0; }
          60% { transform: translateX(-50%) scale(1.12) translateY(-4px); opacity: 1; }
          80% { transform: translateX(-50%) scale(0.96) translateY(2px); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }

        @keyframes pawWave {
          0% { transform: rotate(-10deg); }
          100% { transform: rotate(18deg); }
        }

        .hallmark-glow-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid oklch(90% 0.16 85 / 0.55);
          backdrop-filter: blur(14px);
          border-radius: 24px;
          box-shadow: 0 20px 50px -12px oklch(65% 0.28 350 / 0.40), 0 0 30px oklch(90% 0.16 85 / 0.22), inset 0 1px 2px rgba(255,255,255,0.5);
          box-sizing: border-box;
        }

        .hallmark-primary-btn {
          position: relative;
          background: linear-gradient(135deg, oklch(62% 0.24 350) 0%, oklch(52% 0.26 15) 50%, oklch(66% 0.22 340) 100%);
          color: #ffffff;
          border: 2px solid oklch(92% 0.16 85);
          padding: 10px 26px;
          border-radius: 999px;
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(14px, 1.8vh, 17px);
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
          font-family: var(--font-display);
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

      {/* === GRAND FIREWORKS & CASCADING HEARTS SHOW (Continuous Ambient + On Demand) === */}
      <GrandFireworksShow triggerKey={fireworkKey} autoLoop={true} />

      {/* === MISCHIEVOUS CATS PARTY (Running, Biting, Licking, Tumbling across screen) === */}
      <MischiefCatsParty />

      {/* Ambient Starlight Glow Halo */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '40%',
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

      {/* SUBSTATE: INTRO */}
      {sub === 'intro' && (
        <Intro
          name={name}
          reduced={reduced}
          onOpen={openWheel}
          onFirework={triggerFireworkBurst}
          showFireworkCat={showFireworkCat}
        />
      )}

      {/* SUBSTATE: LUCKY WHEEL */}
      {sub === 'wheel' && (
        <WheelStage
          prizes={prizes}
          reduced={reduced}
          onResult={handleWheelResult}
        />
      )}

      {/* SUBSTATE: REVEAL PRIZE */}
      {sub === 'reveal' && won && (
        <Reveal
          name={name}
          prize={won}
          outroWish={outroWish}
          reduced={reduced}
          onReplayWheel={replayWheel}
          onReplay={onReplay}
          onFirework={triggerFireworkBurst}
          showFireworkCat={showFireworkCat}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Sub-component: Firework Sunglasses Shocked Cat
 * ------------------------------------------------------------------ */
function FireworkSunglassesCat() {
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
        animation: 'promptCatPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
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
          Bắn gì mà dữ dằn dạ má?! 🐶💥🎆
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

      {/* Handcrafted Sunglasses Firework Puppy SVG */}
      <svg viewBox="0 0 130 100" width="126" height="96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 2 }}>
        {/* Ambient Sparkles */}
        <path d="M 20 20 L 22 25 L 27 27 L 22 29 L 20 34 L 18 29 L 13 27 L 18 25 Z" fill="#facc15" />
        <path d="M 112 24 L 113 28 L 117 29 L 113 30 L 112 34 L 111 30 L 107 29 L 111 28 Z" fill="#f43f5e" />

        {/* Puppy Body */}
        <ellipse cx="65" cy="74" rx="34" ry="22" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
        <ellipse cx="65" cy="76" rx="20" ry="14" fill="#ffedd5" />

        {/* Drooping Puppy Ears */}
        <path d="M 44 42 C 26 44, 18 64, 28 72 C 38 78, 46 62, 48 48 Z" fill="#c2410c" stroke="#9a3412" strokeWidth="1.5" />
        <path d="M 86 42 C 104 44, 112 64, 102 72 C 92 78, 84 62, 82 48 Z" fill="#c2410c" stroke="#9a3412" strokeWidth="1.5" />

        {/* Head */}
        <circle cx="65" cy="48" r="26" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
        <ellipse cx="65" cy="56" rx="14" ry="9" fill="#ffedd5" />

        {/* Cool Black Sunglasses */}
        <ellipse cx="52" cy="46" rx="12" ry="9" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
        <ellipse cx="78" cy="46" rx="12" ry="9" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M 64 45 L 66 45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="46" y1="42" x2="52" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="72" y1="42" x2="78" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />

        {/* Shiny Black Button Nose */}
        <ellipse cx="65" cy="53" rx="3.5" ry="2.4" fill="#0f172a" />

        {/* Laughing Puppy Mouth & Tongue */}
        <path d="M 58 56 Q 65 62 72 56" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 62 58 C 61 66, 69 66, 68 58 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />

        {/* Clapping Paws */}
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

/* ------------------------------------------------------------------ *
 * Sub-component: INTRO
 * ------------------------------------------------------------------ */
function Intro({
  name,
  reduced,
  onOpen,
  onFirework,
  showFireworkCat,
}: {
  name: string;
  reduced: boolean;
  onOpen: () => void;
  onFirework: () => void;
  showFireworkCat: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 15s idle teaser cat prompting to open the wheel
  const [showIntroPromptCat, setShowIntroPromptCat] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (hasOpened) {
      setShowIntroPromptCat(false);
      return;
    }

    let hideTimeout: number | undefined;
    let nextShowTimeout: number | undefined;

    const scheduleShow = () => {
      setShowIntroPromptCat(true);
      try {
        const audio = new Audio('/sounds/dog_bark.wav');
        audio.volume = 0.65;
        audio.play().catch(() => {});
      } catch {}

      // Keep visible for 5s then hide
      hideTimeout = window.setTimeout(() => {
        setShowIntroPromptCat(false);
        // Wait 15s before showing again if still not opened
        nextShowTimeout = window.setTimeout(() => {
          scheduleShow();
        }, 15000);
      }, 5000);
    };

    // First trigger after 15s if not opened
    const initialTimer = window.setTimeout(() => {
      scheduleShow();
    }, 15000);

    return () => {
      window.clearTimeout(initialTimer);
      if (nextShowTimeout) window.clearTimeout(nextShowTimeout);
      if (hideTimeout) window.clearTimeout(hideTimeout);
    };
  }, [hasOpened]);

  const handleOpenClick = () => {
    setHasOpened(true);
    setShowIntroPromptCat(false);
    onOpen();
  };

  useGSAP(
    () => {
      if (reduced) return;
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 24, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.5)' },
        );
      }
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
        maxHeight: 'min(88dvh, 580px)',
        padding: 'clamp(20px, 3vh, 32px) clamp(16px, 4vw, 28px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(10px, 1.8vh, 16px)',
      }}
    >
      {/* Top Royal Badge */}
      <span
        style={{
          fontSize: '10px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          fontWeight: 700,
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '4px 14px',
          borderRadius: '999px',
          border: '1px solid oklch(90% 0.16 85 / 0.4)',
        }}
      >
        ✨ Món Quà Sinh Nhật Đặc Biệt ✨
      </span>

      {/* Birthday Girl Avatar with Crown */}
      <div style={{ position: 'relative' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-16px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '22px',
            filter: 'drop-shadow(0 4px 8px rgba(234, 179, 8, 0.8))',
            zIndex: 4,
          }}
        >
          👑
        </div>
        <Avatar name={name} size="md" caption="" hideName imageUrl="/photos/avta.jpg" />
      </div>

      {/* Shimmering Headline */}
      <div>
        <ShimmerText as="h1" className="celebration-headline">
          Chúc Mừng Sinh Nhật, {name}!
        </ShimmerText>
        <style>{`
          .celebration-headline {
            font-family: var(--font-display, "Cormorant Garamond", serif);
            font-style: italic;
            font-weight: 700;
            font-size: clamp(24px, 4vh, 38px);
            line-height: 1.15;
            margin: 4px 0 0;
            color: #ffffff;
            text-shadow: 0 0 18px oklch(65% 0.30 350 / 0.8);
          }
        `}</style>
      </div>

      <p
        style={{
          maxWidth: 420,
          margin: 0,
          fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
          fontSize: 'clamp(15px, 2vh, 18px)',
          lineHeight: 1.45,
          color: '#ffffff',
          opacity: 0.9,
          fontStyle: 'italic',
        }}
      >
        Mời em xoay vòng quay may mắn — xem hôm nay nhận được phần quà bất ngờ nào nhé! 🎁
      </p>

      {/* Buttons: Open Lucky Wheel + Firework Fun */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          {showIntroPromptCat && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 12px)',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 35,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.55))',
                animation: 'promptCatPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              }}
            >
              {/* Comic Speech Bubble */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fef9c3 0%, #fed7aa 100%)',
                  color: '#1c1917',
                  padding: '8px 18px',
                  borderRadius: 18,
                  border: '2px solid #f97316',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                  fontWeight: 800,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '14px', color: '#9a3412', fontWeight: 800 }}>
                  Ủa tính đứng ngắm hoài dạ cô nương? 🐶👑
                </div>
                <div style={{ fontSize: '12px', color: '#7c2d12', fontStyle: 'italic', marginTop: 2 }}>
                  Bấm mở vòng quay lẹ đii, quà xịn đang chờ kìa! 🎁✨
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
                    borderTop: '7px solid #f97316',
                  }}
                />
              </div>

              {/* Handcrafted Fluffy Party Hat Puppy with Waving Beckoning Paw */}
              <svg viewBox="0 0 130 100" width="124" height="96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 2 }}>
                {/* Puppy Body */}
                <ellipse cx="65" cy="74" rx="34" ry="22" fill="#ffffff" stroke="#e0e7ff" strokeWidth="2" />
                <ellipse cx="65" cy="76" rx="20" ry="14" fill="#fff1f2" />

                {/* Left & Right Drooping Puppy Ears */}
                <path d="M 44 42 C 26 44, 18 64, 28 72 C 38 78, 46 62, 48 48 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
                <path d="M 86 42 C 104 44, 112 64, 102 72 C 92 78, 84 62, 82 48 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />

                {/* Festive Birthday Party Cone Hat */}
                <path d="M 54 30 L 65 4 L 76 30 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
                <circle cx="65" cy="4" r="5" fill="#fde047" stroke="#ca8a04" strokeWidth="1.2" />
                <path d="M 57 22 L 73 22" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <path d="M 60 14 L 70 14" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="65" cy="18" r="1.5" fill="#ffffff" />

                {/* Head */}
                <circle cx="65" cy="48" r="26" fill="#ffffff" stroke="#e0e7ff" strokeWidth="2" />
                <ellipse cx="65" cy="56" rx="14" ry="9" fill="#fef08a" opacity="0.6" />

                {/* Eyes */}
                <ellipse cx="53" cy="46" rx="5.5" ry="6.5" fill="#0f172a" />
                <circle cx="51.5" cy="44" r="2.2" fill="#ffffff" />
                <circle cx="55" cy="48" r="1.1" fill="#38bdf8" />

                <ellipse cx="77" cy="46" rx="5.5" ry="6.5" fill="#0f172a" />
                <circle cx="75.5" cy="44" r="2.2" fill="#ffffff" />
                <circle cx="79" cy="48" r="1.1" fill="#38bdf8" />

                {/* Shiny Puppy Button Nose */}
                <ellipse cx="65" cy="53" rx="3.5" ry="2.4" fill="#0f172a" />

                {/* Happy Puppy Mouth & Tongue */}
                <path d="M 59 55 Q 65 59 71 55" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M 62 57 C 61 64, 69 64, 68 57 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />

                {/* Cheeks */}
                <ellipse cx="44" cy="52" rx="4.5" ry="3" fill="#f43f5e" opacity="0.45" />
                <ellipse cx="86" cy="52" rx="4.5" ry="3" fill="#f43f5e" opacity="0.45" />

                {/* Left Paw Resting */}
                <g transform="translate(36, 60)">
                  <ellipse cx="10" cy="10" rx="9" ry="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.6" />
                  <circle cx="10" cy="10" r="2.5" fill="#fda4af" />
                </g>
                {/* Right Paw BECKONING / WAVING */}
                <g transform="translate(78, 50)" style={{ animation: 'pawWave 0.8s infinite alternate ease-in-out', transformOrigin: '5px 15px' }}>
                  <ellipse cx="10" cy="8" rx="9" ry="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.6" />
                  <circle cx="10" cy="8" r="3" fill="#fda4af" />
                  <circle cx="7" cy="4" r="1.5" fill="#fda4af" />
                  <circle cx="10" cy="3" r="1.5" fill="#fda4af" />
                  <circle cx="13" cy="4" r="1.5" fill="#fda4af" />
                </g>
              </svg>
            </div>
          )}

          <button onClick={handleOpenClick} className="hallmark-primary-btn" aria-label="Mở vòng quay may mắn">
            <div className="celebration-shimmer" />
            <span>🎁 Mở Vòng Quay May Mắn ✨</span>
          </button>
        </div>

        <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          {showFireworkCat && <FireworkSunglassesCat />}
          <button onClick={onFirework} className="hallmark-secondary-btn" aria-label="Bắn pháo hoa chúc mừng">
            <span>🎆 Pháo Hoa & Trái Tim 💖</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sub-component: WHEEL
 * ------------------------------------------------------------------ */
function WheelStage({
  prizes,
  reduced,
  onResult,
}: {
  prizes: WheelPrize[];
  reduced: boolean;
  onResult: (prize: WheelPrize) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<LuckyWheelHandle | null>(null);
  const [spinning, setSpinning] = useState(false);

  // 15s idle teaser cat prompting user to spin
  const [showPromptCat, setShowPromptCat] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const promptCatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasSpun) {
      setShowPromptCat(false);
      return;
    }

    let hideTimeout: number | undefined;
    let nextShowTimeout: number | undefined;

    const scheduleShow = () => {
      setShowPromptCat(true);
      try {
        const audio = new Audio('/sounds/dog_bark.wav');
        audio.volume = 0.65;
        audio.play().catch(() => {});
      } catch {}

      // Keep visible for 5s then hide
      hideTimeout = window.setTimeout(() => {
        setShowPromptCat(false);
        // Wait 15s before showing again if not clicked
        nextShowTimeout = window.setTimeout(() => {
          scheduleShow();
        }, 15000);
      }, 5000);
    };

    // First trigger after 15s if not spun
    const initialTimer = window.setTimeout(() => {
      scheduleShow();
    }, 15000);

    return () => {
      window.clearTimeout(initialTimer);
      if (nextShowTimeout) window.clearTimeout(nextShowTimeout);
      if (hideTimeout) window.clearTimeout(hideTimeout);
    };
  }, [hasSpun]);

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (headRef.current) {
        tl.fromTo(
          headRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.1,
        );
      }
      if (wrapRef.current) {
        tl.fromTo(
          wrapRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)' },
          0.2,
        );
      }
    },
    { scope: wrapRef },
  );

  const handleSpin = () => {
    if (spinning || hasSpun) return;
    setHasSpun(true);
    setShowPromptCat(false);
    setSpinning(true);
    wheelRef.current?.spin();
  };

  return (
    <div
      className="hallmark-glow-card"
      style={{
        position: 'relative',
        zIndex: 3,
        maxWidth: '500px',
        width: 'min(500px, 92vw)',
        maxHeight: 'min(90dvh, 580px)',
        padding: 'clamp(14px, 2vh, 22px) clamp(14px, 3vw, 20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(6px, 1.2vh, 10px)',
      }}
    >
      <div ref={headRef}>
        <h2
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 3vh, 28px)',
            margin: 0,
            color: 'var(--color-gold)',
            textShadow: '0 0 12px rgba(234, 179, 8, 0.6)',
          }}
        >
          ✨ Vòng Quay May Mắn ✨
        </h2>
        <p
          style={{
            maxWidth: 380,
            margin: '4px auto 0',
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontSize: 'clamp(12px, 1.5vh, 14px)',
            fontStyle: 'italic',
            color: '#ffffff',
            opacity: 0.85,
          }}
        >
          Nhấn nút để quay quà sinh nhật nha!
        </p>
      </div>

      <div ref={wrapRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <LuckyWheel
          ref={wheelRef}
          prizes={prizes}
          onResult={(prize) => {
            setSpinning(false);
            onResult(prize);
          }}
        />
      </div>

      <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        {showPromptCat && (
          <div
            ref={promptCatRef}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.55))',
              animation: 'promptCatPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
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
                Ủa không muốn mở quà hả? 🐶🎁
              </div>
              <div style={{ fontSize: '12px', color: '#713f12', fontStyle: 'italic', marginTop: 2 }}>
                Chê đúng hơm, bấm quay lẹ đii nèee! 😜👇
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

            {/* Handcrafted Vector Puppy Pointing Down */}
            <svg viewBox="0 0 130 95" width="124" height="90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 2 }}>
              <ellipse cx="65" cy="68" rx="34" ry="22" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <ellipse cx="65" cy="70" rx="20" ry="14" fill="#fef3c7" />

              {/* Drooping Puppy Ears */}
              <path d="M 44 38 C 26 40, 18 60, 28 68 C 38 74, 46 58, 48 44 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
              <path d="M 86 38 C 104 40, 112 60, 102 68 C 92 74, 84 58, 82 44 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />

              {/* Puppy Head */}
              <circle cx="65" cy="42" r="25" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <ellipse cx="65" cy="49" rx="14" ry="9" fill="#ffffff" />

              {/* Mischievous Eyes */}
              <path d="M 48 39 Q 54 34 60 39" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" />
              <ellipse cx="76" cy="38" rx="4.5" ry="5.5" fill="#1c1917" />
              <circle cx="74.5" cy="36.5" r="1.8" fill="#ffffff" />
              <circle cx="77.5" cy="40" r="0.9" fill="#ffffff" />

              {/* Shiny Puppy Nose */}
              <ellipse cx="65" cy="45" rx="3.5" ry="2.4" fill="#0f172a" />

              {/* Puppy Mouth & Tongue */}
              <path d="M 59 48 Q 65 52 71 48" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M 62 50 C 61 57, 69 57, 68 50 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />

              {/* Cheeks */}
              <ellipse cx="46" cy="45" rx="4" ry="2.5" fill="#f43f5e" opacity="0.45" />
              <ellipse cx="84" cy="45" rx="4" ry="2.5" fill="#f43f5e" opacity="0.45" />

              {/* Pointing down puppy paws */}
              <g transform="translate(34, 52)">
                <ellipse cx="10" cy="10" rx="10" ry="8" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" />
                <path d="M 10 16 L 10 26 L 6 20 M 10 26 L 14 20" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="3" fill="#f43f5e" />
              </g>
              <g transform="translate(76, 52)">
                <ellipse cx="10" cy="10" rx="10" ry="8" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" />
                <path d="M 10 16 L 10 26 L 6 20 M 10 26 L 14 20" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="3" fill="#f43f5e" />
              </g>
            </svg>
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={spinning}
          className="hallmark-primary-btn"
          aria-label={spinning ? 'Đang quay...' : 'Quay Thưởng'}
        >
          <div className="celebration-shimmer" />
          <span>{spinning ? '🎲 Đang Quay...' : '🎉 Quay Ngay ✨'}</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sub-component: REVEAL
 * ------------------------------------------------------------------ */
function Reveal({
  name,
  prize,
  outroWish,
  reduced,
  onReplayWheel,
  onReplay,
  onFirework,
  showFireworkCat,
}: {
  name: string;
  prize: WheelPrize;
  outroWish: string;
  reduced: boolean;
  onReplayWheel: () => void;
  onReplay: () => void;
  onFirework: () => void;
  showFireworkCat: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wishRef = useRef<HTMLParagraphElement>(null);

  // Cat Scare Tease state when user hovers or taps on "Quay Lại"
  const [isReplayLocked, setIsReplayLocked] = useState(false);
  const [showCatScare, setShowCatScare] = useState(false);
  const catScareRef = useRef<HTMLDivElement>(null);
  const replayBtnRef = useRef<HTMLButtonElement>(null);

  const triggerCatScare = () => {
    if (isReplayLocked) return;
    setIsReplayLocked(true);
    setShowCatScare(true);

    try {
      const audio = new Audio('/sounds/dog_bark.wav');
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch {}

    if (replayBtnRef.current) {
      gsap.fromTo(
        replayBtnRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.2)' },
      );
    }

    setTimeout(() => {
      if (catScareRef.current) {
        gsap.to(catScareRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 15,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => setShowCatScare(false),
        });
      }
    }, 4200);
  };

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (cardRef.current) {
        tl.fromTo(
          cardRef.current,
          { opacity: 0, y: 24, scale: 0.92, rotate: -1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: 'back.out(1.5)',
          },
          0.1,
        );
      }
      if (wishRef.current) {
        tl.fromTo(
          wishRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.4,
        );
      }
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
        maxWidth: '500px',
        width: 'min(500px, 92vw)',
        maxHeight: 'min(88dvh, 580px)',
        padding: 'clamp(20px, 3vh, 32px) clamp(16px, 4vw, 26px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(8px, 1.5vh, 12px)',
      }}
    >
      {/* Golden Royal Paw-Print Seal */}
      <div
        aria-hidden
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 35% 30%, #fef08a, #eab308 50%, #854d0e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px oklch(65% 0.28 350 / 0.6), 0 0 16px rgba(234, 179, 8, 0.6)',
          border: '2px solid #ffffff',
        }}
      >
        <span style={{ fontSize: '30px' }}>{prize.emoji || '🎁'}</span>
      </div>

      <p
        style={{
          margin: '0',
          fontSize: 11,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
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
          font-size: clamp(24px, 4vh, 38px);
          line-height: 1.15;
          margin: 0;
          color: #ffffff;
          text-shadow: 0 0 20px oklch(65% 0.30 350 / 0.9);
        }
      `}</style>

      <p
        ref={wishRef}
        style={{
          margin: '4px 0',
          fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(14px, 1.8vh, 17px)',
          lineHeight: 1.45,
          color: '#ffffff',
          opacity: 0.92,
          maxWidth: '420px',
        }}
      >
        Chúc mừng sinh nhật {name}! {outroWish}
      </p>

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 6,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          {showCatScare && (
            <div
              ref={catScareRef}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 35,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.65))',
              }}
            >
              {/* Comic Speech Bubble */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
                  color: '#1c1917',
                  padding: '7px 16px',
                  borderRadius: 16,
                  border: '2px solid #ca8a04',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                  fontWeight: 800,
                  fontSize: '13px',
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: '15px' }}>Gâu! Hù! 🐶🐾</span> 1 Lần Thôi Người Ơi~!
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

              {/* Handcrafted Pouncing Vector Puppy SVG */}
              <svg viewBox="0 0 140 95" width="126" height="85" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: 2 }}>
                {/* Waving tail */}
                <path d="M 25 70 C 10 55, 5 35, 18 25 C 24 20, 30 30, 26 43" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                <path d="M 18 25 C 24 20, 30 30, 26 43" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />

                {/* Puppy body */}
                <ellipse cx="70" cy="68" rx="36" ry="22" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                <ellipse cx="70" cy="70" rx="22" ry="14" fill="#fef3c7" />

                {/* Drooping Puppy Ears */}
                <path d="M 44 40 C 26 42, 18 62, 28 70 C 38 76, 46 60, 48 46 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                <path d="M 96 40 C 114 42, 122 62, 112 70 C 102 76, 94 60, 92 46 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />

                {/* Head */}
                <circle cx="70" cy="44" r="25" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                <ellipse cx="70" cy="51" rx="14" ry="9" fill="#ffffff" />

                {/* Mischievous Wink & Sparkly Eye */}
                <path d="M 54 40 Q 60 36 66 40" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" />
                <ellipse cx="80" cy="39" rx="4.5" ry="5.5" fill="#1c1917" />
                <circle cx="78.5" cy="37.5" r="1.8" fill="#ffffff" />
                <circle cx="81.5" cy="41" r="0.9" fill="#ffffff" />

                {/* Shiny Black Button Nose */}
                <ellipse cx="70" cy="47" rx="3.5" ry="2.4" fill="#0f172a" />

                {/* Puppy Mouth & Tongue */}
                <path d="M 64 50 Q 70 54 76 50" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 67 52 C 66 59, 74 59, 73 52 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />

                {/* Cheeks */}
                <ellipse cx="50" cy="46" rx="4" ry="2.5" fill="#f43f5e" opacity="0.45" />
                <ellipse cx="90" cy="46" rx="4" ry="2.5" fill="#f43f5e" opacity="0.45" />

                {/* Puppy Paws reaching out forward over the button */}
                <g transform="translate(30, 52)">
                  <ellipse cx="8" cy="8" rx="11" ry="8" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" />
                  <circle cx="4" cy="5" r="2" fill="#f43f5e" />
                  <circle cx="8" cy="3" r="2" fill="#f43f5e" />
                  <circle cx="12" cy="5" r="2" fill="#f43f5e" />
                  <ellipse cx="8" cy="9" rx="3.5" ry="2.5" fill="#f43f5e" />
                </g>
                <g transform="translate(82, 52)">
                  <ellipse cx="8" cy="8" rx="11" ry="8" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" />
                  <circle cx="4" cy="5" r="2" fill="#f43f5e" />
                  <circle cx="8" cy="3" r="2" fill="#f43f5e" />
                  <circle cx="12" cy="5" r="2" fill="#f43f5e" />
                  <ellipse cx="8" cy="9" rx="3.5" ry="2.5" fill="#f43f5e" />
                </g>
              </svg>
            </div>
          )}

          <button
            ref={replayBtnRef}
            onMouseEnter={triggerCatScare}
            onClick={triggerCatScare}
            disabled={isReplayLocked}
            className="hallmark-secondary-btn"
            style={{
              cursor: isReplayLocked ? 'not-allowed' : 'pointer',
              opacity: isReplayLocked ? 0.72 : 1,
              filter: isReplayLocked ? 'grayscale(0.35)' : 'none',
              borderColor: isReplayLocked ? '#f43f5e' : undefined,
              transition: 'all 0.3s ease',
            }}
            aria-label={isReplayLocked ? 'Đã khóa: 1 lần thôi người ơi' : 'Quay lại'}
          >
            <span>{isReplayLocked ? '🔒 1 Lần Thôi Người Ơi! 🐾' : '🎲 Quay Lại'}</span>
          </button>
        </div>
        <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          {showFireworkCat && <FireworkSunglassesCat />}
          <button
            onClick={onFirework}
            className="hallmark-secondary-btn"
            aria-label="Bắn pháo hoa"
          >
            <span>🎆 Pháo Hoa & Trái Tim 💖</span>
          </button>
        </div>
        <button
          onClick={onReplay}
          className="hallmark-primary-btn"
          aria-label="Xem lại từ đầu"
        >
          <div className="celebration-shimmer" />
          <span>🔄 Xem Lại Từ Đầu</span>
        </button>
      </div>
    </div>
  );
}