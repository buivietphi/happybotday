'use client';

import { useEffect, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

type Props = {
  onLit?: () => void;
  onBlown?: () => void;
  className?: string;
};

/**
 * MeLy Birthday Rive animation component.
 * Loads the original MeLy Birthday Rive animation ("Light the candle" state machine).
 * Handles native Rive dragging for matchstick lighting and wind blowing out.
 */
export default function MeLyRiveCake({ onLit, onBlown, className }: Props) {
  const litNotified = useRef(false);
  const blownNotified = useRef(false);

  const { rive, RiveComponent } = useRive({
    src: '/mely-birthday.riv',
    stateMachines: 'State Machine 1',
    artboard: 'Light the candle',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (!rive) return;

    // Listen to state changes to notify parent of lighting / blowing milestones
    const onStateChange = (event: any) => {
      const stateNames: string[] = Array.isArray(event.data) ? event.data : [event.data];
      for (const name of stateNames) {
        if (typeof name !== 'string') continue;
        const lower = name.toLowerCase();
        
        // Match lighted candle states
        if (
          (lower.includes('flameloop') || lower.includes('flamein') || lower.includes('candleflame')) &&
          !litNotified.current
        ) {
          litNotified.current = true;
          onLit?.();
        }

        // Match blown out / extinguished states
        if (
          (lower.includes('flameout') || lower.includes('windblow') || lower.includes('exitcandle')) &&
          !blownNotified.current
        ) {
          blownNotified.current = true;
          onBlown?.();
        }
      }
    };

    try {
      // @ts-ignore
      rive.on('statechange', onStateChange);
    } catch {
      // Ignore if event listener format differs
    }

    return () => {
      try {
        // @ts-ignore
        rive.off('statechange', onStateChange);
      } catch {
        // Ignore
      }
    };
  }, [rive, onLit, onBlown]);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <RiveComponent style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
