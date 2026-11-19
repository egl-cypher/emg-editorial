import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DIVISIONS, NETWORK } from '../data/site';
import { reducedMotion } from '../lib/motion';
import { mono, pad } from './ui';

gsap.registerPlugin(useGSAP);

/* Every figure is counted from the verified content in src/data/site.ts, never typed by hand. */
const STATS = [
  { value: DIVISIONS.length, label: 'Divisions under one group' },
  { value: NETWORK.length, label: 'West African countries in our network' },
  { value: DIVISIONS.reduce((n, d) => n + d.subs.length, 0), label: 'Specialist services' },
  { value: NETWORK.filter((n) => n.hq).length, label: 'Headquarters, in Monrovia' },
];

/**
 * Stats band: one large figure and three smaller ones on a paper sheet.
 * Numbers render at their final value; GSAP counts them up once when the band
 * scrolls into view. Reduced motion: no counting.
 */
export default function StatsBand() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      el.querySelectorAll<HTMLElement>('[data-stat]').forEach((node, i) => {
        const end = Number(node.dataset.stat);
        const counter = { v: 0 };
        gsap.fromTo(
          counter,
          { v: 0 },
          {
            v: end,
            duration: 1.2,
            delay: i * 0.08,
            ease: 'expo.out',
            onUpdate: () => {
              node.textContent = String(Math.round(counter.v));
            },
            onComplete: () => {
              node.textContent = String(end);
            },
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  const [lead, ...rest] = STATS;
  return (
    <section ref={ref} data-stats className={`${pad} py-16 md:py-24`} aria-label="EMG in numbers">
      <div className="sheet grid overflow-hidden rounded-[6px] md:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 p-7 sm:p-10 md:border-b-0 md:border-r">
          <span className={`${mono} flex items-center gap-3 text-[10px] text-white/60`}>
            <span className="h-2 w-2 rotate-45 bg-accent" /> EMG in numbers
          </span>
          <div>
            <span data-stat={lead.value} className="display block text-[clamp(6rem,16vw,13rem)] leading-[0.85] tabular-nums text-white">
              {lead.value}
            </span>
            <span className="mt-4 block max-w-xs text-base text-white/70">{lead.label}</span>
          </div>
        </div>
        <dl className="grid divide-y divide-white/10">
          {rest.map((s) => (
            <div key={s.label} className="flex items-end justify-between gap-6 px-7 py-6 sm:px-10">
              <dt className={`${mono} max-w-[16ch] text-[10px] leading-relaxed text-white/60`}>{s.label}</dt>
              <dd data-stat={s.value} className="display text-[clamp(3rem,6vw,5rem)] leading-none tabular-nums text-white">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
