# EMG Editorial: GSAP engine upgrade (design)

Date: 2026-11-18
Project: `C:\Users\USER 2026\Downloads\ExclusiveMedia\EMG-website\emg-editorial` (React 19 + Vite 7 + Tailwind 4, TypeScript, dev server on port 5399)

## Intent and why

The Exclusive Multimedia Group (EMG) site is being finished as an award-level piece the owner will submit. On 2026-11-17 the owner chose the "Editorial" concept: warm paper, near-black ink, a vermilion accent, Fraunces headings with Geist body text, and motion modelled on aiautomationsociety.ai (a diorama hero, paragraphs that brighten as you scroll, a sticky alternating card deck).

The owner has since set a website toolkit and design rules for every site (saved in `~/.claude/CLAUDE.md`): UI UX Pro Max picks the style, colors and fonts; components come from 21st.dev and React Bits instead of plain boxes; motion runs on GSAP and Lenis kept in sync; no glassmorphism; reduced motion is respected.

This upgrade brings the existing site in line with that toolkit **without changing the look the owner picked**. The owner chose this approach over adding GSAP alongside the current code and over rebuilding pages from off-the-shelf sections.

## Goals

1. One motion system: GSAP + ScrollTrigger drive every scroll-linked and entrance animation, and Lenis runs off the GSAP ticker so ScrollTrigger stays in sync.
2. Remove every frosted-glass surface (`backdrop-blur-*` on translucent fills).
3. Upgrade a small number of high-visibility spots with React Bits and 21st.dev components, restyled to the site's tokens.
4. Reduced motion handled in one place: with `prefers-reduced-motion: reduce`, no smooth scroll, no scrubbing, and every element rendered in its final, readable state.
5. Everything that works today keeps working on all 17 routes, at desktop and phone widths.

## Non-goals

- No copy or content changes. `src/data/site.ts` stays as is, including the "confirm before launch" items.
- No new pages and no routing changes.
- No palette or font change, unless the UI UX Pro Max pass finds a real contrast or legibility failure (then fix that one thing and note it).
- Don't touch `EMG-website/emg` (original site) or `EMG-website/emg-layers` (unchosen concept).
- No deployment.

## Anti-goals (failure even if it "works")

- The site starts to look like a template: centered headline over three cards, stock component looks, default purple/indigo styling from a component library.
- Jank: Lenis and ScrollTrigger out of step, pinned sections jumping, layout shift during reveals.
- Content that stays hidden when JavaScript is slow, a ScrollTrigger fails to fire, or reduced motion is on.
- Two animation loops running side by side.

## Constraints

- Owner's design rules (in `~/.claude/CLAUDE.md`) apply to every change.
- Theme quirk: in Tailwind, `white` is ink and `black` is paper (inverted in `src/index.css`). Use `paper`, `card`, `ink`, `accent` tokens when a literal color is meant.
- React Bits needs the shadcn CLI, which needs a `components.json` and an import alias (for example `@/`) in this Vite project. Use the `TS-TW` flavor.
- The 21st.dev MCP server is configured at user scope, but its tools only load in a Claude Code session started after it was added. Use a new session for the 21st.dev part, or fall back to React Bits for that spot.
- The folder is not a git repository. Take a copy of the project (without `node_modules`) before changing anything, for example `emg-editorial-backup-2026-11-18`.
- On this machine run UI UX Pro Max scripts with `python`, not `python3`.

## Approaches considered

| | Approach | Trade-off | Outcome |
|---|---|---|---|
| A | Move the motion onto GSAP, keep hook and component APIs, then remove glass and add targeted component upgrades | Most up-front work; leaves one motion system and one reduced-motion switch | **Chosen by the owner** |
| B | Add GSAP alongside the current custom loop | Fastest and least risk to working code, but two loops, and Lenis stays out of sync with ScrollTrigger, which breaks the owner's toolkit rule | Rejected |
| C | Rebuild pages from React Bits / 21st.dev sections | Biggest visual change, slowest, and gradually replaces the Editorial look the owner chose | Rejected |

## How it works today (what this touches)

- `src/lib/motion.tsx` (header still says "Layers motion engine"): a Lenis instance on its own `requestAnimationFrame` loop; a second shared rAF loop (`onFrame`) that every scroll-linked element subscribes to; `useScrollVar(mode, cb)` writes a 0–1 `--p` CSS variable per element in modes `through`, `pin` and `enter`; `useInView` (one-shot IntersectionObserver); `usePointerVars` (eased pointer `--px/--py`); `useSpotlight` (cursor position on `.spot` cards).
- `src/components/Reveal.tsx`: splits heading text into masked words (CSS transitions with per-word delays, `.rv-word`, `.is-in`), and rises + de-blurs blocks (`.rv-block`). Reduced-motion CSS at `src/index.css` around line 234.
- Users of these hooks: `pages/Home.tsx` (heaviest: Hero, FilmStrips, Spread, Deck with `ScrubP`, DivisionIndex, ProcessDeal, Network, Work), `components/Sections.tsx`, `ScrollVideo.tsx`, `ApproachLine.tsx`, `Navbar.tsx`, `Footer.tsx`, `App.tsx`, and most pages under `src/pages/`.
- `App.tsx` resets scroll on route change with `getLenis()?.scrollTo(0, { immediate: true })`.
- Glass surfaces: `CookieBanner.tsx`, `Forms.tsx` (inputs, chips, file drop, buttons), `MobileActions.tsx`, `Navbar.tsx` (scrolled bar, mega menu, mobile sheet), `NetworkMap.tsx`, and in pages `About.tsx`, `Careers.tsx`, `Division.tsx`, `Insights.tsx`.

## Decided design

### 1. Motion core (`src/lib/motion.tsx`)

- Install `gsap` and `@gsap/react`. Register `ScrollTrigger` once at module load.
- Lenis: create it once, `import 'lenis/dist/lenis.css'` (replacing the hand-written Lenis CSS in `index.css`), `lenis.on('scroll', ScrollTrigger.update)`, drive it with `gsap.ticker.add((t) => lenis.raf(t * 1000))`, and `gsap.ticker.lagSmoothing(0)`. Keep the current duration and easing so the scroll feel doesn't change.
- `onFrame(fn)` becomes a thin wrapper over `gsap.ticker.add/remove`, so the custom rAF loop goes away and existing callers (Timecode, pointer easing) keep working.
- `useScrollVar(mode, cb)` keeps its signature and its `--p` output but is rebuilt on a ScrollTrigger per element, with start and end matching today's three modes. Callers don't change.
- `useInView` can stay as an IntersectionObserver or move to a one-shot ScrollTrigger; builder's call.
- After each route change: scroll to top immediately, then `ScrollTrigger.refresh()` once the new page has rendered.
- Reduced motion: a single `reducedMotion()` check. When true, skip Lenis, create no scrubbing triggers, and render reveals in their final state. *(Builder-check call)* `--p` is set to each mode's **rest** value, not 1: `pin` sections (the Home hero diorama) get 0 so the opening view shows; `through` parallax gets 0.5, which is where layers sit at rest; `enter` gets 1. The Deck shows every card readable in a plain stacked layout. Today reduced motion does not stop `--p` scrubbing at all, so this is new behavior.

### 2. Reveal

- Same component, same props (`as`, `delay`, `className`, `id`, `mode`, `stagger`), so no page edits are needed.
- Animate with GSAP via `useGSAP` (scoped and cleaned up per component): headings keep the masked per-word rise, blocks keep the rise + de-blur. Match today's timing (about 1.1 s, `--ease-out-expo`, 55 ms word stagger).
- Content must be visible if JavaScript fails: hide-before-reveal only once GSAP has set up, never in the static CSS.

### 3. Scroll-driven sections

- *(Builder-check call)* CSS keyframe animations (the route curtain, marquees, pulse, spin-slow, float-y, rec) and CSS hover transitions stay in CSS. They don't run a JavaScript loop, so they don't count as a second motion system. They only need a check that the reduced-motion CSS stops them.
- *(Builder-check call)* `ScrollVideo.tsx` is not imported anywhere: leave it alone, don't port it.
- Move `ScrubP` (brightening paragraphs), `Deck` (sticky alternating cards), `FilmStrips`, `Spread` and `ApproachLine` onto ScrollTrigger with `scrub`. `ProgressRule` and `App.tsx` call `onFrame` with `window.scrollY` and keep working through the ticker wrapper. Keep what each looks like today; the aim is smoother, more controllable motion, not new effects.
- Whether a section uses ScrollTrigger `pin` or keeps CSS `position: sticky` with a scrubbed timeline is the builder's call per section, whichever is steadier on phone and desktop.

### 4. Glass removal

- Replace each translucent + `backdrop-blur` surface with a solid fill from the palette (`paper`, `paper-2` or `card`) and a hairline border. The scrolled navbar, mega menu and mobile sheet become solid paper or card with the existing shadow; no blur.
- Form fields become solid `card` with an ink hairline border and an accent focus state (contrast at least 4.5:1 for text and 3:1 for borders).
- The shared `.glass` utility in `index.css` (translucent fill + `backdrop-filter: blur(10px)`) is used by the floating caption cards in Home (Spread, Work), `Services.tsx`, `Work.tsx`, `ui.tsx` and `DesignSystem.tsx`. **Owner decision (2026-11-18):** those floating cards also become solid: paper or card fill with a thin ink hairline border, keeping their position and layering over the photos. Remove the blur from `.glass` (or retire the class) so no glass is left anywhere.
- *(Builder-check call)* `DesignSystem.tsx` is an internal reference page. Update its text about Reveal timing and glass to match the new system; the "no copy changes" non-goal covers client-facing copy only.

### 5. Component upgrades (React Bits and 21st.dev)

- First run a UI UX Pro Max pass (`python ~/.claude/skills/ui-ux-pro-max/scripts/search.py "multimedia production agency West Africa editorial" --design-system`, plus `--domain ux` and `--stack react` queries) to check the existing palette, fonts and motion against its guidance, and to pick which spots to upgrade. The design-taste-frontend skill can be used as a second review lens.
- Set up shadcn for React Bits (`components.json`, `@/` alias in `tsconfig.json` and `vite.config.ts`).
- Upgrade **4 to 6 spots, no more**, picked from the places where they add the most: for example the home hero headline (React Bits SplitText, replacing the Reveal word split there only), the primary CTA buttons, the Work gallery, a client or partner strip, section dividers or a marquee. Each must be restyled to the site's tokens and fonts, use no purple, violet or indigo, and add no glass.
- *(Builder-check call)* At least one of these **must** come from 21st.dev, because the owner's rules name both libraries. That step runs in a new Claude Code session where the 21st.dev tools are loaded; the work isn't done without it.

## Verification (definition of done)

- `npm run build` passes (TypeScript + Vite).
- Every route at 1440 px and 390 px: no horizontal overflow, no console errors, no content left hidden.
- The same check with reduced motion turned on: no smooth scroll, nothing scrubs, everything readable.
- Before and after screenshots of each route at both widths, so the owner can see the look is kept.
- Scrolling the home page feels as smooth as today or smoother, with no jump when pinned sections start or end.

## Left to the builder

- Order of work and how to split it into steps.
- `useInView` implementation; pin vs sticky per section.
- Exact ScrollTrigger start and end values, as long as they reproduce today's behavior.
- Which 4–6 spots get component upgrades, guided by the UI UX Pro Max pass, and which React Bits or 21st.dev components fill them.
- How to run the route audit (in-app browser or a headless script).
