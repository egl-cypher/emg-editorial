# UI UX Pro Max pass: EMG Editorial (2026-11-18)

Queries run with `python ~/.claude/skills/ui-ux-pro-max/scripts/search.py`:
`"multimedia production agency West Africa editorial" --design-system -p "EMG"`, `"scroll reveal reduced motion" --domain ux`, `"animation performance" --stack react`.

## What it recommended, and what we keep

- **Generic recommendation:** "Minimalism & Swiss Style", Outfit / Work Sans, near-black with a pink accent (#EC4899). **Not adopted.** The owner chose the Editorial look on 2026-11-17 (paper #f3efe8, ink #16130f, vermilion #c8381a, Fraunces + Geist), and the spec rules out palette and font changes. A pink accent would also sit close to the banned purple range.
- **Agrees with the current site:** high-contrast ink on paper, Lucide SVG icons (no emoji), visible focus states (2px accent outline), subtle hovers in the 150–300 ms range, hero parallax disabled under reduced motion with a static final state (done in Task 2), reduced motion honoured with no scroll-jacking (Lenis is skipped).
- **React guidance:** profile before optimising; no long lists here, so virtualisation doesn't apply.

## Contrast check (WCAG, computed)

| Pair | Ratio | Result |
|---|---|---|
| Ink on paper | 16.2:1 | pass |
| Vermilion text on paper | 4.54:1 | pass (AA) |
| Paper text on vermilion button | 4.54:1 | pass (AA) |
| Vermilion on card | 4.90:1 | pass |
| Moss on paper | 6.69:1 | pass |
| Accent-soft (#e2603f) on paper | 3.06:1 | only used on ink backgrounds, OK |
| `text-white/50` (ink 50% on paper) | 3.38:1 | **fail** for small text |
| `text-white/55` (ink 55% on paper) | 3.95:1 | **fail** for small text |
| `text-white/60` (ink 60% on paper) | 4.63:1 | pass |

**Fix (the one allowed change):** raise every `text-white/50` and `text-white/55` (50 uses in 17 files, mostly 10–11 px mono labels and indices) to `text-white/60`. Placeholders at `/35` are left as they are, since every field has a visible label.

## Component upgrades, ranked

Rule: any animation must be GSAP or CSS, so React Bits components that depend on `motion` (for example ScrollVelocity) are out.

| # | Spot | Component | Source | Why |
|---|---|---|---|---|
| 1 | Home hero headline | SplitText (TS-TW) | React Bits | GSAP-based character reveal for the one headline that sets the tone; replaces Reveal there only |
| 2 | Primary CTA buttons (`Button` in `ui.tsx`, solid variant) | Magnet (TS-TW) | React Bits | Subtle magnetic pull on hover; no dependency; off on touch and reduced motion |
| 3 | Work / project cards (`ProjectCard`) | GlareHover (TS-TW) | React Bits | A soft paper sheen on hover, CSS only, restyled to a warm, low-opacity glare |
| 4 | Contact CTA band or the partner/support strip | to pick in Task 6 | 21st.dev | Owner's rules name 21st.dev; done in a new session where its MCP tools load |

No client-logo strip: the content rule allows only verified client names, and none are supplied yet.
