# EMG Editorial: patterns borrowed from aidigital.com (short design)

Date: 2026-11-18 · Approved by the owner ("continue") · Reference: https://www.aidigital.com/ (patterns only, not its look)

**Why:** the owner wants aidigital.com's structure in the existing Editorial look (paper, ink, vermilion, Fraunces + Geist), keeping the 17 Nov direction and the design rules.

**Approaches:** borrow patterns into Editorial (chosen) vs restyle to aidigital's cobalt/lime caps look (rejected: replaces the chosen direction, and its cobalt sits at the edge of the no-indigo rule).

**Already present, so not added:** numbered service rows (division index 01–07, Services rows), a product-style showcase (hero showreel window), a big closing CTA. **Not borrowed:** the photo collage (no verified photos yet).

**Build:**
1. **Typed tagline** in the hero's REC strip: "We create", with the last word typed and swapped create → capture → connect (EMG's own tagline). GSAP TextPlugin, vermilion cursor, Geist Mono. Reduced motion: static "We create / capture / connect". Screen readers get the tagline once.
2. **Stats band** on Home between Network and Work: 7 divisions, 6 West African network countries, total services (counted from `DIVISIONS`), 1 HQ in Monrovia. Fraunces numbers count up once on scroll (GSAP, ~1.2 s, expo-out), mono labels, paper sheet with hairlines, asymmetric (one large, three small). Reduced motion: final values at once. All numbers derive from `src/data/site.ts`.

**Unchanged:** palette, fonts, existing copy, other sections. **Checks:** build; audit on Home normal + reduced; new checks that the tagline reads with motion off and the stats end at their data values.
