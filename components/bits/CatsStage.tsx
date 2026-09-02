'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';
import CatRunner, { type CatBehavior } from './CatRunner';

type Props = {
  /** How many cats to spawn. Default 4. */
  count?: number;
  /** Optional cap on the spawn cycle (e.g. stop after N runs). */
  maxCycles?: number;
  /** Vertical band: cats run between top and bottom of this Y range (%). */
  yBand?: [number, number];
  /** Theme hint: 'light' for cream backgrounds, 'dark' for night finale. */
  theme?: 'light' | 'dark';
};

const FUR_CHOICES: Array<'orange' | 'black' | 'white' | 'gray' | 'ginger'> = [
  'orange',
  'black',
  'white',
  'gray',
  'ginger',
];
const BEHAVIOR_CHOICES: CatBehavior[] = [
  'run',
  'walk',
  'jump',
  'sit',
  'scratch',
  'sleep',
  'stretch',
];

/**
 * CatsStage — orchestrates 4–5 CatRunner instances with randomized
 * entrance, behavior, and respawn.
 *
 * Each cat starts off-screen on a random edge, picks a random behavior,
 * and crosses the viewport while animating. When the cycle ends we
 * loop the behavior again so the cat keeps moving (no frozen frames).
 *
 * Pointer events are disabled so cats never block UI.
 */
export default function CatsStage({
  count = 4,
  maxCycles,
  yBand = [60, 88],
  theme = 'light',
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const refs = useRef<Array<React.ComponentRef<typeof CatRunner> | null>>([]);
  const wrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cycleCount = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const wrap = root.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    refs.current.forEach((handle, i) => {
      if (!handle) return;
      const wrapEl = wrapRefs.current[i];
      if (!wrapEl) return;

      const cycle = () => {
        if (maxCycles && cycleCount.current >= maxCycles) return;
        cycleCount.current += 1;

        // Pick a behavior; jumping/sitting/sleeping cats don't move across
        const behavior = BEHAVIOR_CHOICES[Math.floor(Math.random() * BEHAVIOR_CHOICES.length)];
        const isMoving = behavior === 'run' || behavior === 'walk' || behavior === 'jump';
        const facing: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right';
        const fromLeft = facing === 'right';
        const yPct = yBand[0] + Math.random() * (yBand[1] - yBand[0]);

        const offX = fromLeft ? -120 : w + 120;
        const toX = fromLeft ? w + 120 : -120;

        // Reset position instantly off-screen
        gsap.set(wrapEl, {
          x: offX,
          y: (yPct / 100) * h,
          opacity: 0,
        });

        // Fade in
        gsap.to(wrapEl, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });

        // Travel across (only for moving behaviors; for others we just
        // play the behavior in place and respawn)
        if (isMoving) {
          const dur = behavior === 'run' ? 2.6 + Math.random() * 1.4
            : behavior === 'jump' ? 3.0 + Math.random() * 1.2
            : 4.5 + Math.random() * 1.5;
          const ease = behavior === 'run' || behavior === 'jump' ? 'power1.out' : 'none';

          gsap.to(wrapEl, {
            x: toX,
            duration: dur,
            ease,
            delay: 0.1,
            onComplete: () => {
              gsap.to(wrapEl, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                  gsap.delayedCall(0.6 + Math.random() * 2.0, cycle);
                },
              });
            },
          });
        }

        // Run the behavior timeline — repeat it via delayedCall so the
        // cat keeps animating while crossing (instead of freezing after
        // one short behavior plays once).
        const runBehavior = () => {
          if (!handle) return;
          handle.play(behavior);
          // Behavior duration roughly:
          const behaviorDur =
            behavior === 'run' ? 1.0
            : behavior === 'jump' ? 0.7
            : behavior === 'walk' ? 1.4
            : behavior === 'sit' ? 4.5
            : behavior === 'sleep' ? 5.0
            : behavior === 'scratch' ? 1.5
            : 1.2;
          gsap.delayedCall(behaviorDur, () => {
            // If the cat is still on screen and the move is still running,
            // repeat the same behavior once or twice for variety.
            const stillOnScreen = wrapEl && wrapEl.getBoundingClientRect().left > -100 && wrapEl.getBoundingClientRect().left < w + 100;
            if (stillOnScreen && (behavior === 'run' || behavior === 'walk' || behavior === 'jump')) {
              runBehavior();
            } else if (behavior === 'sit' || behavior === 'sleep' || behavior === 'scratch' || behavior === 'stretch') {
              // After a stationary behavior, respawn
              gsap.delayedCall(behaviorDur * 0.3, () => {
                gsap.to(wrapEl, {
                  opacity: 0,
                  duration: 0.3,
                  ease: 'power2.in',
                  onComplete: () => {
                    gsap.delayedCall(0.5 + Math.random() * 1.5, cycle);
                  },
                });
              });
            }
          });
        };
        runBehavior();
      };

      // Stagger initial spawn
      gsap.delayedCall(0.2 + i * 0.4, cycle);
    });
  }, [reduced, maxCycles, yBand]);

  return (
    <div
      ref={root}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: theme === 'dark' ? 2 : 1,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const fur = FUR_CHOICES[i % FUR_CHOICES.length];
        const scale = 0.7 + Math.random() * 0.4;
        return (
          <div
            key={i}
            ref={(el) => { wrapRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              willChange: 'transform, opacity',
              filter: theme === 'dark'
                ? 'drop-shadow(0 4px 8px oklch(15% 0.025 295 / 0.5))'
                : 'drop-shadow(0 6px 12px oklch(22% 0.06 295 / 0.18))',
            }}
          >
            <CatRunner
              ref={(el) => { refs.current[i] = el; }}
              fur={fur}
              scale={scale}
              facing="right"
            />
          </div>
        );
      })}
    </div>
  );
}