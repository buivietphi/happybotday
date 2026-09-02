'use client';

import { useEffect, useState } from 'react';
import type { MusicTrack } from '@/lib/types';
import { useAudio } from './useAudio';
import styles from './MusicToggle.module.css';

const STORAGE_KEY = 'birthday-web:music-on';

type Props = {
  track: MusicTrack;
};

/**
 * Floating music toggle. Renders nothing if the audio src fails to load
 * (e.g. the gift-giver hasn't dropped a file into /public/music/ yet).
 * Toggle state persists via sessionStorage so it survives section changes
 * but not a full page reload — matching the spec's "session" semantics.
 */
export default function MusicToggle({ track }: Props) {
  const { isPlaying, error, toggle } = useAudio(track);
  const [hydrated, setHydrated] = useState(false);

  // Restore prior intent from sessionStorage on first user gesture.
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (isPlaying) sessionStorage.setItem(STORAGE_KEY, '1');
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* sessionStorage can be disabled in private mode — fail silently. */
    }
  }, [isPlaying, hydrated]);

  if (error === 'src-missing') return null;

  const label = isPlaying ? 'Tắt nhạc' : 'Bật nhạc';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={label}
      title={label}
    >
      <span aria-hidden>{isPlaying ? '🎵' : '🔇'}</span>
    </button>
  );
}
