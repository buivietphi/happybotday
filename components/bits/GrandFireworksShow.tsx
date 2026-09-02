'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotionSafe } from '@/lib/useReducedMotion';

type Props = {
  triggerKey?: number;
  autoLoop?: boolean;
};

const PALETTES = [
  ['#f43f5e', '#fb7185', '#fda4af', '#fde047', '#ffffff'], // Rose Gold
  ['#a855f7', '#c084fc', '#e879f9', '#f472b6', '#ffffff'], // Lavender Pink
  ['#38bdf8', '#7dd3fc', '#bae6fd', '#facc15', '#ffffff'], // Sky Diamond
  ['#f59e0b', '#fbbf24', '#fef08a', '#f43f5e', '#ffffff'], // Golden Sunset
  ['#10b981', '#34d399', '#6ee7b7', '#fde047', '#ffffff'], // Emerald Sparkle
];

const HEART_EMOJIS = ['💖', '💗', '💓', '✨', '⭐', '🌸', '💫', '💝'];

/**
 * Ultra-Smooth & Lightweight Grand Fireworks & Cascading Hearts Show:
 *   - Hardware-accelerated transforms (60fps guaranteed).
 *   - Explosive colorful starbursts with flash halos.
 *   - Sparkling floating glowing hearts spiraling down.
 *   - Auto ambient background bursts + interactive barrage.
 */
export default function GrandFireworksShow({ triggerKey, autoLoop = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const spawnBurst = useCallback(
    (originX: number, originY: number, power: number = 1) => {
      const container = containerRef.current;
      if (!container || reduced) return;

      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const particleCount = Math.floor(18 * power);
      const heartCount = Math.floor(6 * power);

      // 1. Central Flash Halo
      const flash = document.createElement('div');
      flash.style.position = 'absolute';
      flash.style.left = `${originX}px`;
      flash.style.top = `${originY}px`;
      flash.style.width = '16px';
      flash.style.height = '16px';
      flash.style.borderRadius = '50%';
      flash.style.background = palette[0];
      flash.style.boxShadow = `0 0 30px 10px ${palette[0]}`;
      flash.style.transform = 'translate(-50%, -50%)';
      flash.style.pointerEvents = 'none';
      flash.style.willChange = 'transform, opacity';
      container.appendChild(flash);

      gsap.fromTo(
        flash,
        { scale: 0.2, opacity: 0.9 },
        {
          scale: 3 * power,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => flash.remove(),
        },
      );

      // 2. Starburst Particles (Circles & Diamonds)
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const color = palette[i % palette.length];
        const size = 4 + Math.random() * 5;
        const isDiamond = i % 2 === 0;

        particle.style.position = 'absolute';
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = isDiamond ? '2px' : '50%';
        particle.style.background = color;
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.pointerEvents = 'none';
        particle.style.willChange = 'transform, opacity';
        container.appendChild(particle);

        const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = (90 + Math.random() * 120) * power;
        const targetX = originX + Math.cos(angle) * speed;
        const targetY = originY + Math.sin(angle) * speed + 40; // gentle gravity drop

        gsap.to(particle, {
          x: targetX - originX,
          y: targetY - originY,
          scale: 0.1,
          opacity: 0,
          rotation: Math.random() * 360 - 180,
          duration: 1.0 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: () => particle.remove(),
        });
      }

      // 3. Floating Glowing Hearts Cascading Down
      for (let j = 0; j < heartCount; j++) {
        const heart = document.createElement('span');
        const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
        heart.textContent = emoji;
        heart.style.position = 'absolute';
        heart.style.left = `${originX}px`;
        heart.style.top = `${originY}px`;
        heart.style.fontSize = `${14 + Math.random() * 14}px`;
        heart.style.pointerEvents = 'none';
        heart.style.userSelect = 'none';
        heart.style.willChange = 'transform, opacity';
        container.appendChild(heart);

        const angle = Math.random() * Math.PI * 2;
        const radius = (40 + Math.random() * 90) * power;
        const initX = originX + Math.cos(angle) * radius;
        const initY = originY + Math.sin(angle) * radius;
        const fallY = initY + 120 + Math.random() * 100;

        const tl = gsap.timeline({ onComplete: () => heart.remove() });
        tl.fromTo(
          heart,
          { x: 0, y: 0, scale: 0.3, opacity: 0 },
          {
            x: initX - originX,
            y: initY - originY,
            scale: 1.1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.5)',
          },
        )
        .to(heart, {
          x: `+=${(Math.random() - 0.5) * 40}`,
          y: fallY - originY,
          rotation: (Math.random() - 0.5) * 45,
          scale: 0.8,
          opacity: 0,
          duration: 1.4 + Math.random() * 0.6,
          ease: 'sine.inOut',
        });
      }
    },
    [reduced],
  );

  // Trigger burst when triggerKey changes (User clicked "Bắn Pháo Hoa" or Won Prize)
  useEffect(() => {
    if (!triggerKey || reduced) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Optimized Crisp Barrage: 3 staged bursts instead of 5
    spawnBurst(w * 0.5, h * 0.32, 1.2);
    setTimeout(() => spawnBurst(w * 0.28, h * 0.4, 1.0), 140);
    setTimeout(() => spawnBurst(w * 0.72, h * 0.38, 1.0), 280);
  }, [triggerKey, reduced, spawnBurst]);

  // Ambient automatic firework loop in the background
  useEffect(() => {
    if (!autoLoop || reduced) return;
    let timer: NodeJS.Timeout;

    const loop = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const randX = rect.width * (0.2 + Math.random() * 0.6);
        const randY = rect.height * (0.15 + Math.random() * 0.4);
        spawnBurst(randX, randY, 0.85);
      }
      const nextDelay = 2800 + Math.random() * 2400;
      timer = setTimeout(loop, nextDelay);
    };

    timer = setTimeout(loop, 1200);
    return () => clearTimeout(timer);
  }, [autoLoop, reduced, spawnBurst]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 8,
      }}
      aria-hidden="true"
    />
  );
}
