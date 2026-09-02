'use client';

/**
 * Cat-themed birthday cake — gorgeous Kawaii Gourmet Birthday Cake with adorable Cat Candles.
 *
 * ViewBox: -100 0 800 600 (centered at x = 300 with 100px wide margins on left and right for spacious wind and match placement).
 *
 * Visual Highlights:
 *   - Bouncy, fluffy Cat Tail anchored firmly at the cake base, wagging gently without detaching.
 *   - Cat Ears seamlessly rooted inside the cake's frosting dome with realistic cat ear reflex twitches.
 *   - Natural Anime Kawaii Wink & Blink: clean vector path switching between wide starry eyes and cute winking arcs.
 *   - Luxurious porcelain plate with golden rim and soft drop shadows.
 *   - Fluffy cat-shaped birthday cake with velvety frosting, strawberry rosettes, and candy sprinkles.
 *   - Golden bell collar & bow tie swaying playfully.
 *   - 3 Kawaii Cat Candles snuggled snugly into whipped cream swirls atop the cake dome.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type Props = {
  candleCount?: number;
  className?: string;
};

export const CANDLE_CONFIGS = [
  { x: 245, y: 298, earHue: 350, expression: 'wink' },
  { x: 300, y: 286, earHue: 40, expression: 'happy' },
  { x: 355, y: 298, earHue: 200, expression: 'joy' },
];

export default function CakeSVG({ className }: Props) {
  const bowRef = useRef<SVGGElement>(null);
  const bellRef = useRef<SVGGElement>(null);
  const whiskersRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const leftEarRef = useRef<SVGGElement>(null);
  const rightEarRef = useRef<SVGGElement>(null);

  // Eye refs for clean anime blink & wink
  const leftOpenRef = useRef<SVGGElement>(null);
  const leftWinkRef = useRef<SVGGElement>(null);
  const rightOpenRef = useRef<SVGGElement>(null);
  const rightWinkRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Bow tie sway
    if (bowRef.current) {
      gsap.to(bowRef.current, {
        rotate: 3.5,
        transformOrigin: '50% 50%',
        duration: 1.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Golden collar bell chime sway
    if (bellRef.current) {
      gsap.to(bellRef.current, {
        rotate: -6,
        transformOrigin: '50% 0%',
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Whisker wiggle
    if (whiskersRef.current) {
      gsap.to(whiskersRef.current, {
        x: 2,
        duration: 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Gentle tail wagging back and forth — anchored firmly at cake base (0px 0px)
    if (tailRef.current) {
      gsap.to(tailRef.current, {
        rotate: 6,
        duration: 1.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: '0px 0px',
      });
    }

    // Realistic Cat Ear Reflex Twitch (quick reflex flick like real cats)
    if (leftEarRef.current) {
      const leftEarTl = gsap.timeline({ repeat: -1, repeatDelay: 3.6 });
      leftEarTl
        .to(leftEarRef.current, {
          rotate: -7,
          skewX: -3,
          duration: 0.08,
          ease: 'power2.out',
          transformOrigin: '185px 375px',
        })
        .to(leftEarRef.current, {
          rotate: 4,
          skewX: 2,
          duration: 0.08,
          ease: 'sine.inOut',
          transformOrigin: '185px 375px',
        })
        .to(leftEarRef.current, {
          rotate: -3,
          duration: 0.06,
          ease: 'sine.inOut',
          transformOrigin: '185px 375px',
        })
        .to(leftEarRef.current, {
          rotate: 0,
          skewX: 0,
          duration: 0.12,
          ease: 'back.out(1.6)',
          transformOrigin: '185px 375px',
        });
    }

    if (rightEarRef.current) {
      const rightEarTl = gsap.timeline({ repeat: -1, repeatDelay: 4.2 });
      rightEarTl
        .to(rightEarRef.current, {
          rotate: 7,
          skewX: 3,
          duration: 0.08,
          ease: 'power2.out',
          transformOrigin: '415px 375px',
        })
        .to(rightEarRef.current, {
          rotate: -4,
          skewX: -2,
          duration: 0.08,
          ease: 'sine.inOut',
          transformOrigin: '415px 375px',
        })
        .to(rightEarRef.current, {
          rotate: 3,
          duration: 0.06,
          ease: 'sine.inOut',
          transformOrigin: '415px 375px',
        })
        .to(rightEarRef.current, {
          rotate: 0,
          skewX: 0,
          duration: 0.12,
          ease: 'back.out(1.6)',
          transformOrigin: '415px 375px',
        });
    }

    // Natural Anime Wink & Blink Choreography
    const lo = leftOpenRef.current;
    const lw = leftWinkRef.current;
    const ro = rightOpenRef.current;
    const rw = rightWinkRef.current;

    if (lo && lw && ro && rw) {
      // Start with open eyes
      gsap.set([lo, ro], { opacity: 1 });
      gsap.set([lw, rw], { opacity: 0 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.8 });

      // 1. Natural quick blink
      tl.set([lo, ro], { opacity: 0 })
        .set([lw, rw], { opacity: 1 })
        .to({}, { duration: 0.15 })
        .set([lo, ro], { opacity: 1 })
        .set([lw, rw], { opacity: 0 })
        // 2. Playful wink with left eye after 1.8s
        .to({}, { duration: 1.8 })
        .set(lo, { opacity: 0 })
        .set(lw, { opacity: 1 })
        .to({}, { duration: 0.5 })
        .set(lo, { opacity: 1 })
        .set(lw, { opacity: 0 });
    }
  }, []);

  return (
    <svg
      viewBox="-100 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Cat-themed birthday cake with three adorable cat candles"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Cake Base Cream Gradient */}
        <radialGradient id="cakeCreamGrad" cx="0.45" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#fffbf5" />
          <stop offset="60%" stopColor="#fef3e7" />
          <stop offset="100%" stopColor="#fae0cc" />
        </radialGradient>

        {/* Cake Wrapper Velvet Gradient */}
        <linearGradient id="cakeVelvetGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>

        {/* Strawberry Cream Frosting Gradient */}
        <linearGradient id="frostingSwirlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fdf2f8" />
          <stop offset="85%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>

        {/* Fluffy Cat Tail Gradient */}
        <linearGradient id="tailFurGrad" x1="0" y1="1" x2="0.8" y2="0">
          <stop offset="0%" stopColor="#fef3e7" />
          <stop offset="40%" stopColor="#fef3e7" />
          <stop offset="75%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        {/* Tail Pink Stripe Gradient */}
        <linearGradient id="tailStripeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>

        {/* Golden Porcelain Plate Gradient */}
        <radialGradient id="plateGoldGrad" cx="0.5" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="80%" stopColor="#f8fafc" />
          <stop offset="96%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>

        {/* Shiny Golden Bell Gradient */}
        <radialGradient id="bellGoldGrad" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="85%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </radialGradient>

        {/* Strawberry Texture Gradient */}
        <radialGradient id="strawberryGrad" cx="0.4" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>

        {/* Soft Drop Shadow Filter */}
        <filter id="cakeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#4a044e" floodOpacity="0.22" />
        </filter>

        {/* Plate Shadow */}
        <filter id="plateShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* === 1. LUXURIOUS PORCELAIN CAKE PLATE === */}
      <g filter="url(#plateShadow)">
        {/* Bottom pedestal rim */}
        <ellipse cx="300" cy="552" rx="140" ry="12" fill="#cbd5e1" />
        <ellipse cx="300" cy="550" rx="138" ry="10" fill="#f1f5f9" />

        {/* Main plate platter */}
        <ellipse cx="300" cy="538" rx="215" ry="26" fill="url(#plateGoldGrad)" />
        <ellipse cx="300" cy="536" rx="212" ry="22" fill="none" stroke="#facc15" strokeWidth="2.5" />
        <ellipse cx="300" cy="534" rx="192" ry="16" fill="#ffffff" opacity="0.85" />
        <ellipse cx="300" cy="532" rx="180" ry="12" fill="#fdf4ff" opacity="0.6" />
      </g>

      {/* === 2. FLUFFY CAT TAIL (Seamlessly rooted at cake base with ribbon bow) === */}
      <g transform="translate(385, 510)" filter="url(#cakeShadow)">
        <g ref={tailRef} style={{ transformOrigin: '0px 0px' }}>
          {/* Main Fluffy Tail Volume starting 35px deep inside the cake */}
          <path
            d="M -35 8
               C 15 8, 140 -35, 140 -135
               C 140 -215, 95 -265, 53 -252
               C 31 -246, 30 -218, 53 -214
               C 79 -210, 107 -175, 107 -130
               C 107 -58, 35 -20, -35 -20
               Z"
            fill="url(#tailFurGrad)"
            stroke="#fbcfe8"
            strokeWidth="1.5"
          />

          {/* Soft Pink Tail Stripes */}
          <path
            d="M 85 -65 Q 127 -80, 123 -108"
            fill="none"
            stroke="url(#tailStripeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 105 -145 Q 130 -160, 117 -182"
            fill="none"
            stroke="url(#tailStripeGrad)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 93 -212 Q 107 -228, 83 -240"
            fill="none"
            stroke="url(#tailStripeGrad)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Fluffy White Tail Tip Tufts */}
          <g fill="#ffffff">
            <circle cx="47" cy="-238" r="14" />
            <circle cx="35" cy="-234" r="9" />
            <circle cx="55" cy="-245" r="8" />
            <circle cx="45" cy="-228" r="7" />
          </g>

          {/* Cute Pink Satin Ribbon Bow tied near the Tail Tip */}
          <g transform="translate(75, -198)">
            {/* Left bow wing */}
            <path d="M 0 0 L -12 -9 L -12 9 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />
            <path d="M -2 -1 L -10 -7 L -10 7 Z" fill="#fb7185" opacity="0.6" />
            {/* Right bow wing */}
            <path d="M 0 0 L 12 -9 L 12 9 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="1" />
            <path d="M 2 -1 L 10 -7 L 10 7 Z" fill="#fb7185" opacity="0.6" />
            {/* Bow knot */}
            <circle cx="0" cy="0" r="4.2" fill="#e11d48" />
            {/* Fluttering ribbon tails */}
            <path d="M -2 3 Q -6 18 -12 24" fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 2 3 Q 6 18 10 26" fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </g>
      </g>

      {/* === 3. CAT EARS (Deeply rooted inside the frosting dome) === */}
      {/* Left Cat Ear */}
      <g ref={leftEarRef} filter="url(#cakeShadow)">
        {/* Main ear body extending deep into the frosting */}
        <path
          d="M 160 395 L 138 290 Q 170 280 205 330 L 215 390 Z"
          fill="#fef3e7"
          stroke="#fbcfe8"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner Pink Fluff */}
        <path
          d="M 165 375 L 148 302 Q 172 295 196 335 L 205 375 Z"
          fill="#f472b6"
        />
        <circle cx="145" cy="298" r="3.2" fill="#ffffff" opacity="0.8" />
        {/* Cute Strawberry Clip on Ear */}
        <circle cx="198" cy="336" r="5" fill="#ef4444" />
        <circle cx="198" cy="332" r="2" fill="#22c55e" />
      </g>

      {/* Right Cat Ear */}
      <g ref={rightEarRef} filter="url(#cakeShadow)">
        {/* Main ear body extending deep into the frosting */}
        <path
          d="M 440 395 L 462 290 Q 430 280 395 330 L 385 390 Z"
          fill="#fef3e7"
          stroke="#fbcfe8"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner Pink Fluff */}
        <path
          d="M 435 375 L 452 302 Q 428 295 404 335 L 395 375 Z"
          fill="#f472b6"
        />
        <circle cx="455" cy="298" r="3.2" fill="#ffffff" opacity="0.8" />
        {/* Cute Strawberry Clip on Ear */}
        <circle cx="402" cy="336" r="5" fill="#ef4444" />
        <circle cx="402" cy="332" r="2" fill="#22c55e" />
      </g>

      {/* === 4. CAKE BODY & VELVET WRAPPER === */}
      <g filter="url(#cakeShadow)">
        {/* Cake Base Sponge Body */}
        <path
          d="M 180 375
             L 192 518
             Q 300 542 408 518
             L 420 375
             Z"
          fill="url(#cakeVelvetGrad)"
        />

        {/* Decorative Cupcake Ribbing / Pleats with Golden Shimmer */}
        <g stroke="#ffffff" strokeWidth="1.2" opacity="0.45" fill="none">
          <line x1="215" y1="382" x2="222" y2="524" />
          <line x1="250" y1="385" x2="254" y2="532" />
          <line x1="285" y1="386" x2="286" y2="536" />
          <line x1="315" y1="386" x2="314" y2="536" />
          <line x1="350" y1="385" x2="346" y2="532" />
          <line x1="385" y1="382" x2="378" y2="524" />
        </g>

        {/* Scalloped Gold Frosting Border at Wrapper Rim */}
        <path
          d="M 178 376
             Q 192 384 206 376
             Q 220 384 234 376
             Q 248 384 262 376
             Q 276 384 290 376
             Q 304 384 318 376
             Q 332 384 346 376
             Q 360 384 374 376
             Q 388 384 402 376
             Q 416 384 422 376"
          fill="none"
          stroke="#fde047"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* === 5. LUSCIOUS VELVETY FROSTING DOME (Seamlessly covering ear roots) === */}
        {/* Frosting Base Shadow */}
        <ellipse cx="300" cy="372" rx="124" ry="16" fill="#f43f5e" opacity="0.3" />

        {/* Main Whipped Cream Cloud Dome */}
        <path
          d="M 170 370
             Q 170 315 210 298
             Q 240 270 272 290
             Q 300 258 328 290
             Q 360 270 390 298
             Q 430 315 430 370
             Q 430 395 300 395
             Q 170 395 170 370 Z"
          fill="url(#frostingSwirlGrad)"
          stroke="#fbcfe8"
          strokeWidth="1.5"
        />

        {/* Frosting Gloss Highlights */}
        <ellipse cx="245" cy="305" rx="18" ry="8" fill="#ffffff" opacity="0.8" transform="rotate(-15 245 305)" />
        <ellipse cx="355" cy="305" rx="18" ry="8" fill="#ffffff" opacity="0.8" transform="rotate(15 355 305)" />
        <ellipse cx="300" cy="275" rx="24" ry="10" fill="#ffffff" opacity="0.9" />

        {/* Whipped Cream Rosettes along the border (embracing ear roots) */}
        <g fill="#ffffff" stroke="#fbcfe8" strokeWidth="1">
          <circle cx="185" cy="365" r="14" />
          <circle cx="215" cy="378" r="15" />
          <circle cx="255" cy="386" r="16" />
          <circle cx="300" cy="388" r="17" />
          <circle cx="345" cy="386" r="16" />
          <circle cx="385" cy="378" r="15" />
          <circle cx="415" cy="365" r="14" />
        </g>

        {/* Sweet Strawberries on Frosting */}
        {/* Left Strawberry */}
        <g transform="translate(195, 335) rotate(-22)" filter="url(#cakeShadow)">
          <path
            d="M 0 -12 C 10 -12, 14 2, 0 16 C -14 2, -10 -12, 0 -12 Z"
            fill="url(#strawberryGrad)"
          />
          <circle cx="-3" cy="-2" r="0.8" fill="#fef08a" />
          <circle cx="3" cy="-2" r="0.8" fill="#fef08a" />
          <circle cx="0" cy="5" r="0.8" fill="#fef08a" />
          <path d="M 0 -12 L -6 -16 L -2 -11 L 0 -18 L 2 -11 L 6 -16 Z" fill="#22c55e" />
        </g>
        {/* Right Strawberry */}
        <g transform="translate(405, 335) rotate(22)" filter="url(#cakeShadow)">
          <path
            d="M 0 -12 C 10 -12, 14 2, 0 16 C -14 2, -10 -12, 0 -12 Z"
            fill="url(#strawberryGrad)"
          />
          <circle cx="-3" cy="-2" r="0.8" fill="#fef08a" />
          <circle cx="3" cy="-2" r="0.8" fill="#fef08a" />
          <circle cx="0" cy="5" r="0.8" fill="#fef08a" />
          <path d="M 0 -12 L -6 -16 L -2 -11 L 0 -18 L 2 -11 L 6 -16 Z" fill="#22c55e" />
        </g>

        {/* Rainbow Confetti & Edible Star Sprinkles */}
        <g>
          {/* Heart sprinkles */}
          <path d="M 230 325 C 228 322, 224 323, 224 326 C 224 329, 230 333, 230 333 C 230 333, 236 329, 236 326 C 236 323, 232 322, 230 325 Z" fill="#f43f5e" />
          <path d="M 370 325 C 368 322, 364 323, 364 326 C 364 329, 370 333, 370 333 C 370 333, 376 329, 376 326 C 376 323, 372 322, 370 325 Z" fill="#f43f5e" />
          {/* Golden Stars */}
          <polygon points="275,320 277,324 281,325 278,328 279,332 275,330 271,332 272,328 269,325 273,324" fill="#eab308" />
          <polygon points="325,320 327,324 331,325 328,328 329,332 325,330 321,332 322,328 319,325 323,324" fill="#eab308" />
          {/* Colorful sugar pearls */}
          <circle cx="218" cy="355" r="3.2" fill="#38bdf8" />
          <circle cx="382" cy="355" r="3.2" fill="#a855f7" />
          <circle cx="260" cy="358" r="2.8" fill="#ec4899" />
          <circle cx="340" cy="358" r="2.8" fill="#10b981" />
        </g>

        {/* === 6. KAWAII CAT FACE ON CAKE WRAPPER === */}
        {/* Soft Glowing Rosy Cheeks */}
        <ellipse cx="236" cy="452" rx="24" ry="14" fill="#fb7185" opacity="0.75" />
        <ellipse cx="236" cy="450" rx="14" ry="8" fill="#ffffff" opacity="0.4" />
        <ellipse cx="364" cy="452" rx="24" ry="14" fill="#fb7185" opacity="0.75" />
        <ellipse cx="364" cy="450" rx="14" ry="8" fill="#ffffff" opacity="0.4" />

        {/* === Anime Kawaii Cat Eyes (Open vs Wink Switching) === */}
        <g id="cake-eyes-group">
          {/* LEFT EYE */}
          {/* Left Eye OPEN */}
          <g ref={leftOpenRef}>
            <ellipse cx="254" cy="432" rx="14" ry="18" fill="#1e1b4b" />
            <ellipse cx="254" cy="434" rx="12" ry="15" fill="#312e81" />
            <circle cx="250" cy="426" r="6" fill="#ffffff" />
            <circle cx="258" cy="440" r="3" fill="#ffffff" />
            <circle cx="248" cy="442" r="1.5" fill="#ffffff" />
            <path d="M 242 420 Q 254 412 266 420" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Left Eye WINK ARC */}
          <g ref={leftWinkRef} style={{ opacity: 0 }}>
            <path d="M 238 434 Q 254 448 270 434" fill="none" stroke="#1e1b4b" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M 266 438 L 274 444" stroke="#1e1b4b" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 242 438 L 234 444" stroke="#1e1b4b" strokeWidth="2.4" strokeLinecap="round" />
          </g>

          {/* RIGHT EYE */}
          {/* Right Eye OPEN */}
          <g ref={rightOpenRef}>
            <ellipse cx="346" cy="432" rx="14" ry="18" fill="#1e1b4b" />
            <ellipse cx="346" cy="434" rx="12" ry="15" fill="#312e81" />
            <circle cx="342" cy="426" r="6" fill="#ffffff" />
            <circle cx="350" cy="440" r="3" fill="#ffffff" />
            <circle cx="340" cy="442" r="1.5" fill="#ffffff" />
            <path d="M 334 420 Q 346 412 358 420" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Right Eye WINK ARC */}
          <g ref={rightWinkRef} style={{ opacity: 0 }}>
            <path d="M 330 434 Q 346 448 362 434" fill="none" stroke="#1e1b4b" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M 358 438 L 366 444" stroke="#1e1b4b" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 334 438 L 326 444" stroke="#1e1b4b" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>

        {/* Cute Heart Nose */}
        <path
          d="M 300 445 C 296 438, 288 440, 288 448 C 288 456, 300 464, 300 464 C 300 464, 312 456, 312 448 C 312 440, 304 438, 300 445 Z"
          fill="#e11d48"
        />

        {/* Sweet "ω" Cat Smile */}
        <path
          d="M 284 462 Q 292 472 300 464 Q 308 472 316 462"
          fill="none"
          stroke="#1e1b4b"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Cute Cat Whiskers */}
        <g ref={whiskersRef}>
          <line x1="170" y1="448" x2="225" y2="452" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="168" y1="462" x2="225" y2="462" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="172" y1="476" x2="225" y2="472" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

          <line x1="375" y1="452" x2="430" y2="448" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="375" y1="462" x2="432" y2="462" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="375" y1="472" x2="428" y2="476" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Cute Chubby Cat Paws Peeking over Bottom Rim */}
        <g fill="#ffffff" stroke="#fbcfe8" strokeWidth="1.5">
          {/* Left Paw */}
          <ellipse cx="230" cy="515" rx="16" ry="12" />
          <circle cx="223" cy="518" r="3" fill="#f472b6" opacity="0.6" />
          <circle cx="230" cy="520" r="3" fill="#f472b6" opacity="0.6" />
          <circle cx="237" cy="518" r="3" fill="#f472b6" opacity="0.6" />

          {/* Right Paw */}
          <ellipse cx="370" cy="515" rx="16" ry="12" />
          <circle cx="363" cy="518" r="3" fill="#f472b6" opacity="0.6" />
          <circle cx="370" cy="520" r="3" fill="#f472b6" opacity="0.6" />
          <circle cx="377" cy="518" r="3" fill="#f472b6" opacity="0.6" />
        </g>

        {/* === 7. GOLDEN COLLAR BELL & SATIN BOW TIE === */}
        <g ref={bowRef} transform="translate(300, 520)" filter="url(#cakeShadow)">
          {/* Satin Pink/Red Ribbon Wings */}
          <path d="M -48 -14 L -8 -4 L -8 16 L -48 24 Z" fill="#e11d48" stroke="#9f1239" strokeWidth="1.5" />
          <path d="M -44 -10 L -12 -3 L -12 12 L -44 18 Z" fill="#f43f5e" opacity="0.7" />

          <path d="M 48 -14 L 8 -4 L 8 16 L 48 24 Z" fill="#e11d48" stroke="#9f1239" strokeWidth="1.5" />
          <path d="M 44 -10 L 12 -3 L 12 12 L 44 18 Z" fill="#f43f5e" opacity="0.7" />

          {/* Golden Bell Centerpiece */}
          <g ref={bellRef}>
            <circle cx="0" cy="6" r="13" fill="url(#bellGoldGrad)" stroke="#854d0e" strokeWidth="1.5" />
            <ellipse cx="-4" cy="2" rx="4" ry="6" fill="#ffffff" opacity="0.7" />
            <line x1="-12" y1="8" x2="12" y2="8" stroke="#854d0e" strokeWidth="1.5" />
            <circle cx="0" cy="12" r="3" fill="#713f12" />
          </g>
        </g>

        {/* === 8. 3 KAWAII CAT CANDLES SNUGGLED IN FROSTING === */}
        {CANDLE_CONFIGS.map((cfg, i) => (
          <g key={i} transform={`translate(${cfg.x}, ${cfg.y})`}>
            {/* Whipped cream cushion base */}
            <ellipse cx="0" cy="0" rx="16" ry="6" fill="#fbcfe8" />
            <ellipse cx="0" cy="-2" rx="13" ry="4" fill="#ffffff" />

            {/* Candle body with soft pastel cylinder gradient */}
            <rect
              x="-9.5"
              y="-36"
              width="19"
              height="36"
              rx="6"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            {/* Birthday Diagonal Ribbon Stripes */}
            <line x1="-9" y1="-29" x2="9" y2="-23" stroke="#3b82f6" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="-9" y1="-19" x2="9" y2="-13" stroke="#3b82f6" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="-9" y1="-9" x2="9" y2="-3" stroke="#3b82f6" strokeWidth="2.8" strokeLinecap="round" />

            {/* === Kawaii Cat Head on Candle === */}
            <g>
              {/* Left Cat Ear */}
              <path
                d="M -9 -34 L -14 -49 L -3 -40 Z"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M -8 -36 L -12 -46 L -4 -40 Z"
                fill={`oklch(82% 0.16 ${cfg.earHue})`}
              />

              {/* Right Cat Ear */}
              <path
                d="M 9 -34 L 14 -49 L 3 -40 Z"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M 8 -36 L 12 -46 L 4 -40 Z"
                fill={`oklch(82% 0.16 ${cfg.earHue})`}
              />

              {/* Chubby Cat Head Dome */}
              <ellipse
                cx="0"
                cy="-36"
                rx="11.5"
                ry="10"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              {/* Rosy Cheeks */}
              <ellipse cx="-6" cy="-34" rx="2.8" ry="1.6" fill="#f43f5e" opacity="0.65" />
              <ellipse cx="6" cy="-34" rx="2.8" ry="1.6" fill="#f43f5e" opacity="0.65" />

              {/* Cat Face Expressions */}
              {cfg.expression === 'happy' && (
                <g stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" fill="none">
                  <path d="M -6 -37 Q -4 -41 -2 -37" />
                  <path d="M 2 -37 Q 4 -41 6 -37" />
                  <path d="M -2.5 -33 Q 0 -31 2.5 -33" />
                </g>
              )}
              {cfg.expression === 'wink' && (
                <g stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" fill="none">
                  <path d="M -6 -37 Q -4 -41 -2 -37" />
                  <circle cx="4" cy="-37" r="1.6" fill="#0f172a" />
                  <path d="M -2 -33 Q 0 -31 2 -33" />
                </g>
              )}
              {cfg.expression === 'joy' && (
                <g stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" fill="none">
                  <path d="M -6 -39 L -2 -37 L -6 -35" />
                  <path d="M 6 -39 L 2 -37 L 6 -35" />
                  <path d="M -2 -33 Q 0 -30 2 -33" />
                </g>
              )}

              {/* Tiny Pink Nose */}
              <circle cx="0" cy="-35" r="1" fill="#f43f5e" />

              {/* Cute Cat Whiskers */}
              <g stroke="#64748b" strokeWidth="0.8" strokeLinecap="round" opacity="0.8">
                <line x1="-8" y1="-35" x2="-13" y2="-36" />
                <line x1="-8" y1="-33" x2="-13" y2="-32" />
                <line x1="8" y1="-35" x2="13" y2="-36" />
                <line x1="8" y1="-33" x2="13" y2="-32" />
              </g>

              {/* Cute Cat Paws hugging candle body */}
              <ellipse cx="-6" cy="-22" rx="3.2" ry="2.4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.9" />
              <ellipse cx="6" cy="-22" rx="3.2" ry="2.4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.9" />
            </g>

            {/* Candle Wick — exactly at y = -54 */}
            <line
              x1="0"
              y1="-44"
              x2="0"
              y2="-54"
              stroke="#1e293b"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
