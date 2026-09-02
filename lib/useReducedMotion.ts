'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `true` if the user has `prefers-reduced-motion: reduce` set,
 * `false` otherwise. Subscribes to changes so toggling the OS preference
 * is reflected immediately.
 *
 * Renamed `useReducedMotionSafe` for clarity at call sites — both names
 * resolve to the same hook.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export const useReducedMotionSafe = useReducedMotion;
