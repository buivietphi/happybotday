'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

/**
 * MischiefCatsParty — Adorable, Solid, Seamless Feline Antics:
 *   1. Chasing & Playful Tackle Duo (Unified solid bodies with galloping bounce, sprint, and playful rolling tumble)
 *   2. Loving Grooming & Licking Couple (Cohesive snuggle pair on velvet cushion with licking tongue and purr hearts)
 *   3. Pouncing Yarn Ball Kitten (Parabolic arc jump, playful paw taps, rolling ball)
 *   4. Ribbon Swinging Pendulum Cat (Unified pendulum swing from top right)
 *   5. Corner Peeking Kitten (Seamless peeking and blinking from bottom left)
 *   6. Interactive Tap Reactions on all cats with cute meow bubbles!
 */
export default function MischiefCatsParty() {
  const root = useRef<HTMLDivElement>(null);
  const chaseDuoRef = useRef<HTMLDivElement>(null);
  const chaserCatRef = useRef<SVGGElement>(null);
  const runnerCatRef = useRef<SVGGElement>(null);
  const tongueRef = useRef<SVGPathElement>(null);
  const purrHeartsRef = useRef<SVGGElement>(null);
  const yarnKittenRef = useRef<HTMLDivElement>(null);
  const yarnBallRef = useRef<SVGCircleElement>(null);
  const pendulumCatRef = useRef<HTMLDivElement>(null);
  const peekingKittenRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const [tappedEmoji, setTappedEmoji] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const handleCatTap = (e: React.MouseEvent, text: string) => {
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setTappedEmoji((prev) => [...prev.slice(-6), { id, x, y, text }]);

    try {
      const sounds = ['/sounds/meow_chirp.wav', '/sounds/meow1.wav', '/sounds/meow_double.wav'];
      const audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
      audio.volume = 0.55;
      audio.play().catch(() => {});
    } catch {
      // Audio playback fails gracefully if unallowed
    }

    setTimeout(() => {
      setTappedEmoji((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // ========================================================
      // 1. RUNNING & TACKLE CHASE DUO (Solid, Unified Body Gallop)
      // ========================================================
      const chaseWrap = chaseDuoRef.current;
      const chaser = chaserCatRef.current;
      const runner = runnerCatRef.current;

      if (chaseWrap && chaser && runner) {
        // Galloping up/down bounce for both cats in sync
        gsap.to(chaser, {
          y: -10,
          rotate: -4,
          duration: 0.16,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '50% 100%',
        });
        gsap.to(runner, {
          y: -12,
          rotate: 4,
          duration: 0.16,
          delay: 0.08,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '50% 100%',
        });

        // Main chase path: Run across, tackle wrestle, run back
        const chaseTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        chaseTl
          // Sprint to the right
          .set(chaseWrap, { x: '-22vw', scaleX: 1 })
          .to(chaseWrap, {
            x: '40vw',
            duration: 4.6,
            ease: 'none',
          })
          // Tackle wrestle: duo shakes and jumps playfully
          .to(chaseWrap, {
            y: -16,
            duration: 0.14,
            yoyo: true,
            repeat: 7,
            ease: 'power1.inOut',
          })
          // Turn around and sprint to the left
          .set(chaseWrap, { scaleX: -1 })
          .to(chaseWrap, {
            x: '-24vw',
            duration: 4.4,
            ease: 'none',
          });
      }

      // ========================================================
      // 2. GROOMING COUPLE (Licking Tongue & Purr Hearts)
      // ========================================================
      const tongue = tongueRef.current;
      const hearts = purrHeartsRef.current;

      if (tongue && hearts) {
        const groomTl = gsap.timeline({ repeat: -1, repeatDelay: 1.0 });
        groomTl
          // 4 licking strokes
          .fromTo(
            tongue,
            { scaleY: 0, opacity: 0 },
            {
              scaleY: 1.3,
              opacity: 1,
              duration: 0.22,
              yoyo: true,
              repeat: 5,
              ease: 'sine.inOut',
              transformOrigin: '50% 0%',
            },
          )
          // Floating purr hearts
          .fromTo(
            hearts,
            { opacity: 0, y: 0, scale: 0.4 },
            { opacity: 1, y: -24, scale: 1.1, duration: 0.9, ease: 'power2.out' },
            0.3,
          )
          .to(hearts, { opacity: 0, duration: 0.3 }, 1.1);
      }

      // ========================================================
      // 3. YARN BALL & POUNCING KITTEN (Parabolic Arc Leap)
      // ========================================================
      const yarnWrap = yarnKittenRef.current;
      const ball = yarnBallRef.current;

      if (yarnWrap && ball) {
        const yarnTl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
        yarnTl
          // 1. Wiggle rear
          .to(yarnWrap, {
            x: -4,
            rotate: 4,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
            ease: 'sine.inOut',
            transformOrigin: 'bottom center',
          })
          // 2. Leap arc over yarn ball
          .to(yarnWrap, {
            x: 45,
            y: -28,
            duration: 0.4,
            ease: 'power2.out',
          })
          .to(ball, {
            x: 60,
            duration: 0.6,
            ease: 'power2.out',
          }, '<0.1')
          .to(yarnWrap, {
            y: 0,
            duration: 0.3,
            ease: 'bounce.out',
          })
          // 3. Return to initial spot
          .to(yarnWrap, {
            x: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            delay: 0.6,
          })
          .to(ball, {
            x: 0,
            duration: 0.6,
            ease: 'power2.inOut',
          }, '<');
      }

      // ========================================================
      // 4. TOP PENDULUM RIBBON SWINGING CAT
      // ========================================================
      const pendulumCat = pendulumCatRef.current;
      if (pendulumCat) {
        gsap.to(pendulumCat, {
          rotate: 15,
          duration: 2.0,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: 'top center',
        });
      }

      // ========================================================
      // 5. BOTTOM PEEKING KITTEN
      // ========================================================
      const peekingKitten = peekingKittenRef.current;
      if (peekingKitten) {
        const peekTl = gsap.timeline({ repeat: -1, repeatDelay: 2.2 });
        peekTl
          .to(peekingKitten, { y: -30, duration: 0.45, ease: 'back.out(1.7)' })
          .to(peekingKitten, { rotate: 4, duration: 0.15, yoyo: true, repeat: 5 })
          .to(peekingKitten, { y: 0, duration: 0.4, ease: 'power2.in', delay: 1.6 });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={root}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      <style>{`
        @keyframes tapMeowFloat {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          50% { opacity: 1; transform: translateY(-20px) scale(1.15); }
          100% { opacity: 0; transform: translateY(-40px) scale(1.3); }
        }
        .cat-interactive-tap {
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cat-interactive-tap:hover {
          transform: scale(1.08);
        }
        .cat-interactive-tap:active {
          transform: scale(0.92);
        }
      `}</style>

      {/* Floating Tapped Meow Emojis */}
      {tappedEmoji.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            fontSize: '22px',
            pointerEvents: 'none',
            animation: 'tapMeowFloat 1.2s ease-out forwards',
            zIndex: 10,
          }}
        >
          {item.text}
        </div>
      ))}

      {/* ============================================================
          1. CHASE & PLAYFUL TACKLE DUO (Completely Solid Unified Anatomy)
         ============================================================ */}
      <div
        ref={chaseDuoRef}
        className="cat-interactive-tap"
        onClick={(e) => handleCatTap(e, '⚡ Meowww! Chạy rượt đuổi nhau nè! 🐾')}
        style={{
          position: 'absolute',
          bottom: '9%',
          left: '0',
          width: '270px',
          height: '100px',
          zIndex: 4,
          transformOrigin: 'bottom center',
        }}
      >
        <svg viewBox="0 0 270 100" width="270" height="100" style={{ overflow: 'visible' }}>
          {/* Running dust puffs */}
          <g fill="#ffffff" opacity="0.3">
            <circle cx="25" cy="85" r="8" />
            <circle cx="40" cy="88" r="5" />
            <circle cx="52" cy="86" r="4" />
          </g>

          {/* CAT A (Chaser - Solid Ginger Tabby) */}
          <g ref={chaserCatRef} transform="translate(10, 10)">
            {/* Tail seamlessly connected */}
            <path d="M 22 56 Q -4 42 2 20 Q 6 12 12 14" fill="none" stroke="#ea580c" strokeWidth="8" strokeLinecap="round" />
            {/* Solid Body & Legs */}
            <path
              d="M 20 54 C 20 32, 60 30, 76 46 C 88 56, 84 72, 70 72 C 48 72, 24 72, 20 54 Z"
              fill="#f97316"
              stroke="#ea580c"
              strokeWidth="1.5"
            />
            {/* Belly highlight */}
            <path d="M 32 60 Q 52 68 68 60" fill="none" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
            {/* Paws */}
            <ellipse cx="26" cy="74" rx="6" ry="4" fill="#ea580c" />
            <ellipse cx="40" cy="75" rx="6" ry="4" fill="#ea580c" />
            <ellipse cx="70" cy="74" rx="6" ry="4" fill="#ea580c" />
            <ellipse cx="82" cy="73" rx="6" ry="4" fill="#ea580c" />
            {/* Tabby stripes */}
            <path d="M 40 38 Q 44 46 42 54 M 52 38 Q 56 46 54 54 M 64 40 Q 66 48 64 54" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
            {/* Solid Head connected directly to body */}
            <ellipse cx="80" cy="38" rx="18" ry="16" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
            {/* Ears */}
            <polygon points="68,28 62,12 76,24" fill="#ea580c" />
            <polygon points="84,24 98,12 92,28" fill="#ea580c" />
            <polygon points="69,26 65,16 74,24" fill="#f472b6" />
            <polygon points="85,24 94,16 90,26" fill="#f472b6" />
            {/* Eyes */}
            <circle cx="76" cy="36" r="4.2" fill="#1e1b4b" />
            <circle cx="75" cy="34" r="1.5" fill="#ffffff" />
            <circle cx="86" cy="36" r="4.2" fill="#1e1b4b" />
            <circle cx="85" cy="34" r="1.5" fill="#ffffff" />
            {/* Open Playful Biting Mouth */}
            <path d="M 88 42 Q 97 45 88 50 Z" fill="#991b1b" />
            <polygon points="90,42 92,45 94,42" fill="#ffffff" />
            <polygon points="90,50 92,47 94,50" fill="#ffffff" />
          </g>

          {/* Comic Action Star Burst */}
          <polygon points="128,30 134,22 131,27 139,25 133,33 130,30 125,33" fill="#facc15" />

          {/* CAT B (Runner - Solid Tuxedo Cat) */}
          <g ref={runnerCatRef} transform="translate(140, 10)">
            {/* Tail seamlessly connected */}
            <path d="M 22 54 Q -2 38 6 18 Q 10 10 16 12" fill="none" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
            <circle cx="15" cy="12" r="5" fill="#ffffff" />
            {/* Solid Body & Legs */}
            <path
              d="M 20 54 C 20 32, 60 30, 76 46 C 88 56, 84 72, 70 72 C 48 72, 24 72, 20 54 Z"
              fill="#0f172a"
              stroke="#020617"
              strokeWidth="1.5"
            />
            {/* White Tuxedo Chest */}
            <path d="M 34 58 Q 54 66 70 58" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            {/* White Paws */}
            <ellipse cx="26" cy="74" rx="6" ry="4" fill="#ffffff" />
            <ellipse cx="40" cy="75" rx="6" ry="4" fill="#ffffff" />
            <ellipse cx="70" cy="74" rx="6" ry="4" fill="#ffffff" />
            <ellipse cx="82" cy="73" rx="6" ry="4" fill="#ffffff" />
            {/* Solid Head connected directly to body */}
            <ellipse cx="80" cy="38" rx="18" ry="16" fill="#0f172a" />
            <ellipse cx="82" cy="42" rx="10" ry="8" fill="#ffffff" />
            {/* Ears */}
            <polygon points="68,28 62,12 76,24" fill="#0f172a" />
            <polygon points="84,24 98,12 92,28" fill="#0f172a" />
            {/* Laughing Winking Face */}
            <path d="M 73 35 Q 77 31 81 35" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="87" cy="35" r="3.5" fill="#0f172a" />
            <circle cx="86" cy="34" r="1.2" fill="#ffffff" />
            <path d="M 77 43 Q 81 48 85 43" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* ============================================================
          2. GROOMING COUPLE (Solid Snuggling Pair on Cushion)
         ============================================================ */}
      <div
        className="cat-interactive-tap"
        onClick={(e) => handleCatTap(e, '💖 Purrrr~ Liếm lông dụi đầu siêu cưng! 😻')}
        style={{
          position: 'absolute',
          top: '12%',
          left: '3%',
          width: '185px',
          height: '130px',
          zIndex: 4,
        }}
      >
        <svg viewBox="0 0 185 130" width="185" height="130" style={{ overflow: 'visible' }}>
          {/* Soft Pink Cushion */}
          <ellipse cx="92" cy="112" rx="80" ry="14" fill="rgba(244, 114, 182, 0.25)" stroke="#f472b6" strokeWidth="1.5" />

          {/* Purr Hearts */}
          <g ref={purrHeartsRef} opacity="0" transform="translate(92, 20)">
            <path d="M 0 0 C -6 -8, -14 0, 0 10 C 14 0, 6 -8, 0 0 Z" fill="#f43f5e" />
            <path d="M 16 -8 C 12 -14, 6 -8, 16 -1 C 26 -8, 20 -14, 16 -8 Z" fill="#fb7185" />
          </g>

          {/* CAT A (Solid White Persian Cat) */}
          <g transform="translate(25, 35)">
            {/* Tail */}
            <path d="M 12 55 Q -10 38 4 20" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" />
            <path d="M 12 55 Q -10 38 4 20" fill="none" stroke="#fbcfe8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Solid Body */}
            <ellipse cx="38" cy="50" rx="26" ry="20" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1.5" />
            {/* Solid Head */}
            <circle cx="54" cy="34" r="17" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1.5" />
            <polygon points="42,24 38,10 50,20" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1.2" />
            <polygon points="56,20 68,10 64,24" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1.2" />
            <polygon points="43,23 40,14 48,20" fill="#f472b6" opacity="0.6" />
            <polygon points="57,20 65,14 62,23" fill="#f472b6" opacity="0.6" />
            {/* Closed Smiling Eyes */}
            <path d="M 46 32 Q 49 28 53 32" fill="none" stroke="#1e1b4b" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 57 32 Q 60 28 64 32" fill="none" stroke="#1e1b4b" strokeWidth="2.2" strokeLinecap="round" />
            {/* Licking Tongue (Solid, attached to mouth) */}
            <path
              ref={tongueRef}
              d="M 66 38 C 72 36, 76 42, 72 48 C 68 50, 64 46, 66 38 Z"
              fill="#fb7185"
              stroke="#e11d48"
              strokeWidth="1"
            />
          </g>

          {/* CAT B (Solid Siamese Cat Snuggled Next to Cat A) */}
          <g transform="translate(90, 36)">
            {/* Tail */}
            <path d="M 45 52 Q 62 36 52 20" fill="none" stroke="#6b21a8" strokeWidth="8" strokeLinecap="round" />
            {/* Solid Body */}
            <ellipse cx="32" cy="50" rx="25" ry="19" fill="#f5d0fe" stroke="#d8b4fe" strokeWidth="1.5" />
            {/* Solid Head Tilting in Bliss */}
            <circle cx="18" cy="35" r="16" fill="#f5d0fe" stroke="#d8b4fe" strokeWidth="1.5" />
            <ellipse cx="16" cy="37" rx="10" ry="8" fill="#581c87" opacity="0.9" />
            <polygon points="8,26 4,12 16,22" fill="#581c87" />
            <polygon points="20,22 32,12 28,26" fill="#581c87" />
            {/* Purring Ecstatic Eyes */}
            <path d="M 11 34 Q 14 30 18 34" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M 19 34 Q 22 30 25 34" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="10" cy="40" r="2.8" fill="#f472b6" opacity="0.8" />
            <circle cx="23" cy="40" r="2.8" fill="#f472b6" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* ============================================================
          3. POUNCING YARN KITTEN (Solid Calico Kitten)
         ============================================================ */}
      <div
        ref={yarnKittenRef}
        className="cat-interactive-tap"
        onClick={(e) => handleCatTap(e, '🧶 Vồ cuộn len nhào lộn siêu điệu nghệ! ✨')}
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '4%',
          width: '180px',
          height: '120px',
          zIndex: 4,
          transformOrigin: 'bottom center',
        }}
      >
        <svg viewBox="0 0 180 120" width="180" height="120" style={{ overflow: 'visible' }}>
          {/* Solid Calico Kitten */}
          <g transform="translate(30, 25)">
            {/* Tail seamlessly connected */}
            <path d="M 15 50 Q -5 32 4 15" fill="none" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" />
            {/* Solid Body & Paws */}
            <ellipse cx="38" cy="48" rx="26" ry="18" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.5" />
            <circle cx="30" cy="42" r="9" fill="#fb923c" />
            <circle cx="48" cy="48" r="8" fill="#1e293b" />
            <ellipse cx="28" cy="62" rx="6" ry="4" fill="#ffffff" stroke="#fed7aa" strokeWidth="1" />
            <ellipse cx="48" cy="62" rx="6" ry="4" fill="#ffffff" stroke="#fed7aa" strokeWidth="1" />
            {/* Solid Head */}
            <circle cx="56" cy="34" r="16" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.5" />
            <polygon points="46,24 42,10 54,20" fill="#fb923c" />
            <polygon points="58,20 70,10 66,24" fill="#1e293b" />
            {/* Starry Eyes */}
            <circle cx="51" cy="32" r="4.2" fill="#1e1b4b" />
            <circle cx="50" cy="30" r="1.5" fill="#ffffff" />
            <circle cx="61" cy="32" r="4.2" fill="#1e1b4b" />
            <circle cx="60" cy="30" r="1.5" fill="#ffffff" />
            <polygon points="55,37 58,37 56.5,39" fill="#e11d48" />
          </g>

          {/* Rolling Yarn Ball */}
          <circle ref={yarnBallRef} cx="130" cy="72" r="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ============================================================
          4. TOP PENDULUM RIBBON SWINGING CAT
         ============================================================ */}
      <div
        ref={pendulumCatRef}
        className="cat-interactive-tap"
        onClick={(e) => handleCatTap(e, '🎈 Đang đu dây bắt bóng bay nè! 😸')}
        style={{
          position: 'absolute',
          top: '-10px',
          right: '8%',
          width: '110px',
          height: '140px',
          zIndex: 5,
          transformOrigin: 'top center',
        }}
      >
        <svg viewBox="0 0 110 140" width="110" height="140" style={{ overflow: 'visible' }}>
          {/* Ribbon */}
          <line x1="55" y1="0" x2="55" y2="48" stroke="#f43f5e" strokeWidth="3" />

          {/* Upside Down Cat (Solid complete illustration) */}
          <g transform="translate(55, 76) rotate(180)">
            <ellipse cx="0" cy="0" rx="20" ry="26" fill="#ea580c" />
            <ellipse cx="0" cy="0" rx="12" ry="17" fill="#ffedd5" />
            <ellipse cx="-12" cy="-26" rx="6" ry="7" fill="#ea580c" />
            <ellipse cx="12" cy="-26" rx="6" ry="7" fill="#ea580c" />
            <path d="M 0 -25 Q 20 -42 10 -52" fill="none" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />
            <circle cx="0" cy="30" r="16" fill="#ea580c" />
            <polygon points="-11,4 -17,18 -3,10" fill="#c2410c" />
            <polygon points="3,10 17,18 11,4" fill="#c2410c" />
            <circle cx="-5" cy="-2" r="4.2" fill="#1e1b4b" />
            <circle cx="-4" cy="-4" r="1.5" fill="#ffffff" />
            <circle cx="5" cy="-2" r="4.2" fill="#1e1b4b" />
            <circle cx="6" cy="-4" r="1.5" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* ============================================================
          5. BOTTOM PEEKING KITTEN
         ============================================================ */}
      <div
        ref={peekingKittenRef}
        className="cat-interactive-tap"
        onClick={(e) => handleCatTap(e, '👀 Ú òa! Chúc mừng sinh nhật chị Kiều Lee! 🐱')}
        style={{
          position: 'absolute',
          bottom: '0',
          left: '10%',
          width: '100px',
          height: '70px',
          zIndex: 5,
          transformOrigin: 'bottom center',
        }}
      >
        <svg viewBox="0 0 100 70" width="100" height="70" style={{ overflow: 'visible' }}>
          {/* Blue Tabby Kitten (Solid cohesive unit) */}
          <g transform="translate(50, 42)">
            <ellipse cx="0" cy="0" rx="25" ry="20" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <polygon points="-16,-10 -24,-26 -6,-16" fill="#0284c7" />
            <polygon points="-14,-12 -20,-22 -8,-16" fill="#f472b6" opacity="0.75" />
            <polygon points="6,-16 24,-26 16,-10" fill="#0284c7" />
            <polygon points="8,-16 20,-22 14,-12" fill="#f472b6" opacity="0.75" />
            {/* Anime Eyes */}
            <circle cx="-9" cy="-2" r="5.8" fill="#0f172a" />
            <circle cx="-10" cy="-4" r="2.2" fill="#ffffff" />
            <circle cx="-7" cy="1" r="1.1" fill="#ffffff" />
            <circle cx="9" cy="-2" r="5.8" fill="#0f172a" />
            <circle cx="8" cy="-4" r="2.2" fill="#ffffff" />
            <circle cx="11" cy="1" r="1.1" fill="#ffffff" />
            {/* Cheeks & Paws */}
            <circle cx="-14" cy="4" r="3.8" fill="#f472b6" opacity="0.7" />
            <circle cx="14" cy="4" r="3.8" fill="#f472b6" opacity="0.7" />
            <ellipse cx="-16" cy="18" rx="8" ry="6" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
            <ellipse cx="16" cy="18" rx="8" ry="6" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}
