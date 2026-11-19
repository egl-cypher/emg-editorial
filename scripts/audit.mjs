// Route audit for the EMG Editorial site.
// Usage: npm run audit -- [--label <name>] [--reduced-motion] [--no-js] [--routes /,/about]
// Needs the dev server on http://localhost:5399 and Chrome installed.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.AUDIT_BASE || 'http://localhost:5399';
const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => p && existsSync(p));

const ALL_ROUTES = [
  '/', '/about', '/services', '/services/events-experiences',
  '/services/events-experiences/conference-event-management', '/work', '/industries', '/insights',
  '/contact', '/request-a-proposal', '/partnerships', '/careers', '/privacy-policy',
  '/terms-of-service', '/cookie-policy', '/design-system', '/does-not-exist',
];
const WIDTHS = [
  { w: 1440, h: 900 },
  { w: 390, h: 844 },
];

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const label = opt('--label', 'run');
const reduced = flag('--reduced-motion');
const noJs = flag('--no-js');
const routes = opt('--routes', '') ? opt('--routes', '').split(',') : ALL_ROUTES;

const failures = [];
const fail = (route, w, reason) => {
  const line = `FAIL ${route} @${w}: ${reason}`;
  failures.push(line);
  console.log(line);
};
const slug = (r) => (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '__'));

/** Counts reveal elements that are still in a hidden/offscreen state. */
const hiddenReveals = (onScreen = false) => {
  const ident = (t) => t === 'none' || /^matrix\(1, 0, 0, 1, 0, 0\)$/.test(t);
  const vh = window.innerHeight;
  // onScreen: only count elements currently in the viewport (content below the fold may still be waiting).
  const skip = (el) => {
    if (!onScreen) return false;
    const r = el.getBoundingClientRect();
    return r.bottom < 0 || r.top > vh;
  };
  let n = 0;
  document.querySelectorAll('.rv-block').forEach((el) => {
    if (skip(el)) return;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.99 || !ident(cs.transform)) n++;
  });
  document.querySelectorAll('.rv-word > span').forEach((el) => {
    if (skip(el)) return;
    if (!ident(getComputedStyle(el).transform)) n++;
  });
  return n;
};
const glassCount = () =>
  [...document.querySelectorAll('*')].filter((el) => {
    const cs = getComputedStyle(el);
    const bf = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
    return bf !== 'none' && bf !== '';
  }).length;
/** Visible elements whose text, background or border colour is purple/violet/indigo. */
const purpleHits = () => {
  const hue = (c) => {
    const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
    if (!m || (m[4] !== undefined && parseFloat(m[4]) < 0.05)) return null;
    const [r, g, b] = [m[1], m[2], m[3]].map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (d === 0) return null;
    const l = (mx + mn) / 2;
    const s = d / (1 - Math.abs(2 * l - 1));
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    return { h, s };
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    for (const c of [cs.color, cs.backgroundColor, cs.borderTopColor]) {
      const v = hue(c);
      if (v && v.h >= 240 && v.h <= 300 && v.s > 0.25) {
        out.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''));
        break;
      }
    }
    if (out.length > 5) break;
  }
  return out;
};

async function scrollThrough(page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
}

async function checkPage(page, route, w, errors) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) fail(route, w, `horizontal overflow ${overflow}px`);
  if (!noJs && errors.length) fail(route, w, `console error: ${errors[0].slice(0, 160)}`);
  const hidden = await page.evaluate(hiddenReveals);
  if (hidden) fail(route, w, `hidden reveal: ${hidden}`);
  if (noJs) return;
  const glass = await page.evaluate(glassCount);
  if (glass) fail(route, w, `glass: ${glass}`);
  const purple = await page.evaluate(purpleHits);
  if (purple.length) fail(route, w, `purple: ${purple.join(', ')}`);
  if (reduced) {
    const lenis = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
    if (lenis) fail(route, w, 'lenis active under reduced motion');
  }
}

async function extraChecks(browser) {
  // Review Focus 1: route change from the bottom of a long page.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();

  // Review Focus 2: the stylesheet alone must not hide reveal content (if the animation code never runs).
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const staticHidden = await page.evaluate(() => {
    const box = document.createElement('div');
    box.innerHTML = '<div class="rv-block">x</div><h2><span class="rv-word"><span>x</span></span></h2>';
    document.body.appendChild(box);
    const ident = (t) => t === 'none' || /^matrix\(1, 0, 0, 1, 0, 0\)$/.test(t);
    const b = getComputedStyle(box.querySelector('.rv-block'));
    const wd = getComputedStyle(box.querySelector('.rv-word > span'));
    const out = [];
    if (parseFloat(b.opacity) < 0.99 || !ident(b.transform)) out.push('.rv-block');
    if (!ident(wd.transform)) out.push('.rv-word > span');
    box.remove();
    return out;
  });
  if (staticHidden.length) fail('(stylesheet)', 1440, `static CSS hides ${staticHidden.join(', ')}`);

  // Typed tagline: present, readable, and announced once for screen readers.
  {
    const tg = await page.evaluate(() => {
      const el = document.querySelector('[data-tagline]');
      return el ? { text: el.textContent || '', sr: el.querySelector('.sr-only')?.textContent || '' } : null;
    });
    if (!tg) fail('/ (tagline)', 1440, 'typed tagline missing');
    else {
      if (!/create.*capture.*connect/i.test(tg.sr)) fail('/ (tagline)', 1440, `tagline has no screen-reader text: "${tg.sr}"`);
      if (reduced && !/create \/ capture \/ connect/i.test(tg.text)) fail('/ (tagline)', 1440, `reduced motion should show the full static tagline: "${tg.text}"`);
    }
  }

  // Stats band: every number ends at its data value once scrolled into view.
  {
    const band = page.locator('[data-stats]');
    if (!(await band.count())) fail('/ (stats)', 1440, 'stats band missing');
    else {
      await band.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(2200);
      const bad = await page.evaluate(() =>
        [...document.querySelectorAll('[data-stat]')]
          .filter((el) => (el.textContent || '').trim() !== el.getAttribute('data-stat'))
          .map((el) => `${el.textContent} != ${el.getAttribute('data-stat')}`),
      );
      if (bad.length) fail('/ (stats)', 1440, `stats not at final value: ${bad.join(', ')}`);
    }
  }

  // The home h1 must have an accessible name screen readers announce.
  const h1 = await page.locator('main h1').first().ariaSnapshot().catch((e) => String(e));
  if (!/Ideas into impact/i.test(h1)) fail('/ (a11y)', 1440, `h1 accessible name missing: ${h1.slice(0, 120).replace(/\n/g, ' ')}`);

  // With web fonts stalled, the hero headline must still be visible within ~1s.
  {
    const slow = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await slow.route(/fonts\.(googleapis|gstatic)\.com/, async (r) => {
      await new Promise((res) => setTimeout(res, 8000));
      await r.continue().catch(() => {});
    });
    const sp = await slow.newPage();
    await sp.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await sp.waitForTimeout(1500);
    const hidden = await sp.evaluate(
      () => [...document.querySelectorAll('main h1 .split-parent')].filter((el) => getComputedStyle(el).visibility === 'hidden').length,
    );
    if (hidden) fail('/ (slow fonts)', 1440, `hero headline hidden while fonts load: ${hidden} pieces`);
    await slow.close();
  }

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const a = [...document.querySelectorAll('footer a')].find((x) => x.getAttribute('href') === '/about');
    a?.click();
  });
  // Long enough for every on-screen reveal (delay + 1.1s) to finish.
  await page.waitForTimeout(2600);
  const y = await page.evaluate(() => window.scrollY);
  if (y > 2) fail('/ → /about', 1440, `route change left scrollY at ${y}`);
  const hid = await page.evaluate(hiddenReveals, true);
  if (hid) fail('/ → /about', 1440, `hidden reveal on screen after route change: ${hid}`);
  if (!reduced) {
    // Content below the fold must still be waiting for the visitor to scroll, not already played.
    const waiting = await page.evaluate(() => {
      const vh = window.innerHeight;
      return [...document.querySelectorAll('.rv-block')].filter(
        (el) => el.getBoundingClientRect().top > vh * 1.2 && parseFloat(getComputedStyle(el).opacity) < 0.99,
      ).length;
    });
    if (!waiting) fail('/ → /about', 1440, 'below-fold reveals already played on arrival (triggers measured at the old scroll position)');
  }

  // Review Focus 5: fling straight to the bottom.
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1500);
  const flung = await page.evaluate(() => {
    const ident = (t) => t === 'none' || /^matrix\(1, 0, 0, 1, 0, 0\)$/.test(t);
    const vh = window.innerHeight;
    return [...document.querySelectorAll('.rv-block')].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return false; // only what is on screen now
      const cs = getComputedStyle(el);
      return parseFloat(cs.opacity) < 0.99 || !ident(cs.transform);
    }).length;
  });
  if (flung) fail('/ (fling)', 1440, `hidden reveal on screen after fling: ${flung}`);

  // Review Focus 4: resize without reload.
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  const res = await page.evaluate(() => {
    const over = document.documentElement.scrollWidth - window.innerWidth;
    const bad = [...document.querySelectorAll('[style*="--p"]')]
      .map((el) => el.style.getPropertyValue('--p'))
      .filter((s) => s.trim() !== '')
      .map(parseFloat)
      .filter((v) => !(v >= 0 && v <= 1));
    return { over, bad: bad.length };
  });
  if (res.over > 0) fail('/ (resize)', 390, `overflow after resize ${res.over}px`);
  if (res.bad) fail('/ (resize)', 390, `--p out of range on ${res.bad} elements`);

  // Review Focus 3: reduced-motion rest values.
  if (reduced) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const vals = await page.evaluate(() => {
      const hero = document.querySelector('main section');
      const scrub = [...document.querySelectorAll('p[style*="--p"]')][0];
      return {
        hero: hero ? hero.style.getPropertyValue('--p') : null,
        scrub: scrub ? scrub.style.getPropertyValue('--p') : null,
      };
    });
    if (parseFloat(vals.hero) !== 0) fail('/ (reduced)', 1440, `hero --p is ${vals.hero}, expected 0`);
    if (parseFloat(vals.scrub) !== 0.5) fail('/ (reduced)', 1440, `ScrubP --p is ${vals.scrub}, expected 0.5`);
  }
  await ctx.close();
}

const browser = await chromium.launch({ executablePath: CHROME });
try {
  for (const { w, h } of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      javaScriptEnabled: !noJs,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    // Check up to 4 routes at once.
    const queue = [...routes];
    const worker = async () => {
      for (let route = queue.shift(); route; route = queue.shift()) await checkRoute(route);
    };
    const checkRoute = async (route) => {
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(String(e)));
      try {
        await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
        if (!noJs) await scrollThrough(page);
        await checkPage(page, route, w, errors);
        const dir = join('screenshots', label);
        await mkdir(dir, { recursive: true });
        const shot = join(dir, `${slug(route)}-${w}.png`);
        // Very tall pages can exceed Chrome's capture limit; fall back to the viewport.
        await page.screenshot({ path: shot, fullPage: true }).catch(() => page.screenshot({ path: shot }));
      } catch (e) {
        fail(route, w, `error: ${String(e).slice(0, 160)}`);
      }
      await page.close();
    };
    await Promise.all(Array.from({ length: Math.min(4, routes.length) }, worker));
    await ctx.close();
  }
  if (!noJs && (!args.includes('--routes') || flag('--extra'))) await extraChecks(browser);
} finally {
  await browser.close();
}
console.log(failures.length ? `\n${failures.length} failure(s)` : '\nAll checks passed');
process.exit(failures.length ? 1 : 0);
