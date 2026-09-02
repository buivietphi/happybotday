# Data Model: Birthday Greeting Web

**Purpose**: Define the content shape for the birthday greeting experience. All content is configured via a single file (`/content/site.config.ts`) by the gift-giver at build time. No runtime data, no database.
**Date**: 2026-09-01

---

## Entity Overview

```
SiteConfig (root)
├── recipient:        Recipient
├── photos:           PhotoSlide[]   (ordered)
├── messages:         BirthdayMessage[]  (ordered, ≥ 3)
├── music?:           MusicTrack     (optional)
└── theme:            ThemeTokens
```

All entities are TypeScript types declared in `lib/types.ts` and exported from `content/site.config.ts`. Validation is enforced at module-load time via Zod (lightweight) so misconfiguration fails the build, not the user's first impression.

---

## Entities

### Recipient

The person being celebrated.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | `string` | ✅ | 1–60 chars; rendered in hero and outro |
| `nickname` | `string` | ❌ | 1–30 chars; alternative short form |
| `headline` | `string` | ✅ | 1–80 chars; hero headline (e.g., "Chúc mừng sinh nhật!") |
| `outroWish` | `string` | ✅ | 1–200 chars; final wish on the outro card |

**Validation rules**:
- `name` cannot equal `"undefined"` / `null` / empty (would break the hero)
- Diacritics and Vietnamese characters must be preserved (UTF-8 throughout)

---

### PhotoSlide

A single image in the slideshow.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `src` | `string` | ✅ | Path under `/public/photos/` OR full HTTPS URL |
| `caption` | `string` | ❌ | 0–120 chars; revealed with the photo |
| `durationMs` | `number` | ❌ | 4000–8000; default 6000 (overrides FR-003 default of 4–8s if set) |
| `alt` | `string` | ❌ | Accessibility text; falls back to `caption` |

**Validation rules**:
- `src` must resolve at build time OR be a valid `https://` URL (FR-013: missing photos render as placeholder, don't crash)
- If `durationMs` is set, it must be within `[4000, 8000]` per SC-003 timing window

**State transitions**: idle → loading → visible → exiting → (next slide loading). Single linear progression; no loops inside the slideshow.

---

### BirthdayMessage

A single heartfelt message.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `text` | `string` | ✅ | 1–300 chars; rendered with reveal animation |
| `author` | `string` | ❌ | 0–40 chars; displayed under the message (e.g., "— Anh") |

**Validation rules**:
- Minimum 3 messages required (FR-006)
- Empty/whitespace-only `text` rejected at build time
- Each message is revealed in order with ≥ 6s visible time (SC derived from message length)

**State transitions**: hidden → revealing → visible → fading → (next message). One-way progression; no random order.

---

### MusicTrack

Optional background music.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `src` | `string` | ✅ | Path under `/public/music/` OR `https://` URL |
| `volume` | `number` | ❌ | 0.0–1.0; default 0.3 |
| `loop` | `boolean` | ❌ | default `true` |

**Validation rules**:
- If music file is missing at runtime, the toggle hides itself (graceful degrade, no error)
- Volume clamped to `[0, 1]`

---

### ThemeTokens

Visual identity tokens for the gift.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `primary` | `string` | ✅ | CSS color (hex / oklch); hero accent |
| `background` | `string` | ✅ | CSS color; page background |
| `textColor` | `string` | ✅ | CSS color; body text (must pass WCAG AA vs `background`) |
| `accentEmoji` | `string` | ❌ | Single emoji used in particles (default `🎂`) |

**Validation rules**:
- `textColor` vs `background` contrast ratio ≥ 4.5:1 (WCAG AA for body text)
- Colors validated at build time; contrast check warned (not failed) at build

---

## Entity Relationships

```
SiteConfig 1 ── 1 Recipient
SiteConfig 1 ── * PhotoSlide   (ordered, ≥ 1)
SiteConfig 1 ── * BirthdayMessage (ordered, ≥ 3)
SiteConfig 1 ── 0..1 MusicTrack
SiteConfig 1 ── 1 ThemeTokens
```

No cross-entity references (a photo doesn't reference a message; a message doesn't reference a recipient — recipient is rendered globally).

---

## Lifecycle / Section Progression

The site flows through 4 sections. Each is gated by user action or auto-progression:

| Section | Trigger to Enter | Trigger to Exit | Internal State |
|---|---|---|---|
| **Hero** | Page load | Click "Bắt đầu" | `particlesAnimating: true` |
| **Slideshow** | Hero → Slideshow transition | Last photo revealed OR manual skip | `currentIndex: 0..n-1`, `paused: false` |
| **Messages** | Slideshow → Messages transition | Last message revealed | `currentIndex: 0..m-1` |
| **Outro** | Messages → Outro transition | Click "Replay" → returns to Hero | `signatureVisible: true` |

State machine diagram (textual):

```
[page load] → hero ──(Start)──→ slideshow ──(last photo)──→ messages ──(last msg)──→ outro
                ↑                                                                          │
                └──────────────────────(Replay)───────────────────────────────────────────┘
```

Replay resets section-internal state via React `key` change on the section tree.

---

## Configuration File Shape

`/content/site.config.ts` exports a `SiteConfig` object. Example shape (not real content):

```ts
import type { SiteConfig } from '@/lib/types';

const config: SiteConfig = {
  recipient: {
    name: 'Lan',
    headline: 'Chúc mừng sinh nhật Lan!',
    outroWish: 'Chúc em một năm mới rực rỡ...',
  },
  photos: [
    { src: '/photos/01.jpg', caption: 'Mùa hè đầu tiên...', durationMs: 6000 },
    // ...
  ],
  messages: [
    { text: 'Cảm ơn em đã đến bên anh...', author: '— Anh' },
    // ... (≥ 3)
  ],
  music: { src: '/music/birthday.mp3', volume: 0.3, loop: true },
  theme: {
    primary: '#e91e63',
    background: '#fff8f5',
    textColor: '#3a2a2a',
    accentEmoji: '🎂',
  },
};

export default config;
```

The full TypeScript contract (with Zod schema for runtime validation) lives at [contracts/site-config.schema.md](./contracts/site-config.schema.md).
