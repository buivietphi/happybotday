'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import CatMascot from '@/components/bits/CatMascots';

gsap.registerPlugin(useGSAP);

type Props = {
  text: string;
  index: number;
  total: number;
  /** True for the active top card. */
  active?: boolean;
  /** Stack depth (0 = top). Higher numbers render further back. */
  depth?: number;
};

/**
 * 5 Distinct Luxury Hallmark Color Themes per Card
 */
const CARD_THEMES = [
  // Card 1: Sakura Rose & Gold
  {
    bg: 'linear-gradient(145deg, oklch(99% 0.015 350) 0%, oklch(96% 0.035 340) 100%)',
    border: 'oklch(84% 0.12 350)',
    innerBorder: 'oklch(86% 0.14 85)',
    accent: '#e11d48',
    glow: 'oklch(90% 0.12 350 / 0.35)',
    title: 'Mèo Chúc Mừng Sinh Nhật',
    badge: '🌸 Thiệp 01',
  },
  // Card 2: Lavender Champagne & Rose
  {
    bg: 'linear-gradient(145deg, oklch(99% 0.012 290) 0%, oklch(96% 0.035 295) 100%)',
    border: 'oklch(84% 0.12 295)',
    innerBorder: 'oklch(86% 0.14 85)',
    accent: '#9333ea',
    glow: 'oklch(90% 0.12 295 / 0.35)',
    title: 'Mèo Trao Món Quà Yêu Thương',
    badge: '🎁 Thiệp 02',
  },
  // Card 3: Peach Coral & Honey
  {
    bg: 'linear-gradient(145deg, oklch(99% 0.018 60) 0%, oklch(96% 0.045 55) 100%)',
    border: 'oklch(84% 0.14 55)',
    innerBorder: 'oklch(86% 0.14 85)',
    accent: '#ea580c',
    glow: 'oklch(90% 0.14 55 / 0.35)',
    title: 'Mèo Thả Bóng Bay Ước Nguyện',
    badge: '🎈 Thiệp 03',
  },
  // Card 4: Mint Pistachio & Strawberry
  {
    bg: 'linear-gradient(145deg, oklch(99% 0.012 160) 0%, oklch(96% 0.035 155) 100%)',
    border: 'oklch(84% 0.12 155)',
    innerBorder: 'oklch(86% 0.14 85)',
    accent: '#0d9488',
    glow: 'oklch(90% 0.12 155 / 0.35)',
    title: 'Mèo Thưởng Thức Bánh Kem Ngọt',
    badge: '🍰 Thiệp 04',
  },
  // Card 5: Celestial Gold & Royal Velvet
  {
    bg: 'linear-gradient(145deg, oklch(99% 0.015 85) 0%, oklch(96% 0.045 80) 100%)',
    border: 'oklch(84% 0.16 85)',
    innerBorder: 'oklch(88% 0.18 85)',
    accent: '#ca8a04',
    glow: 'oklch(92% 0.18 85 / 0.40)',
    title: 'Mèo Ngôi Sao Tỏa Sáng',
    badge: '⭐ Thiệp 05',
  },
];

/**
 * Hallmark Luxury Birthday Wish Card with Adorable Vector Animated Cat Mascot.
 */
export default function WishCard({
  text,
  index,
  total,
  active = false,
  depth = 0,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const catType = (index % 5) as 0 | 1 | 2 | 3 | 4;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 + depth * 14, scale: 1 - depth * 0.045 },
        {
          opacity: 1,
          y: depth * 14,
          scale: 1 - depth * 0.045,
          duration: 0.75,
          ease: 'back.out(1.5)',
          delay: depth * 0.06,
        },
      );
    },
    { scope: root, dependencies: [active, depth, reduced] },
  );

  return (
    <div
      ref={root}
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        zIndex: total - depth,
      }}
    >
      <div
        ref={cardInnerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: theme.bg,
          border: `2px solid ${theme.border}`,
          borderRadius: '20px',
          boxShadow: `0 18px 45px -12px ${theme.glow}, 0 4px 16px -4px oklch(22% 0.06 295 / 0.12), inset 0 1px 2px rgba(255,255,255,0.9)`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Paper texture overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            pointerEvents: 'none',
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            mixBlendMode: 'multiply',
          }}
        />

        {/* Gold Leaf Inner Frame */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '12px',
            border: `1.5px solid ${theme.innerBorder}`,
            borderRadius: '12px',
            pointerEvents: 'none',
            opacity: 0.75,
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '16px',
            border: `1px dashed ${theme.border}`,
            borderRadius: '8px',
            pointerEvents: 'none',
            opacity: 0.45,
          }}
        />

        {/* Corner Filigree Ornaments */}
        <CornerFiligree position="tl" color={theme.innerBorder} />
        <CornerFiligree position="tr" color={theme.innerBorder} />
        <CornerFiligree position="bl" color={theme.innerBorder} />
        <CornerFiligree position="br" color={theme.innerBorder} />

        {/* === TOP BAR: Badge & Title === */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px 8px',
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: theme.accent,
              background: 'rgba(255, 255, 255, 0.75)',
              padding: '4px 12px',
              borderRadius: '999px',
              border: `1px solid ${theme.border}`,
              backdropFilter: 'blur(4px)',
            }}
          >
            {theme.badge}
          </span>

          {/* Card counter */}
          <span
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 600,
              color: 'var(--color-text-soft)',
              letterSpacing: '0.08em',
            }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* === MAIN BODY: Cat Mascot + Heartfelt Wish Text === */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            flex: 1,
            padding: '4px 28px 12px',
            zIndex: 2,
          }}
        >
          {/* Animated Cat Mascot on the left */}
          <div
            style={{
              width: 'clamp(100px, 15vw, 135px)',
              height: 'clamp(100px, 15vw, 135px)',
              flexShrink: 0,
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08))',
            }}
          >
            <CatMascot type={catType} />
          </div>

          {/* Wish Message with Quotation Styling */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Quote Mark Icon */}
            <span
              aria-hidden
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '36px',
                lineHeight: 0.6,
                color: theme.accent,
                opacity: 0.45,
                marginBottom: 4,
              }}
            >
              “
            </span>

            {/* Wish Text */}
            <p
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(18px, 2.4vw, 24px)',
                lineHeight: 1.45,
                color: 'oklch(26% 0.06 295)',
                margin: 0,
                letterSpacing: '0.01em',
              }}
            >
              {text}
            </p>
          </div>
        </div>

        {/* === BOTTOM BAR: Signature & Embossed Cat Wax Seal === */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '8px 26px 16px',
            zIndex: 3,
          }}
        >
          {/* Signature */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            }}
          >
            <span
              aria-hidden
              style={{
                fontSize: '10px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-fade)',
                fontWeight: 600,
              }}
            >
              gửi tới em
            </span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: '20px',
                color: theme.accent,
              }}
            >
              — anh yêu —
            </span>
          </div>

          {/* Hallmark Golden Cat Wax Seal */}
          <div
            aria-hidden
            style={{
              width: '58px',
              height: '58px',
              position: 'relative',
              flexShrink: 0,
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.16))',
            }}
          >
            <svg viewBox="0 0 64 64" width="58" height="58" aria-hidden>
              <defs>
                <radialGradient id={`sealGrad-${index}`} cx="0.35" cy="0.3">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="45%" stopColor="#eab308" />
                  <stop offset="85%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#854d0e" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill={`url(#sealGrad-${index})`} stroke="#ca8a04" strokeWidth="1" />
              <circle cx="32" cy="32" r="25" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="3 2" />
              {/* Cute Cat Paw in Wax Seal */}
              <g fill="#ffffff" opacity="0.95">
                <circle cx="32" cy="35" r="6" />
                <circle cx="25" cy="27" r="3" />
                <circle cx="32" cy="22" r="3" />
                <circle cx="39" cy="27" r="3" />
                <circle cx="21" cy="34" r="2" />
                <circle cx="43" cy="34" r="2" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hand-drawn Little Filigree Flourish at Each Corner.
 */
function CornerFiligree({ position, color }: { position: 'tl' | 'tr' | 'bl' | 'br'; color: string }) {
  const map: Record<typeof position, { top?: number; bottom?: number; left?: number; right?: number; rotate: number }> = {
    tl: { top: 16, left: 16, rotate: 0 },
    tr: { top: 16, right: 16, rotate: 90 },
    bl: { bottom: 16, left: 16, rotate: 270 },
    br: { bottom: 16, right: 16, rotate: 180 },
  };
  const p = map[position];
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        ...(p.top !== undefined ? { top: p.top } : {}),
        ...(p.bottom !== undefined ? { bottom: p.bottom } : {}),
        ...(p.left !== undefined ? { left: p.left } : {}),
        ...(p.right !== undefined ? { right: p.right } : {}),
        zIndex: 1,
        opacity: 0.85,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 28 28"
        aria-hidden
        style={{ transform: `rotate(${p.rotate}deg)` }}
      >
        <path
          d="M 14 4 Q 18 4 18 9 Q 18 14 12 14 Q 8 14 8 11 Q 8 9 10 9 Q 12 9 12 11"
          fill="none"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="1.6" fill={color} />
      </svg>
    </div>
  );
}