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
import FloatingHearts from '@/components/bits/FloatingHearts';
import CatsStage from '@/components/bits/CatsStage';
import Avatar from '@/components/bits/Avatar';
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

// Matchstick sits in the lower-left corner
const MATCH_CORNER = { x: 35, y: 490, rotate: -28 };
const MATCH_HIT_RADIUS = 38;

// Wind breeze sits far out on the LEFT margin (x = 15, y = 238), with 230px spacious distance from the cake and 0 clipping
const WIND_CORNER = { x: 15, y: 238 };

// Timings (ms)
const T_DARK = 600;
const T_ENTERING = 1200;
const T_LIT = 3200; // "make a wish" pause before prompting to blow
const T_BLOW_TO_CELEBRATE = 800;

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
      // Start off-screen lower-left
      gsap.set(el, {
        x: MATCH_CORNER.x - 140,
        y: MATCH_CORNER.y + 140,
        rotate: -50,
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
      // Idle breathing wobble
      const tEnter = (T_DARK + T_ENTERING) / 1000;
      gsap.to(el, {
        y: MATCH_CORNER.y - 5,
        duration: 1.6,
        delay: tEnter,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(el, {
        rotate: MATCH_CORNER.rotate - 2,
        duration: 2.0,
        delay: tEnter + 0.3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
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
      // Slide into permanent left position
      gsap.to(el, {
        x: WIND_CORNER.x,
        y: WIND_CORNER.y,
        opacity: 1,
        scale: 1,
        duration: T_ENTERING / 1000,
        delay: T_DARK / 1000,
        ease: 'back.out(1.4)',
      });
      // Gentle constant floating hover
      const tEnter = (T_DARK + T_ENTERING) / 1000;
      gsap.to(el, {
        y: WIND_CORNER.y - 7,
        duration: 1.8,
        delay: tEnter,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
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

  // === Pointer Drag Handlers ===
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (reduced) return;
      const target = e.target as Element | null;
      if (!target) return;
      const msHandle = target.closest('[data-drag-matchstick]');
      const wHandle = target.closest('[data-drag-wind]');

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
      } else if (wHandle && windGroupRef.current) {
        e.preventDefault();
        e.stopPropagation();
        const wg = windGroupRef.current;
        syncRefsFromDOM();
        const { x, y } = clientToViewBox(e.clientX, e.clientY);
        windOffset.current = {
          x: windCenterVB.current.x - x,
          y: windCenterVB.current.y - y,
        };
        dragMode.current = 'wind';
        setIsDraggingWind(true);
        // Default pointing left (behind rightward movement into cake)
        setDragAngle(180);
        gsap.killTweensOf(wg);
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
      } else if (dragMode.current === 'wind' && windGroupRef.current) {
        const { x, y } = clientToViewBox(e.clientX, e.clientY);
        const wg = windGroupRef.current;
        const newX = x + windOffset.current.x;
        const newY = y + windOffset.current.y;
        gsap.set(wg, { x: newX, y: newY });

        // Calculate dynamic drag angle so nitro streams out opposite to movement
        const dx = newX - windCenterVB.current.x;
        const dy = newY - windCenterVB.current.y;
        if (Math.hypot(dx, dy) > 1.2) {
          const moveAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
          // Nitro exhaust shoots directly opposite to drag direction
          const exhaustAngle = moveAngle + 180;
          setDragAngle(exhaustAngle);
        }

        windCenterVB.current = { x: newX, y: newY };

        // Cross-test against lit candles to extinguish them
        for (let i = 0; i < CANDLE_COUNT; i++) {
          if (extinguished[i]) continue;
          const wickY = CANDLE_CONFIGS[i].y - 54;
          const dist = Math.hypot(newX - CANDLE_CONFIGS[i].x, newY - wickY);
          if (dist < 65 || (Math.abs(newY - wickY) < 55 && Math.abs(newX - CANDLE_CONFIGS[i].x) < 55)) {
            const dir = newX < CANDLE_CONFIGS[i].x ? -1 : 1;
            extinguishCandle(i, dir);
          }
        }
      }
    },
    [clientToViewBox, reduced, extinguished, lightCandle, extinguishCandle],
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

      <CatsStage count={2} yBand={[6, 16]} theme="light" />

      {/* Soft paw-print watermark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          pointerEvents: 'none',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 64 64'><g fill='%23e34d8c'><circle cx='32' cy='38' r='10'/><circle cx='20' cy='24' r='5'/><circle cx='32' cy='16' r='5'/><circle cx='44' cy='24' r='5'/></g></svg>\")",
          backgroundSize: '160px 160px',
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
        <Avatar name={config.recipient.name} size="sm" caption="" hideName imageUrl="/photos/avta.jpg" />
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
            Có ai đó đang tới thắp nến cho em nè
          </div>
        )}
        {isReady && (
          <div className="phase-caption" key="ready" style={captionStyle}>
            {!isMatchLit
              ? 'Chạm và kéo que diêm để quẹt lửa nhé 🕯️'
              : 'Kéo diêm đến từng ngọn nến mèo để thắp nhé 🕯️'}
          </div>
        )}
        {(isLit || isBlowing) && (
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
            Em ước đi nhé ✨
          </div>
        )}
        {isCelebrate && (
          <div
            className="celebrate-pop"
            key="celebrate"
            style={{
              ...captionStyle,
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(32px, 3.8vw, 46px)',
              color: 'var(--color-accent-deep)',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            Chúc mừng em yêu! 🎉
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

          {/* Candle flames (placed at each cat candle's position) */}
          {CANDLE_CONFIGS.map((cfg, i) => (
            <g
              key={`flame-wrap-${i}`}
              data-flame-wrap={i}
              transform={`translate(${cfg.x}, ${cfg.y})`}
              style={{ transformBox: 'fill-box', pointerEvents: 'none' }}
            >
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

          {/* === GORGEOUS FULL-SCALE WIND BREEZE CLOUD (Facing LEFT at x=15, y=238) === */}
          <g
            ref={windGroupRef}
            data-drag-wind=""
            transform={`translate(${WIND_CORNER.x}, ${WIND_CORNER.y})`}
            filter="url(#windGlow)"
            style={{
              cursor: 'grab',
              pointerEvents: 'auto',
              touchAction: 'none',
              opacity: 0,
            }}
          >
            {/* Ambient Cyan Aura Halo */}
            <ellipse cx="-10" cy="0" rx="60" ry="32" fill="#e0f2fe" opacity="0.65" filter="blur(8px)" />

            {/* === NITRO WIND JET STREAM (Shoots out behind the cloud based on drag direction) === */}
            {isDraggingWind && (
              <g
                className="nitro-thruster-active"
                transform={`rotate(${dragAngle})`}
                style={{
                  animation: 'nitroPulse 0.35s infinite alternate ease-in-out',
                  transformOrigin: '0px 0px',
                }}
              >
                {/* 1. Luminous Plasma Cone Core */}
                <path
                  d="M 15 -14 C 55 -20, 110 -26, 175 -15 C 135 -2, 135 2, 175 15 C 110 26, 55 20, 15 14 Z"
                  fill="url(#nitroCoreGrad)"
                  filter="blur(4px)"
                  opacity="0.92"
                />

                {/* 2. Concentric Supersonic Shockwave Rings */}
                <ellipse cx="45" cy="0" rx="5" ry="22" fill="none" stroke="url(#nitroShockRingGrad)" strokeWidth="3" opacity="0.95" />
                <ellipse cx="78" cy="0" rx="7" ry="32" fill="none" stroke="url(#nitroShockRingGrad)" strokeWidth="2.5" opacity="0.85" />
                <ellipse cx="115" cy="0" rx="9" ry="42" fill="none" stroke="url(#nitroShockRingGrad)" strokeWidth="2" opacity="0.65" />
                <ellipse cx="155" cy="0" rx="11" ry="50" fill="none" stroke="url(#nitroShockRingGrad)" strokeWidth="1.5" opacity="0.4" />

                {/* 3. Aerodynamic Nitro Speed Streaks */}
                <g stroke="url(#nitroJetGrad)" strokeLinecap="round" fill="none" style={{ animation: 'nitroStreamFlicker 0.25s infinite linear' }}>
                  <path d="M 20 -20 C 65 -30, 120 -38, 195 -24" strokeWidth="4.5" strokeDasharray="30 15" />
                  <path d="M 28 -10 C 75 -14, 140 -16, 215 -8" strokeWidth="6" strokeDasharray="40 20" />
                  <path d="M 32 0 C 85 0, 160 0, 235 0" strokeWidth="8" strokeDasharray="50 25" />
                  <path d="M 28 10 C 75 14, 140 16, 215 8" strokeWidth="6" strokeDasharray="40 20" />
                  <path d="M 20 20 C 65 30, 120 38, 195 24" strokeWidth="4.5" strokeDasharray="30 15" />
                </g>

                {/* 4. Blazing Nitro Sparkles & Energy Orbs */}
                <g fill="#ffffff">
                  <circle cx="140" cy="-14" r="3.5" filter="drop-shadow(0 0 6px #38bdf8)" />
                  <circle cx="170" cy="18" r="3" filter="drop-shadow(0 0 6px #38bdf8)" />
                  <circle cx="205" cy="-4" r="4" filter="drop-shadow(0 0 8px #0284c7)" />
                  <circle cx="225" cy="6" r="3.2" filter="drop-shadow(0 0 6px #ffffff)" />
                  <circle cx="110" cy="20" r="2.8" fill="#facc15" filter="drop-shadow(0 0 6px #facc15)" />
                </g>
              </g>
            )}

            {/* Full Luxurious Flowing Wind Gust Streams (Trailing to the left) */}
            <g stroke="url(#windStreamGrad)" strokeLinecap="round" fill="none">
              {/* Top swirl trail */}
              <path
                d="M 5 -16 C -25 -22, -45 -16, -65 -20 C -78 -23, -84 -13, -78 -3 C -72 7, -62 -3, -70 -10"
                strokeWidth="3.2"
                opacity="0.9"
              />
              {/* Mid strong breeze stream */}
              <path
                d="M 15 0 C -20 -2, -45 4, -72 -2 C -88 -6, -96 8, -84 12 C -75 15, -68 5, -76 0"
                strokeWidth="4"
                opacity="0.95"
              />
              {/* Bottom swirl trail */}
              <path
                d="M 5 16 C -18 20, -40 16, -60 22 C -72 26, -78 16, -72 8 C -66 0, -56 10, -64 16"
                strokeWidth="3"
                opacity="0.85"
              />
            </g>

            {/* Grand Fluffy Kawaii Breeze Cloud Body */}
            <g>
              {/* Main Cloud Puffs */}
              <ellipse cx="5" cy="0" rx="34" ry="24" fill="url(#windBreezeGrad)" stroke="#7dd3fc" strokeWidth="1.5" />
              <ellipse cx="-16" cy="4" rx="22" ry="18" fill="url(#windBreezeGrad)" stroke="#7dd3fc" strokeWidth="1.2" />
              <ellipse cx="20" cy="-4" rx="20" ry="16" fill="url(#windBreezeGrad)" stroke="#7dd3fc" strokeWidth="1.2" />
              <circle cx="2" cy="-14" r="16" fill="url(#windBreezeGrad)" />
              <circle cx="2" cy="-14" r="16" fill="none" stroke="#7dd3fc" strokeWidth="1.2" />

              {/* Cloud Gloss Highlights */}
              <ellipse cx="5" cy="-8" rx="14" ry="6" fill="#ffffff" opacity="0.85" />
              <circle cx="-16" cy="-2" r="5" fill="#ffffff" opacity="0.8" />

              {/* Cute Smiling Face on Cloud (Facing LEFT) */}
              <g stroke="#0369a1" strokeWidth="1.6" strokeLinecap="round" fill="none">
                {/* Happy sleeping eyes facing left */}
                <path d="M -2 -2 Q 2 -6 6 -2" />
                <path d="M 14 -2 Q 18 -6 22 -2" />
                {/* Sweet blowing whistle mouth blowing LEFTWARD */}
                <circle cx="-16" cy="5" r="3.2" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.2" />
                <circle cx="-16" cy="5" r="1.5" fill="#ffffff" />
              </g>

              {/* Cute Rosy Blushing Cheeks */}
              <ellipse cx="-8" cy="4" rx="3.5" ry="2" fill="#f43f5e" opacity="0.5" />
              <ellipse cx="20" cy="4" rx="3.5" ry="2" fill="#f43f5e" opacity="0.5" />
            </g>

            {/* Sparkling Breeze Stars (✦) and Magic Dust Particles blowing left */}
            <g fill="#38bdf8">
              {/* Big Star 1 */}
              <path
                d="M -45 -14 Q -45 -6 -37 -6 Q -45 -6 -45 2 Q -45 -6 -53 -6 Q -45 -6 -45 -14 Z"
                fill="#0284c7"
                opacity="0.9"
              />
              {/* Star 2 */}
              <path
                d="M -65 12 Q -65 17 -60 17 Q -65 17 -65 22 Q -65 17 -70 17 Q -65 17 -65 12 Z"
                fill="#38bdf8"
                opacity="0.85"
              />
              {/* Sparkle dots */}
              <circle cx="-55" cy="-4" r="2" fill="#7dd3fc" opacity="0.9" />
              <circle cx="-75" cy="-10" r="1.5" fill="#bae6fd" opacity="0.8" />
              <circle cx="-35" cy="16" r="1.8" fill="#38bdf8" opacity="0.85" />
              <circle cx="28" cy="-18" r="1.6" fill="#facc15" opacity="0.9" />
            </g>
          </g>

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
            <g transform="translate(-40.9, -59.1)">
              <Matchstick size={200} lit={isMatchLit} />
            </g>
          </g>
        </svg>

        {/* Floating hearts during blowing + celebrate */}
        {(isBlowing || isCelebrate) && (
          <FloatingHearts count={10} playing duration={3.6} />
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
        {(isDark || isReady) && (
          <span>
            {!isMatchLit
              ? 'Chạm vào que diêm để quẹt lửa'
              : `Đang thắp · ${litCount}/${CANDLE_COUNT}`}
          </span>
        )}
        {(isLit || isBlowing) && (
          <span style={{ color: 'var(--color-accent-deep)', fontWeight: 600 }}>
            ✨ {CANDLE_COUNT} ngọn nến mèo đang lung linh ✨
          </span>
        )}
        {isCelebrate && (
          <button
            ref={proceedBtnRef}
            onClick={handleProceedClick}
            className="hallmark-btn"
            aria-label="Mở thư sinh nhật và xem lời chúc"
          >
            <div className="gold-shimmer-sweep" />
            <span style={{ fontSize: '1.2em' }}>💌</span>
            <span>Mở Thư Sinh Nhật Của Em</span>
            <span style={{ fontSize: '1.1em' }}>✨</span>
          </button>
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
