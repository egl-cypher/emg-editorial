import { useState } from 'react';
import { ABOUT } from '../data/site';
import { useScrollVar } from '../lib/motion';

/** 5-step process; the accent rail fills as the block scrolls through the viewport. */
export default function ApproachLine() {
  const steps = ABOUT.approach;
  // Only the number of lit steps lives in React state; the rail reads --p in CSS.
  const [lit, setLit] = useState(0);
  const ref = useScrollVar<HTMLDivElement>(
    'enter',
    (p) => {
      const n = steps.filter((_, i) => p >= i / steps.length + 0.02).length;
      setLit((prev) => (prev === n ? prev : n));
    },
    { start: 'top 85%', end: 'bottom 50%' },
  );
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/15 md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-px md:w-auto" />
      <div className="absolute left-[7px] top-2 w-px bg-accent md:hidden" style={{ height: 'max(0px, calc(var(--p, 0) * 100% - 16px))' }} />
      <div className="absolute left-0 top-[7px] hidden h-px bg-accent md:block" style={{ width: 'calc(var(--p, 0) * 100%)' }} />
      <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
        {steps.map((s, i) => {
          const on = i < lit;
          return (
            <li key={s.title} className="flex gap-5 md:flex-col md:gap-6">
              <span
                className={`mt-0.5 h-[15px] w-[15px] shrink-0 rounded-full border transition-colors duration-500 ${
                  on ? 'border-accent bg-accent' : 'border-white/40 bg-paper'
                }`}
              />
              <div>
                <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">0{i + 1}</span>
                <h3 className={`mt-1 text-2xl transition-colors duration-500 ${on ? 'text-white' : 'text-white/60'}`}>{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
