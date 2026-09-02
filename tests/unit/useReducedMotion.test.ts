import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Listener = (e: MediaQueryListEvent) => void;

function mockMatchMedia(initial: boolean) {
  const listeners = new Map<string, Set<Listener>>();
  const mql: Partial<MediaQueryList> = {
    matches: initial,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (type: string, cb: Listener) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(cb);
    },
    removeEventListener: (type: string, cb: Listener) => {
      listeners.get(type)?.delete(cb);
    },
    dispatchEvent: (e: Event) => {
      listeners.get(e.type)?.forEach((cb) => cb(e as MediaQueryListEvent));
      return true;
    },
    onchange: null,
  };
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue(mql),
  });
  return { mql, listeners };
}

describe('useReducedMotion', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when prefers-reduced-motion is not set', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when the media query changes', () => {
    const { mql } = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      (mql as MediaQueryList).matches = true;
      (mql as MediaQueryList).dispatchEvent(new Event('change'));
    });
    expect(result.current).toBe(true);
  });
});
