'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MusicTrack } from '@/lib/types';
import { catBirthday, type SynthHandle } from '@/lib/synth';

export type AudioState = {
  isPlaying: boolean;
  /** 'src-missing' if the audio element produced an error (e.g. file 404). */
  error: 'src-missing' | null;
};

/**
 * Plays the configured MusicTrack. Two modes:
 *  - 'file'   — wraps an HTMLAudioElement pointed at `track.src`
 *  - 'synth'  — starts a Web Audio synthesizer (currently: 'cat-birthday')
 *
 * Browser autoplay policy means actual playback only starts after a user
 * gesture, so `toggle()` must be called from a click handler.
 */
export function useAudio(track: MusicTrack | undefined) {
  const [state, setState] = useState<AudioState>({ isPlaying: false, error: null });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const synthRef = useRef<SynthHandle | null>(null);
  // Tracks if user has explicitly pressed pause/mute
  const manuallyPausedRef = useRef<boolean>(false);
  // Mirrors the latest startSynth so the auto-gesture listener (defined
  // inside useEffect) can call into the latest closure without re-binding.
  const startSynthRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!track) {
      setState({ isPlaying: false, error: null });
      return;
    }

    // Only file mode needs eager setup here.
    if (track.kind !== 'synth') {
      const audio = new Audio(track.src);
      audio.loop = track.loop ?? true;
      audio.volume = track.volume ?? 0.5;
      audio.preload = 'auto';
      audioRef.current = audio;

      const onError = () =>
        setState((s) => ({ ...s, isPlaying: false, error: 'src-missing' }));
      const onPlay = () => setState({ isPlaying: true, error: null });
      const onPause = () => setState((s) => ({ ...s, isPlaying: false }));

      audio.addEventListener('error', onError);
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);

      // Attempt immediate auto-play (Music defaults to ON)
      const tryAutoPlay = () => {
        if (manuallyPausedRef.current) return;
        const p = audio.play();
        if (p && typeof p.then === 'function') {
          p.catch(() => {
            // Autoplay restricted by browser policy until first gesture
          });
        }
      };

      tryAutoPlay();

      // Trigger playback on first user gesture anywhere if autoplay was restricted
      const onFirstInteraction = () => {
        if (!manuallyPausedRef.current && audio.paused) {
          tryAutoPlay();
        }
      };

      window.addEventListener('pointerdown', onFirstInteraction, { passive: true });
      window.addEventListener('touchstart', onFirstInteraction, { passive: true });
      window.addEventListener('keydown', onFirstInteraction, { passive: true });
      window.addEventListener('click', onFirstInteraction, { passive: true });

      return () => {
        window.removeEventListener('pointerdown', onFirstInteraction);
        window.removeEventListener('touchstart', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
        window.removeEventListener('click', onFirstInteraction);
        audio.pause();
        audio.removeEventListener('error', onError);
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audioRef.current = null;
      };
    }

    // Synth mode: auto-start on mount or on first user gesture anywhere
    const onFirstGesture = () => {
      if (!manuallyPausedRef.current) {
        startSynthRef.current?.();
      }
    };

    window.addEventListener('pointerdown', onFirstGesture, { passive: true, once: true });
    window.addEventListener('keydown', onFirstGesture, { passive: true, once: true });
    window.addEventListener('touchstart', onFirstGesture, { passive: true, once: true });
    window.addEventListener('click', onFirstGesture, { passive: true, once: true });

    try {
      startSynthRef.current?.();
    } catch {}

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
      window.removeEventListener('click', onFirstGesture);
    };
  }, [track]);

  const ensureCtx = (): AudioContext => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    return ctxRef.current;
  };

  const startSynth = useCallback(() => {
    if (!track || track.kind !== 'synth') return;
    const ctx = ensureCtx();
    if (ctx.state === 'suspended') void ctx.resume();
    if (synthRef.current) synthRef.current.stop();
    const handle =
      track.synth === 'cat-birthday'
        ? catBirthday(ctx, { volume: track.volume ?? 0.35, loop: track.loop ?? true })
        : catBirthday(ctx, { volume: track.volume ?? 0.35 });
    synthRef.current = handle;
    setState({ isPlaying: true, error: null });
  }, [track]);

  // Keep the ref pointed at the latest closure.
  useEffect(() => {
    startSynthRef.current = startSynth;
  }, [startSynth]);

  const stopSynth = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.stop();
      synthRef.current = null;
    }
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const play = useCallback(() => {
    manuallyPausedRef.current = false;
    if (!track) return;
    if (track.kind === 'synth') {
      startSynth();
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    const p = a.play();
    if (p && typeof p.then === 'function') p.catch(() => undefined);
  }, [track, startSynth]);

  const pause = useCallback(() => {
    manuallyPausedRef.current = true;
    if (!track) return;
    if (track.kind === 'synth') {
      stopSynth();
      return;
    }
    audioRef.current?.pause();
  }, [track, stopSynth]);

  const toggle = useCallback(() => {
    if (!track) return;
    if (track.kind === 'synth') {
      if (synthRef.current) pause();
      else play();
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) play();
    else pause();
  }, [track, play, pause]);

  return { ...state, play, pause, toggle };
}