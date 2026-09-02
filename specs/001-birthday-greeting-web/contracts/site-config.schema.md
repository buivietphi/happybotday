# Contract: Site Config Schema

**Purpose**: Define the runtime/compile-time contract for `/content/site.config.ts` — the single file the gift-giver edits to customize the experience.
**Date**: 2026-09-01

---

## TypeScript Types (`lib/types.ts`)

```ts
export type Recipient = {
  name: string;              // 1–60 chars
  nickname?: string;         // 1–30 chars
  headline: string;          // 1–80 chars, hero headline
  outroWish: string;         // 1–200 chars, outro card
};

export type PhotoSlide = {
  src: string;               // /photos/foo.jpg OR https://...
  caption?: string;          // 0–120 chars
  durationMs?: number;       // 4000–8000, default 6000
  alt?: string;              // a11y text, fallback to caption
};

export type BirthdayMessage = {
  text: string;              // 1–300 chars
  author?: string;           // 0–40 chars
};

export type MusicTrack = {
  src: string;               // /music/foo.mp3 OR https://...
  volume?: number;           // 0.0–1.0, default 0.3
  loop?: boolean;            // default true
};

export type ThemeTokens = {
  primary: string;           // CSS color
  background: string;        // CSS color
  textColor: string;         // CSS color
  accentEmoji?: string;      // single emoji, default '🎂'
};

export type SiteConfig = {
  recipient: Recipient;
  photos: PhotoSlide[];      // ≥ 1
  messages: BirthdayMessage[]; // ≥ 3
  music?: MusicTrack;
  theme: ThemeTokens;
};
```

---

## Runtime Validation (Zod schema in `lib/validate-config.ts`)

```ts
import { z } from 'zod';

export const SiteConfigSchema = z.object({
  recipient: z.object({
    name: z.string().min(1).max(60),
    nickname: z.string().min(1).max(30).optional(),
    headline: z.string().min(1).max(80),
    outroWish: z.string().min(1).max(200),
  }),
  photos: z.array(z.object({
    src: z.string().min(1),
    caption: z.string().max(120).optional(),
    durationMs: z.number().int().min(4000).max(8000).optional(),
    alt: z.string().optional(),
  })).min(1),
  messages: z.array(z.object({
    text: z.string().min(1).max(300),
    author: z.string().max(40).optional(),
  })).min(3),
  music: z.object({
    src: z.string().min(1),
    volume: z.number().min(0).max(1).optional(),
    loop: z.boolean().optional(),
  }).optional(),
  theme: z.object({
    primary: z.string().min(1),
    background: z.string().min(1),
    textColor: z.string().min(1),
    accentEmoji: z.string().optional(),
  }),
});
```

Validation runs at module load time. On failure, the build fails with a clear error pointing to the offending field (e.g., `messages: must contain at least 3 items`).

---

## Invariants

The gift-giver's `site.config.ts` MUST satisfy:

1. **At least 1 photo** (FR-003 minimum; ≥ 1 keeps the slideshow renderable even if the gift-giver is still building their collection)
2. **At least 3 messages** (FR-006 hard requirement)
3. **Valid recipient** (name + headline + outroWish all non-empty)
4. **Theme text color contrasts ≥ 4.5:1 vs background** (SC-005 a11y bar) — warned at build, not failed
5. **All photo `src` paths resolve** — checked at build time for `/public/...` paths, runtime for HTTPS URLs

Violations fail the build (or warn, in the case of contrast) so the gift-giver cannot ship a broken experience.

---

## Extensibility

Future fields MAY be added without breaking v1 config files (additive evolution). The Zod schema uses `.passthrough()` (or equivalent) so unknown fields are preserved rather than stripped — useful for adding `customCSS`, `analyticsId`, etc. in future versions without breaking older configs.

---

## Out of Contract

These are intentionally NOT part of v1 and require code changes (not config):

- Admin UI for editing content
- Multiple recipients / multi-language messages
- Photo upload UI
- Custom domains per recipient
- Tokenized share URLs
