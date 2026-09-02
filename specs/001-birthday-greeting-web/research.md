# Research: Birthday Greeting Web

**Purpose**: Resolve all open questions from the Technical Context in [plan.md](./plan.md) before Phase 1 design.
**Date**: 2026-09-01

---

## R1. Animation Library for Cinematic Transitions

**Question**: Which animation approach delivers the spec's "cinematic transitions" (ken-burns, cross-fade, parallax, blur-in, masked reveal) while respecting `prefers-reduced-motion` and the 1.2s transition budget?

**Decision**: **Framer Motion** (`framer-motion` v11+) as the primary animation library.

**Rationale**:
- First-class React API; declarative variants map cleanly to the section state machine
- Built-in `useReducedMotion()` hook returns the user's preference — one line of code wires it up
- Supports layout animations, gesture controls (for pause/scrub), and exit animations out of the box
- Variant staggering is trivial (line-by-line message reveal)
- Bundle: ~50KB gzipped — fits within the 200KB budget

**Alternatives considered**:
- **GSAP** — more powerful for timeline-based cinematic effects but heavier (~70KB+) and requires imperative wiring; overkill for this scope
- **Pure CSS @keyframes** — smallest bundle, but harder to choreograph multi-step variants and lacks `useReducedMotion` integration without JS
- **React Spring** — physics-based, but steeper learning curve and less ergonomic for variant staggering

**Ponytail note**: If at any point Framer Motion's bundle weight becomes an issue, swap to CSS transitions driven by class toggles for the simpler transitions (fade, slide) and keep Framer Motion only for the reveal masks. Don't pre-optimize.

---

## R2. Photo Loading & Optimization

**Question**: How do we keep LCP ≤ 2s and slideshow transitions smooth when displaying 5–20 high-resolution photos?

**Decision**: **`next/image`** with the following configuration:
- `priority` on the first hero/slideshow image (LCP optimization)
- `sizes` attribute per layout breakpoint (`100vw` mobile, `50vw` tablet, `33vw` desktop)
- Quality 80 for hero, 75 for slideshow (slight quality drop is invisible)
- AVIF + WebP via Next.js Image Optimization API
- Lazy-load all non-first images
- Per-image `onError` fallback to a static placeholder (FR-013)
- Per-image timeout (5s) via `Image` wrapper that swaps to placeholder if not loaded

**Rationale**:
- `next/image` handles responsive `srcset`, format negotiation, and lazy loading automatically
- 5–20 photos × 3 formats × 3 sizes ≈ 45–180 optimized variants, but only the visible ones are fetched

**Alternatives considered**:
- **Manual `<img>` tags** — more control, but you re-implement responsive images, lazy loading, and format negotiation. Not ponytail.
- **Cloudinary / Imgix** — external CDN, but requires an account and adds an integration dependency for a personal gift site. Not justified.

---

## R3. Audio Autoplay & Music UX

**Question**: Browsers block audio autoplay without a user gesture. How do we deliver the "soft background music" experience from the spec without violating the policy?

**Decision**: **HTML5 `<audio>` element behind a user-gesture-gated toggle**.
- Music is **never** attempted to autoplay on page load
- A floating "🎵 Bật nhạc / Tắt nhạc" toggle is always visible (FR-009)
- First click on the toggle acts as the user gesture that unlocks playback
- Default volume: 0.3 (30%) — soft, background level
- State persists in `sessionStorage` so a replay doesn't restart muted (but doesn't survive across sessions, respecting user control)
- If music file is missing/unavailable, the toggle hides itself gracefully

**Rationale**: This is the only compliant pattern. Mobile Safari is the strictest (no autoplay ever without gesture); even desktop Chrome blocks audio without prior interaction on the site.

**Alternatives considered**:
- **`<video>` background** — overkill for audio-only
- **Web Audio API** — more control but vastly more code for no user-facing benefit
- **Pre-roll silent + audio context resume** — fragile, platform-dependent

---

## R4. `prefers-reduced-motion` Implementation

**Question**: How do we satisfy FR-012 and SC-006 (animations ≤ 400ms or static when user opts out)?

**Decision**: **Framer Motion's `useReducedMotion()`** + a CSS-level fallback.
- Wrap all motion variants in `useReducedMotion()`; when true, swap to a 200ms opacity fade or remove motion entirely
- Additionally, a CSS `@media (prefers-reduced-motion: reduce)` block in `globals.css` sets `animation-duration: 0.01ms !important` and `transition-duration: 0.01ms !important` for any CSS animations
- The auto-advancement timer still works (motion preference doesn't pause the slideshow, just removes the visual motion)

**Rationale**: Defense in depth — Framer Motion handles its own animations, CSS handles anything else. Both layers are independently correct.

**Alternatives considered**:
- **JS-only check** — fragile if Framer Motion isn't the only animation source
- **User setting toggle in UI** — duplicates the OS-level setting; OS-level is the right source of truth

---

## R5. Vietnamese Text & Font Strategy

**Question**: The spec requires all Vietnamese text (including diacritics) to render correctly across sections (FR-015, SC-009). What's the cleanest way?

**Decision**: **`next/font/google` with Be Vietnam Pro** (primary) or **Noto Sans** (fallback).
- Both have full Vietnamese diacritic coverage
- `next/font` self-hosts the font (no FOUT, no Google CDN call, no GDPR concerns)
- `font-display: swap` ensures text is visible immediately with the system fallback while the webfont loads
- Document `<html lang="vi">` for screen readers and search engines

**Rationale**: Vietnamese has many diacritic marks (ă, â, ề, ế, ơ, ư, ớ, ứ, etc.) — system fonts on some platforms render them inconsistently. A self-hosted Vietnamese-supporting webfont eliminates the issue.

**Alternatives considered**:
- **System font stack only** — works on macOS/iOS/Windows but inconsistent across Linux/Android
- **Self-hosted custom font** — adds asset hosting complexity; Be Vietnam Pro is a free Google Font with full Vietnamese coverage

---

## R6. Section State Machine

**Question**: The experience has 4 sections (Hero → Slideshow → Messages → Outro) with optional Replay. What's the right state model?

**Decision**: **Linear section index with a single `useState<number>` orchestrator** in `app/page.tsx`.
- States: `'hero' | 'slideshow' | 'messages' | 'outro'`
- Transitions: `hero → slideshow` (Start click), `slideshow → messages` (auto after last photo OR manual skip), `messages → outro` (auto after last message), `outro → hero` (Replay click)
- Each section manages its own internal state (current photo, current message); the orchestrator only knows the section index
- Replay resets all section-internal state via a `key` prop change on the section tree

**Rationale**: Simple, testable, no need for a state management library. The state machine has 4 states and 4 transitions — that's the right scale for `useState`, not Redux.

**Alternatives considered**:
- **URL hash routing** (`/#hero`, `/#slideshow`) — adds deep-linkability but isn't required by the spec; defer to v2
- **XState** — powerful but absurd overkill for 4 states

---

## R7. Hosting & Deployment

**Question**: Where does this ship?

**Decision**: **Static export (`output: 'export'` in `next.config.mjs`)** deployable to any static host.
- Default recommendation: **Vercel** (zero-config Next.js host, free tier)
- Alternatives: Netlify, Cloudflare Pages, GitHub Pages
- All assets (photos, music, fonts) bundled or referenced via HTTPS URLs in config

**Rationale**: The site is 100% static — no server, no API routes, no SSR needed. Static export is the smallest, fastest, cheapest deployment. Vercel is the canonical Next.js host.

**Alternatives considered**:
- **Self-hosted Node server** — adds ops burden for no benefit (no server logic exists)
- **Vercel SSR** — works fine but unnecessary; static is cheaper

---

## Summary Table

| # | Topic | Decision |
|---|---|---|
| R1 | Animation library | Framer Motion |
| R2 | Photo optimization | `next/image` |
| R3 | Music autoplay | User-gesture-gated HTML5 audio |
| R4 | Reduced motion | Framer Motion `useReducedMotion` + CSS fallback |
| R5 | Vietnamese fonts | Be Vietnam Pro via `next/font` |
| R6 | Section state | `useState` orchestrator (4 states) |
| R7 | Hosting | Static export → Vercel (or any static host) |

All Phase 0 unknowns resolved. Ready for Phase 1.
