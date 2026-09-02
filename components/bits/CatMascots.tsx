'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type CatMascotProps = {
  type: 0 | 1 | 2 | 3 | 4;
  className?: string;
};

/**
 * 5 Unique, Ultra-Cute Hallmark Cat Mascots:
 *   0. Party Hat Cat with Sparkling Star Wand (Calico)
 *   1. Gift Box Cat with Satin Ribbon Bow (Fluffy White)
 *   2. Heart Balloon Floating Cat with Golden Bell (Ginger Tabby)
 *   3. Strawberry Cupcake Cat with Licking Smile (Tuxedo)
 *   4. Heart Glasses & Silk Bow Cat with Starry Sparkles (Siamese)
 */
export default function CatMascot({ type, className }: CatMascotProps) {
  const rootRef = useRef<SVGSVGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const accessoryRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Gentle head bobbing & breathing
      if (headRef.current) {
        gsap.to(headRef.current, {
          y: -3,
          rotate: type % 2 === 0 ? 2 : -2,
          duration: 1.6 + type * 0.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 80%',
        });
      }

      // Accessory swaying (wand, balloons, gift box, cupcake, glasses)
      if (accessoryRef.current) {
        gsap.to(accessoryRef.current, {
          rotate: type === 2 ? 6 : 4,
          y: type === 2 ? -5 : -2,
          duration: 1.4 + type * 0.15,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      }

      // Tail wagging
      if (tailRef.current) {
        gsap.to(tailRef.current, {
          rotate: 12,
          duration: 1.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '20% 80%',
        });
      }
    }, root);

    return () => ctx.revert();
  }, [type]);

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 160 160"
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        {/* Soft shadow */}
        <radialGradient id={`catShadow-${type}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>

        {/* Gold shine */}
        <linearGradient id={`goldGrad-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Rose gradient */}
        <linearGradient id={`roseGrad-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      </defs>

      {/* Ground drop shadow */}
      <ellipse cx="80" cy="144" rx="42" ry="8" fill={`url(#catShadow-${type})`} />

      {/* Tail */}
      <path
        ref={tailRef}
        d={
          type === 0
            ? 'M 115 125 Q 145 110 135 85 Q 128 70 120 75'
            : type === 1
              ? 'M 115 125 Q 148 115 142 90 Q 138 75 128 80'
              : type === 2
                ? 'M 45 125 Q 15 110 25 85 Q 32 70 40 75'
                : type === 3
                  ? 'M 115 125 Q 145 120 138 95 Q 132 80 122 85'
                  : 'M 45 125 Q 12 115 20 85 Q 26 70 36 78'
        }
        fill="none"
        stroke={
          type === 0 ? '#fed7aa' : type === 1 ? '#ffffff' : type === 2 ? '#fdba74' : type === 3 ? '#1e293b' : '#f5d0fe'
        }
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Cat Body */}
      <ellipse
        cx="80"
        cy="115"
        rx="36"
        ry="28"
        fill={
          type === 0 ? '#fff7ed' : type === 1 ? '#ffffff' : type === 2 ? '#ffedd5' : type === 3 ? '#1e293b' : '#faf5ff'
        }
        stroke={type === 1 ? '#fbcfe8' : type === 3 ? '#0f172a' : '#fed7aa'}
        strokeWidth="2"
      />

      {/* Body belly patch */}
      <ellipse
        cx="80"
        cy="118"
        rx="22"
        ry="18"
        fill={type === 3 ? '#ffffff' : type === 4 ? '#f3e8ff' : '#ffffff'}
        opacity={type === 1 ? 0.9 : 0.8}
      />

      {/* Cat Head Group */}
      <g ref={headRef}>
        {/* Left Ear */}
        <g>
          <path
            d="M 52 68 L 38 32 L 68 46 Z"
            fill={type === 0 ? '#fb923c' : type === 1 ? '#ffffff' : type === 2 ? '#f97316' : type === 3 ? '#1e293b' : '#a855f7'}
            stroke={type === 1 ? '#fbcfe8' : '#e2e8f0'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M 50 62 L 42 38 L 64 48 Z" fill="#f472b6" opacity="0.75" />
        </g>

        {/* Right Ear */}
        <g>
          <path
            d="M 108 68 L 122 32 L 92 46 Z"
            fill={type === 0 ? '#38bdf8' : type === 1 ? '#ffffff' : type === 2 ? '#f97316' : type === 3 ? '#1e293b' : '#a855f7'}
            stroke={type === 1 ? '#fbcfe8' : '#e2e8f0'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M 110 62 L 118 38 L 96 48 Z" fill="#f472b6" opacity="0.75" />
        </g>

        {/* Head Main Dome */}
        <ellipse
          cx="80"
          cy="72"
          rx="38"
          ry="30"
          fill={
            type === 0 ? '#fff7ed' : type === 1 ? '#ffffff' : type === 2 ? '#ffedd5' : type === 3 ? '#1e293b' : '#faf5ff'
          }
          stroke={type === 1 ? '#fbcfe8' : type === 3 ? '#0f172a' : '#fed7aa'}
          strokeWidth="2"
        />

        {/* Special Calico Patches for Cat 0 */}
        {type === 0 && (
          <path d="M 44 65 Q 52 50 68 54 Q 58 72 44 65 Z" fill="#fb923c" />
        )}
        {/* Special Tiger Stripes for Cat 2 */}
        {type === 2 && (
          <g stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6">
            <line x1="76" y1="46" x2="76" y2="54" />
            <line x1="84" y1="46" x2="84" y2="54" />
            <line x1="80" y1="44" x2="80" y2="52" />
          </g>
        )}
        {/* White face muzzle for Cat 3 */}
        {type === 3 && (
          <ellipse cx="80" cy="80" rx="16" ry="12" fill="#ffffff" />
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="58" cy="80" rx="6" ry="3.5" fill="#fb7185" opacity="0.7" />
        <ellipse cx="102" cy="80" rx="6" ry="3.5" fill="#fb7185" opacity="0.7" />

        {/* Eyes & Expressions per Cat */}
        {type === 0 && (
          // Sparkling Happy Eyes
          <g fill="#1e1b4b">
            <circle cx="66" cy="72" r="5" />
            <circle cx="64" cy="70" r="1.8" fill="#ffffff" />
            <circle cx="94" cy="72" r="5" />
            <circle cx="92" cy="70" r="1.8" fill="#ffffff" />
          </g>
        )}
        {type === 1 && (
          // Sweet Wink (^_-)
          <g stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M 60 72 Q 66 66 72 72" />
            <circle cx="94" cy="71" r="5" fill="#1e1b4b" />
            <circle cx="92" cy="69" r="1.8" fill="#ffffff" />
          </g>
        )}
        {type === 2 && (
          // Joyful Crescent Closed Eyes (^^)
          <g stroke="#7c2d12" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M 60 72 Q 66 64 72 72" />
            <path d="M 88 72 Q 94 64 100 72" />
          </g>
        )}
        {type === 3 && (
          // Kawaii Happy Anime Eyes (≧◡≦)
          <g stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M 62 70 L 68 73 L 62 76" />
            <path d="M 98 70 L 92 73 L 98 76" />
          </g>
        )}
        {type === 4 && (
          // Starry Eyes behind glasses
          <g fill="#4c1d95">
            <circle cx="66" cy="72" r="5.5" />
            <circle cx="64" cy="69" r="2" fill="#ffffff" />
            <circle cx="94" cy="72" r="5.5" />
            <circle cx="92" cy="69" r="2" fill="#ffffff" />
          </g>
        )}

        {/* Tiny Pink Nose */}
        <polygon points="78,77 82,77 80,80" fill="#e11d48" />

        {/* Cute "ω" Mouth */}
        <path
          d="M 74 81 Q 77 84 80 81 Q 83 84 86 81"
          fill="none"
          stroke={type === 3 ? '#0f172a' : '#1e1b4b'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <g stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round">
          <line x1="42" y1="76" x2="52" y2="78" />
          <line x1="40" y1="82" x2="52" y2="82" />
          <line x1="108" y1="78" x2="118" y2="76" />
          <line x1="108" y1="82" x2="120" y2="82" />
        </g>

        {/* Cat Front Paws */}
        <g fill="#ffffff" stroke={type === 1 ? '#fbcfe8' : '#e2e8f0'} strokeWidth="1.5">
          <ellipse cx="65" cy="115" rx="8" ry="6" />
          <ellipse cx="95" cy="115" rx="8" ry="6" />
        </g>
      </g>

      {/* Accessory Overlays (Different for each cat!) */}
      <g ref={accessoryRef}>
        {/* CAT 0: Birthday Party Hat & Magic Wand */}
        {type === 0 && (
          <g>
            {/* Party Hat */}
            <polygon points="80,18 68,48 92,48" fill="url(#roseGrad-0)" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="80" cy="16" r="4.5" fill="#facc15" />
            {/* Hat pattern */}
            <line x1="71" y1="40" x2="89" y2="40" stroke="#fef08a" strokeWidth="2.5" />
            <line x1="74" y1="30" x2="86" y2="30" stroke="#fef08a" strokeWidth="2" />
            {/* Star Wand */}
            <g transform="translate(108, 90) rotate(22)">
              <line x1="0" y1="0" x2="0" y2="36" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="0,-8 3,-2 9,0 4,4 5,10 0,6 -5,10 -4,4 -9,0 -3,-2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            </g>
          </g>
        )}

        {/* CAT 1: Pastel Gift Box with Satin Ribbon */}
        {type === 1 && (
          <g transform="translate(80, 118)">
            {/* Gift Box */}
            <rect x="-16" y="-12" width="32" height="24" rx="4" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
            {/* Ribbon */}
            <rect x="-4" y="-12" width="8" height="24" fill="#fde047" />
            <rect x="-16" y="-2" width="32" height="4" fill="#fde047" />
            {/* Ribbon Bow */}
            <path d="M 0 -12 C -8 -20, -14 -12, 0 -12 C 8 -20, 14 -12, 0 -12 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="0" cy="-12" r="3" fill="#eab308" />
          </g>
        )}

        {/* CAT 2: Floating Heart Balloons & Golden Bell */}
        {type === 2 && (
          <g>
            {/* Golden Bell Collar */}
            <circle cx="80" cy="98" r="6" fill="url(#goldGrad-2)" stroke="#854d0e" strokeWidth="1" />
            <circle cx="80" cy="100" r="1.5" fill="#713f12" />
            {/* Heart Balloons */}
            <g transform="translate(112, 42)">
              <path d="M 0 0 Q 0 45 -18 70" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
              <path
                d="M 0 -18 C -14 -32, -28 -18, -14 -4 L 0 10 L 14 -4 C 28 -18, 14 -32, 0 -18 Z"
                fill="url(#roseGrad-2)"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle cx="-6" cy="-18" r="3" fill="#ffffff" opacity="0.6" />
            </g>
          </g>
        )}

        {/* CAT 3: Strawberry Cupcake with Birthday Candle */}
        {type === 3 && (
          <g transform="translate(80, 118)">
            {/* Cupcake Wrapper */}
            <polygon points="-12,12 12,12 10,0 -10,0" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            {/* Whipped Cream */}
            <path d="M -13 0 Q 0 -14 13 0 Z" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1" />
            <circle cx="0" cy="-6" r="4.5" fill="#ef4444" />
            {/* Candle */}
            <line x1="0" y1="-6" x2="0" y2="-18" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Flame */}
            <path d="M 0 -19 Q 3 -24 0 -28 Q -3 -24 0 -19 Z" fill="#fbbf24" stroke="#f97316" strokeWidth="0.8" />
          </g>
        )}

        {/* CAT 4: Heart Sunglasses & Satin Bow */}
        {type === 4 && (
          <g>
            {/* Pink Heart Sunglasses */}
            <g transform="translate(80, 72)">
              {/* Left Heart Lens */}
              <path
                d="M -14 -6 C -20 -14, -28 -6, -20 0 L -14 6 L -8 0 C 0 -6, -8 -14, -14 -6 Z"
                fill="#ec4899"
                stroke="#be185d"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <circle cx="-16" cy="-4" r="1.8" fill="#ffffff" opacity="0.8" />
              {/* Right Heart Lens */}
              <path
                d="M 14 -6 C 8 -14, 0 -6, 8 0 L 14 6 L 20 0 C 28 -6, 20 -14, 14 -6 Z"
                fill="#ec4899"
                stroke="#be185d"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <circle cx="12" cy="-4" r="1.8" fill="#ffffff" opacity="0.8" />
              {/* Bridge */}
              <line x1="-8" y1="-3" x2="8" y2="-3" stroke="#be185d" strokeWidth="2" />
            </g>
            {/* Satin Pink Neck Bow */}
            <g transform="translate(80, 96)">
              <polygon points="0,0 -8,-5 -8,5" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
              <polygon points="0,0 8,-5 8,5" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
              <circle cx="0" cy="0" r="2.5" fill="#facc15" />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
