'use client';

/**
 * Royal French Honeycomb & Forest Strawberry Patisserie Cake.
 * A truly unique, bespoke luxury multi-tiered architectural birthday cake.
 *
 * ViewBox: -100 0 800 600 (centered at x = 300 with ample margins for candles and interactive elements).
 *
 * Visual Highlights:
 *   - Royal Baroque Porcelain Platter with sculpted 24K gold filigree edging and pearl highlights.
 *   - Tier 1 (Grand Base): Dark Belgian Chocolate Velvet mirror glaze with geometric golden honeycomb lattice cells,
 *     translucent dripping amber honey, sliced ruby strawberries with golden leaf flakes and fresh mint leaves.
 *   - Tier 2 (Middle Tier): French Vanilla Chantilly & Strawberry Cremeux wrapped in edible golden ribbon and pearl beads.
 *   - Tier 3 (Crown Pillow): Whipped Mascarpone cloud pillow crowned with sugar crystal pearls.
 *   - Adorable Little Ant Pastry Chef: Standing proudly with a tall white chef hat, cute antennae, and golden whisk.
 *   - 3 Royal Golden Spiral Taper Candles: Perfectly centered at CANDLE_CONFIGS with wicks at y = -54.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type Props = {
  candleCount?: number;
  className?: string;
};

export const CANDLE_CONFIGS = [
  { x: 300, y: 286, earHue: 40, expression: 'happy' as const },
];

export default function CakeSVG({ className }: Props) {
  const chefHatRef = useRef<SVGGElement>(null);
  const honeyGlowRef = useRef<SVGGElement>(null);
  const shimmerRef = useRef<SVGGElement>(null);
  const antChefRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Little Ant Chef sits still without up-and-down bobbing

    // Honey drop shimmering pulse
    if (honeyGlowRef.current) {
      gsap.to(honeyGlowRef.current, {
        opacity: 0.95,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Gold leaf & sugar crystal sparkle
    if (shimmerRef.current) {
      gsap.to(shimmerRef.current, {
        scale: 1.15,
        rotate: 8,
        transformOrigin: '50% 50%',
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }, []);

  return (
    <svg
      viewBox="-100 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Bánh kem hoàng gia Pháp Mật Ong và Rừng Dâu Tây độc bản"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Royal Gold 24K Gradient */}
        <linearGradient id="gold24kGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="85%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        {/* Honey Amber Drop Radial */}
        <radialGradient id="honeyAmberGrad" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#d97706" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
        </radialGradient>

        {/* Chocolate Velvet Sponge Gradient */}
        <linearGradient id="chocoVelvetGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#582f1b" />
          <stop offset="35%" stopColor="#3d1d0e" />
          <stop offset="70%" stopColor="#291206" />
          <stop offset="100%" stopColor="#1a0a03" />
        </linearGradient>

        {/* French Vanilla & Strawberry Cream Tier Gradient */}
        <linearGradient id="frenchVanillaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fff7ed" />
          <stop offset="70%" stopColor="#ffe4e6" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>

        {/* Top Mascarpone Cream Gradient */}
        <linearGradient id="mascarponeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>

        {/* Fresh Glazed Strawberry Gradient */}
        <radialGradient id="royalBerryGrad" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="30%" stopColor="#f43f5e" />
          <stop offset="75%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>

        {/* Royal Porcelain Plate Platter */}
        <radialGradient id="porcelainPlatterGrad" cx="0.5" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f8fafc" />
          <stop offset="90%" stopColor="#f1f5f9" />
          <stop offset="98%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>

        {/* Honeycomb Pattern */}
        <pattern id="honeycombLattice" width="28" height="48" patternUnits="userSpaceOnUse" patternTransform="scale(0.85)">
          <path
            d="M 14 0 L 28 8 L 28 24 L 14 32 L 0 24 L 0 8 Z
               M 14 48 L 28 40 L 28 24 L 14 32 L 0 24 L 0 40 Z"
            fill="none"
            stroke="url(#gold24kGrad)"
            strokeWidth="1.2"
            opacity="0.55"
          />
        </pattern>

        {/* Luxury Drop Shadows */}
        <filter id="patisserieShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#2e1065" floodOpacity="0.25" />
        </filter>
        <filter id="plateDropShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.22" />
        </filter>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#facc15" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* ========================================================= */}
      {/* 1. ROYAL PORCELAIN PEDESTAL PLATTER WITH 24K GOLD FILIGREE */}
      {/* ========================================================= */}
      <g filter="url(#plateDropShadow)">
        {/* Foot of the pedestal */}
        <ellipse cx="300" cy="564" rx="160" ry="12" fill="#cbd5e1" />
        <ellipse cx="300" cy="562" rx="158" ry="10" fill="#f8fafc" stroke="url(#gold24kGrad)" strokeWidth="1.5" />

        {/* Pedestal stem pillar */}
        <path d="M 230 562 Q 300 546 370 562 L 350 542 Q 300 548 250 542 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

        {/* Grand Platter Base */}
        <ellipse cx="300" cy="538" rx="230" ry="28" fill="url(#porcelainPlatterGrad)" stroke="url(#gold24kGrad)" strokeWidth="3" />
        {/* Scalloped Gold Rim Bevel */}
        <ellipse cx="300" cy="536" rx="224" ry="24" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
        <ellipse cx="300" cy="534" rx="205" ry="18" fill="#ffffff" opacity="0.9" />
        <ellipse cx="300" cy="532" rx="190" ry="14" fill="#fff7ed" opacity="0.6" />
      </g>

      {/* ========================================================= */}
      {/* 2. TIER 1: GRAND CHOCOLATE VELVET & GOLDEN HONEYCOMB TIER */}
      {/* ========================================================= */}
      <g filter="url(#patisserieShadow)">
        {/* Cake base shadow */}
        <ellipse cx="300" cy="522" rx="165" ry="16" fill="#1a0a03" opacity="0.4" />

        {/* Chocolate Velvet Sponge Cylinder */}
        <path
          d="M 155 425
             L 155 505
             C 155 532, 445 532, 445 505
             L 445 425
             Z"
          fill="url(#chocoVelvetGrad)"
        />

        {/* Geometric Honeycomb Lattice Texture Overlay on Chocolate Tier */}
        <path
          d="M 155 425
             L 155 505
             C 155 532, 445 532, 445 505
             L 445 425
             Z"
          fill="url(#honeycombLattice)"
          opacity="0.8"
        />

        {/* Golden Base Molding Trim */}
        <path
          d="M 155 505 C 155 532, 445 532, 445 505"
          fill="none"
          stroke="url(#gold24kGrad)"
          strokeWidth="3.5"
        />

        {/* Tier 1 Top Surface */}
        <ellipse cx="300" cy="425" rx="145" ry="22" fill="#451e0e" stroke="url(#gold24kGrad)" strokeWidth="1.5" />
        <ellipse cx="300" cy="424" rx="138" ry="18" fill="#582f1b" />

        {/* Luscious Amber Dripping Honey Glaze over Tier 1 */}
        <g ref={honeyGlowRef}>
          <path
            d="M 155 425
               C 175 448, 185 470, 195 450
               C 205 435, 215 480, 230 488
               C 245 496, 250 445, 265 440
               C 280 435, 290 502, 305 508
               C 320 514, 330 455, 345 448
               C 360 442, 370 485, 385 478
               C 400 472, 410 440, 425 455
               C 435 465, 440 435, 445 425
               C 445 408, 155 408, 155 425 Z"
            fill="url(#honeyAmberGrad)"
            opacity="0.88"
            stroke="#d97706"
            strokeWidth="1.2"
          />
          {/* Honey Gloss Highlights */}
          <path
            d="M 226 465 Q 230 482 232 482"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 300 480 Q 305 502 307 502"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>
      </g>

      {/* ========================================================= */}
      {/* 3. TIER 2: FRENCH VANILLA CHANTILLY & STRAWBERRY CREMEUX  */}
      {/* ========================================================= */}
      <g filter="url(#patisserieShadow)">
        {/* Tier 2 Cylinder */}
        <path
          d="M 185 355
             L 185 425
             C 185 448, 415 448, 415 425
             L 415 355
             Z"
          fill="url(#frenchVanillaGrad)"
        />

        {/* Tier 2 Base Scalloped Pearl Trim */}
        <g fill="#ffffff" stroke="url(#gold24kGrad)" strokeWidth="0.8">
          {[200, 225, 250, 275, 300, 325, 350, 375, 400].map((cx, idx) => (
            <circle key={idx} cx={cx} cy={428 - Math.sin((idx / 8) * Math.PI) * 4} r="4.5" />
          ))}
        </g>

        {/* Tier 2 Top Surface Oval */}
        <ellipse cx="300" cy="355" rx="115" ry="18" fill="#fff1f2" stroke="url(#gold24kGrad)" strokeWidth="1.8" />
        <ellipse cx="300" cy="354" rx="108" ry="14" fill="#ffffff" />

        {/* Delicate Golden Honey Ribbon Band around Tier 2 */}
        <path
          d="M 185 390 C 220 405, 380 405, 415 390"
          fill="none"
          stroke="url(#gold24kGrad)"
          strokeWidth="3.2"
        />
        <path
          d="M 185 390 C 220 405, 380 405, 415 390"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
      </g>

      {/* ========================================================= */}
      {/* 4. TIER 3: MASCARPONE WHIPPED CLOUD PILLOW & CROWN TOP   */}
      {/* ========================================================= */}
      <g filter="url(#patisserieShadow)">
        {/* Cloud-scalloped Mascarpone Dome */}
        <path
          d="M 215 355
             C 215 315, 245 295, 275 305
             C 290 285, 310 285, 325 305
             C 355 295, 385 315, 385 355
             C 385 375, 215 375, 215 355 Z"
          fill="url(#mascarponeGrad)"
          stroke="#fef08a"
          strokeWidth="1.5"
        />

        {/* Fluffy whipped cream rosettes along crown */}
        <g fill="#ffffff" stroke="#fed7aa" strokeWidth="1">
          <circle cx="230" cy="350" r="14" />
          <circle cx="260" cy="358" r="15" />
          <circle cx="300" cy="360" r="16" />
          <circle cx="340" cy="358" r="15" />
          <circle cx="370" cy="350" r="14" />
          <circle cx="245" cy="318" r="13" />
          <circle cx="355" cy="318" r="13" />
          <circle cx="300" cy="298" r="14" />
        </g>
      </g>

      {/* ========================================================= */}
      {/* 5. GOURMET RUBY STRAWBERRIES, GOLD LEAF & MINT ACCENTS    */}
      {/* ========================================================= */}
      <g>
        {/* Left Strawberry Cluster on Tier 1 */}
        <g transform="translate(178, 495) rotate(-16)" filter="url(#patisserieShadow)">
          <path d="M 0 -16 C 14 -16, 18 2, 0 20 C -18 2, -14 -16, 0 -16 Z" fill="url(#royalBerryGrad)" />
          {/* Strawberry seeds */}
          <circle cx="-4" cy="-2" r="0.9" fill="#fef08a" />
          <circle cx="4" cy="-2" r="0.9" fill="#fef08a" />
          <circle cx="0" cy="6" r="0.9" fill="#fef08a" />
          {/* Calyx Green Leaves */}
          <path d="M 0 -16 L -8 -22 L -3 -15 L 0 -24 L 3 -15 L 8 -22 Z" fill="#15803d" />
        </g>

        {/* Right Strawberry Cluster on Tier 1 */}
        <g transform="translate(422, 495) rotate(18)" filter="url(#patisserieShadow)">
          <path d="M 0 -16 C 14 -16, 18 2, 0 20 C -18 2, -14 -16, 0 -16 Z" fill="url(#royalBerryGrad)" />
          <circle cx="-4" cy="-2" r="0.9" fill="#fef08a" />
          <circle cx="4" cy="-2" r="0.9" fill="#fef08a" />
          <circle cx="0" cy="6" r="0.9" fill="#fef08a" />
          <path d="M 0 -16 L -8 -22 L -3 -15 L 0 -24 L 3 -15 L 8 -22 Z" fill="#15803d" />
        </g>

        {/* Tier 2 Strawberries */}
        <g transform="translate(205, 415) rotate(-20)" filter="url(#patisserieShadow)">
          <path d="M 0 -13 C 11 -13, 14 1, 0 16 C -14 1, -11 -13, 0 -13 Z" fill="url(#royalBerryGrad)" />
          <path d="M 0 -13 L -6 -18 L -2 -12 L 0 -20 L 2 -12 L 6 -18 Z" fill="#15803d" />
        </g>
        <g transform="translate(395, 415) rotate(20)" filter="url(#patisserieShadow)">
          <path d="M 0 -13 C 11 -13, 14 1, 0 16 C -14 1, -11 -13, 0 -13 Z" fill="url(#royalBerryGrad)" />
          <path d="M 0 -13 L -6 -18 L -2 -12 L 0 -20 L 2 -12 L 6 -18 Z" fill="#15803d" />
        </g>

        {/* Shimmering 24K Edible Gold Leaf Flakes (✦) */}
        <g ref={shimmerRef} fill="url(#gold24kGrad)">
          <polygon points="280,380 282,385 287,386 283,390 284,395 280,392 276,395 277,390 273,386 278,385" />
          <polygon points="325,382 327,386 331,387 328,390 329,394 325,392 321,394 322,390 319,387 323,386" />
          <polygon points="225,465 226,469 230,470 227,473 228,476 225,474 222,476 223,473 220,470 224,469" />
          <polygon points="375,462 376,466 380,467 377,470 378,473 375,471 372,473 373,470 370,467 374,466" />
        </g>
      </g>

      {/* ========================================================= */}
      {/* 6. LITTLE ANT PASTRY CHEF (Proudly decorating the cake)   */}
      {/* ========================================================= */}
      <g ref={antChefRef} transform="translate(142, 455)" filter="url(#patisserieShadow)">
        {/* Shadow */}
        <ellipse cx="0" cy="38" rx="16" ry="5" fill="#1a0a03" opacity="0.35" />

        {/* Ant Round Gaster Body */}
        <ellipse cx="-12" cy="20" rx="16" ry="12" fill="#ea580c" stroke="#c2410c" strokeWidth="1.8" />
        <ellipse cx="-12" cy="22" rx="10" ry="7" fill="#fed7aa" />

        {/* Chef White Apron */}
        <path d="M -8 10 L 4 10 L 6 26 L -10 26 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
        <circle cx="-2" cy="16" r="1.5" fill="#f43f5e" />
        <circle cx="-2" cy="21" r="1.5" fill="#f43f5e" />

        {/* Ant Head */}
        <ellipse cx="2" cy="4" rx="14" ry="12" fill="#ea580c" stroke="#c2410c" strokeWidth="1.8" />

        {/* Ant Antennae */}
        <path d="M -2 -6 Q -12 -18 -8 -24" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
        <circle cx="-8" cy="-24" r="2.8" fill="#facc15" stroke="#c2410c" strokeWidth="1" />
        <path d="M 6 -6 Q 16 -18 12 -24" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="-24" r="2.8" fill="#facc15" stroke="#c2410c" strokeWidth="1" />

        {/* Tall White Chef Toque Hat */}
        <g ref={chefHatRef}>
          {/* Hat band */}
          <rect x="-6" y="-12" width="16" height="6" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
          {/* Puffy Toque Crown */}
          <path
            d="M -9 -12
               C -15 -22, -10 -34, 2 -34
               C 14 -34, 19 -22, 13 -12 Z"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="1.4"
          />
          {/* Hat pleats */}
          <line x1="-3" y1="-14" x2="-3" y2="-30" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="2" y1="-14" x2="2" y2="-32" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="7" y1="-14" x2="7" y2="-30" stroke="#e2e8f0" strokeWidth="1" />
        </g>

        {/* Happy Chef Anime Eyes */}
        <ellipse cx="-2" cy="2" rx="2.5" ry="3.5" fill="#0f172a" />
        <circle cx="-3" cy="1" r="1" fill="#ffffff" />
        <ellipse cx="6" cy="2" rx="2.5" ry="3.5" fill="#0f172a" />
        <circle cx="5" cy="1" r="1" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="-5" cy="6" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6" />
        <ellipse cx="9" cy="6" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6" />

        {/* Cute Smiling Mouth */}
        <path d="M 0 6 Q 2 9 4 6" fill="none" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" />

        {/* Ant Hand holding a Miniature Golden Whisk / Honey Dipper */}
        <g transform="translate(10, 12)">
          {/* Wooden / Golden handle */}
          <line x1="0" y1="12" x2="16" y2="-8" stroke="url(#gold24kGrad)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Whisk / Dipper bulb */}
          <ellipse cx="16" cy="-8" rx="6" ry="8" fill="none" stroke="url(#gold24kGrad)" strokeWidth="1.6" />
          <line x1="16" y1="-14" x2="16" y2="-2" stroke="url(#gold24kGrad)" strokeWidth="1.4" />
          {/* Dipping Honey Drop */}
          <circle cx="18" cy="-6" r="3" fill="url(#honeyAmberGrad)" />
        </g>
      </g>

      {/* ========================================================= */}
      {/* 7. 3 ROYAL GOLDEN SPIRAL TAPER CANDLES                    */}
      {/* (Seamlessly positioned at CANDLE_CONFIGS, wicks at y=-54)  */}
      {/* ========================================================= */}
      {CANDLE_CONFIGS.map((cfg, i) => (
        <g key={i} transform={`translate(${cfg.x}, ${cfg.y})`} filter="url(#goldGlow)">
          {/* French Porcelain Pedestal Base for each candle */}
          <ellipse cx="0" cy="4" rx="14" ry="5" fill="#cbd5e1" />
          <ellipse cx="0" cy="2" rx="13" ry="4" fill="url(#gold24kGrad)" />
          <ellipse cx="0" cy="0" rx="11" ry="3" fill="#ffffff" />

          {/* Slender Golden Spiral Taper Candle Body */}
          <rect
            x="-7"
            y="-38"
            width="14"
            height="38"
            rx="5"
            fill="url(#gold24kGrad)"
            stroke="#854d0e"
            strokeWidth="1.2"
          />

          {/* Elegant Baroque Spiral Ribbons around Candle */}
          <path
            d="M -7 -32 Q 0 -28 7 -24
               M -7 -22 Q 0 -18 7 -14
               M -7 -12 Q 0 -8 7 -4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Candle Crown Cap */}
          <ellipse cx="0" cy="-38" rx="6" ry="2.2" fill="#ffffff" stroke="#ca8a04" strokeWidth="1" />

          {/* Wax Drips flowing down the sides */}
          <path
            d="M -5 -38 C -5 -32, -3 -30, -3 -38"
            fill="#ffffff"
            stroke="#ca8a04"
            strokeWidth="0.8"
          />

          {/* Candle Wick — exactly reaching y = -54 for contact detection */}
          <line
            x1="0"
            y1="-38"
            x2="0"
            y2="-54"
            stroke="#1e293b"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}
