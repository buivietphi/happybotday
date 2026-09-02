# Quickstart: Birthday Greeting Web

**Purpose**: Runnable validation guide — prove the experience works end-to-end from a fresh clone to a working local site.
**Date**: 2026-09-01

---

## Prerequisites

- Node.js ≥ 18.18
- npm ≥ 9 (or pnpm/yarn equivalent)
- A modern browser (Chrome, Firefox, or Safari — last 2 versions)

---

## Setup

```bash
# From the project root
npm install
```

If this is a fresh Next.js project (created via `npx create-next-app@latest --typescript --app --no-tailwind --src-dir=false`), the install pulls in:
- `next`, `react`, `react-dom`
- `framer-motion`
- `zod` (config validation)
- `clsx` (class composition)
- Dev: `typescript`, `@types/*`, `vitest`, `@playwright/test`, `@axe-core/playwright`

---

## Project Customization (gift-giver)

Edit exactly one file: **`/content/site.config.ts`**

```ts
const config: SiteConfig = {
  recipient: {
    name: 'Lan',
    headline: 'Chúc mừng sinh nhật Lan!',
    outroWish: 'Một năm mới thật rực rỡ em nhé.',
  },
  photos: [
    { src: '/photos/01.jpg', caption: 'Mùa hè đầu tiên của chúng mình', durationMs: 6000 },
    { src: '/photos/02.jpg', caption: 'Cà phê sáng ở Hà Nội' },
    { src: '/photos/03.jpg', caption: 'Sinh nhật năm ngoái' },
    // ... at least 1 photo
  ],
  messages: [
    { text: 'Cảm ơn em đã đến bên anh những ngày khó khăn nhất.', author: '— Anh' },
    { text: 'Chúc em một năm mới tràn đầy sức khỏe và niềm vui.' },
    { text: 'Mong rằng mọi ước mơ của em đều thành hiện thực.', author: '— Anh' },
    // ... at least 3 messages
  ],
  music: { src: '/music/track.mp3', volume: 0.3, loop: true }, // optional
  theme: {
    primary: '#e91e63',
    background: '#fff8f5',
    textColor: '#3a2a2a',
  },
};
```

Drop photo files into `/public/photos/` (or use remote HTTPS URLs in `src`). Drop the music file into `/public/music/` if used.

---

## Run Dev Server

```bash
npm run dev
# → http://localhost:3000
```

The first paint of the hero should appear within ~2 seconds on a dev machine.

---

## Validation Scenarios

These map directly to the spec's acceptance scenarios. Run through each manually in the browser:

### V1 — Hero Welcome (FR-001, FR-002, SC-001)
1. Open `http://localhost:3000`
2. **Expect**: Recipient name visible, headline rendered, ambient particles animating
3. **Expect**: Initial paint ≤ 2 seconds

### V2 — Start Button → Slideshow (User Story 1.2)
1. From the hero, click "Bắt đầu"
2. **Expect**: Smooth transition to slideshow section (no hard reload)

### V3 — Slideshow Auto-Advance (FR-003, SC-003)
1. On the slideshow section, wait without interacting
2. **Expect**: Photos advance every 4–8s with a smooth animation (no hard cuts)
3. **Expect**: Each transition completes ≤ 1.2s

### V4 — Slideshow Manual Controls (FR-004)
1. Click the next/prev control
2. **Expect**: Slide changes within 500ms
3. Click pause → **Expect**: Auto-advance stops; click again → resumes

### V5 — Captions with Photos (FR-005)
1. Watch a slide with a caption
2. **Expect**: Caption appears with the photo, in reading order

### V6 — Messages Reveal (FR-006, FR-007)
1. Reach the messages section
2. **Expect**: Messages reveal one at a time with a clear animation
3. **Expect**: Each message stays visible ≥ 6s before the next begins

### V7 — Outro + Replay (FR-008, FR-010)
1. Reach the outro
2. **Expect**: Final wish + signature visible
3. Click "Xem lại" → **Expect**: Returns to hero, experience restarts

### V8 — Music Toggle (FR-009)
1. Click the music toggle (any section)
2. **Expect**: Music starts at low volume
3. Click again → **Expect**: Music stops immediately
4. Refresh page → **Expect**: Toggle state resets (sessionStorage, not localStorage)

### V9 — Share (FR-011)
1. Click the share control on the outro
2. **Expect**: URL copied to clipboard OR native share sheet opens

### V10 — Reduced Motion (FR-012, SC-006)
- **Chrome DevTools**: Rendering panel → "Emulate CSS media feature prefers-reduced-motion" → `reduce`
- **Expect**: Animations are subtle fades (≤ 400ms) or static; auto-advance still works
- Reset emulation → **Expect**: Full animations return

### V11 — Broken Photo (FR-013, SC-008)
1. Temporarily change one photo's `src` in config to `/photos/does-not-exist.jpg`
2. Refresh, reach the slideshow
3. **Expect**: That slide shows a placeholder; slideshow continues to next photo within ≤ 8s

### V12 — Keyboard Navigation (FR-014)
1. Reload page; press `Tab` repeatedly
2. **Expect**: Start button → music toggle → slideshow controls → replay button — all reachable with visible focus

### V13 — Vietnamese Text (FR-015, SC-009)
1. View hero with `name: "Lan"`, `headline: "Chúc mừng sinh nhật Lan!"`
2. **Expect**: Diacritics render correctly (no `?` boxes, no mojibake)

### V14 — Responsive Viewport (FR-016, SC-007)
1. DevTools → Device toolbar → test at 360px, 768px, 1280px, 2560px
2. **Expect**: No horizontal scroll, no clipped text, controls reachable

---

## Automated Checks

```bash
# Type check
npm run typecheck

# Unit tests
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Lint + a11y
npm run lint
npm run a11y

# Lighthouse (manual via DevTools or CLI)
npx lighthouse http://localhost:3000 --only-categories=accessibility,performance --view
```

E2E suite covers V1, V3, V6, V7, V10, V12, V14. Manual run-through covers the rest.

---

## Build for Production

```bash
npm run build       # outputs static export to /out
npm run start       # production server (or serve /out with any static host)
```

Deploy `/out` to Vercel / Netlify / Cloudflare Pages. The site is fully static — no server runtime needed.

---

## Done When

- [ ] All 14 manual validation scenarios pass
- [ ] `npm run typecheck` clean
- [ ] `npm run test` green
- [ ] `npm run test:e2e` green
- [ ] Lighthouse Accessibility ≥ 90
- [ ] No console errors in production build
- [ ] Vietnamese diacritics render correctly across all sections
