import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Matchstick from '@/components/bits/Matchstick';
import CandleFlame from '@/components/bits/CandleFlame';
import SmokeWisp from '@/components/bits/SmokeWisp';

describe('Matchstick component', () => {
  it('renders lit matchstick with generous non-clipping viewBox', () => {
    const { container } = render(<Matchstick size={200} lit={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('-30 -55 100 230');
    // Halo glow exists
    const glow = container.querySelector('circle[fill="url(#ms-halo)"]');
    expect(glow).toBeTruthy();
  });

  it('hides flame when unlit', () => {
    const { container } = render(<Matchstick size={200} lit={false} />);
    const glow = container.querySelector('circle[fill="url(#ms-halo)"]');
    expect(glow).toBeNull();
  });
});

describe('CandleFlame component', () => {
  it('renders flame and glow when lit', () => {
    const { container } = render(
      <svg>
        <CandleFlame state="lit" phaseOffset={0} />
      </svg>,
    );
    const flame = container.querySelector('[data-flame]');
    expect(flame).toBeTruthy();
    const glow = container.querySelector('[data-glow]');
    expect(glow).toBeTruthy();
  });

  it('hides flame and glow when extinguished', () => {
    const { container } = render(
      <svg>
        <CandleFlame state="extinguished" phaseOffset={0} />
      </svg>,
    );
    const flame = container.querySelector('[data-flame]');
    expect(flame).toBeNull();
    const glow = container.querySelector('[data-glow]');
    expect(glow).toBeNull();
  });
});

describe('SmokeWisp component', () => {
  it('renders smoke wisp anchored at wick tip', () => {
    const { container } = render(
      <svg>
        <SmokeWisp xDrift={5} />
      </svg>,
    );
    const trail = container.querySelector('[data-smoke-trail]');
    expect(trail).toBeTruthy();
  });
});
