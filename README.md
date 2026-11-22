# BYTEON 2026 — Zypherix National Level IT Fest

Scroll-driven landing page for **Byteon**, the coding contest at Zypherix '26
(National Level IT Fest, Jamia Hamdard Kannur Campus, 27–28 January 2026).
The Byteon contest is on **27 January 2026**.

As you scroll, the circuit-board film scrubs forward and one event detail
appears per screen: the fest, the contest, rounds, prizes (₹6,000 first,
₹3,000 second), sponsors, coordinators, and registration with QR code.

## Run it

```bash
pnpm install   # or: npm install
pnpm dev       # or: npm run dev
```

Build for production with `pnpm build` / `npm run build`.

## How the scroll works

- `src/components/ScrollCanvasAnimation.tsx` — the whole experience.
  A single `<video>` (`public/byteon.mp4`) is pinned full-screen and
  scrubbed by scroll (`video.currentTime = progress × duration`, eased
  with a lerp in a `requestAnimationFrame` loop). No frame-sequence
  images: the old 238-frame canvas approach was removed for sharpness.
- The page is an 800vh track — 100vh per chapter, 8 chapters. Each
  chapter fades in over its first 18%, holds, and fades out over its
  last 18%, with opacity written straight to the DOM (no React
  re-render per scroll frame, no CSS transition fighting the scroll).
- Chapter dots jump to a chapter; the footer shows the current chapter
  and a bronze → amber progress bar. Reduced-motion visitors get a
  clean stacked page with the poster instead of the scrub.

## Design system

Defined in `src/app/globals.css` (`:root` tokens + `.chapter-panel`,
`.cta-primary`, …). Three roles only:

| Token | Role |
|---|---|
| Emerald `#00F5A0` | Structural only — the live dot in the footer |
| Amber `#FFBA00` | Action + emphasis — CTAs, key numbers, kickers, active dot, progress bar |
| Bronze `#B46617` | Premium only — champion badge fill, second-round tag (never small text; readable partner `#E8A85C`) |

Writing hierarchy: white headings, amber emphasis, warm paper `#F2EFE6`
body, sage `#A8BFAF` meta. Panels are translucent (blur + bottom-weighted
gradient + text-shadow) so the video stays visible through the cards;
the video runs at 0.78 brightness. If text ever feels thin on a dim
screen, raise the panel gradient alphas in `.chapter-panel` first —
don't dim the video.

## Content notes

Verified against the event poster: Zypherix 27–28 Jan, Byteon 27 Jan,
sponsors Upcode Software Labs and Infomac Systems, prizes ₹6,000 /
₹3,000, coordinators Khalid Adeel (+91 8590090507) and Nihma Parveen
(+91 8137831382), registration QR, zypherix2026@gmail.com, Jamia
Hamdard Kannur Campus.

**Not on the poster — confirm with the organisers before presenting as
final:** Round 1 (45 min, Syntax Hunt & Debugging), Round 2 (90 min,
Algorithmic Arena), the five languages, the 09:00–16:30 schedule, and
the trophy/certificate line items. These are flagged in the UI with a
"confirm with the organisers" note.

## Structure

```
src/app/page.tsx                  — mounts the scroll experience + modals
src/app/layout.tsx                — metadata, fonts
src/app/globals.css               — design tokens, panels, buttons
src/components/
  ScrollCanvasAnimation.tsx       — video scrub + 8 chapters + HUD
  RegistrationModal.tsx           — registration form modal
  PosterModal.tsx                 — poster lightbox
  Navbar.tsx / SponsorsSection.tsx / ScheduleSection.tsx
  PrizesSection.tsx / RulesSection.tsx / CoordinatorsSection.tsx
                                  — currently unused by page.tsx
public/
  byteon.mp4                      — the film that gets scrubbed
  poster.jpg                      — event poster (video poster + fallback)
  qr-code.png                     — registration QR (150px, shown near-native)
```

## Stack

Next.js 14 (App Router) · React 18 · Tailwind CSS 3 · TypeScript ·
lucide-react.
