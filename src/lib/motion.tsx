/**
 * EMG · Editorial motion engine (GSAP).
 * - Lenis smooth scroll, driven by the GSAP ticker and kept in sync with ScrollTrigger.
 * - onFrame: subscribe to the GSAP ticker (one loop for the whole site).
 * - useScrollVar: writes a 0–1 progress (`--p`) onto an element from a ScrollTrigger, so
 *   parallax layers stay pure CSS calc() with no React re-render per frame.
 * - useInView: one-shot IntersectionObserver.
 * - usePointerVars: eased pointer position (`--px`,`--py`, -1…1) for tilt/depth.
 * Reduced motion: no Lenis, no scrubbing; `--p` rests at restProgress(mode).
 */
import { useEffect, useRef, useState, type RefObject } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { restProgress, triggerRange, type ScrollMode } from './scroll-math';

gsap.registerPlugin(ScrollTrigger);

export type { ScrollMode };

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Re-measure every ScrollTrigger (after a route change or layout shift). */
export const refreshScroll = () => ScrollTrigger.refresh();

export function useSmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const l = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    });
    lenis = l;
    l.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, []);
}

/** Run fn on every GSAP ticker frame. Returns an unsubscribe function. */
export function onFrame(fn: () => void) {
  gsap.ticker.add(fn);
  return () => {
    gsap.ticker.remove(fn);
  };
}

/**
 * mode 'through': 0 when the element's top hits the viewport bottom, 1 when its bottom leaves the top.
 * mode 'pin':     0 when top hits viewport top, 1 when bottom hits viewport bottom (for sticky tracks).
 * mode 'enter':   0 when top hits viewport bottom, 1 when top hits viewport top.
 * range overrides the mode's start/end (ScrollTrigger syntax); reduced motion still uses the mode's rest value.
 */
export function useScrollVar<T extends HTMLElement>(
  mode: ScrollMode = 'through',
  onProgress?: (p: number, el: T) => void,
  range?: { start: string; end: string },
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;
  const start = range?.start;
  const end = range?.end;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;
    const write = (p: number) => {
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      el.style.setProperty('--p', p.toFixed(4));
      cb.current?.(p, el);
    };
    if (reducedMotion()) {
      write(restProgress(mode));
      return;
    }
    const r = start && end ? { start, end } : triggerRange(mode);
    const st = ScrollTrigger.create({
      trigger: el,
      start: r.start,
      end: r.end,
      onUpdate: (self) => write(self.progress),
      onRefresh: (self) => write(self.progress),
    });
    write(st.progress);
    return () => st.kill();
  }, [mode, start, end]);
  return ref;
}

export function useInView<T extends HTMLElement>(threshold = 0.2, rootMargin = '0px 0px -8% 0px') {
  const ref = useRef<T>(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          set(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);
  return [ref, inView] as const;
}

/** Eased pointer position on an element as CSS vars --px/--py in -1…1. */
export function usePointerVars<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    const move = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    const off = onFrame(() => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty('--px', x.toFixed(4));
      el.style.setProperty('--py', y.toFixed(4));
    });
    return () => {
      window.removeEventListener('pointermove', move);
      off();
    };
  }, []);
  return ref;
}

/** Spotlight cursor tracking for `.spot` cards (event delegation, one listener). */
export function useSpotlight() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.('.spot') as HTMLElement | null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`);
      t.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
}
