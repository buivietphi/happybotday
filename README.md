# Birthday Web 🎂

A unique, heartfelt birthday greeting website built with Next.js — personalized welcome, cinematic photo slideshow, sincere messages, optional music, and replay.

## Features

- 🎉 Personalized hero welcome with ambient particles
- 📸 Cinematic photo slideshow (cross-fade, ken-burns, blur, parallax)
- 💌 Line-by-line message reveals
- 🎵 Optional background music (autoplay-policy compliant)
- 🔁 Replay from start
- 🔗 Share via native share sheet or clipboard
- ♿ Keyboard-accessible, `prefers-reduced-motion` aware, Vietnamese diacritic-safe

## Quick start

```bash
npm install
npm run dev
# → open http://localhost:3000
```

## Customize the gift

Edit **one file**: [`content/site.config.ts`](./content/site.config.ts)

```ts
const config: SiteConfig = {
  recipient: { name: 'Lan', headline: '...', outroWish: '...' },
  photos: [
    { src: '/photos/01.jpg', caption: 'Mùa hè đầu tiên...', durationMs: 6000 },
    // ... drop your photos into public/photos/
  ],
  messages: [
    { text: 'Cảm ơn em đã đến bên anh...', author: '— Anh' },
    // ... at least 3 messages
  ],
  music: { src: '/music/track.mp3', volume: 0.3, loop: true }, // optional
  theme: { primary: '#e91e63', background: '#fff8f5', textColor: '#3a2a2a' },
};
```

Build fails on misconfiguration (Zod schema in `lib/validate-config.ts`) so you can't ship a broken gift.

## Drop in your photos & music

```
public/
├── photos/
│   ├── 01.jpg
│   ├── 02.jpg
│   └── ...
└── music/
    └── birthday.mp3   (optional)
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production static export → `out/` |
| `npm run start` | Serve the production build locally |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run a11y` | Playwright accessibility scan |

## Deployment

The site is a static export — deploy `out/` to any static host:

- **Vercel**: zero-config; connect the repo, project root is the repo root
- **Netlify**: drag-and-drop `out/`, or `netlify deploy --prod --dir=out`
- **Cloudflare Pages**: upload `out/`, or connect via Git

## Accessibility notes

- Honors `prefers-reduced-motion: reduce` (animations collapse to a 200ms fade or static)
- Full keyboard navigation (Tab, Arrow keys for slideshow prev/next, Space for pause)
- All interactive elements have visible focus rings
- `<html lang="vi">` for correct screen-reader pronunciation
- Self-hosted Be Vietnam Pro font for consistent Vietnamese diacritic rendering

## Validation

See [`../specs/001-birthday-greeting-web/quickstart.md`](../specs/001-birthday-greeting-web/quickstart.md) for 14 manual validation scenarios (V1–V14) and the full automated test suite.

## Project structure

```
.  (project root)
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Section orchestrator
│   └── globals.css         # Design tokens + reduced-motion fallback
├── components/             # Feature sections
│   ├── Hero/               # Welcome screen + ambient particles
│   ├── Slideshow/          # Cinematic photo transitions
│   ├── Messages/           # Heartfelt message reveals
│   ├── Outro/              # Final wish + replay + share
│   ├── MusicToggle/        # Floating music control
│   └── ui/                 # Shared primitives
├── content/
│   └── site.config.ts      # ← The single file to edit
├── lib/                    # Hooks, types, validation
├── public/                 # Photos, music
└── tests/
    ├── e2e/                # Playwright
    └── unit/               # Vitest
```

## License

Personal gift — pick your license before publishing.
