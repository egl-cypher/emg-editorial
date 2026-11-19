# EMG Editorial GSAP Engine Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all scroll and entrance motion in the EMG Editorial site onto GSAP + ScrollTrigger with Lenis on the GSAP ticker, remove every glass surface, and add 4 to 6 React Bits / 21st.dev component upgrades, without changing the chosen look.

**Architecture:** Every scroll-linked section already reads a `--p` CSS variable written by `useScrollVar`, so rebuilding that one hook on ScrollTrigger migrates FilmStrips, Spread, ScrubP, Deck, ProcessDeal, Network, Sections and Footer at once with no page edits. `onFrame` becomes a wrapper over `gsap.ticker`, which removes the second rAF loop. `Reveal` keeps its props and moves its timing to GSAP.

**Tech Stack:** React 19, Vite 7, Tailwind 4, TypeScript 5.9, `lenis` ^1.3.4 (already installed), `gsap` + `@gsap/react` (new), `playwright-core` (new dev dependency, driving the installed Chrome), shadcn CLI for React Bits, the 21st.dev MCP server.

**Spec:** `docs/superpowers/specs/2026-11-18-gsap-engine-upgrade-design.md`

## Global Constraints

- Project root: `C:\Users\USER 2026\Downloads\ExclusiveMedia\EMG-website\emg-editorial`. Dev server: `npm run dev` on port **5399** (the `--port` flag in `package.json` overrides `vite.config.ts`).
- Not a git repository. There are no commit steps; Task 1 takes a backup instead.
- Don't touch `EMG-website/emg` or `EMG-website/emg-layers`. Don't change `src/data/site.ts`.
- No palette or font change. Tokens live in `src/index.css` `@theme`. In Tailwind, `white` = ink (#16130f) and `black` = paper (#f3efe8). Use `paper`, `paper-2`, `card`, `ink`, `accent` when a literal color is meant.
- Owner rules (`~/.claude/CLAUDE.md`): no purple/violet/indigo, no glassmorphism, no emoji icons (Lucide), no centered-headline-over-three-cards layouts, respect `prefers-reduced-motion`.
- Keep today's motion feel: Lenis `duration: 1.15`, easing `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`; reveals about 1100 ms on `--ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)`, word stagger 55 ms, block rise 32 px with 0.6° tilt.
- Reduced-motion rest values for `--p`: `pin` → 0, `through` → 0.5, `enter` → 1.
- Run UI UX Pro Max with `python`, not `python3`.
- Node 26 is installed, so `node --test file.test.ts` runs TypeScript tests with no extra packages.

## Review Focus

1. **Route change mid-scroll:** going from a long page (Home, scrolled to the bottom) to a short one (Legal) must land at the top with every trigger measured for the new page. Test: audit step "navigate Home → bottom → /privacy-policy, expect scrollY 0 and no hidden `.rv-block`" in Task 2.
2. **JavaScript slow or broken:** content must be visible without JS. Test: audit run with JavaScript disabled finds no `.rv-block` or `.rv-word > span` with opacity 0 or offscreen transform, in Task 3.
3. **Reduced motion:** no Lenis (`html.lenis` absent), `--p` at rest values, all reveals final. Test: audit `--reduced-motion` assertions in Task 2 and Task 3.
4. **Window resize / phone rotation:** ScrollTrigger start and end must re-measure. Test: audit resizes 1440 → 390 on Home without reload and checks the Deck and hero `--p` stay in [0, 1] and no overflow, in Task 2.
5. **Fast fling scroll to the bottom:** every reveal ends visible even when the trigger is passed in one frame. Test: audit jumps `window.scrollTo(0, max)` and expects every `.rv-block` in the final state after 1.5 s, in Task 3.

---

### Task 1: Backup, audit script and baseline screenshots

**Files:**
- Create: `scripts/audit.mjs`
- Modify: `package.json` (add `"audit": "node scripts/audit.mjs"`, dev dependency `playwright-core`)
- Create (outside the project): `EMG-website/emg-editorial-backup-2026-11-18/` (copy of the project without `node_modules` and `dist`)

**Interfaces:**
- Produces: `npm run audit -- [--label <name>] [--reduced-motion] [--no-js] [--routes <comma list>]`. Expects the dev server on `http://localhost:5399`. Exit code 0 when all checks pass, 1 otherwise, with one line per failure: `FAIL <route> @<width>: <reason>`. Screenshots go to `screenshots/<label>/<route-slug>-<width>.png` (full page).

- [ ] **Step 1:** Copy the project to `../emg-editorial-backup-2026-11-18`, excluding `node_modules` and `dist`. Check: the backup has `src/`, `package.json` and `index.html`.
- [ ] **Step 2:** `npm install -D playwright-core`. Launch with `chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })` (no browser download).
- [ ] **Step 3:** Write `scripts/audit.mjs`. Routes: `/`, `/about`, `/services`, `/services/events-experiences`, `/services/events-experiences/conference-event-management`, `/work`, `/industries`, `/insights`, `/contact`, `/request-a-proposal`, `/partnerships`, `/careers`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`, `/design-system`, `/does-not-exist`. Widths 1440×900 and 390×844. For each route and width: load, wait for network idle, scroll to the bottom in 600 px steps with 120 ms pauses, scroll back to the top, wait 1.5 s, then check:
  - `document.documentElement.scrollWidth <= window.innerWidth` (else `horizontal overflow <n>px`)
  - no `console.error` or `pageerror` (else `console error: <text>`)
  - no `.rv-block` with computed opacity < 0.99 and no `.rv-word > span` whose transform isn't `none` or the identity matrix (else `hidden reveal: <count>`)
  - with `--reduced-motion`: `emulateMedia({ reducedMotion: 'reduce' })`, and `document.documentElement.classList.contains('lenis')` is false
  - with `--no-js`: context `javaScriptEnabled: false`, skip the console check
- [ ] **Step 4:** Start the dev server and run `npm run audit -- --label before`. Expected: the script completes and writes 34 screenshots to `screenshots/before/`. Record the failures it reports as the baseline (they aren't fixed in this task).

### Task 2: Motion core on GSAP (Lenis sync, ticker, ScrollTrigger-based `useScrollVar`)

**Files:**
- Create: `src/lib/scroll-math.ts`, `src/lib/scroll-math.test.ts`
- Modify: `src/lib/motion.tsx` (whole file; fix the header comment to say "EMG · Editorial"), `src/App.tsx:59-63` (route effect), `src/index.css` (drop hand-written `.lenis` rules), `src/main.tsx` (import `lenis/dist/lenis.css`), `src/components/ApproachLine.tsx`
- Modify: `package.json` (dependencies `gsap`, `@gsap/react`; script `"test": "node --test src/lib/*.test.ts"`)

**Interfaces:**
- Produces (in `scroll-math.ts`):
  - `type ScrollMode = 'through' | 'pin' | 'enter'`
  - `triggerRange(mode: ScrollMode): { start: string; end: string }`: `through` → `{ start: 'top bottom', end: 'bottom top' }`, `pin` → `{ start: 'top top', end: 'bottom bottom' }`, `enter` → `{ start: 'top bottom', end: 'top top' }` (matches today's three formulas)
  - `restProgress(mode: ScrollMode): number`: 0 / 0.5 / 1 as in Global Constraints
- Produces (in `motion.tsx`, same names and signatures as today so callers don't change): `getLenis(): Lenis | null`, `reducedMotion(): boolean`, `useSmoothScroll(): void`, `onFrame(fn: () => void): () => void`, `useScrollVar<T extends HTMLElement>(mode?: ScrollMode, onProgress?: (p: number, el: T) => void): RefObject<T | null>`, `useInView`, `usePointerVars`, `useSpotlight`. New: `refreshScroll(): void` (calls `ScrollTrigger.refresh()`).

- [ ] **Step 1: Write the failing test** `src/lib/scroll-math.test.ts` with `node:test` and `node:assert/strict`: `triggerRange('through')` deep-equals `{ start: 'top bottom', end: 'bottom top' }`; `triggerRange('pin')` deep-equals `{ start: 'top top', end: 'bottom bottom' }`; `triggerRange('enter')` deep-equals `{ start: 'top bottom', end: 'top top' }`; `restProgress` returns 0 for `pin`, 0.5 for `through`, 1 for `enter`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL, module `./scroll-math.ts` not found.
- [ ] **Step 3:** Implement `scroll-math.ts`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS (6 assertions).
- [ ] **Step 5:** `npm install gsap @gsap/react`. Rewrite `motion.tsx`:
  - `gsap.registerPlugin(ScrollTrigger)` at module level.
  - `useSmoothScroll`: if `reducedMotion()`, return. Otherwise create Lenis with the Global Constraints duration and easing and `autoRaf: false`, then `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(tick)` where `tick = (t) => lenis.raf(t * 1000)`, and `gsap.ticker.lagSmoothing(0)`. Cleanup removes the tick and destroys Lenis.
  - `onFrame(fn)`: `gsap.ticker.add(fn)`, returns `() => gsap.ticker.remove(fn)`.
  - `useScrollVar`: in reduced motion, set `--p` to `restProgress(mode)` once and call `onProgress` once. Otherwise `ScrollTrigger.create({ trigger: el, ...triggerRange(mode), onUpdate: (st) => write(st.progress), onRefresh: (st) => write(st.progress) })`, where `write` sets `--p` with `toFixed(4)` and calls `onProgress`. Kill the trigger on cleanup.
- [ ] **Step 6:** Import `lenis/dist/lenis.css` in `main.tsx` and delete the `html.lenis` / `.lenis.lenis-smooth` rules from `index.css`.
- [ ] **Step 7:** In `App.tsx`, the route effect does `getLenis()?.scrollTo(0, { immediate: true })`, falls back to `window.scrollTo(0, 0)` when there's no Lenis, then `requestAnimationFrame(() => refreshScroll())`.
- [ ] **Step 8:** `ApproachLine.tsx`: replace its own rAF loop and `useState` with `useScrollVar<HTMLDivElement>('enter', …)`. Keep the old fill formula `(vh * 0.85 - top) / (height + vh * 0.35)` by giving it a custom range: add an optional third parameter `range?: { start: string; end: string }` to `useScrollVar` and pass `{ start: 'top 85%', end: 'bottom 50%' }`. The rail reads `var(--p)` in CSS instead of React state.
- [ ] **Step 9:** Extend `scripts/audit.mjs` with Review Focus checks 1, 3 and 4: (a) on `/`, scroll to the bottom, click a footer link to `/privacy-policy`, expect `scrollY === 0` after 1 s and no hidden reveals; (b) with `--reduced-motion`, on `/` the hero section (`section` that holds the diorama) has `--p` = `0` and a ScrubP paragraph has `--p` = `0.5`; (c) on `/`, resize 1440 → 390 without reloading, wait 500 ms, expect no overflow and every `[style*="--p"]` value in [0, 1].
- [ ] **Step 10:** Run `npm test`, `npm run build`, `npm run audit -- --label task2` and `npm run audit -- --label task2-rm --reduced-motion`. Expected: all pass, with no new failures compared with the baseline.
- [ ] **Step 11:** Check by hand in the browser at 1440: the hero diorama, film strips, Spread, ScrubP brightening and Deck scale behave as in `screenshots/before`, and the scroll feel is unchanged.

### Task 3: Reveal on GSAP, visible without JavaScript

**Files:**
- Modify: `src/components/Reveal.tsx`, `src/index.css` (Reveal section, lines around 86–113, and the reduced-motion block around 234)

**Interfaces:**
- Consumes: `reducedMotion()` from `src/lib/motion.tsx`.
- Produces: `Reveal` with unchanged props `{ as?, delay?, className?, id?, mode?: 'auto' | 'words' | 'block', stagger?, children }` and unchanged classes `rv-word`, `rv-block`.

- [ ] **Step 1:** Add the no-JS and fling checks (Review Focus 2 and 5) to `scripts/audit.mjs`. `--no-js` already exists. Add the fling: on `/`, `window.scrollTo(0, document.body.scrollHeight)` in one jump, wait 1.5 s, expect no hidden reveals.
- [ ] **Step 2:** Run `npm run audit -- --label t3-nojs --no-js --routes /,/about,/work`. Expected: FAIL `hidden reveal` (the static CSS hides `.rv-block` with opacity 0).
- [ ] **Step 3:** CSS: remove the hidden start states from `.rv-word > span` and `.rv-block` (no opacity 0 or transform in static CSS), and remove their transitions.
- [ ] **Step 4:** `Reveal.tsx`: keep `splitWords`, and drop the per-word `transitionDelay`. With `useGSAP` scoped to the element, set the start state and animate it on a one-shot ScrollTrigger (`start: 'top 85%'`, `once: true`). Words: from `yPercent: 112, rotation: 6`, transform origin `0 100%`, `stagger: stagger / 1000`. Blocks: from `opacity: 0, y: 32, rotation: 0.6, filter: 'blur(6px)'`. Use `duration: 1.1`, `ease: 'expo.out'`, `delay: delay / 1000`. With reduced motion, set nothing and animate nothing.
- [ ] **Step 5:** Run the Step 2 command again. Expected: PASS. Then run `npm run build` and `npm run audit -- --label task3` (includes the fling check) and `--reduced-motion`. Expected: PASS.
- [ ] **Step 6:** Compare headings and blocks on `/` and `/about` with `screenshots/before` by eye: same rise, mask and timing.

### Task 4: Remove all glass

**Files:**
- Modify: `src/index.css` (`.glass` at line 116), `src/components/CookieBanner.tsx:27`, `src/components/Forms.tsx:9,66,83,262,309`, `src/components/MobileActions.tsx:23`, `src/components/Navbar.tsx:63,137,148`, `src/components/NetworkMap.tsx:11`, `src/pages/About.tsx:116`, `src/pages/Careers.tsx:28`, `src/pages/Division.tsx:65`, `src/pages/Insights.tsx:33`, `src/pages/DesignSystem.tsx:32-43` (internal notes only)

- [ ] **Step 1:** Add a check to `scripts/audit.mjs`: count elements whose computed `backdrop-filter` or `-webkit-backdrop-filter` isn't `none`; any count > 0 is `FAIL glass: <n>`. Run `npm run audit -- --label t4 --routes /,/contact,/work`. Expected: FAIL glass.
- [ ] **Step 2:** `.glass`: solid `var(--color-card)` fill, `1px solid rgba(22,19,15,0.14)` border, keep the existing shadow, no `backdrop-filter`. The floating caption cards keep their position and layering (owner decision).
- [ ] **Step 3:** Each listed Tailwind usage: drop `backdrop-blur-*` and replace translucent fills (`bg-white/[0.07]`, `bg-white/10`, `bg-black/70`, `bg-[rgba(250,248,244,0.82…0.98)]`) with `bg-card` or `bg-paper`. Keep borders and shadows. Form fields: `bg-card`, ink hairline border, accent focus border (text contrast ≥ 4.5:1, border ≥ 3:1).
- [ ] **Step 4:** `DesignSystem.tsx`: rewrite the notes that describe "frosted glass", "glass or a veil" and the reveal timing so they describe solid paper sheets and the GSAP reveal. Client-facing copy elsewhere stays the same.
- [ ] **Step 5:** Run `npm run build` and `npm run audit -- --label task4`. Expected: PASS, glass 0 on every route.

### Task 5: UI UX Pro Max pass and React Bits upgrades

**Files:**
- Create: `components.json`, `src/components/ui/` (files the shadcn CLI writes), `docs/superpowers/notes/2026-11-18-uipro-pass.md`
- Modify: `tsconfig.json` (`"baseUrl": "."`, `"paths": { "@/*": ["./src/*"] }`), `vite.config.ts` (`resolve.alias` `@` → `./src`), and the 3–5 sections chosen in Step 2

- [ ] **Step 1:** Run `python ~/.claude/skills/ui-ux-pro-max/scripts/search.py "multimedia production agency West Africa editorial" --design-system -p "EMG"`, plus `"scroll reveal reduced motion" --domain ux` and `"animation performance" --stack react`. Write the findings to the notes file: what agrees with the current palette, fonts and motion, any contrast failure (fix only that), and the ranked list of spots to upgrade.
- [ ] **Step 2:** Pick 3–5 React Bits spots from the ranked list. Start from: the Home hero headline (SplitText, replacing `Reveal` there only), the primary CTA `Button` in `src/components/ui.tsx`, the Work gallery, a marquee or section divider. Write the choice and a one-line reason for each into the notes file.
- [ ] **Step 3:** Set up shadcn: alias edits, then `npx shadcn@latest init` with Tailwind 4 and CSS variables, without letting it overwrite `src/index.css` tokens (back the file up first and restore the `@theme` block if it's changed).
- [ ] **Step 4:** For each spot: `npx shadcn@latest add @react-bits/<Name>-TS-TW`, wire it in, and restyle it to the tokens: Fraunces/Geist, ink, paper, accent. Remove any default purple/violet/indigo, gradient orbs or blur from the component. Any animation in the component must use GSAP or CSS and respect `reducedMotion()`.
- [ ] **Step 5:** Add a check to `scripts/audit.mjs`: no computed color on any element whose hue is between 240° and 300° with saturation > 25% (`FAIL purple: <selector>`). Run `npm run build`, `npm run audit -- --label task5` and `--reduced-motion`. Expected: PASS, including the glass and purple checks.

### Task 6: 21st.dev component (new session)

**Files:** the section chosen in Step 1, plus any files the 21st.dev tool writes under `src/components/ui/`.

- [ ] **Step 1:** In a **new Claude Code session** opened in `emg-editorial` (the 21st.dev MCP tools load only at session start), confirm the `21st` tools are listed. Pick 1–2 spots, so that Tasks 5 and 6 together upgrade 4 to 6 spots, from the notes file's ranked list that React Bits didn't take (for example the partner/client strip or the contact CTA).
- [ ] **Step 2:** Pull the component through the 21st.dev MCP, then restyle and guard it with the same rules as Task 5 Step 4.
- [ ] **Step 3:** Run `npm run build`, `npm run audit -- --label task6` and `--reduced-motion`. Expected: PASS.

### Task 7: Final verification and before/after

**Files:**
- Create: `docs/superpowers/notes/2026-11-18-upgrade-report.md`

- [ ] **Step 1:** Run `npm test`, `npm run build`, `npm run audit -- --label after`, `npm run audit -- --label after-rm --reduced-motion` and `npm run audit -- --label after-nojs --no-js`. Expected: all exit 0.
- [ ] **Step 2:** Put `screenshots/before` and `screenshots/after` side by side for every route at both widths. Note in the report anything that looks different apart from intended changes (glass now solid, component upgrades).
- [ ] **Step 3:** Scroll the home page at 1440 and 390 in the browser: no jump at the start or end of the Deck, hero or Spread, and Lenis feels the same as before.
- [ ] **Step 4:** Report: what changed per task, the component list with sources (React Bits or 21st.dev), the audit results, and anything left (for example the spec's "confirm before launch" content items, which are untouched).
