# EMG Editorial GSAP upgrade: report (2026-11-18)

Spec: `docs/superpowers/specs/2026-11-18-gsap-engine-upgrade-design.md` · Plan: `docs/superpowers/plans/2026-11-18-gsap-engine-upgrade.md` · Ledger: `.superpowers/sdd/2026-11-18-gsap-engine-upgrade/progress.md`
Backup of the site before any change: `../emg-editorial-backup-2026-11-18` (no `node_modules`).

## What changed

| Task | Change | Main files |
|---|---|---|
| 1 | Backup; route checker (`npm run audit`) covering overflow, console errors, hidden content, glass, purple, reduced motion, route change, fling, resize, slow fonts, heading accessibility; baseline screenshots in `screenshots/before` | `scripts/audit.mjs`, `package.json` |
| 2 | One motion system: Lenis on the GSAP ticker synced to ScrollTrigger; `onFrame` on `gsap.ticker`; `useScrollVar` rebuilt on ScrollTrigger (same API, so every scroll-linked section moved with no page edits); reduced-motion rest values; ScrollTrigger refresh on route change; ApproachLine off its own loop | `src/lib/motion.tsx`, `src/lib/scroll-math.ts`, `src/App.tsx`, `src/main.tsx`, `src/components/ApproachLine.tsx` |
| 3 | Reveal on GSAP with the same props and timing; content visible in static CSS | `src/components/Reveal.tsx`, `src/index.css` |
| 4 | All frosted glass replaced by solid paper/card sheets (navbar, menus, forms, cookie banner, map, cards, floating captions); internal design-system notes updated | 11 components/pages, `src/index.css`, `src/pages/DesignSystem.tsx` |
| 5 | UI UX Pro Max pass (notes in `2026-11-18-uipro-pass.md`); contrast fix for small labels; React Bits: **SplitText** (home hero), **Magnet** (solid buttons), **GlareHover** (deck film frames; project cards once verified projects exist) | `src/components/{SplitText,Magnet,GlareHover}.tsx`, `src/components/ui.tsx`, `src/pages/Home.tsx`, `components.json`, `tsconfig.json`, `vite.config.ts` |
| 6 | 21st.dev: the scrolling-phrase backdrop from "Worth Keeping CTA" (cta69), rebuilt on GSAP, behind the contact CTA band (done in a separate session) | `src/components/MarqueeBackdrop.tsx`, `src/components/Sections.tsx` |
| 7 | Final checks, fresh code review, three review fixes (hero visible on slow fonts, hero heading readable by screen readers, remaining low-contrast labels) | — |

## Results

- `npm test`: 5/5 (scroll ranges, rest values, contrast rule).
- `npm run build`: passes (warning: one 516 kB JS chunk).
- `npm run audit` (all 17 routes at 1440 and 390 px plus the extra checks) and `npm run audit -- --reduced-motion`: all checks passed.
- Screenshots: `screenshots/before` and `screenshots/after` (and `after-rm`), same file names, for side-by-side comparison. Intended differences: glass now solid, the hero headline reveal, slightly darker small labels.

## Left for later

- Deferred minors from the review: re-measure scroll triggers after in-page layout shifts (Industries accordion, late images); 1px ring on the deck film frame; Magnet's per-scroll measuring; the 516 kB bundle.
- Content items marked "confirm before launch" in `src/data/site.ts` (email, WhatsApp, phone sets, form endpoint) are untouched.
