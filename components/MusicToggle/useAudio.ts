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
      audio.volume = track.volume ?? 0.3;
      audio.preload = 'none';
      audioRef.current = audio;

      const onError = () =>
        setState((s) => ({ ...s, isPlaying: false, error: 'src-missing' }));
      const onPlay = () => setState({ isPlaying: true, error: null });
      const onPause = () => setState((s) => ({ ...s, isPlaying: false }));

      audio.addEventListener('error', onError);
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);

      return () => {
        audio.pause();
        audio.removeEventListener('error', onError);
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audioRef.current = null;
      };
    }

    // Synth mode: auto-start on the FIRST user gesture anywhere on the page.
    // iOS Safari only allows AudioContext.resume() inside a user-initiated
    // event handler, so we attach a one-shot listener.
    const onFirstGesture = () => {
      startSynthRef.current?.();
      document.removeEventListener('pointerdown', onFirstGesture);
      document.removeEventListener('keydown', onFirstGesture);
      document.removeEventListener('touchstart', onFirstGesture);
    };
    document.addEventListener('pointerdown', onFirstGesture, { passive: true });
    document.addEventListener('keydown', onFirstGesture, { passive: true });
    document.addEventListener('touchstart', onFirstGesture, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', onFirstGesture);
      document.removeEventListener('keydown', onFirstGesture);
      document.removeEventListener('touchstart', onFirstGesture);
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
      if (synthRef.current) stopSynth();
      else startSynth();
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) play();
    else pause();
  }, [track, play, pause, startSynth, stopSynth]);

  return { ...state, play, pause, toggle };
}