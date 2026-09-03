'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

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
 * 5 Bespoke Royal Honeycomb & Gold-Leaf Letter Themes
 */
const CARD_THEMES = [
  // Card 1: Royal Amber Honey & Velvet Cream
  {
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 45%, #fff7ed 100%)',
    border: '#ca8a04',
    innerBorder: '#eab308',
    sealBg: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #78350f 100%)',
    sealBorder: '#ca8a04',
    sealGlow: 'rgba(217, 119, 6, 0.45)',
    accent: '#b45309',
    badge: '📜 THƯ SỐ 01',
    title: 'Bé Kiến Trao Bánh Hoàng Gia',
  },
  // Card 2: Rosewood & Golden Strawberry
  {
    bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 45%, #fff5f5 100%)',
    border: '#e11d48',
    innerBorder: '#f43f5e',
    sealBg: 'linear-gradient(135deg, #be123c 0%, #e11d48 50%, #881337 100%)',
    sealBorder: '#f43f5e',
    sealGlow: 'rgba(225, 29, 72, 0.45)',
    accent: '#be123c',
    badge: '📜 THƯ SỐ 02',
    title: 'Bé Kiến Gửi Quà Tri Kỷ',
  },
  // Card 3: Royal Lavender & Amethyst Honey
  {
    bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 45%, #fdf4ff 100%)',
    border: '#9333ea',
    innerBorder: '#a855f7',
    sealBg: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #581c87 100%)',
    sealBorder: '#a855f7',
    sealGlow: 'rgba(147, 51, 234, 0.45)',
    accent: '#7e22ce',
    badge: '📜 THƯ SỐ 03',
    title: 'Bé Kiến Nâng Chùm Bóng Bay',
  },
  // Card 4: Emerald Forest & Wild Honey
  {
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 45%, #f7fee7 100%)',
    border: '#15803d',
    innerBorder: '#22c55e',
    sealBg: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #14532d 100%)',
    sealBorder: '#22c55e',
    sealGlow: 'rgba(22, 163, 74, 0.45)',
    accent: '#15803d',
    badge: '📜 THƯ SỐ 04',
    title: 'Bé Kiến Thết Đãi Trà Sữa',
  },
  // Card 5: 24K Celestial Imperial Gold
  {
    bg: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 45%, #fef08a 100%)',
    border: '#ca8a04',
    innerBorder: '#eab308',
    sealBg: 'linear-gradient(135deg, #854d0e 0%, #ca8a04 50%, #713f12 100%)',
    sealBorder: '#facc15',
    sealGlow: 'rgba(202, 138, 4, 0.5)',
    accent: '#854d0e',
    badge: '📜 THƯ SỐ 05',
    title: 'Bé Kiến Thắp Sáng Vương Miện',
  },
];

/**
 * 5 Unique Vector Bé Kiến Mascots for the Cards (No cats!)
 */
function AntCardMascot({ pose }: { pose: 0 | 1 | 2 | 3 | 4 }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.14))' }}
    >
      <defs>
        <linearGradient id={`antGrad-${pose}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>

      {/* Ant Abdomen */}
      <ellipse cx="40" cy="78" rx="24" ry="17" fill={`url(#antGrad-${pose})`} stroke="#9a3412" strokeWidth="2" />
      <ellipse cx="40" cy="80" rx="16" ry="11" fill="#fed7aa" opacity="0.6" />

      {/* Ant Thorax with little golden neckerchief */}
      <ellipse cx="62" cy="68" rx="14" ry="12" fill={`url(#antGrad-${pose})`} stroke="#9a3412" strokeWidth="1.8" />
      <path d="M 56 64 Q 62 72 68 64" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />

      {/* Ant Antennae with golden star tips */}
      <path d="M 64 36 Q 52 14 58 6" stroke="#9a3412" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="58" cy="6" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
      <path d="M 76 36 Q 88 14 82 6" stroke="#9a3412" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="82" cy="6" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />

      {/* Ant Head */}
      <ellipse cx="72" cy="48" rx="20" ry="17" fill={`url(#antGrad-${pose})`} stroke="#9a3412" strokeWidth="2" />

      {/* Ant Rosy Cheeks */}
      <ellipse cx="64" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />
      <ellipse cx="80" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />

      {/* Big Kawaii Smiling Eyes */}
      <ellipse cx="66" cy="45" rx="3.5" ry="5" fill="#1e293b" />
      <circle cx="67.5" cy="43.5" r="1.5" fill="#ffffff" />
      <ellipse cx="78" cy="45" rx="3.5" ry="5" fill="#1e293b" />
      <circle cx="79.5" cy="43.5" r="1.5" fill="#ffffff" />

      {/* Ant Happy Smile */}
      <path d="M 68 54 Q 72 58 76 54" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />

      {/* Legs */}
      <path d="M 45 92 L 38 106 M 55 86 L 52 104 M 65 78 L 70 102" stroke="#9a3412" strokeWidth="2.2" strokeLinecap="round" />

      {/* Pose Props */}
      {pose === 0 && (
        /* Cake slice in hand */
        <g transform="translate(80, 52) scale(0.65)">
          <path d="M 0 20 L 25 0 L 35 20 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
          <ellipse cx="20" cy="8" rx="4" ry="4" fill="#fbbf24" />
        </g>
      )}
      {pose === 1 && (
        /* Holding Gold Gift Box */
        <g transform="translate(78, 55) scale(0.6)">
          <rect x="0" y="0" width="28" height="26" rx="4" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <line x1="14" y1="0" x2="14" y2="26" stroke="#ef4444" strokeWidth="3" />
          <line x1="0" y1="13" x2="28" y2="13" stroke="#ef4444" strokeWidth="3" />
          <circle cx="14" cy="-2" r="5" fill="#ef4444" />
        </g>
      )}
      {pose === 2 && (
        /* Balloon in hand */
        <g transform="translate(76, 12)">
          <line x1="0" y1="50" x2="14" y2="18" stroke="#cbd5e1" strokeWidth="1.5" />
          <ellipse cx="16" cy="12" rx="14" ry="18" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
          <polygon points="13,30 19,30 16,33" fill="#be185d" />
        </g>
      )}
      {pose === 3 && (
        /* Milk tea cup */
        <g transform="translate(80, 56) scale(0.6)">
          <path d="M 4 8 L 8 32 L 24 32 L 28 8 Z" fill="#fed7aa" stroke="#9a3412" strokeWidth="2" />
          <rect x="2" y="5" width="28" height="4" rx="2" fill="#ea580c" />
          <line x1="16" y1="0" x2="16" y2="24" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {pose === 4 && (
        /* Little King Crown */
        <g transform="translate(62, 24) scale(0.65)">
          <path d="M 0 16 L 4 0 L 15 10 L 26 0 L 30 16 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="4" cy="0" r="2.5" fill="#ef4444" />
          <circle cx="15" cy="10" r="2" fill="#3b82f6" />
          <circle cx="26" cy="0" r="2.5" fill="#ef4444" />
        </g>
      )}
    </svg>
  );
}

/**
 * Bespoke Royal French Honeycomb & Gold-Leaf Birthday Letter (Hoàn toàn độc bản, không đụng hàng)
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
  const poseIndex = (index % 5) as 0 | 1 | 2 | 3 | 4;

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
          borderRadius: '22px',
          boxShadow: `0 22px 50px -10px ${theme.sealGlow}, 0 6px 20px rgba(0, 0, 0, 0.08), inset 0 0 25px rgba(254, 240, 138, 0.35)`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* === WATERMARK: Royal Honeycomb Geometric Lattice (ZERO CAT PAWS) === */}
        <svg
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.08,
          }}
        >
          <defs>
            <pattern id={`honeycombGrid-${index}`} width="28" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M 14 0 L 28 8 L 28 24 L 14 32 L 0 24 L 0 8 Z M 14 32 L 28 40 L 28 56 L 14 64 L 0 56 L 0 40 Z"
                fill="none"
                stroke="#b45309"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#honeycombGrid-${index})`} />
        </svg>

        {/* Double Gold-Foil Scalloped Border Frame */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '10px',
            border: `1.8px solid ${theme.innerBorder}`,
            borderRadius: '16px',
            pointerEvents: 'none',
            opacity: 0.85,
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '14px',
            border: '1px dashed #ca8a04',
            borderRadius: '12px',
            pointerEvents: 'none',
            opacity: 0.5,
          }}
        />

        {/* 4 Vintage Baroque Filigree Corners */}
        <BaroqueCorner position="tl" color="#ca8a04" />
        <BaroqueCorner position="tr" color="#ca8a04" />
        <BaroqueCorner position="bl" color="#ca8a04" />
        <BaroqueCorner position="br" color="#ca8a04" />

        {/* === TOP HEADER: Ribbon Banner with Title & Counter === */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px 6px',
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              padding: '4px 14px',
              borderRadius: '999px',
              border: `1.5px solid ${theme.border}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: theme.accent,
              }}
            >
              {theme.badge}
            </span>
          </div>

          {/* Card counter */}
          <span
            style={{
              fontSize: '13px',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#854d0e',
              letterSpacing: '0.06em',
            }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* === MAIN BODY: Bé Kiến Mascot + Heartfelt Wish Text === */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            flex: 1,
            padding: '4px 26px 8px',
            zIndex: 2,
          }}
        >
          {/* Animated Bé Kiến Herald on the left (NO CATS!) */}
          <div
            style={{
              width: 'clamp(95px, 14vw, 130px)',
              height: 'clamp(95px, 14vw, 130px)',
              flexShrink: 0,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AntCardMascot pose={poseIndex} />
          </div>

          {/* Heartfelt Wish Text */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <blockquote
              style={{
                margin: 0,
                padding: 0,
                fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(14.5px, 2vw, 17.5px)',
                lineHeight: 1.58,
                color: '#451a03',
                letterSpacing: '0.01em',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.9)',
              }}
            >
              “{text}”
            </blockquote>
          </div>
        </div>

        {/* === FOOTER: Royal Ant Wax Seal & Signature (ABSOLUTELY NO CAT PAW) === */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 24px 14px',
            borderTop: '1px solid rgba(202, 138, 4, 0.22)',
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 2,
          }}
        >
          {/* Signature Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span
              style={{
                fontSize: '10.5px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                color: '#78350f',
                fontWeight: 700,
              }}
            >
              Chúc Dẹo Dẹo
            </span>
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: '18px',
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                color: theme.accent,
              }}
            >
              — Bạn Thân Tri Kỷ 🌟 —
            </span>
          </div>

          {/* === ROYAL ANT & HONEYCOMB WAX SEAL (Embossed Ant Silhouette & Crown) === */}
          <div
            aria-hidden
            style={{
              width: '54px',
              height: '54px',
              position: 'relative',
              flexShrink: 0,
              filter: `drop-shadow(0 4px 10px ${theme.sealGlow})`,
            }}
          >
            <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden>
              {/* Wax Seal Outer Stamp Edge with Natural Uneven Drips */}
              <path
                d="M 32 4 C 44 3, 56 12, 59 24 C 62 36, 56 50, 44 58 C 32 63, 16 59, 8 48 C 1 38, 4 22, 14 10 C 20 4, 26 5, 32 4 Z"
                fill={theme.sealBorder}
              />
              <circle cx="32" cy="32" r="26" fill={`url(#sealGrad-${index})`} stroke="#ca8a04" strokeWidth="1.2" />
              <circle cx="32" cy="32" r="22" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />

              <defs>
                <radialGradient id={`sealGrad-${index}`} cx="0.35" cy="0.3">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="45%" stopColor="#eab308" />
                  <stop offset="85%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#854d0e" />
                </radialGradient>
              </defs>

              {/* Embossed Royal Ant & Honeycomb Emblem (NO CAT PAW) */}
              <g fill="#ffffff" opacity="0.95">
                {/* Miniature Hexagon Honeycomb Cells */}
                <polygon points="32,15 35,17 35,21 32,23 29,21 29,17" />
                {/* Ant Crown */}
                <path d="M 27 24 L 29 20 L 32 22 L 35 20 L 37 24 Z" />
                {/* Ant Head */}
                <circle cx="32" cy="27" r="3.5" />
                {/* Ant Antennae */}
                <path d="M 30 25 Q 26 21 27 18 M 34 25 Q 38 21 37 18" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" fill="none" />
                {/* Ant Thorax & Wings */}
                <ellipse cx="32" cy="34" rx="3.5" ry="3" />
                {/* Ant Round Abdomen */}
                <ellipse cx="32" cy="42" rx="5" ry="4" />
                {/* Ant Legs */}
                <line x1="28" y1="33" x2="23" y2="30" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                <line x1="36" y1="33" x2="41" y2="30" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                <line x1="28" y1="36" x2="22" y2="37" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                <line x1="36" y1="36" x2="42" y2="37" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                <line x1="29" y1="41" x2="24" y2="45" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                <line x1="35" y1="41" x2="40" y2="45" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hand-drawn Antique Baroque Filigree Corner Ornaments
 */
function BaroqueCorner({ position, color }: { position: 'tl' | 'tr' | 'bl' | 'br'; color: string }) {
  const map: Record<typeof position, { top?: number; bottom?: number; left?: number; right?: number; rotate: number }> = {
    tl: { top: 14, left: 14, rotate: 0 },
    tr: { top: 14, right: 14, rotate: 90 },
    bl: { bottom: 14, left: 14, rotate: 270 },
    br: { bottom: 14, right: 14, rotate: 180 },
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
        pointerEvents: 'none',
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 28 28"
        aria-hidden
        style={{ transform: `rotate(${p.rotate}deg)` }}
      >
        <path
          d="M 4 4 L 16 4 C 18 4, 20 6, 20 8 C 20 12, 14 14, 10 14 C 6 14, 4 18, 4 22 L 4 4 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
        />
        <circle cx="8" cy="8" r="2" fill={color} />
        <path d="M 4 12 C 7 12, 10 9, 10 6" stroke={color} strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}