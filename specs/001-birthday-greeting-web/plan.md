# Implementation Plan: Birthday Greeting Web

**Branch**: `001-birthday-greeting-web` | **Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-birthday-greeting-web/spec.md`

## Summary

A single-page Next.js (App Router) experience that walks the recipient through a hero welcome → cinematic photo slideshow → heartfelt messages → outro, with optional background music, share, and replay. Content is configured via a single typed config file (recipient, photos, messages, optional music, theme). Animations are handled by Framer Motion with strict `prefers-reduced-motion` respect; photos are served through `next/image` for performance; music uses native HTML5 audio gated behind a user-initiated toggle to honor browser autoplay policies.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js ≥ 18.18, Next.js 14+ (App Router), React 18.

**Primary Dependencies**:
- `next` (user-stated) — framework
- `framer-motion` — declarative React animations (transitions, reveals, parallax, ken-burns)
- `next/image` — built-in, for photo optimization (AVIF/WebP, responsive `srcset`)
- Native HTML5 `<audio>` (wrapped in a React hook) — no third-party audio lib
- `clsx` — conditional class composition (tiny, ~200 bytes)

**Storage**: File-based. All content lives in `/content/site.config.ts` (typed). Photos in `/public/photos/*` (or remote URLs in config). Optional music in `/public/music/*`. No database.

**Testing**:
- **Unit**: Vitest for hooks/utils (e.g., `useReducedMotion`, slideshow timer)
- **E2E**: Playwright for cross-browser acceptance scenarios (hero → slideshow → messages → outro), a11y, motion-reduce behavior
- **Visual**: Playwright screenshot diffing for hero/slideshow/messages states
- **A11y**: `@axe-core/playwright` integrated in E2E

**Target Platform**: Evergreen browsers (Chromium, Firefox, Safari — last 2 versions). Responsive 360px → 2560px. Desktop and mobile (touch + keyboard).

**Project Type**: Web application (single Next.js project; no separate backend).

**Performance Goals**:
- LCP ≤ 2s desktop, ≤ 3s mobile (broadband)
- Each slideshow transition ≤ 1.2s, no hard cuts
- Maintain 60fps on mid-range mobile during animations (no main-thread blocking)
- Initial JS bundle ≤ 200KB gzipped (excluding photo assets)

**Constraints**:
- Lighthouse Accessibility ≥ 90
- `prefers-reduced-motion: reduce` → animations ≤ 400ms or static
- All interactive controls keyboard-accessible with visible focus
- Vietnamese text (with diacritics) must render without mojibake
- Music must NOT autoplay without user gesture (browser policy + a11y)

**Scale/Scope**: Single user per visit, ~5–20 photos, ~3–10 messages, 1 optional music track. Static build deployable to Vercel / Netlify / static host. No multi-tenant, no backend, no accounts.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The `.specify/memory/constitution.md` is currently a template (placeholders only) — there is no ratified project constitution to enforce. **Result**: gate passes trivially (no rules to violate). When a real constitution is ratified, this section should be re-evaluated against the five principle categories.

**Post-design re-evaluation (after Phase 1)**:
- ✅ **Single project, no backend** — matches simplicity default; no over-engineering
- ✅ **Accessibility built in (FR-014, SC-005)** — respects accessibility default
- ✅ **Verification via Playwright E2E** — respects verifiability default
- ✅ **No unrequested abstractions** — no Repository pattern, no factory, no interface-with-one-implementation
- ✅ **Boring over clever** — Framer Motion + `useState` orchestrator instead of XState/Redux

**Conclusion**: Constitution Check passes post-design. No violations, no complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-birthday-greeting-web/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── site-config.schema.md
└── tasks.md             # Phase 2 output (created by /speckit-tasks — not here)
```

### Source Code (repository root)

```text
(project root)
├── app/
│   ├── layout.tsx             # Root layout, fonts (Vietnamese-supporting), metadata
│   ├── page.tsx               # Section orchestrator (hero → slideshow → messages → outro)
│   └── globals.css            # CSS reset + design tokens (colors, typography)
├── components/
│   ├── Hero/                  # Welcome screen + ambient effects
│   │   ├── Hero.tsx
│   │   ├── Hero.module.css
│   │   └── AmbientParticles.tsx
│   ├── Slideshow/             # Cinematic photo transitions
│   │   ├── Slideshow.tsx
│   │   ├── SlideshowControls.tsx
│   │   └── transitions.ts     # Framer Motion variants
│   ├── Messages/              # Reveal animation + line stagger
│   │   ├── Messages.tsx
│   │   └── MessageReveal.tsx
│   ├── Outro/                 # Final wish + replay + share
│   │   └── Outro.tsx
│   ├── MusicToggle/           # Floating music control
│   │   ├── MusicToggle.tsx
│   │   └── useAudio.ts
│   └── ui/                    # Shared primitives (Button, Icon)
├── content/
│   └── site.config.ts         # Typed config: recipient, photos, messages, music, theme
├── lib/
│   ├── useReducedMotion.ts    # Motion preference hook
│   ├── useReveal.ts           # IntersectionObserver-based reveal
│   └── types.ts               # Shared TypeScript types
├── public/
│   ├── photos/                # Bundled photos (or remote URLs in config)
│   └── music/                 # Optional music file
├── tests/
│   ├── e2e/                   # Playwright
│   │   ├── hero.spec.ts
│   │   ├── slideshow.spec.ts
│   │   ├── messages.spec.ts
│   │   └── a11y.spec.ts
│   └── unit/                  # Vitest
│       ├── useReducedMotion.test.ts
│       └── useAudio.test.ts
├── next.config.mjs            # Image domains (if remote), headers, etc.
├── tsconfig.json
├── package.json
└── README.md
```

**Structure Decision**: Single Next.js project with `app/` router. No backend, no API routes (purely static / client-rendered). Components organized by feature section to mirror the user journey. Content separated into `/content/` so the gift-giver edits one file. Tests colocated by type (e2e/unit) under `/tests/`. No monorepo, no workspaces — the experience is one cohesive surface.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |

No constitution violations — the plan follows simplicity (one project, file-based config, no abstractions beyond what's necessary for the user journey).

## Phase 0: Research (see research.md)

Resolved unknowns: animation library choice (Framer Motion), image optimization (next/image), autoplay policy strategy (user-gesture-gated), motion-reduce implementation (Framer Motion's `useReducedMotion`), Vietnamese font strategy (next/font with Noto Sans / Be Vietnam Pro), and section state machine (linear progression with optional replay).

## Phase 1: Design & Contracts (see data-model.md, contracts/, quickstart.md)

- **data-model.md** — Five entities (Recipient, PhotoSlide, BirthdayMessage, MusicTrack, SiteConfig) with fields, validation rules, and lifecycle.
- **contracts/site-config.schema.md** — TypeScript shape and runtime validation contract for `site.config.ts`.
- **quickstart.md** — Setup → run dev server → validation scenarios (hero, slideshow, messages, replay, a11y, motion-reduce).
