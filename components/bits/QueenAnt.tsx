'use client';

import React from 'react';

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Con Kiến Chúa Đáng Yêu (Adorable Queen Ant Mascot)
 * - Sparkling 24K Royal Crown with jewels
 * - Sweet kawaii anime eyes with sparkling stars
 * - Rosy blushing cheeks & cute smile
 * - Royal Queen Cape with golden honey collar
 * - Golden Royal Honey Sceptre
 */
export default function QueenAnt({ size = 'md', className, style }: Props) {
  const pixelMap = {
    sm: 54,
    md: 96,
    lg: 140,
    xl: 180,
  };
  const px = pixelMap[size] || 96;

  return (
    <div
      className={className}
      style={{
        width: px,
        height: px,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 8px 20px rgba(234, 88, 12, 0.35))',
        ...style,
      }}
    >
      <style>{`
        @keyframes queenAntFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes crownSparkle {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
      `}</style>
      <svg
        viewBox="0 0 160 160"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'queenAntFloat 3s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="queenAntBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="45%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <linearGradient id="queenCape" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="60%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          <linearGradient id="queenCrownGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="80%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          <radialGradient id="queenGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fed7aa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Royal Golden Aura Halo */}
        <circle cx="80" cy="80" r="72" fill="url(#queenGlow)" />

        {/* Royal Cape flowing behind Queen Ant */}
        <path
          d="M 46 95 C 32 120, 42 144, 62 142 C 74 140, 80 134, 80 134 C 80 134, 86 140, 98 142 C 118 144, 128 120, 114 95 Z"
          fill="url(#queenCape)"
          stroke="#9f1239"
          strokeWidth="2"
        />
        {/* Cape golden ermine trim */}
        <path
          d="M 44 126 C 54 146, 106 146, 116 126"
          stroke="#fde047"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="8 6"
        />

        {/* Ant Round Abdomen (Thân Kiến Chúa Múp Míp Đáng Yêu) */}
        <ellipse cx="80" cy="116" rx="30" ry="24" fill="url(#queenAntBody)" stroke="#9a3412" strokeWidth="2.2" />
        <ellipse cx="80" cy="118" rx="20" ry="15" fill="#ffedd5" opacity="0.65" />

        {/* Ant Thorax (Ngực) with Royal Collar */}
        <ellipse cx="80" cy="88" rx="20" ry="16" fill="url(#queenAntBody)" stroke="#9a3412" strokeWidth="2" />
        {/* Golden Honeycomb Collar */}
        <path
          d="M 64 82 Q 80 94 96 82 Q 80 98 64 82 Z"
          fill="url(#queenCrownGold)"
          stroke="#a16207"
          strokeWidth="1.2"
        />

        {/* Ant Head (Đầu tròn trĩnh dễ thương) */}
        <ellipse cx="80" cy="58" rx="28" ry="24" fill="url(#queenAntBody)" stroke="#9a3412" strokeWidth="2.2" />

        {/* Rosy Blushing Cheeks (Má hồng ửng đào) */}
        <ellipse cx="60" cy="66" rx="6" ry="4" fill="#f43f5e" opacity="0.65" />
        <ellipse cx="100" cy="66" rx="6" ry="4" fill="#f43f5e" opacity="0.65" />

        {/* Big Sparkling Kawaii Anime Eyes (Mắt long lanh lấp lánh) */}
        {/* Left Eye */}
        <ellipse cx="66" cy="54" rx="6" ry="8" fill="#1e1b4b" />
        <circle cx="64" cy="51" r="2.6" fill="#ffffff" />
        <circle cx="68" cy="57" r="1.4" fill="#ffffff" />
        <path d="M 64 54 Q 66 56 68 54" stroke="#a5b4fc" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* Right Eye */}
        <ellipse cx="94" cy="54" rx="6" ry="8" fill="#1e1b4b" />
        <circle cx="92" cy="51" r="2.6" fill="#ffffff" />
        <circle cx="96" cy="57" r="1.4" fill="#ffffff" />
        <path d="M 92 54 Q 94 56 96 54" stroke="#a5b4fc" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* Sweet Happy Smile */}
        <path d="M 74 66 Q 80 72 86 66" stroke="#831843" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Ant Antennae (Râu kiến uốn lượn có chóp ngọc vàng) */}
        <path d="M 68 40 Q 52 18 58 8" stroke="#9a3412" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="58" cy="8" r="4" fill="url(#queenCrownGold)" stroke="#9a3412" strokeWidth="1.2" />

        <path d="M 92 40 Q 108 18 102 8" stroke="#9a3412" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="102" cy="8" r="4" fill="url(#queenCrownGold)" stroke="#9a3412" strokeWidth="1.2" />

        {/* 24K Royal Queen Crown (Vương miện Kiến Chúa Lộng Lẫy) */}
        <g style={{ animation: 'crownSparkle 2s ease-in-out infinite' }}>
          <path
            d="M 62 38 L 65 22 L 72 30 L 80 18 L 88 30 L 95 22 L 98 38 Z"
            fill="url(#queenCrownGold)"
            stroke="#a16207"
            strokeWidth="1.8"
          />
          {/* Jewels on Crown */}
          <circle cx="65" cy="22" r="2.5" fill="#ef4444" />
          <circle cx="80" cy="18" r="3.2" fill="#3b82f6" />
          <circle cx="95" cy="22" r="2.5" fill="#ef4444" />
          <circle cx="80" cy="31" r="2" fill="#ec4899" />
          <rect x="64" y="36" width="32" height="3" rx="1.5" fill="#ca8a04" />
        </g>

        {/* Little Queen Legs / Arms */}
        {/* Left hand waving cute greeting */}
        <ellipse cx="54" cy="82" rx="7" ry="5" fill="#ffedd5" stroke="#9a3412" strokeWidth="1.6" transform="rotate(-20 54 82)" />
        {/* Right hand holding Royal Honey Sceptre */}
        <g transform="translate(102, 72)">
          {/* Sceptre staff */}
          <line x1="0" y1="26" x2="16" y2="0" stroke="url(#queenCrownGold)" strokeWidth="2.8" strokeLinecap="round" />
          {/* Sceptre Honey Orb */}
          <circle cx="16" cy="0" r="6" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1.5" />
          <polygon points="16,-6 18,-2 22,-2 19,1 20,5 16,3 12,5 13,1 10,-2 14,-2" fill="#fef08a" />
          {/* Hand holding it */}
          <ellipse cx="6" cy="16" rx="6" ry="5" fill="#ffedd5" stroke="#9a3412" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}
