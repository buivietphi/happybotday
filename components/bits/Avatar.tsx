'use client';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  /** Name shown below the avatar. */
  name: string;
  /** 'sm' = 96px · 'md' = 140px · 'lg' = 220px */
  size?: Size;
  /** Optional caption shown under the name. */
  caption?: string;
  /** Skip the name+caption block below the circle (caller renders their own). */
  hideName?: boolean;
  /** Photo URL — renders inside the circle when provided, replaces initials. */
  imageUrl?: string;
  className?: string;
};

const SIZE_PX: Record<Size, number> = {
  sm: 96,
  md: 140,
  lg: 220,
};

/**
 * Avatar — empty bordered circular frame with a paw-print ring.
 * The interior is intentionally empty: drop a real photo in later by
 * replacing the inner div with an <img>, or pass an image via the
 * optional `imageUrl` prop (TODO if you want it now).
 *
 * The ring uses the magenta→gold gradient with subtle paw-print marks
 * so even without a photo the avatar reads as a frame, not a placeholder.
 */
export default function Avatar({ name, size = 'md', caption, hideName, imageUrl, className }: Props) {
  const px = SIZE_PX[size];
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: px,
          height: px,
          borderRadius: '50%',
          padding: 4,
          background:
            'conic-gradient(from 180deg, var(--color-avatar-ring-1), var(--color-avatar-ring-2), var(--color-avatar-ring-1))',
          boxShadow:
            '0 16px 36px -16px oklch(22% 0.06 295 / 0.35), 0 2px 8px oklch(22% 0.06 295 / 0.10)',
        }}
      >
        {/* Inner cream fill (drop photo here) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 30% 25%, oklch(99% 0.01 80), oklch(94% 0.022 75))',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={`Avatar của ${name}`}
        >
          {/* Initials watermark — present when no photo is provided */}
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={`${name} avatar`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          ) : (
            <span
              aria-hidden
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: `${Math.round(px * 0.32)}px`,
                color: 'var(--color-text-soft)',
                opacity: 0.55,
                letterSpacing: '0.02em',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {name
                .split(/\s+/)
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </span>
          )}

          {/* Golden star marks around the inner ring (ZERO CAT PAWS) */}
          <svg
            aria-hidden
            viewBox="0 0 200 200"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0.25,
              pointerEvents: 'none',
            }}
          >
            <g fill="var(--color-accent)">
              <circle cx="100" cy="14" r="3" />
              <circle cx="186" cy="100" r="3" />
              <circle cx="100" cy="186" r="3" />
              <circle cx="14" cy="100" r="3" />
            </g>
          </svg>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        {!hideName && (
          <>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: size === 'lg' ? 'clamp(20px, 2.6vw, 28px)' : '16px',
                letterSpacing: '0.04em',
                color: 'var(--color-text)',
              }}
            >
              {name}
            </div>
            {caption ? (
              <div
                style={{
                  marginTop: 2,
                  fontSize: '12px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-fade)',
                }}
              >
                {caption}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
