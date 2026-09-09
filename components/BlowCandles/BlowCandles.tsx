'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import CakeSVG, { CANDLE_CONFIGS } from '@/components/bits/CakeSVG';
import CandleFlame from '@/components/bits/CandleFlame';
import SmokeWisp from '@/components/bits/SmokeWisp';
import ConfettiBurst from '@/components/bits/ConfettiBurst';
import Matchstick from '@/components/bits/Matchstick';
import IgniteBurst from '@/components/bits/IgniteBurst';
import FloatingCode from '@/components/bits/FloatingCode';
import QueenAnt from '@/components/bits/QueenAnt';
import config from '@/content/site.config';

type Props = {
  onComplete: () => void;
};

/**
 * User-driven cake lighting & blowing choreography:
 *
 *   dark      → soft intro
 *   entering  → matchstick & wind cloud slide into position
 *   ready     → user drags matchstick to light 3 cute cat candles
 *   lit       → all 3 candles flickering; "Em ước đi nhé" pause
 *   blowing   → user drags wind breeze cloud across candles to blow them out (dissolves and respawns like cloud vapor)
 *   celebrate → "Chúc mừng em yêu!" + confetti burst + Hallmark Luxury CTA button (NO AUTO NAVIGATION, waits for user click)
 *   advance   → call onComplete
 */
type Phase =
  | 'dark'
  | 'entering'
  | 'ready'
  | 'lit'
  | 'blowing'
  | 'celebrate'
  | 'advance';

const CANDLE_COUNT = CANDLE_CONFIGS.length; // 3 cute cat candles

// Matchstick sits comfortably on the lower-right side
const MATCH_CORNER = { x: 510, y: 440, rotate: 18 };
const MATCH_HIT_RADIUS = 46;

// Blowing Ant in place of cloud sits on the left
const WIND_CORNER = { x: 55, y: 260 };

// Timings (ms)
const T_DARK = 600;
const T_ENTERING = 1200;
const T_LIT = 5000;
const T_BLOW_TO_CELEBRATE = 800;

function FlyingWindPuff({
  startX,
  startY,
  targetX,
  targetY,
  onHit,
  onComplete,
}: {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  onHit: () => void;
  onComplete: () => void;
}) {
  const puffRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!puffRef.current) return;
    const el = puffRef.current;
    let hitFired = false;

    gsap.set(el, {
      x: startX,
      y: startY,
      scale: 0.5,
      opacity: 0.95,
    });

    gsap.to(el, {
      x: targetX,
      y: targetY - 6 + (Math.random() * 10 - 5),
      scale: 1.25,
      duration: 0.45,
      ease: 'power1.out',
      onUpdate: function () {
        if (!hitFired && this.progress() >= 0.72) {
          hitFired = true;
          onHit();
        }
      },
      onComplete: () => {
        gsap.to(el, {
          opacity: 0,
          scale: 1.5,
          duration: 0.12,
          ease: 'power2.out',
          onComplete,
        });
      },
    });
  }, [startX, startY, targetX, targetY, onHit, onComplete]);

  return (
    <g ref={puffRef} style={{ pointerEvents: 'none' }} filter="url(#windGlow)">
      {/* Cute Kawaii Flying Wind Cloud Puff ("1 đám gió") */}
      <g>
        <ellipse cx="0" cy="0" rx="16" ry="11" fill="url(#windBreezeGrad)" stroke="#38bdf8" strokeWidth="1.2" opacity="0.95" />
        <ellipse cx="-8" cy="2" rx="10" ry="8" fill="url(#windBreezeGrad)" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
        <ellipse cx="9" cy="-2" rx="9" ry="7" fill="url(#windBreezeGrad)" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
        <circle cx="1" cy="-7" r="7" fill="url(#windBreezeGrad)" />
        {/* Soft highlight */}
        <ellipse cx="2" cy="-4" rx="6" ry="3" fill="#ffffff" opacity="0.9" />
        {/* Wind motion trail tail behind */}
        <path d="M -16 2 Q -26 0 -34 4" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
        <path d="M -12 -3 Q -22 -6 -28 -2" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
    </g>
  );
}

function GiantMegaWindPuff({
  startX,
  startY,
  targetX,
  targetY,
  onHit,
  onComplete,
}: {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  onHit: () => void;
  onComplete: () => void;
}) {
  const puffRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!puffRef.current) return;
    const el = puffRef.current;
    let hitFired = false;

    gsap.set(el, {
      x: startX,
      y: startY,
      scale: 0.9,
      opacity: 1,
    });

    gsap.to(el, {
      x: targetX,
      y: targetY - 10,
      scale: 2.4,
      duration: 0.55,
      ease: 'power2.out',
      onUpdate: function () {
        if (!hitFired && this.progress() >= 0.65) {
          hitFired = true;
          onHit();
        }
      },
      onComplete: () => {
        gsap.to(el, {
          opacity: 0,
          scale: 3.2,
          duration: 0.18,
          ease: 'power2.out',
          onComplete,
        });
      },
    });
  }, [startX, startY, targetX, targetY, onHit, onComplete]);

  return (
    <g ref={puffRef} style={{ pointerEvents: 'none' }} filter="url(#windGlow)">
      {/* 1 Cục Gió To Khổng Lồ ("nhấn giữ nặng ra 1 cục gió to") */}
      <circle cx="0" cy="0" r="28" fill="url(#windBreezeGrad)" stroke="#0284c7" strokeWidth="2.5" opacity="0.95" />
      <ellipse cx="-14" cy="4" rx="20" ry="16" fill="url(#windBreezeGrad)" stroke="#38bdf8" strokeWidth="1.8" opacity="0.9" />
      <ellipse cx="16" cy="-4" rx="18" ry="15" fill="url(#windBreezeGrad)" stroke="#38bdf8" strokeWidth="1.8" opacity="0.9" />
      <circle cx="2" cy="-12" r="14" fill="url(#windBreezeGrad)" />
      {/* Swirling Cyclone Rings */}
      <ellipse cx="0" cy="0" rx="36" ry="16" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="16 8" opacity="0.85" />
      <ellipse cx="0" cy="0" rx="26" ry="24" fill="none" stroke="#bae6fd" strokeWidth="2" strokeDasharray="12 6" opacity="0.75" />
      {/* Mega Speed Trails behind */}
      <path d="M -30 6 Q -48 2 -68 10" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M -26 -8 Q -46 -14 -62 -6" stroke="#7dd3fc" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M -20 18 Q -40 24 -56 16" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
    </g>
  );
}

export default function BlowCandles({ onComplete }: Props) {
  const root = useRef<HTMLElement>(null);
  const matchstickRef = useRef<SVGGElement>(null);
  const windGroupRef = useRef<SVGGElement>(null);
  const cakeWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const proceedBtnRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotionSafe();

  const [phase, setPhase] = useState<Phase>('dark');
  // All candles start unlit
  const [extinguished, setExtinguished] = useState<boolean[]>(() =>
    Array(CANDLE_COUNT).fill(true),
  );
  // Smoke drift direction per candle
  const [smokeDrift, setSmokeDrift] = useState<number[]>(() =>
    Array(CANDLE_COUNT).fill(-14),
  );
  // Matchstick starts unlit, ignites only when user touches/drags it
  const [isMatchLit, setIsMatchLit] = useState(false);
  // Per-candle burst trigger on ignite
  const [burstActive, setBurstActive] = useState<boolean[]>(() =>
    Array(CANDLE_COUNT).fill(false),
  );
  // Nitro wind active state when user is dragging the cloud
  const [isDraggingWind, setIsDraggingWind] = useState(false);
  // Dynamic nitro angle trailing directly behind drag motion
  const [dragAngle, setDragAngle] = useState(180);

  // Flying Wind Puffs state ("5 gió cùng lúc hoặc nhấn giữ nặng ra 1 cục gió to")
  type WindPuff = {
    id: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    isMega?: boolean;
  };
  const [windPuffs, setWindPuffs] = useState<WindPuff[]>([]);
  const [antIsPuffing, setAntIsPuffing] = useState(false);
  const [isChargingMega, setIsChargingMega] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const puffCounterRef = useRef(0);
  const recentHitsRef = useRef<number[]>([]);
  const holdStartTimeRef = useRef<number>(0);
  const holdTimerRef = useRef<number | null>(null);
  const isHoldActiveRef = useRef(false);
  const rapidClickTimestampsRef = useRef<number[]>([]);
  const [showTiredAnt, setShowTiredAnt] = useState(false);
  const hasShownTiredRef = useRef(false);

  // Crying cat state if user stays in celebrate phase for 30s without clicking proceed button
  const [showCryingCat, setShowCryingCat] = useState(false);
  const cryingCatRef = useRef<HTMLDivElement>(null);

  const litCount = extinguished.filter((v) => !v).length;
  const blownCount = extinguished.filter((v) => v).length;

  // Drag state
  const dragMode = useRef<null | 'matchstick' | 'wind'>(null);
  const matchstickOffset = useRef({ x: 0, y: 0 });
  const windOffset = useRef({ x: 0, y: 0 });
  const matchstickHeadVB = useRef({ x: MATCH_CORNER.x, y: MATCH_CORNER.y });
  const windCenterVB = useRef({ x: WIND_CORNER.x, y: WIND_CORNER.y });

  const syncRefsFromDOM = useCallback(() => {
    const ms = matchstickRef.current;
    const wg = windGroupRef.current;
    if (ms) {
      const raw = ms.getAttribute('transform');
      if (raw && raw.startsWith('matrix(')) {
        const parts = raw.slice(7, -1).split(',').map((s) => parseFloat(s.trim()));
        if (parts.length >= 6 && parts.every((n) => Number.isFinite(n))) {
          matchstickHeadVB.current = { x: parts[4], y: parts[5] };
        }
      }
    }
    if (wg) {
      const raw = wg.getAttribute('transform');
      if (raw && raw.startsWith('matrix(')) {
        const parts = raw.slice(7, -1).split(',').map((s) => parseFloat(s.trim()));
        if (parts.length >= 6 && parts.every((n) => Number.isFinite(n))) {
          windCenterVB.current = { x: parts[4], y: parts[5] };
        }
      }
    }
  }, []);

  const litInThisDrag = useRef<Set<number>>(new Set());
  const extinguishingRef = useRef<Set<number>>(new Set());

  /** Cloud Vapor Dissolve & Respawn at Default Point */
  const respawnWindCloud = useCallback(() => {
    const wg = windGroupRef.current;
    if (!wg) return;
    gsap.killTweensOf(wg);

    const tl = gsap.timeline();
    // 1. Dissolve like a cloud of vapor / mist blowing away
    tl.to(wg, {
      x: '-=30',
      scaleX: 1.38,
      scaleY: 0.65,
      opacity: 0,
      duration: 0.28,
      ease: 'power2.out',
    })
    // 2. Gather together & respawn at default location
    .fromTo(
      wg,
      {
        x: WIND_CORNER.x - 20,
        y: WIND_CORNER.y,
        scale: 0.2,
        scaleX: 0.2,
        scaleY: 0.2,
        opacity: 0,
      },
      {
        x: WIND_CORNER.x,
        y: WIND_CORNER.y,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.48,
        ease: 'back.out(1.6)',
        onComplete: () => {
          windCenterVB.current = { x: WIND_CORNER.x, y: WIND_CORNER.y };
          // Resume gentle hover breathing
          gsap.to(wg, {
            y: WIND_CORNER.y - 7,
            duration: 1.8,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        },
      },
    );
  }, []);

  // Reduced motion
  useEffect(() => {
    if (!reduced) return;
    const t = window.setTimeout(() => onComplete(), 600);
    return () => window.clearTimeout(t);
  }, [reduced, onComplete]);

  // Phase entrance: dark → entering → ready
  useEffect(() => {
    if (reduced) return;
    const t1 = window.setTimeout(() => setPhase('entering'), T_DARK);
    const t2 = window.setTimeout(() => setPhase('ready'), T_DARK + T_ENTERING);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  // ready → lit: when all 3 candles are lit
  useEffect(() => {
    if (phase !== 'ready') return;
    if (litCount < CANDLE_COUNT) return;

    // Smoothly return matchstick to corner and extinguish flame
    const ms = matchstickRef.current;
    if (ms) {
      gsap.killTweensOf(ms);
      gsap.to(ms, {
        x: MATCH_CORNER.x,
        y: MATCH_CORNER.y,
        rotate: MATCH_CORNER.rotate,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setIsMatchLit(false);
          matchstickHeadVB.current = { x: MATCH_CORNER.x, y: MATCH_CORNER.y };
        },
      });
    }

    const t = window.setTimeout(() => setPhase('lit'), 600);
    return () => window.clearTimeout(t);
  }, [phase, litCount]);

  // lit → blowing: prompt user to blow candles after wish pause
  useEffect(() => {
    if (phase !== 'lit') return;
    const t = window.setTimeout(() => setPhase('blowing'), T_LIT);
    return () => window.clearTimeout(t);
  }, [phase]);

  // blowing → celebrate: when all candles blown out (STAYS IN CELEBRATE UNTIL USER CLICKS BUTTON)
  useEffect(() => {
    if (phase !== 'blowing') return;
    if (blownCount < CANDLE_COUNT) return;
    respawnWindCloud();
    const t = window.setTimeout(() => setPhase('celebrate'), T_BLOW_TO_CELEBRATE);
    return () => window.clearTimeout(t);
  }, [phase, blownCount, respawnWindCloud]);

  // advance → call onComplete
  useEffect(() => {
    if (phase !== 'advance') return;
    const t = window.setTimeout(() => onComplete(), 150);
    return () => window.clearTimeout(t);
  }, [phase, onComplete]);

  // GSAP Entrance & Heartbeat animation for Hallmark Proceed Button in celebrate phase
  useEffect(() => {
    if (reduced || phase !== 'celebrate' || !proceedBtnRef.current) return;
    const btn = proceedBtnRef.current;
    gsap.killTweensOf(btn);

    const ctx = gsap.context(() => {
      // Bouncy celebratory entrance
      gsap.fromTo(
        btn,
        { scale: 0.4, y: 32, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'back.out(2)',
        },
      );

      // Continuous gentle breathing pulse
      gsap.to(btn, {
        scale: 1.035,
        duration: 1.3,
        delay: 0.85,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [phase, reduced]);

  // If user stays in celebrate phase for ~30s without clicking the proceed button, show crying cat
  useEffect(() => {
    if (phase !== 'celebrate') {
      setShowCryingCat(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowCryingCat(true);
      try {
        const audio = new Audio('/sounds/ant_chirp.wav');
        audio.volume = 0.65;
        audio.play().catch(() => {});
      } catch {}
    }, 30000); // 30s timeout

    return () => window.clearTimeout(timer);
  }, [phase]);

  // User click on Hallmark Proceed Button
  const handleProceedClick = useCallback(() => {
    if (phase !== 'celebrate') return;
    const btn = proceedBtnRef.current;
    if (btn) {
      gsap.killTweensOf(btn);
      gsap.to(btn, {
        scale: 0.94,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(btn, {
            scale: 1.12,
            opacity: 0,
            duration: 0.25,
            ease: 'back.out(1.5)',
            onComplete: () => {
              setPhase('advance');
            },
          });
        },
      });
    } else {
      setPhase('advance');
    }
  }, [phase]);

  // Matchstick entrance & idle hover wobble
  useEffect(() => {
    if (reduced || !matchstickRef.current) return;
    const el = matchstickRef.current;
    const ctx = gsap.context(() => {
      // Start off-screen lower-right
      gsap.set(el, {
        x: MATCH_CORNER.x + 120,
        y: MATCH_CORNER.y + 120,
        rotate: 35,
        opacity: 0,
      });
      // Slide into corner
      gsap.to(el, {
        x: MATCH_CORNER.x,
        y: MATCH_CORNER.y,
        rotate: MATCH_CORNER.rotate,
        opacity: 1,
        duration: T_ENTERING / 1000,
        delay: T_DARK / 1000,
        ease: 'power2.out',
      });
      // (Idle breathing wobble removed — matchstick now sits still in the corner
      // so the cursor lands on it cleanly without chasing a moving target.)
    });
    return () => ctx.revert();
  }, [reduced]);

  // Wind entrance & constant hovering presence on far LEFT (always visible)
  useEffect(() => {
    if (reduced || !windGroupRef.current) return;
    const el = windGroupRef.current;
    const ctx = gsap.context(() => {
      // Start off-screen left
      gsap.set(el, {
        x: WIND_CORNER.x - 120,
        y: WIND_CORNER.y,
        opacity: 0,
        scale: 0.7,
      });
      // Slide into permanent left position and stay still (no bobbing)
      gsap.to(el, {
        x: WIND_CORNER.x,
        y: WIND_CORNER.y,
        opacity: 1,
        scale: 1,
        duration: T_ENTERING / 1000,
        delay: T_DARK / 1000,
        ease: 'back.out(1.4)',
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  // Coordinate conversion: client → SVG viewBox
  const clientToViewBox = useCallback((clientX: number, clientY: number) => {
    const svg = overlayRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const t = pt.matrixTransform(ctm.inverse());
    return { x: t.x, y: t.y };
  }, []);

  /** Light a single candle. */
  const lightCandle = useCallback((idx: number) => {
    extinguishingRef.current.delete(idx);
    setExtinguished((prev) => {
      if (!prev[idx]) return prev;
      const next = [...prev];
      next[idx] = false;
      return next;
    });
    setBurstActive((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }, []);

  /** Extinguish a candle with rich GSAP wind shear, flutter, pop & smoke plume. */
  const extinguishCandle = useCallback((idx: number, windDirection: number = -1) => {
    if (extinguishingRef.current.has(idx)) return;
    extinguishingRef.current.add(idx);

    // Save smoke drift direction for this candle
    setSmokeDrift((prev) => {
      const next = [...prev];
      next[idx] = windDirection * 16;
      return next;
    });

    const flameEl = root.current?.querySelector<SVGGElement>(
      `[data-flame-wrap="${idx}"] [data-flame]`,
    );
    const glowEl = root.current?.querySelector<SVGCircleElement>(
      `[data-flame-wrap="${idx}"] [data-glow]`,
    );

    if (flameEl) {
      gsap.killTweensOf(flameEl);
      if (glowEl) gsap.killTweensOf(glowEl);

      const tiltAngle = windDirection * 42;
      const skewAngle = windDirection * 28;

      const tl = gsap.timeline({
        onComplete: () => {
          setExtinguished((prev) => {
            if (prev[idx]) return prev;
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        },
      });

      // 1. Wind Shear: Flame violently tilts & flattens in wind direction
      tl.to(flameEl, {
        rotate: tiltAngle,
        skewX: skewAngle,
        scaleX: 1.5,
        scaleY: 0.6,
        duration: 0.12,
        ease: 'power2.out',
        transformOrigin: '0px 0px',
      })
      // 2. Flutter: Violent erratic flickering against the wind
      .to(flameEl, {
        rotate: tiltAngle + windDirection * 8,
        scaleX: 1.6,
        scaleY: 0.45,
        duration: 0.06,
        ease: 'sine.inOut',
        transformOrigin: '0px 0px',
      })
      .to(flameEl, {
        rotate: tiltAngle - windDirection * 6,
        scaleX: 1.3,
        scaleY: 0.7,
        duration: 0.06,
        ease: 'sine.inOut',
        transformOrigin: '0px 0px',
      })
      // 3. Extinguish Snap: Flame snaps off with a pinch pop
      .to(flameEl, {
        rotate: tiltAngle + windDirection * 12,
        scaleX: 0.1,
        scaleY: 0.05,
        opacity: 0,
        duration: 0.12,
        ease: 'power3.in',
        transformOrigin: '0px 0px',
      });

      // Glow halo flares then dissolves
      if (glowEl) {
        tl.to(
          glowEl,
          {
            scale: 1.5,
            opacity: 0.9,
            duration: 0.1,
            ease: 'power1.out',
            transformOrigin: '0px -70px',
          },
          0,
        ).to(
          glowEl,
          {
            scale: 0.2,
            opacity: 0,
            duration: 0.16,
            ease: 'power2.in',
            transformOrigin: '0px -70px',
          },
          0.14,
        );
      }
    } else {
      setExtinguished((prev) => {
        if (prev[idx]) return prev;
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    }
  }, []);

  /** Sway and flicker candle flames without extinguishing (for wind levels 1 & 2) */
  const flickerAndSwayCandles = useCallback(
    (level: number) => {
      const tiltDeg = level === 1 ? 16 : 32;
      const duration = level === 1 ? 0.38 : 0.48;
      const scaleY = level === 1 ? 0.88 : 0.65;

      for (let idx = 0; idx < CANDLE_COUNT; idx++) {
        if (extinguished[idx]) continue;
        const flameEl = root.current?.querySelector<SVGGElement>(
          `[data-flame-wrap="${idx}"] [data-flame]`,
        );
        const glowEl = root.current?.querySelector<SVGCircleElement>(
          `[data-flame-wrap="${idx}"] [data-glow]`,
        );
        if (!flameEl) continue;

        gsap.killTweensOf(flameEl);
        if (glowEl) gsap.killTweensOf(glowEl);

        const tl = gsap.timeline();
        tl.to(flameEl, {
          rotate: tiltDeg,
          skewX: tiltDeg * 0.7,
          scaleX: 1.25,
          scaleY: scaleY,
          duration: duration * 0.35,
          ease: 'power2.out',
          transformOrigin: '0px 0px',
        })
          .to(flameEl, {
            rotate: tiltDeg * 0.6,
            scaleY: scaleY * 1.1,
            duration: duration * 0.25,
            ease: 'sine.inOut',
          })
          .to(flameEl, {
            rotate: 0,
            skewX: 0,
            scaleX: 1,
            scaleY: 1,
            duration: duration * 0.45,
            ease: 'elastic.out(1.1, 0.4)',
          });

        if (glowEl) {
          gsap.to(glowEl, {
            opacity: level === 1 ? 0.55 : 0.3,
            duration: duration * 0.35,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut',
          });
        }
      }
    },
    [extinguished],
  );

  const removePuff = useCallback((id: number) => {
    setWindPuffs((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const spawnPuff = useCallback((isMega = false) => {
    puffCounterRef.current += 1;
    const newId = puffCounterRef.current;
    const antMouthX = WIND_CORNER.x + 40;
    const antMouthY = WIND_CORNER.y + 10;
    const targetCandleX = CANDLE_CONFIGS[0]?.x ?? 300;
    const targetCandleY = (CANDLE_CONFIGS[0]?.y ?? 286) - 54;

    setWindPuffs((prev) => [
      ...prev,
      {
        id: newId,
        startX: antMouthX,
        startY: antMouthY,
        targetX: targetCandleX,
        targetY: targetCandleY,
        isMega,
      },
    ]);
  }, []);

  /** Puff reaches candle ("5 gió đi cùng lúc kìa mới tắt, hoặc 1 cục gió to") */
  const handlePuffHit = useCallback(
    (isMega?: boolean) => {
      if (extinguished[0]) return;

      // Mega Wind Ball -> Blows out instantly!
      if (isMega) {
        try {
          const audio = new Audio('/sounds/wind_breeze.wav');
          audio.volume = 0.95;
          audio.play().catch(() => {});
        } catch {}
        recentHitsRef.current = [];
        extinguishCandle(0, -1);
        return;
      }

      // Normal small puff
      const now = Date.now();
      // Keep only hits in the last 1100ms
      recentHitsRef.current = recentHitsRef.current.filter((t) => now - t <= 1100);
      recentHitsRef.current.push(now);
      const count = recentHitsRef.current.length;

      if (count >= 5) {
        // 5 puffs hitting rapidly in succession -> Blows out candle!
        try {
          const audio = new Audio('/sounds/wind_breeze.wav');
          audio.volume = 0.9;
          audio.play().catch(() => {});
        } catch {}
        recentHitsRef.current = [];
        extinguishCandle(0, -1);
      } else {
        // Clicks ngắt quãng or < 5 -> candle flickers & sways with wind, DOES NOT blow out!
        flickerAndSwayCandles(count);
      }
    },
    [extinguished, extinguishCandle, flickerAndSwayCandles],
  );

  /** Pointer Down on Ant: Press & hold to charge giant wind ball ("nhấn giữ nặng ra 1 cục gió to") */
  const handleAntPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isHoldActiveRef.current = true;
      holdStartTimeRef.current = Date.now();
      setAntIsPuffing(true);
      setIsChargingMega(true);
      setChargeProgress(0.1);

      if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);

      holdTimerRef.current = window.setInterval(() => {
        if (!isHoldActiveRef.current) return;
        const elapsed = Date.now() - holdStartTimeRef.current;
        const prog = Math.min(elapsed / 700, 1);
        setChargeProgress(prog);

        if (elapsed >= 800) {
          // Auto blast if held for 800ms
          isHoldActiveRef.current = false;
          setIsChargingMega(false);
          setChargeProgress(0);
          setAntIsPuffing(false);
          if (holdTimerRef.current) {
            window.clearInterval(holdTimerRef.current);
            holdTimerRef.current = null;
          }
          try {
            const audio = new Audio('/sounds/wind_breeze.wav');
            audio.volume = 0.85;
            audio.play().catch(() => {});
          } catch {}
          spawnPuff(true); // 1 CỤC GIÓ TO!
        }
      }, 50);
    },
    [spawnPuff],
  );

  /** Pointer Up on Ant: If held long -> launch mega puff; if quick tap -> launch normal puff */
  const handleAntPointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isHoldActiveRef.current) return;
      isHoldActiveRef.current = false;
      setIsChargingMega(false);
      setChargeProgress(0);
      setTimeout(() => setAntIsPuffing(false), 200);

      if (holdTimerRef.current) {
        window.clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }

      const elapsed = Date.now() - holdStartTimeRef.current;
      if (elapsed >= 550) {
        // Charged enough -> Giant Mega Wind Puff!
        try {
          const audio = new Audio('/sounds/wind_breeze.wav');
          audio.volume = 0.85;
          audio.play().catch(() => {});
        } catch {}
        spawnPuff(true); // 1 CỤC GIÓ TO!
      } else {
        // Quick click -> normal puff ("thổi bao nhiêu ra bấy nhiêu")
        try {
          const audio = new Audio('/sounds/ant_chirp.wav');
          audio.volume = 0.65;
          audio.play().catch(() => {});
        } catch {}
        spawnPuff(false);

        // Track rapid clicks: if >= 8 clicks within 3s → show tired ant teaser (once per blow session)
        const now = Date.now();
        rapidClickTimestampsRef.current = rapidClickTimestampsRef.current.filter((t) => now - t <= 3000);
        rapidClickTimestampsRef.current.push(now);
        if (rapidClickTimestampsRef.current.length >= 5 && !hasShownTiredRef.current) {
          hasShownTiredRef.current = true;
          setShowTiredAnt(true);
          try {
            const audio = new Audio('/sounds/ant_chirp.wav');
            audio.volume = 0.8;
            audio.play().catch(() => {});
          } catch {}
          window.setTimeout(() => setShowTiredAnt(false), 4500);
        }
      }
    },
    [spawnPuff],
  );

  // === Pointer Drag Handlers ===
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (reduced) return;
      const target = e.target as Element | null;
      if (!target) return;
      const msHandle = target.closest('[data-drag-matchstick]');
      const antHandle = target.closest('[data-ant-blow]');

      if (antHandle) {
        // Ant handles its own pointer down hypersensitively
        return;
      }

      // Matchstick is draggable AT ANY TIME
      if (msHandle && matchstickRef.current) {
        e.preventDefault();
        e.stopPropagation();
        setIsMatchLit(true);
        const ms = matchstickRef.current;
        syncRefsFromDOM();
        const { x, y } = clientToViewBox(e.clientX, e.clientY);
        matchstickOffset.current = {
          x: matchstickHeadVB.current.x - x,
          y: matchstickHeadVB.current.y - y,
        };
        dragMode.current = 'matchstick';
        litInThisDrag.current = new Set();
        gsap.killTweensOf(ms);
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      }
    },
    [clientToViewBox, reduced, syncRefsFromDOM],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (reduced) return;
      if (dragMode.current === 'matchstick' && matchstickRef.current) {
        const { x, y } = clientToViewBox(e.clientX, e.clientY);
        const ms = matchstickRef.current;
        const newX = x + matchstickOffset.current.x;
        const newY = y + matchstickOffset.current.y;
        gsap.set(ms, { x: newX, y: newY, rotate: -22 });
        matchstickHeadVB.current = { x: newX, y: newY };

        // Auto-light unlit candles on contact with the cat candle wick tip (y - 54)
        for (let i = 0; i < CANDLE_COUNT; i++) {
          if (!extinguished[i]) continue;
          if (litInThisDrag.current.has(i)) continue;
          const wickY = CANDLE_CONFIGS[i].y - 54;
          const dx = newX - CANDLE_CONFIGS[i].x;
          const dy = newY - wickY;
          const dist = Math.hypot(dx, dy);
          if (dist < MATCH_HIT_RADIUS) {
            litInThisDrag.current.add(i);
            lightCandle(i);
          }
        }
      }
    },
    [clientToViewBox, reduced, extinguished, lightCandle],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (dragMode.current === 'matchstick') {
        const ms = matchstickRef.current;
        dragMode.current = null;
        try {
          (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        } catch {
          // ignore
        }
        if (!ms) return;
        gsap.killTweensOf(ms);
        // Smoothly return matchstick to corner when released and extinguish flame on arrival
        gsap.to(ms, {
          x: MATCH_CORNER.x,
          y: MATCH_CORNER.y,
          rotate: MATCH_CORNER.rotate,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            setIsMatchLit(false);
            matchstickHeadVB.current = { x: MATCH_CORNER.x, y: MATCH_CORNER.y };
          },
        });
      } else if (dragMode.current === 'wind') {
        dragMode.current = null;
        setIsDraggingWind(false);
        try {
          (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        } catch {
          // ignore
        }
        // Cloud Vapor Dissolve & Respawn at Default Point
        const distFromHome = Math.hypot(
          windCenterVB.current.x - WIND_CORNER.x,
          windCenterVB.current.y - WIND_CORNER.y,
        );
        if (distFromHome > 15) {
          respawnWindCloud();
        }
      }
    },
    [respawnWindCloud],
  );

  // Reduced motion auto flow
  useEffect(() => {
    if (!reduced || phase !== 'ready') return;
    const timeouts: number[] = [];
    for (let i = 0; i < CANDLE_COUNT; i++) {
      timeouts.push(
        window.setTimeout(() => {
          setExtinguished((prev) => {
            const next = [...prev];
            next[i] = false;
            return next;
          });
          setBurstActive((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 500 + i * 380),
      );
    }
    return () => timeouts.forEach(window.clearTimeout);
  }, [phase, reduced]);

  useEffect(() => {
    if (!reduced || phase !== 'blowing') return;
    const timeouts: number[] = [];
    for (let i = 0; i < CANDLE_COUNT; i++) {
      timeouts.push(window.setTimeout(() => extinguishCandle(i, -1), 700 + i * 420));
    }
    return () => timeouts.forEach(window.clearTimeout);
  }, [phase, reduced, extinguishCandle]);

  // Cake entrance + breathing
  useEffect(() => {
    if (reduced || !cakeWrapRef.current) return;
    const el = cakeWrapRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.92, y: 14 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      );
      gsap.to(el, { y: -4, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    return () => ctx.revert();
  }, [reduced]);

  const isDark = phase === 'dark' || phase === 'entering';
  const isReady = phase === 'ready';
  const isLit = phase === 'lit';
  const isBlowing = phase === 'blowing';
  const isCelebrate = phase === 'celebrate' || phase === 'advance';

  return (
    <section
      ref={root}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 28px',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 100% at 50% 0%, oklch(95% 0.06 350) 0%, oklch(90% 0.10 350) 40%, oklch(86% 0.12 350) 100%)',
        textAlign: 'center',
        gap: 8,
      }}
    >
      <style>{`
        @keyframes phaseFadeIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .phase-caption { animation: phaseFadeIn 0.5s ease-out forwards; }
        @keyframes celebratePop {
          0% { opacity: 0; transform: scale(0.7) rotate(-3deg); }
          60% { opacity: 1; transform: scale(1.08) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .celebrate-pop { animation: celebratePop 0.7s ease-out forwards; }

        @keyframes goldShimmerSweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        .gold-shimmer-sweep {
          position: absolute;
          top: 0; left: 0; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: goldShimmerSweep 3s infinite ease-in-out;
          pointer-events: none;
        }

        @keyframes nitroPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px #38bdf8); }
          50% { transform: scale(1.08, 1.22); filter: drop-shadow(0 0 20px #0ea5e9) drop-shadow(0 0 30px #38bdf8); }
        }
        @keyframes nitroStreamFlicker {
          0% { stroke-dashoffset: 0; opacity: 0.85; }
          50% { stroke-dashoffset: -40; opacity: 1; }
          100% { stroke-dashoffset: -80; opacity: 0.85; }
        }

        @keyframes cryingCatEnter {
          0% { transform: translateX(-50%) scale(0) translateY(24px); opacity: 0; }
          60% { transform: translateX(-50%) scale(1.12) translateY(-4px); opacity: 1; }
          80% { transform: translateX(-50%) scale(0.96) translateY(2px); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }
        @keyframes cryingSobSob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .hallmark-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px 34px;
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(16px, 2.2vw, 19px);
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #ffffff;
          background: linear-gradient(135deg, oklch(62% 0.24 350) 0%, oklch(52% 0.26 15) 50%, oklch(66% 0.22 340) 100%);
          border: 2px solid oklch(92% 0.16 85);
          border-radius: 999px;
          box-shadow: 0 12px 32px oklch(52% 0.26 15 / 0.40), 0 0 24px oklch(90% 0.16 85 / 0.45), inset 0 2px 4px rgba(255,255,255,0.6);
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .hallmark-btn:hover {
          transform: scale(1.06) translateY(-2px);
          box-shadow: 0 18px 40px oklch(52% 0.26 15 / 0.50), 0 0 32px oklch(92% 0.18 85 / 0.60), inset 0 2px 6px rgba(255,255,255,0.8);
        }
        .hallmark-btn:active {
          transform: scale(0.96) translateY(1px);
        }
      `}</style>

      {/* Soft golden honeycomb watermark (ZERO CAT PAWS) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 40 40'><path d='M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z' fill='none' stroke='%23ca8a04' stroke-width='1.2'/></svg>\")",
          backgroundSize: '80px 80px',
          backgroundRepeat: 'repeat',
          zIndex: 1,
        }}
      />

      {/* === TOP: avatar + name === */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          justifyContent: 'center',
        }}
      >
        <QueenAnt size="sm" />
        <div style={{ textAlign: 'left' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(18px, 2.4vw, 22px)',
              lineHeight: 1.1,
              color: 'var(--color-text)',
            }}
          >
            {config.recipient.name}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(11px, 1.2vw, 13px)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-soft)',
            }}
          >
            Người sinh nhật hôm nay
          </div>
        </div>
      </div>

      {/* === Caption (rotates by phase) === */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          minHeight: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {phase === 'dark' && (
          <div className="phase-caption" key="dark" style={captionStyle}>
            Một ngày thật đặt biệt sắp đến rồi…
          </div>
        )}
        {phase === 'entering' && (
          <div className="phase-caption" key="enter" style={captionStyle}>
            Có ai đó đang tới thắp nến cho Dẹo Dẹo nè
          </div>
        )}
        {isReady && (
          <div className="phase-caption" key="ready" style={captionStyle}>
            {!isMatchLit
              ? 'Chạm và kéo que diêm để quẹt lửa nhé 🕯️'
              : 'Kéo diêm đến ngọn nến để thắp nhé 🕯️'}
          </div>
        )}
        {isLit && (
          <div
            className="phase-caption"
            key="lit"
            style={{
              ...captionStyle,
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(28px, 3.4vw, 38px)',
              color: 'var(--color-accent-deep)',
              letterSpacing: '0.02em',
            }}
          >
            Dẹo Dẹo ước một điều thật đẹp nhé ✨
          </div>
        )}
        {isBlowing && (
          <div className="phase-caption" key="blow" style={captionStyle}>
            Chạm vào nến hoặc bấm vào bé kiến để thổi tắt nhé 🌬️
          </div>
        )}
        {isCelebrate && (
          <div
            className="celebrate-pop"
            key="celebrate"
            style={{
              ...captionStyle,
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(30px, 3.6vw, 44px)',
              color: 'var(--color-accent-deep)',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            Chúc mừng sinh nhật Dẹo Dẹo! 🎉🎂
          </div>
        )}
      </div>

      {/* === CAKE + CANDLES === */}
      <div
        ref={cakeWrapRef}
        style={{
          position: 'relative',
          width: 'min(460px, 86vw)',
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          filter: 'drop-shadow(0 18px 28px oklch(22% 0.06 295 / 0.20))',
          minHeight: 0,
        }}
      >
        <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
          <CakeSVG />
        </div>

        {/* Overlay SVG — flames + smoke + matchstick + wind */}
        <svg
          ref={overlayRef}
          viewBox="-100 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            zIndex: 2,
            touchAction: 'none',
            overflow: 'visible',
          }}
          aria-hidden
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <defs>
            {/* Wind Breeze Soft Glow Filter */}
            <filter id="windGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.35" />
            </filter>

            {/* Wind Breeze Gradient */}
            <radialGradient id="windBreezeGrad" cx="0.4" cy="0.35" r="0.7">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </radialGradient>

            {/* Wind Stream Trail Gradient (Right to Left) */}
            <linearGradient id="windStreamGrad" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#7dd3fc" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Nitro Wind Jet Gradient (Left to Right) */}
            <linearGradient id="nitroJetGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="65%" stopColor="#0284c7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>

            {/* Nitro Plasma Core Gradient */}
            <radialGradient id="nitroCoreGrad" cx="0.2" cy="0.5" r="0.8">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>

            {/* Nitro Shockwave Ring Gradient */}
            <linearGradient id="nitroShockRingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Candle flames (placed at each ant candle's position) */}
          {CANDLE_CONFIGS.map((cfg, i) => (
            <g
              key={`flame-wrap-${i}`}
              data-flame-wrap={i}
              transform={`translate(${cfg.x}, ${cfg.y})`}
              onClick={() => {
                if (isBlowing && !extinguished[i]) {
                  extinguishCandle(i, -1);
                }
              }}
              style={{
                transformBox: 'fill-box',
                pointerEvents: isBlowing && !extinguished[i] ? 'auto' : 'none',
                cursor: isBlowing && !extinguished[i] ? 'pointer' : 'default',
              }}
            >
              {/* Invisible touch target for easy candle blowing */}
              {isBlowing && !extinguished[i] && (
                <circle cx="0" cy="-52" r="36" fill="transparent" />
              )}
              <CandleFlame
                state={extinguished[i] ? 'extinguished' : 'lit'}
                phaseOffset={i}
              />
              <IgniteBurst autoPlay={burstActive[i]} />
            </g>
          ))}

          {/* Billowing Smoke wisps */}
          {extinguished.map((out, i) => {
            if (!out) return null;
            return (
              <g
                key={`smoke-${i}`}
                transform={`translate(${CANDLE_CONFIGS[i].x}, ${CANDLE_CONFIGS[i].y})`}
                style={{ pointerEvents: 'none' }}
              >
                <SmokeWisp xDrift={smokeDrift[i]} />
              </g>
            );
          })}

          {/* Tired Ant Popup — khi bấm liên tục >= 8 lần trong 3s */}
          {showTiredAnt && (
            <g
              transform={`translate(${WIND_CORNER.x + 22}, ${WIND_CORNER.y - 80})`}
              style={{ pointerEvents: 'none', animation: 'promptCatPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
            >
              {/* Bubble background */}
              <rect x="-88" y="-30" width="176" height="52" rx="14" ry="14"
                fill="#fef08a" stroke="#ca8a04" strokeWidth="2"
                filter="url(#windGlow)"
              />
              {/* Bubble tail pointing down toward ant */}
              <polygon points="-6,22 6,22 0,34" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" strokeLinejoin="round" />
              <polygon points="-5,22 5,22 0,31" fill="#fef08a" />
              {/* Text */}
              <text x="0" y="-10" textAnchor="middle" fontSize="12.5" fontWeight="800"
                fontFamily="var(--font-body)" fill="#854d0e"
                style={{ userSelect: 'none' }}
              >
                bấm từ từ thôi tôi hết hơi
              </text>
              <text x="0" y="8" textAnchor="middle" fontSize="12" fontWeight="700"
                fontFamily="var(--font-body)" fill="#713f12"
                style={{ userSelect: 'none' }}
              >
                rồi má ơi 🐜💨😮‍💨
              </text>
            </g>
          )}

          {/* === BÉ KIẾN THỔI GIÓ (Thay thế đám mây, nằm im tại x=55, y=260) === */}
          <g
            ref={windGroupRef}
            data-ant-blow=""
            onPointerDown={handleAntPointerDown}
            onPointerUp={handleAntPointerUp}
            onPointerLeave={handleAntPointerUp}
            onPointerCancel={handleAntPointerUp}
            transform={`translate(${WIND_CORNER.x}, ${WIND_CORNER.y})`}
            filter="url(#windGlow)"
            style={{
              cursor: 'pointer',
              pointerEvents: 'auto',
              opacity: 0,
              touchAction: 'none',
              userSelect: 'none',
            }}
            role="button"
            tabIndex={0}
            aria-label="Bấm liên tục 5 lần hoặc nhấn giữ để thổi ra cục gió to"
          >
            {/* Hypersensitive Large Touch Hit Area */}
            <rect
              x="-65"
              y="-75"
              width="180"
              height="160"
              fill="transparent"
              style={{ cursor: 'pointer', touchAction: 'none' }}
            />


            {/* Ambient Cyan Aura Halo behind Bé Kiến */}
            <ellipse cx="20" cy="8" rx="48" ry="32" fill="#e0f2fe" opacity="0.65" filter="blur(8px)" />

            {/* Bé Kiến Body (Facing RIGHT towards cake) */}
            <g transform="scale(1.15) translate(-15, -15)">
              {/* Ant Round Abdomen (Nằm im vững chãi) */}
              <ellipse cx="0" cy="22" rx="20" ry="14" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
              <ellipse cx="0" cy="24" rx="13" ry="9" fill="#fed7aa" />

              {/* Ant Thorax */}
              <ellipse cx="18" cy="16" rx="13" ry="10" fill="#f97316" stroke="#c2410c" strokeWidth="1.8" />

              {/* Ant Antennae pointing up & forward */}
              <path d="M 22 -4 Q 14 -18 20 -24" stroke="#c2410c" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <circle cx="20" cy="-24" r="3" fill="#facc15" stroke="#c2410c" strokeWidth="1" />
              <path d="M 32 -4 Q 44 -18 40 -24" stroke="#c2410c" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <circle cx="40" cy="-24" r="3" fill="#facc15" stroke="#c2410c" strokeWidth="1" />

              {/* Ant Head (Phồng má khi thổi hoặc sạc) */}
              <ellipse
                cx="28"
                cy="8"
                rx={antIsPuffing || isChargingMega ? 21 : 17}
                ry={antIsPuffing || isChargingMega ? 18 : 14}
                fill="#ea580c"
                stroke="#c2410c"
                strokeWidth="2"
              />

              {/* Rosy Cheeks */}
              <ellipse cx="22" cy="12" rx="4" ry="2.5" fill="#f43f5e" opacity="0.65" />
              <ellipse cx="36" cy="12" rx="4" ry="2.5" fill="#f43f5e" opacity="0.65" />

              {/* Squinting / Blowing Eyes */}
              <path d="M 20 4 Q 24 1 28 4" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 32 4 Q 36 1 40 4" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />

              {/* Puckered Whistle Mouth blowing wind to the right */}
              <ellipse cx="40" cy="10" rx="3.5" ry="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="40" cy="10" r="1.5" fill="#e0f2fe" />

              {/* Charging Mega Wind Sphere right at mouth ("nhấn giữ nặng ra 1 cục gió to") */}
              {isChargingMega && (
                <g transform="translate(48, 10)" style={{ pointerEvents: 'none' }}>
                  <circle
                    cx="0"
                    cy="0"
                    r={8 + chargeProgress * 18}
                    fill="url(#windBreezeGrad)"
                    stroke="#38bdf8"
                    strokeWidth="2.2"
                    opacity={0.8 + chargeProgress * 0.2}
                    filter="url(#windGlow)"
                  />
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={12 + chargeProgress * 20}
                    ry={5 + chargeProgress * 8}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    opacity="0.9"
                  />
                </g>
              )}

              {/* Ant Legs supporting body */}
              <ellipse cx="12" cy="22" rx="5" ry="4" fill="#ffffff" stroke="#ea580c" strokeWidth="1.2" />
              <ellipse cx="26" cy="22" rx="5" ry="4" fill="#ffffff" stroke="#ea580c" strokeWidth="1.2" />
            </g>
          </g>

          {/* Flying Wind Puffs ("5 gió đi cùng lúc hoặc 1 cục gió to") */}
          {windPuffs.map((puff) =>
            puff.isMega ? (
              <GiantMegaWindPuff
                key={puff.id}
                startX={puff.startX}
                startY={puff.startY}
                targetX={puff.targetX}
                targetY={puff.targetY}
                onHit={() => handlePuffHit(true)}
                onComplete={() => removePuff(puff.id)}
              />
            ) : (
              <FlyingWindPuff
                key={puff.id}
                startX={puff.startX}
                startY={puff.startY}
                targetX={puff.targetX}
                targetY={puff.targetY}
                onHit={() => handlePuffHit(false)}
                onComplete={() => removePuff(puff.id)}
              />
            ),
          )}

          {/* Matchstick — freely draggable AT ALL TIMES */}
          <g
            ref={matchstickRef}
            data-drag-matchstick=""
            style={{
              cursor: 'grab',
              pointerEvents: 'auto',
              touchAction: 'none',
            }}
          >
            {/* Matchstick head aligned precisely with parent origin (0, 0) */}
            <g transform="translate(-50, -70)">
              <Matchstick size={230} lit={isMatchLit} />
            </g>
          </g>
        </svg>

        {/* Floating hearts during blowing + celebrate */}
        {(isBlowing || isCelebrate) && (
          <FloatingCode count={10} playing duration={3.6} />
        )}

        {/* Confetti burst anchor on celebrate */}
        {isCelebrate && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 0,
              height: 0,
              zIndex: 4,
            }}
          >
            <ConfettiBurst key={Date.now()} count={70} radius={340} />
          </div>
        )}
      </div>

      {/* === BOTTOM: counter / hint / Hallmark CTA Button === */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-text-soft)',
          letterSpacing: '0.04em',
        }}
      >
        {(isDark || isReady) && isMatchLit && (
          <span>Đang thắp · {litCount}/{CANDLE_COUNT}</span>
        )}
        {isLit && (
          <span style={{ color: 'var(--color-accent-deep)', fontWeight: 600 }}>
            ✨ Ngọn nến hoàng gia đang lung linh ✨
          </span>
        )}
        {isBlowing && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              animation: 'promptCatPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <span style={{ fontSize: '14px', color: 'var(--color-accent-deep)', fontWeight: 600 }}>
              👈 Bấm liên tục 5 lần hoặc nhấn giữ bé kiến để thổi tắt nến nhé 🐜💨
            </span>
          </div>
        )}
        {isCelebrate && (
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {showCryingCat && (
              <div
                ref={cryingCatRef}
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
                  animation: 'cryingCatEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                }}
              >
                {/* Comic Speech Bubble */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
                    color: '#881337',
                    padding: '8px 18px',
                    borderRadius: 18,
                    border: '2px solid #f43f5e',
                    boxShadow: '0 8px 24px rgba(244, 63, 94, 0.35)',
                    fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                    fontWeight: 700,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: '15px', color: '#e11d48', fontWeight: 800 }}>
                    Tại sao không bấm nhanh điii... 🐜💦
                  </div>
                  <div style={{ fontSize: '13px', color: '#9f1239', fontStyle: 'italic', marginTop: 2 }}>
                    Đang háo hức chờ xem thư nèee! 🥺💌✨
                  </div>
                  {/* Bubble pointer */}
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
                      borderTop: '7px solid #f43f5e',
                    }}
                  />
                </div>

                {/* Handcrafted Vector Crying Ant SVG */}
                <svg
                  viewBox="0 0 130 95"
                  width="124"
                  height="90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginTop: 2, animation: 'cryingSobSob 1.2s ease-in-out infinite' }}
                >
                  {/* Tear splash puddles */}
                  <ellipse cx="22" cy="85" rx="14" ry="4" fill="#38bdf8" opacity="0.6" />
                  <ellipse cx="108" cy="85" rx="14" ry="4" fill="#38bdf8" opacity="0.6" />

                  {/* Ant Body */}
                  <ellipse cx="65" cy="68" rx="34" ry="22" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                  <ellipse cx="65" cy="70" rx="20" ry="14" fill="#ffffff" />

                  {/* Trembling Ant Antennae */}
                  <path d="M 52 30 Q 36 12 42 4" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <circle cx="42" cy="4" r="3.5" fill="#facc15" stroke="#ea580c" strokeWidth="1" />
                  <path d="M 78 30 Q 94 12 88 4" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <circle cx="88" cy="4" r="3.5" fill="#facc15" stroke="#ea580c" strokeWidth="1" />

                  {/* Head */}
                  <ellipse cx="65" cy="44" rx="28" ry="24" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />

                  {/* Big Watery Crying Eyes */}
                  <ellipse cx="52" cy="40" rx="6" ry="7" fill="#1c1917" />
                  <circle cx="50" cy="38" r="2.4" fill="#ffffff" />
                  <circle cx="54" cy="42" r="1.4" fill="#ffffff" />
                  <ellipse cx="52" cy="44" rx="4" ry="2" fill="#38bdf8" opacity="0.75" />

                  <ellipse cx="78" cy="40" rx="6" ry="7" fill="#1c1917" />
                  <circle cx="76" cy="38" r="2.4" fill="#ffffff" />
                  <circle cx="80" cy="42" r="1.4" fill="#ffffff" />
                  <ellipse cx="78" cy="44" rx="4" ry="2" fill="#38bdf8" opacity="0.75" />

                  {/* Gushing Waterfall Tears */}
                  <path d="M 48 44 C 36 50, 24 62, 22 84" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 48 44 C 36 50, 24 62, 22 84" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="28" cy="62" r="2.5" fill="#bae6fd" />
                  <circle cx="16" cy="74" r="2" fill="#38bdf8" />

                  <path d="M 82 44 C 94 50, 106 62, 108 84" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 82 44 C 94 50, 106 62, 108 84" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="102" cy="62" r="2.5" fill="#bae6fd" />
                  <circle cx="114" cy="74" r="2" fill="#38bdf8" />

                  {/* Trembling Open Crying Mouth */}
                  <path d="M 58 52 C 60 58, 70 58, 72 52 Z" fill="#e11d48" stroke="#1c1917" strokeWidth="1.5" />
                  <ellipse cx="65" cy="55" rx="3.5" ry="2" fill="#fda4af" />

                  {/* Front Legs Wiping Cheeks */}
                  <ellipse cx="44" cy="56" rx="7" ry="5" fill="#ffffff" stroke="#ea580c" strokeWidth="1.5" />
                  <ellipse cx="86" cy="56" rx="7" ry="5" fill="#ffffff" stroke="#ea580c" strokeWidth="1.5" />
                </svg>
              </div>
            )}

            <button
              ref={proceedBtnRef}
              onClick={handleProceedClick}
              className="hallmark-btn"
              aria-label="Mở thư sinh nhật và xem lời chúc"
            >
              <div className="gold-shimmer-sweep" />
              <span style={{ fontSize: '1.2em' }}>💌</span>
              <span>Mở Thư Chúc Dẹo Dẹo</span>
              <span style={{ fontSize: '1.1em' }}>✨</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const captionStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontSize: 'clamp(18px, 2.4vw, 22px)',
  color: 'var(--color-text)',
  textShadow: '0 0 18px oklch(98% 0.02 80 / 0.85), 0 2px 8px oklch(98% 0.02 80 / 0.5)',
  padding: '6px 18px',
  borderRadius: 999,
  background: 'oklch(99% 0.01 80 / 0.55)',
  backdropFilter: 'blur(8px)',
};
