'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import type { WheelPrize } from '@/lib/types';

type Props = {
  prizes: WheelPrize[];
  /** Called with the prize that the wheel lands on. */
  onResult: (prize: WheelPrize, index: number) => void;
  /** Disable spinning. */
  disabled?: boolean;
};

export type LuckyWheelHandle = {
  /** Trigger a spin. No-op if already spinning. */
  spin: () => void;
  /** Whether the wheel is currently animating. */
  spinning: boolean;
};

// Hallmark Luxury Pastel & Jewel Tone Palettes for sectors
const SECTOR_THEMES = [
  { bg: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)', text: '#ffe4e6', border: '#fda4af' }, // Rose Ruby
  { bg: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', text: '#fae8ff', border: '#e9d5ff' }, // Royal Amethyst
  { bg: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', text: '#e0f2fe', border: '#bae6fd' }, // Sapphire Sky
  { bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', text: '#fef3c7', border: '#fde68a' }, // Amber Gold
  { bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', text: '#d1fae5', border: '#a7f3d0' }, // Emerald Mint
  { bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', text: '#fce7f3', border: '#fbcfe8' }, // Cotton Candy Pink
  { bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', text: '#ede9fe', border: '#ddd6fe' }, // Lavender Velvet
  { bg: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)', text: '#ffe4e6', border: '#fecdd3' }, // Velvet Crimson
  { bg: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)', text: '#cffafe', border: '#67e8f9' }, // Cyan Diamond
  { bg: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)', text: '#ffedd5', border: '#fdba74' }, // Sunset Coral
  { bg: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)', text: '#ccfbf1', border: '#5eead4' }, // Persian Teal
  { bg: 'linear-gradient(135deg, #d946ef 0%, #a21caf 100%)', text: '#fae8ff', border: '#f0abfc' }, // Electric Orchid
  { bg: 'linear-gradient(135deg, #eab308 0%, #a16207 100%)', text: '#fef9c3', border: '#fef08a' }, // Imperial Gold
  { bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', text: '#e0e7ff', border: '#a5b4fc' }, // Royal Indigo
];

const SIZE = 400;
const RADIUS = 175;
const CENTER = SIZE / 2;

/** Returns the SVG arc path for a wedge of the wheel */
function wedgePath(startAngleRad: number, endAngleRad: number): string {
  const r = RADIUS;
  const x1 = CENTER + r * Math.cos(startAngleRad);
  const y1 = CENTER + r * Math.sin(startAngleRad);
  const x2 = CENTER + r * Math.cos(endAngleRad);
  const y2 = CENTER + r * Math.sin(endAngleRad);
  const largeArc = endAngleRad - startAngleRad > Math.PI ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/**
 * Hallmark Luxury Mystery Lucky Wheel:
 *   - Solid Gold-Embossed Metallic Rim with chasing bulbs.
 *   - Mystery Question Mark Sectors (? ✨) hiding prizes until stopped.
 *   - Realistic Mechanical Wheel Physics: Super fast spin decelerating gradually to a realistic stop.
 *   - Mechanical Pointer Ticker rattling against passing pins.
 *   - Center Gold Wax Seal with Royal Cat Tiara.
 */
const LuckyWheel = forwardRef<LuckyWheelHandle, Props>(function LuckyWheel(
  { prizes, onResult, disabled = false },
  ref,
) {
  const wheelGroupRef = useRef<SVGGElement>(null);
  const tickerRef = useRef<SVGGElement>(null);
  const spinningRef = useRef(false);
  const [spinning, setSpinning] = useState(false);
  const currentRotationRef = useRef<number>(0);
  const reduced = useReducedMotionSafe();

  const N = Math.max(prizes.length, 2);
  const segmentDeg = 360 / N;
  const segmentRad = (Math.PI * 2) / N;

  const spin = useCallback(() => {
    if (spinningRef.current || disabled || prizes.length < 2) return;
    spinningRef.current = true;
    setSpinning(true);

    const wheel = wheelGroupRef.current;
    const ticker = tickerRef.current;

    // 1. Pick random target winning slice (0 to N-1)
    const targetIndex = Math.floor(Math.random() * prizes.length);

    // Calculate rotation in degrees to land target slice center under 12 o'clock pointer
    // Sector i is centered at (i + 0.5) * segmentDeg - 90 deg.
    // 12 o'clock is -90 deg.
    // So the target slice center is at (targetIndex + 0.5) * segmentDeg from 12 o'clock.
    // Clockwise rotation to align this sector to top:
    const targetSliceOffsetDeg = (targetIndex + 0.5) * segmentDeg;
    const fullRevolutions = 6; // 6 full dramatic spins
    const totalDeltaDeg = fullRevolutions * 360 + (360 - (targetSliceOffsetDeg % 360));
    const finalRotation = currentRotationRef.current + totalDeltaDeg;

    if (!wheel) {
      spinningRef.current = false;
      setSpinning(false);
      onResult(prizes[targetIndex], targetIndex);
      return;
    }

    // GSAP Physics Animation: Zero-DOM-read numerical tweening for silky 60fps
    const spinProxy = { rot: currentRotationRef.current };
    let lastPin = -1;

    gsap.to(spinProxy, {
      rot: finalRotation,
      duration: reduced ? 0.6 : 5.4,
      ease: 'circ.out',
      onUpdate: () => {
        if (wheel) {
          gsap.set(wheel, { rotation: spinProxy.rot, transformOrigin: '50% 50%' });
        }
        const pin = Math.floor((spinProxy.rot / segmentDeg) % N);
        if (pin !== lastPin && ticker) {
          lastPin = pin;
          gsap.fromTo(
            ticker,
            { rotate: -18 },
            { rotate: 0, duration: 0.09, ease: 'power1.out', overwrite: true },
          );
        }
      },
      onComplete: () => {
        currentRotationRef.current = finalRotation % 360;
        spinningRef.current = false;
        setSpinning(false);

        // Flash ticker on winning sector and suspense delay before reveal
        if (ticker) {
          gsap.fromTo(
            ticker,
            { scale: 1.3, filter: 'drop-shadow(0 0 16px #facc15)' },
            { scale: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))', duration: 0.5 },
          );
        }

        setTimeout(() => {
          onResult(prizes[targetIndex], targetIndex);
        }, 450);
      },
    });
  }, [disabled, prizes, segmentDeg, N, reduced, onResult]);

  useImperativeHandle(
    ref,
    () => ({
      spin,
      get spinning() {
        return spinningRef.current;
      },
    }),
    [spin],
  );

  if (prizes.length < 2) {
    return (
      <div style={{ padding: 24, color: 'var(--color-text-soft)' }}>
        Cần ít nhất 2 phần quà để quay.
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: 'min(295px, 40vh, 84vw)',
        aspectRatio: '1',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes bulbGlowPulse {
          0%, 100% { fill: #fef08a; filter: drop-shadow(0 0 4px #facc15); }
          50% { fill: #ffffff; filter: drop-shadow(0 0 8px #ffffff); }
        }
        .chasing-bulb {
          animation: bulbGlowPulse 1.4s infinite ease-in-out;
        }
        .chasing-bulb:nth-child(even) {
          animation-delay: 0.7s;
        }
      `}</style>

      {/* Mechanical Gold Arrow Pointer (Top, 12 o'clock) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45))',
        }}
      >
        <svg width="52" height="64" viewBox="0 0 52 64" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="goldTickerGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#facc15" />
              <stop offset="70%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <linearGradient id="rubyGemGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>

          <g ref={tickerRef as any} transform="translate(26, 12)">
            {/* Pointer Body */}
            <path
              d="M 0 46 L -16 6 C -16 -4, 16 -4, 16 6 Z"
              fill="url(#goldTickerGrad)"
              stroke="#78350f"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Glowing Ruby Gem in Pointer Head */}
            <circle cx="0" cy="8" r="7" fill="url(#rubyGemGrad)" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="-2" cy="6" r="2" fill="#ffffff" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* Main SVG Wheel Canvas */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        onClick={spin}
        style={{
          cursor: spinning || disabled ? 'not-allowed' : 'pointer',
          overflow: 'visible',
          filter: 'drop-shadow(0 18px 45px rgba(0, 0, 0, 0.5))',
        }}
        aria-label="Vòng quay may mắn"
      >
        <defs>
          {/* Outer Metallic Bezel Gradient */}
          <radialGradient id="goldBezel" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#78350f" />
            <stop offset="92%" stopColor="#fef08a" />
            <stop offset="96%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>

          {/* Center Hub Royal Seal Gradient */}
          <radialGradient id="royalHubSeal" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="75%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#713f12" />
          </radialGradient>

          {/* Soft inner ambient glow */}
          <radialGradient id="innerWheelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>
        </defs>

        {/* 1. Outer Solid Gold Bezel Rim */}
        <circle cx={CENTER} cy={CENTER} r={RADIUS + 18} fill="url(#goldBezel)" stroke="#ca8a04" strokeWidth="3" />
        <circle cx={CENTER} cy={CENTER} r={RADIUS + 4} fill="#1e1b4b" stroke="#facc15" strokeWidth="2" />

        {/* 2. Chasing Gold/Diamond Bulbs around the Bezel Rim */}
        <g>
          {Array.from({ length: 18 }, (_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const bx = CENTER + (RADIUS + 11) * Math.cos(angle);
            const by = CENTER + (RADIUS + 11) * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={bx}
                cy={by}
                r="3.8"
                className="chasing-bulb"
                stroke="#854d0e"
                strokeWidth="0.8"
              />
            );
          })}
        </g>

        {/* 3. Rotating Wheel Group (Mystery Question Sectors) */}
        <g ref={wheelGroupRef}>
          {prizes.map((_, i) => {
            const startAngle = i * segmentRad - Math.PI / 2;
            const endAngle = (i + 1) * segmentRad - Math.PI / 2;
            const midAngle = (startAngle + endAngle) / 2;
            const theme = SECTOR_THEMES[i % SECTOR_THEMES.length];

            // Mystery Question Mark Position
            const labelR = RADIUS * 0.62;
            const lx = CENTER + labelR * Math.cos(midAngle);
            const ly = CENTER + labelR * Math.sin(midAngle);
            const rotDeg = (midAngle * 180) / Math.PI + 90;

            // Outer Rim Gold Pin Position
            const pinX = CENTER + RADIUS * Math.cos(startAngle);
            const pinY = CENTER + RADIUS * Math.sin(startAngle);

            return (
              <g key={i}>
                {/* Sector Wedge */}
                <path
                  d={wedgePath(startAngle, endAngle)}
                  fill={theme.bg.includes('#') ? theme.border : '#e11d48'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Inner sector gradient shade */}
                <path
                  d={wedgePath(startAngle, endAngle)}
                  fill="url(#innerWheelGlow)"
                  opacity="0.35"
                />

                {/* Mystery Surprise Question Mark & Star Box (Rotated outwards) */}
                <g transform={`translate(${lx}, ${ly}) rotate(${rotDeg})`}>
                  {/* Glowing Gift Box Silhouette / Star */}
                  <text
                    x="0"
                    y="-18"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    style={{ userSelect: 'none' }}
                  >
                    🎁
                  </text>

                  {/* Elegant Golden Question Mark */}
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-display), 'Cormorant Garamond', serif"
                    fontSize="32"
                    fontWeight="800"
                    fontStyle="italic"
                    fill="#ffffff"
                    stroke="#854d0e"
                    strokeWidth="1.2"
                    style={{
                      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.6))',
                      userSelect: 'none',
                    }}
                  >
                    ?
                  </text>

                  {/* Sparkle dot */}
                  <text
                    x="12"
                    y="-4"
                    fontSize="12"
                    fill="#fef08a"
                    style={{ userSelect: 'none' }}
                  >
                    ✨
                  </text>
                </g>

                {/* Golden Divider Pin at Sector Boundary */}
                <circle cx={pinX} cy={pinY} r="4" fill="#fef08a" stroke="#854d0e" strokeWidth="1.2" />
              </g>
            );
          })}

          {/* Inner Decorative Golden Ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS - 2}
            fill="none"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.75"
          />
        </g>

        {/* 4. Center Hub (Royal Gold Wax Seal with Crown & Cat Paw - Does NOT rotate) */}
        <g>
          {/* Shadow & Outer Ring */}
          <circle cx={CENTER} cy={CENTER} r="42" fill="#78350f" opacity="0.6" />
          <circle cx={CENTER} cy={CENTER} r="38" fill="url(#royalHubSeal)" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx={CENTER} cy={CENTER} r="32" fill="none" stroke="#78350f" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

          {/* Royal Crown Icon */}
          <text
            x={CENTER}
            y={CENTER - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            style={{ userSelect: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
          >
            👑
          </text>

          {/* Center Call to Action Text */}
          <text
            x={CENTER}
            y={CENTER + 13}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-display), 'Cormorant Garamond', serif"
            fontSize="14"
            fontStyle="italic"
            fontWeight="800"
            fill="#78350f"
            style={{ userSelect: 'none', letterSpacing: '0.08em' }}
          >
            QUAY
          </text>
        </g>
      </svg>
    </div>
  );
});

export default LuckyWheel;
