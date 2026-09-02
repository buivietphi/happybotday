---
description: "Task list for Birthday Greeting Web feature implementation"
---

# Tasks: Birthday Greeting Web

**Input**: Design documents from `/specs/001-birthday-greeting-web/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: E2E (Playwright) + unit (Vitest) tasks included where they prove independent testability of each user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single Next.js project at repository root (Next.js default `app/` at root, no separate frontend/backend)
- Paths use repository-relative form (e.g., `app/page.tsx`, `components/Hero/Hero.tsx`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Scaffold Next.js 14+ project with App Router and TypeScript: `npx create-next-app@latest . --typescript --app --no-tailwind --no-src-dir --no-eslint --import-alias "@/*"` in current directory
- [x] T002 Install runtime dependencies in package.json: `npm install framer-motion zod clsx`
- [x] T003 [P] Install dev dependencies in package.json: `npm install -D vitest @vitest/ui @playwright/test @axe-core/playwright @types/node`
- [x] T004 [P] Configure ESLint + Prettier: create `.eslintrc.json` and `.prettierrc` with project defaults
- [x] T005 [P] Create base directory structure: `mkdir -p app components/Hero components/Slideshow components/Messages components/Outro components/MusicToggle components/ui content lib tests/e2e tests/unit public/photos public/music`
- [x] T006 [P] Create placeholder content assets: touch `public/photos/.gitkeep` and `public/music/.gitkeep`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Define all entity TypeScript types in `lib/types.ts`: `Recipient`, `PhotoSlide`, `BirthdayMessage`, `MusicTrack`, `ThemeTokens`, `SiteConfig` (per data-model.md)
- [x] T008 Implement Zod validation schema in `lib/validate-config.ts`: `SiteConfigSchema` matching `contracts/site-config.schema.md`; export `validateSiteConfig(input: unknown): SiteConfig`
- [x] T009 Create typed site config in `content/site.config.ts`: export a `SiteConfig` object with 1 recipient, 3+ messages, 2+ photos, theme tokens; wrap in `validateSiteConfig()` so build fails on invalid input
- [x] T010 [P] Implement `useReducedMotion` hook in `lib/useReducedMotion.ts`: returns boolean matching `(prefers-reduced-motion: reduce)`; subscribes to changes via `matchMedia`
- [x] T011 [P] Implement `useReveal` hook in `lib/useReveal.ts`: `IntersectionObserver`-based trigger, returns `ref` and `isVisible` boolean; fires once per element
- [x] T012 [P] Implement `useAudio` hook in `components/MusicToggle/useAudio.ts`: wraps HTML5 `<audio>`; exposes `play`, `pause`, `isPlaying`, `error`; respects user-gesture requirement (only `play()` after explicit call)
- [x] T013 Configure Be Vietnam Pro font via `next/font/google` in `app/layout.tsx`: import and apply; set `<html lang="vi">`; include minimal metadata (title, description)
- [x] T014 Create global styles in `app/globals.css`: CSS reset, design tokens (CSS custom properties derived from `theme`), typography defaults, `@media (prefers-reduced-motion: reduce)` override block
- [x] T015 Configure `next.config.mjs`: enable `output: 'export'` (static export); add `images.remotePatterns` if remote HTTPS photo URLs are allowed; set `images.formats: ['image/avif', 'image/webp']`
- [x] T016 Create section orchestrator skeleton in `app/page.tsx`: render a single section component based on local `section` state ('hero' | 'slideshow' | 'messages' | 'outro'); provide `goTo(section)` callback; render placeholder boxes for each section
- [x] T017 [P] Add Vitest config in `vitest.config.ts`: include `tests/unit/**/*.test.ts`; configure jsdom environment for hook tests
- [x] T018 [P] Add Playwright config in `playwright.config.ts`: baseURL `http://localhost:3000`, webServer `npm run dev`, projects for chromium/firefox/webkit

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Hero Welcome (Priority: P1) 🎯 MVP

**Goal**: Deliver a personalized hero screen with recipient name, headline, ambient particles, and a "Bắt đầu" button that transitions to the next section.

**Independent Test**: Open `http://localhost:3000`; recipient name and headline are visible within 2s; ambient particles animate; clicking "Bắt đầu" transitions to the slideshow section without page reload.

### Implementation for User Story 1

- [x] T019 [P] [US1] Create `components/Hero/Hero.tsx`: renders recipient `name`, `headline`, and a "Bắt đầu" button; uses Framer Motion for entrance animation; respects `useReducedMotion()`
- [x] T020 [P] [US1] Create `components/Hero/Hero.module.css`: typography scale for headline, button styling, layout that centers content; responsive at 360px / 768px / 1280px
- [x] T021 [P] [US1] Create `components/Hero/AmbientParticles.tsx`: animated emoji or particle layer using Framer Motion; reads `accentEmoji` from theme; counts 20–40 particles; reduced-motion → static decorative layer
- [x] T022 [US1] Wire Hero into `app/page.tsx`: render `<Hero />` when `section === 'hero'`; call `goTo('slideshow')` on Start button click
- [x] T023 [US1] Unit test in `tests/unit/useReducedMotion.test.ts`: verifies hook returns `true` when `matchMedia` reports `reduce` (mock matchMedia in jsdom)

**Checkpoint**: User Story 1 fully functional — recipient name visible, ambient animation runs, Start button transitions to slideshow. Independently demoable as MVP.

---

## Phase 4: User Story 2 - Cinematic Photo Slideshow (Priority: P1)

**Goal**: Auto-advancing photo slideshow with cinematic transitions, captions, manual controls, and broken-photo fallback.

**Independent Test**: Reach the slideshow section; photos advance every 4–8s with smooth transitions (no hard cuts); manual next/prev/pause controls work within 500ms; broken photo URL falls back to placeholder without breaking the slideshow.

### Implementation for User Story 2

- [x] T024 [P] [US2] Define Framer Motion variants in `components/Slideshow/transitions.ts`: export `crossFade`, `kenBurns`, `blurIn`, `parallax` variants; all honor `useReducedMotion()` (short fade fallback)
- [x] T025 [P] [US2] Create `components/Slideshow/SlideshowControls.tsx`: prev / pause-resume / next buttons; keyboard-accessible (arrow keys for prev/next, space for pause); visible focus rings
- [x] T026 [P] [US2] Create `components/Slideshow/Slideshow.module.css`: container layout, photo aspect ratio (16:9 desktop, 4:3 mobile), caption positioning, control bar styling
- [x] T027 [US2] Create `components/Slideshow/Slideshow.tsx`: state for `currentIndex`, `paused`; auto-advance timer using `setTimeout` per photo `durationMs` (default 6000); render current photo via `next/image` with `priority` on first photo; render caption; pause on hover
- [x] T028 [US2] Add broken-photo fallback in `components/Slideshow/Slideshow.tsx`: wrap `next/image` with error handler that swaps to a placeholder `<div>`; cap individual image load at 5s, skip to next photo on timeout (FR-013, SC-008)
- [x] T029 [US2] Wire Slideshow into `app/page.tsx`: render `<Slideshow />` when `section === 'slideshow'`; auto-call `goTo('messages')` after last photo revealed
- [x] T030 [US2] E2E test in `tests/e2e/slideshow.spec.ts`: navigate from hero to slideshow; assert ≥2 photos render in sequence with transition; click pause → auto-advance stops; click next → photo changes within 500ms

**Checkpoint**: User Story 2 fully functional — auto-advance, cinematic transitions, manual controls, broken-photo fallback all working. Independently demoable.

---

## Phase 5: User Story 3 - Heartfelt Messages (Priority: P1)

**Goal**: Reveal heartfelt messages one at a time with line-stagger animation; each message readable for ≥6s; outro card at the end.

**Independent Test**: Reach the messages section; messages appear in order with reveal animation; each stays visible long enough to read; final outro card displays the recipient's outroWish and signature.

### Implementation for User Story 3

- [x] T031 [P] [US3] Create `components/Messages/MessageReveal.tsx`: takes a `BirthdayMessage`; splits `text` into lines; Framer Motion stagger animation for line-by-line fade-in; respects `useReducedMotion()`
- [x] T032 [P] [US3] Create `components/Messages/Messages.module.css`: large readable typography (≥ 18px), high contrast (uses theme `textColor`), centered single-column layout, generous line-height (≥ 1.6)
- [x] T033 [US3] Create `components/Messages/Messages.tsx`: state for `currentIndex`; auto-advance timer per message (≥ 6s for messages ≤ 60 words; scale up for longer messages); render `<MessageReveal />` for current message; fade-out before next
- [x] T034 [US3] Wire Messages into `app/page.tsx`: render `<Messages />` when `section === 'messages'`; auto-call `goTo('outro')` after last message
- [x] T035 [US3] E2E test in `tests/e2e/messages.spec.ts`: navigate to messages section; assert ≥3 messages render in sequence; assert each message has visible duration ≥ 5s (test threshold); final outroWish appears on outro section

**Checkpoint**: User Story 3 fully functional — messages reveal with line stagger, remain readable, flow into outro. Independently demoable.

---

## Phase 6: User Story 4 - Background Music with Toggle (Priority: P2)

**Goal**: Optional background music playable behind a user-gesture-gated floating toggle; state persists for the session.

**Independent Test**: Click music toggle → music starts at low volume; click again → music stops; toggle remains reachable from any section; if no music file configured, the toggle hides itself.

### Implementation for User Story 4

- [x] T036 [P] [US4] Create `components/MusicToggle/MusicToggle.tsx`: floating button (bottom-right), icon swap between "play" and "pause", accessible label; uses `useAudio` hook; hides itself when `error === 'src-missing'` or no music configured
- [x] T037 [P] [US4] Create `components/MusicToggle/MusicToggle.module.css`: fixed positioning, glass/blur background, color uses `theme.primary`, large enough tap target (≥ 44×44px)
- [x] T038 [US4] Add session persistence in `app/page.tsx`: lift music state (`isPlaying`) so the toggle is reachable from every section (render `<MusicToggle />` outside the section switch); persist via `sessionStorage` so replay doesn't auto-restart but session toggle survives navigation
- [x] T039 [US4] E2E test in `tests/e2e/music.spec.ts`: click toggle → assert `aria-label` switches to "Tắt nhạc"; click again → switches back; verify toggle visible on hero, slideshow, and outro pages

**Checkpoint**: User Story 4 fully functional — music toggle reachable globally, autoplay-policy-compliant, gracefully hidden when no music configured.

---

## Phase 7: User Story 5 - Replay and Share (Priority: P3)

**Goal**: Outro card with a clear final wish, plus Replay and Share controls.

**Independent Test**: Reach the outro; final wish and signature visible; clicking "Xem lại" returns to hero and restarts the experience; clicking share copies the URL to the clipboard or opens the native share sheet.

### Implementation for User Story 5

- [x] T040 [P] [US5] Create `components/Outro/Outro.tsx`: displays recipient `outroWish`, a signature line (configurable via `recipient.author` or default "— From the heart"), and Replay + Share buttons
- [x] T041 [P] [US5] Create `components/Outro/Outro.module.css`: centered card, large readable typography, button row, gentle Framer Motion entrance; respects `useReducedMotion()`
- [x] T042 [US5] Implement Replay in `app/page.tsx`: change the section tree's React `key` on Replay click to force a full reset (re-mounts Hero → fresh state); set `section` back to `'hero'`
- [x] T043 [US5] Implement Share in `components/Outro/Outro.tsx`: try `navigator.share()` first; fall back to `navigator.clipboard.writeText(window.location.href)`; show toast confirmation; on neither supported, show URL in a read-only input
- [x] T044 [US5] Wire Outro into `app/page.tsx`: render `<Outro />` when `section === 'outro'`; pass Replay/Share handlers
- [x] T045 [US5] E2E test in `tests/e2e/outro.spec.ts`: navigate to outro; assert outroWish rendered; click Replay → assert hero re-renders with fresh state (e.g., particles visible); click Share → assert clipboard contains URL (mock or read)

**Checkpoint**: User Story 5 fully functional — outro card, replay resets state, share works across browsers.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories; verification against quickstart scenarios.

- [x] T046 [P] Add axe-core a11y test in `tests/e2e/a11y.spec.ts`: run `@axe-core/playwright` scan on hero, slideshow, messages, outro pages; assert no violations at `wcag2a` / `wcag2aa` level
- [x] T047 [P] Responsive E2E test in `tests/e2e/responsive.spec.ts`: viewport matrix at 360px, 768px, 1280px, 2560px; assert no horizontal scroll, controls reachable, text not clipped
- [x] T048 Add reduced-motion E2E test in `tests/e2e/reduced-motion.spec.ts`: emulate `prefers-reduced-motion: reduce`; assert no transition exceeds 400ms; auto-advance still works
- [x] T049 Verify static export build in `next.config.mjs`: run `npm run build`; assert `out/` directory produced; serve locally and re-run E2E against the build (proves the deployment target works)
- [x] T050 [P] Write `README.md` at repo root: project intro, prerequisites, install / dev / build commands, content-customization guide (edit `content/site.config.ts`), deployment guide (Vercel/Netlify/Cloudflare Pages), accessibility notes
- [x] T051 [P] Update `package.json` scripts: ensure `dev`, `build`, `start`, `typecheck`, `lint`, `test`, `test:e2e`, `a11y` scripts are present and documented
- [x] T052 Run quickstart.md validation V1–V14 manually and confirm each passes; fix any failures before delivery
- [x] T053 [P] Run Lighthouse against production build: assert Accessibility score ≥ 90; assert LCP ≤ 2s on desktop; capture report

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — **BLOCKS all user stories**
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion
  - User Stories 1, 2, 3 are P1 and tightly coupled (orchestrator flows through them) → execute sequentially
  - User Story 4 (Music) and 5 (Replay/Share) are independent features — can run in parallel with later P1 work or after
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational only
- **User Story 2 (P1)**: Depends on Foundational; integrates with US1 via `app/page.tsx` orchestrator (Start button → slideshow)
- **User Story 3 (P1)**: Depends on Foundational; integrates with US2 via orchestrator (slideshow end → messages)
- **User Story 4 (P2)**: Depends on Foundational; renders globally, does not depend on US1–US3
- **User Story 5 (P3)**: Depends on Foundational + US3 (outro follows messages); depends on US1 for replay-target

### Within Each User Story

- Component CSS modules created in parallel with their components (different files)
- Hook tests (Vitest) follow the hook implementation in the same phase
- E2E tests (Playwright) follow the section implementation
- Wire-up into `app/page.tsx` is the last step in each story phase

### Parallel Opportunities

- Phase 1 setup tasks T003, T004, T005, T006 run in parallel after T001/T002
- Within Phase 2: T010, T011, T012, T017, T018 are independent files and run in parallel
- Within each story: component file + its CSS module + (US1) AmbientParticles run in parallel
- User Stories 4 and 5 can be implemented in parallel with each other once Foundational is complete
- Phase 8 polish tasks T046, T047, T050, T051 run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all US1 component files in parallel (different files):
Task: "Create components/Hero/Hero.tsx"
Task: "Create components/Hero/Hero.module.css"
Task: "Create components/Hero/AmbientParticles.tsx"

# Then sequentially (depends on the above):
Task: "Wire Hero into app/page.tsx"
Task: "Unit test for useReducedMotion in tests/unit/useReducedMotion.test.ts"
```

## Parallel Example: User Story 2

```bash
# All US2 component files + variants in parallel:
Task: "Define Framer Motion variants in components/Slideshow/transitions.ts"
Task: "Create components/Slideshow/SlideshowControls.tsx"
Task: "Create components/Slideshow/Slideshow.module.css"

# Then sequentially:
Task: "Create components/Slideshow/Slideshow.tsx"
Task: "Wire Slideshow into app/page.tsx"
Task: "Add E2E test in tests/e2e/slideshow.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T006)
2. Complete Phase 2: Foundational (T007–T018) — **CRITICAL**
3. Complete Phase 3: User Story 1 (T019–T023)
4. **STOP and VALIDATE**: Open `http://localhost:3000` → recipient name visible, ambient particles animate, Start button transitions work
5. Deploy/demo if ready — this is the MVP: a personalized welcome screen with a button

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP demo** (personalized welcome)
3. Add User Story 2 → Test independently → Demo (welcome + photo slideshow)
4. Add User Story 3 → Test independently → Demo (full core journey: welcome → slideshow → messages)
5. Add User Story 4 → Test independently → Demo (music toggle added)
6. Add User Story 5 → Test independently → Demo (full experience with replay + share)
7. Polish → A11y, responsive, reduced-motion, Lighthouse verification

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1 + Phase 2 together
2. Once Foundational is done:
   - Developer A: User Story 1 (Hero)
   - Developer B: User Story 2 (Slideshow) — needs to know orchestrator shape from US1
   - Developer C: User Story 4 (Music) — fully independent, can start in parallel
   - Developer D: User Story 5 (Outro/Share) — depends on US3 shape
3. User Story 3 (Messages) follows US2; US5 follows US3
4. Polish phase: all together

---

## Notes

- [P] tasks = different files, no dependencies — safe to parallelize
- [Story] label maps each task to its user story for traceability
- Each user story is independently completable and testable
- Tests are OPTIONAL per the spec — but included here because the spec calls out measurable success criteria that benefit from automation
- Commit after each task or logical group (e.g., after a full user story phase is green)
- Stop at any checkpoint to validate the story independently — don't push forward on broken foundations
- Avoid: vague tasks (each task has an explicit file path), same-file conflicts (CSS modules live next to components), cross-story dependencies that break independence
- Total: **53 tasks** across 8 phases
