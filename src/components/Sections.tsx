import type { ReactNode } from 'react';
import Reveal from './Reveal';
import { Badge, Button, headline, pad, mono } from './ui';
import { Link } from '../lib/router';
import { ChevronRight } from 'lucide-react';
import { useScrollVar } from '../lib/motion';
import { Ridge } from './Diorama';
import MarqueeBackdrop from './MarqueeBackdrop';

/** Framed print: a paper mount with a warm dark plate inside, used as a physical layer.
 *  `grade` and `pos` are kept for callers; they styled the old background film, which was removed. */
export function Print({
  className = '',
  caption,
  style,
}: {
  className?: string;
  grade?: string;
  pos?: string;
  caption?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure className={`sheet p-2 pb-8 ${className}`} style={style} aria-hidden="true">
      <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(80%_80%_at_50%_30%,#6b4636,#1f1712_80%)]">
      </div>
      {caption && <figcaption className={`${mono} absolute bottom-2.5 left-3 right-3 truncate text-[9px] text-white/60`}>{caption}</figcaption>}
    </figure>
  );
}

/**
 * Interior page opener as a magazine masthead, in three planes:
 *   back  — a big italic ghost word, drifting slowest
 *   mid   — the serif headline (word-mask reveal)
 *   front — a tilted film print that lifts faster than the page
 */
export function PageHero({
  crumbs,
  badge,
  title,
  aside,
  children,
  ghost,
}: {
  crumbs?: { label: string; to?: string }[];
  badge: string;
  title: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  ghost?: string;
}) {
  const ref = useScrollVar<HTMLElement>('through');
  const ghostWord = (ghost ?? badge).split(/[\s&·]+/)[0];
  return (
    <section ref={ref} className={`${pad} relative overflow-clip pt-32 sm:pt-36`}>
      {/* masthead rule */}
      <div className={`${mono} relative flex items-center justify-between gap-4 border-b border-white/15 pb-3 text-[10px] text-white/60`}>
        {crumbs ? (
          <Reveal as="nav" className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {c.to ? (
                  <Link to={c.to} className="transition-colors hover:text-accent">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <ChevronRight size={10} />}
              </span>
            ))}
          </Reveal>
        ) : (
          <span>EMG</span>
        )}
        <span className="hidden sm:inline">Monrovia · West Africa</span>
      </div>

      <div
        aria-hidden="true"
        className="serif-i pointer-events-none absolute -right-[4vw] top-[30%] select-none whitespace-nowrap text-[clamp(8rem,26vw,24rem)] leading-none text-white/[0.05]"
        style={{ transform: 'translate3d(0, calc((var(--p,0) - 0.5) * 20vh), 0)' }}
      >
        {ghostWord}
      </div>

      <div className="relative mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
        <div style={{ transform: 'translate3d(0, calc((var(--p,0) - 0.5) * -3vh), 0)' }}>
          <Reveal delay={100} className="mb-7">
            <Badge accent>{badge}</Badge>
          </Reveal>
          <Reveal as="h1" delay={160} className={`${headline} max-w-5xl`}>
            {title}
          </Reveal>
          {aside && (
            <Reveal delay={360} className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {aside}
            </Reveal>
          )}
          {children && (
            <Reveal delay={460} className="mt-9">
              {children}
            </Reveal>
          )}
        </div>
        {/* desktop: two prints at different depths */}
        <Reveal delay={300} className="relative hidden h-[340px] w-[300px] lg:block">
          <div className="absolute left-0 top-6" style={{ transform: 'translate3d(0, calc((var(--p,0) - 0.5) * -8vh), 0) rotate(-5deg)' }}>
            <Print className="relative h-[230px] w-[180px]" grade="sepia(0.55) saturate(1.5)" pos="75% 50%" caption="Monrovia" />
          </div>
          <div className="absolute right-0 top-0" style={{ transform: 'translate3d(0, calc((var(--p,0) - 0.5) * -18vh), 0) rotate(4deg)' }}>
            <Print className="relative h-[290px] w-[220px]" grade="grayscale(1) contrast(1.15)" caption={`EMG — ${badge}`} />
          </div>
        </Reveal>
        {/* phone & tablet: one wide print */}
        <Reveal delay={300} className="lg:hidden">
          <div style={{ transform: 'rotate(-1.2deg)' }}>
            <Print className="relative aspect-[16/9] w-full max-w-xl" grade="sepia(0.45) saturate(1.4)" caption={`EMG — ${badge}`} />
          </div>
        </Reveal>
      </div>

      {/* horizon: a low sunset coastline the page sits on, echoing the home hero */}
      <div aria-hidden="true" className="relative -mx-5 mt-16 h-[110px] overflow-hidden sm:-mx-8 sm:h-[140px] md:-mx-12 md:mt-20">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(242,205,170,0.55)_55%,rgba(220,143,111,0.45)_100%)]" />
        <Ridge base={210} amp={60} seed={1.3} fill="#e7b796" className="absolute inset-x-0 bottom-0 h-full w-full" style={{ transform: 'translate3d(0, calc((var(--p,0) - 0.5) * 30px), 0)' }} />
        <Ridge base={280} amp={46} seed={2.6} fill="#cf9271" className="absolute inset-x-0 bottom-0 h-full w-full" style={{ transform: 'translate3d(0, calc((var(--p,0) - 0.5) * 50px), 0)' }} />
        <Ridge base={340} amp={30} seed={5.1} fill="var(--color-paper)" className="absolute inset-x-0 -bottom-px h-full w-full" />
      </div>
    </section>
  );
}

/** Generic content section with an editorial header row (number rule + serif title). */
export function Section({
  id,
  label,
  title,
  intro,
  children,
  className = '',
}: {
  id?: string;
  label?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`${pad} relative scroll-mt-24 py-24 md:py-32 ${className}`}>
      {(label || title || intro) && (
        <div className="mb-14">
          {label && (
            <Reveal className={`${mono} mb-8 flex items-center gap-4 border-t border-white/15 pt-3 text-[10px] text-white/60`}>
              <span className="h-2 w-2 rotate-45 bg-accent" />
              {label}
            </Reveal>
          )}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {title && (
              <Reveal as="h2" delay={80} className="display max-w-4xl text-[clamp(2.2rem,4.8vw,4.5rem)] leading-[1] text-white [text-wrap:balance]">
                {title}
              </Reveal>
            )}
            {intro && (
              <Reveal delay={220} className="max-w-md text-sm leading-relaxed text-white/65 sm:text-base md:text-right">
                {intro}
              </Reveal>
            )}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

/** Closing call to action — a large paper sheet with a print pinned to it. */
export function CtaBand({
  title = 'Have a Project in Mind?',
  body = 'Whether you are planning an event, developing a brand, producing media content or improving your digital presence, EMG is ready to help.',
  primary = { label: 'Request a Proposal', to: '/request-a-proposal' },
  secondary = { label: 'Contact Our Team', to: '/contact' },
}: {
  title?: string;
  body?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string } | null;
}) {
  const ref = useScrollVar<HTMLElement>('enter');
  return (
    <section ref={ref} className={`${pad} pb-28 pt-10 md:pb-36`}>
      <div className="sheet relative overflow-hidden rounded-[6px] px-6 py-14 sm:px-12 md:py-20" style={{ transform: 'rotate(calc((1 - var(--p,0)) * -1.5deg)) translateY(calc((1 - var(--p,0)) * 40px))' }}>
        <MarqueeBackdrop phrase="Create / Capture / Connect" />
        <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className={`${mono} flex items-center gap-2 text-[10px] text-accent`}>
              <span className="rec h-2 w-2 rounded-full bg-accent" /> Create / Capture / Connect
            </span>
            <Reveal as="h2" className="display mt-6 text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.96] text-white">
              {title}
            </Reveal>
            <Reveal delay={200} className="mt-6 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
              {body}
            </Reveal>
            <Reveal delay={320} className="mt-9 flex flex-wrap gap-3">
              <Button to={primary.to} variant="accent">
                {primary.label}
              </Button>
              {secondary && (
                <Button to={secondary.to} variant="secondary">
                  {secondary.label}
                </Button>
              )}
            </Reveal>
          </div>
          <div className="relative hidden h-[340px] lg:block">
            <div className="absolute right-[30%] top-6" style={{ transform: 'rotate(-7deg) translateY(calc((1 - var(--p,0)) * 60px))' }}>
              <Print className="relative h-[260px] w-[210px]" grade="grayscale(1) contrast(1.2)" pos="30% 50%" caption="Capture" />
            </div>
            <div className="absolute right-[4%] top-0" style={{ transform: 'rotate(5deg) translateY(calc((1 - var(--p,0)) * 110px))' }}>
              <Print className="relative h-[280px] w-[220px]" grade="sepia(0.5) saturate(1.4)" pos="70% 50%" caption="Connect" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
