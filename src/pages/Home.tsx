import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';
import GlareHover from '../components/GlareHover';
import TypedTagline from '../components/TypedTagline';
import StatsBand from '../components/StatsBand';
import NetworkMap from '../components/NetworkMap';
import { CtaBand, Print, Section } from '../components/Sections';
import { Coast, Ridge } from '../components/Diorama';
import { LensMark } from '../components/Wordmark';
import ShowreelModal, { SHOWREEL_POSTER, SHOWREEL_SRC } from '../components/ShowreelModal';
import { Button, PendingSlot, mono, pad } from '../components/ui';
import { ABOUT, DIVISIONS, HOME, NETWORK, PROJECTS, WHO_WE_SUPPORT, WORK } from '../data/site';
import { Link } from '../lib/router';
import { onFrame, reducedMotion, usePointerVars, useScrollVar } from '../lib/motion';
import { useDocumentTitle } from '../lib/useDocumentTitle';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* Hero headline pieces. `at` chains each piece's start (s) so the lines read as one reveal (25ms per character). */
const HERO_LINES: { text: string; className?: string; at: number }[][] = [
  [
    { text: 'Ideas into', at: 0.2 },
    { text: 'impact.', className: 'serif-i text-accent', at: 0.45 },
  ],
  [
    { text: 'Creativity into', at: 0.65 },
    { text: 'results.', className: 'serif-i', at: 1.03 },
  ],
];

export default function Home() {
  useDocumentTitle();
  return (
    <>
      <Hero />
      <FilmStrips />
      <Spread />
      <Deck />
      <DivisionIndex />
      <ProcessDeal />
      <Why />
      <Network />
      <StatsBand />
      <Work />
      <Support />
      <CtaBand title={HOME.final.title} body={HOME.final.body} />
    </>
  );
}

/* ───────── Live timecode ───────── */
function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const t0 = performance.now();
    return onFrame(() => {
      const el = ref.current;
      if (!el) return;
      const ms = performance.now() - t0;
      const s = Math.floor(ms / 1000);
      const p = (n: number) => String(n).padStart(2, '0');
      el.textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(Math.floor((ms / 40) % 25))}`;
    });
  }, []);
  return <span ref={ref}>00:00:00:00</span>;
}

/* ───────── 1 · Hero — the coast diorama ─────────
   Built like a stage set, back to front: sky → sun → far ridge → near ridge → the EMG
   "monitor" window → a paper-coloured coastline (palms + Monrovia skyline). As you scroll the
   window rises out of the land while the coast rises faster and swallows it, so the hero
   melts into the page. The headline sits in the sky and drifts away slowest. */

const SIDEBAR = ['Events', 'Media', 'Digital', 'Branding', 'AI & Automation', 'Training', 'Support'];
/* The showreel runs CREATE → CAPTURE → CONNECT: Branding, Digital, AI, Media, Events, Training, Support,
   one scene every 4 s from 0.6 s. Maps the scene playing to its SIDEBAR row. */
const REEL_ORDER = [3, 2, 4, 1, 0, 5, 6];
const reelRow = (t: number) => REEL_ORDER[Math.min(6, Math.max(0, Math.floor((t - 0.2) / 4)))];

function Hero() {
  const ref = useScrollVar<HTMLElement>('pin');
  const ptr = usePointerVars<HTMLDivElement>();
  const reel = useRef<HTMLVideoElement>(null);
  const [row, setRow] = useState(1);
  const [watch, setWatch] = useState(false);
  const closeWatch = useCallback(() => setWatch(false), []);
  useEffect(() => {
    const v = reel.current;
    if (!v) return;
    if (reducedMotion()) return; // poster only; the play button still opens the full film
    v.play().catch(() => {});
    const onTime = () => setRow(reelRow(v.currentTime));
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, []);
  useEffect(() => {
    const v = reel.current;
    if (!v || reducedMotion()) return;
    if (watch) v.pause();
    else v.play().catch(() => {});
  }, [watch]);
  return (
    <section ref={ref} className="relative h-[190vh]" aria-label="Introduction">
      <div
        ref={ptr}
        className="sticky top-0 h-screen overflow-hidden supports-[height:100svh]:h-[100svh]"
        style={{ '--c0': 'clamp(26vh, 40vw, 40vh)', '--q': 'var(--p, 0)', '--w': 'min(1, calc(var(--p, 0) / 0.55))', '--d': 'clamp(0, calc((var(--p, 0) - 0.42) / 0.55), 1)' } as Vars}
      >
        {/* sky */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#f3efe8_0%,#f5e6d4_34%,#f2cdaa_58%,#eaa985_78%,#dc8f6f_100%)]" />
        <div aria-hidden="true" className="ruled absolute inset-0 opacity-60 [mask-image:linear-gradient(#000,transparent_55%)]" />
        {/* sun */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[44%] aspect-square w-[min(56vw,560px)] rounded-full bg-[radial-gradient(circle,#fff1dc_0%,#f7b583_38%,rgba(232,120,80,0.55)_58%,rgba(232,120,80,0)_72%)]"
          style={{ transform: 'translate3d(calc(-50% + var(--px, 0) * -6px), calc(var(--q) * 16vh), 0)' }}
        />

        {/* headline in the sky */}
        <div
          className={`${pad} absolute inset-x-0 top-[calc(84px+3vh)] z-[5] text-center`}
          style={{ transform: 'translate3d(0, calc(var(--w) * -26vh), 0)', opacity: 'calc(1 - var(--w) * 1.6)' }}
        >
          <Reveal className={`${mono} mx-auto mb-6 inline-flex items-center gap-3 border-y border-white/20 py-1.5 text-[10px] text-white/70`}>
            <span className="rec h-2 w-2 rounded-full bg-accent" />
            <span className="tabular-nums">
              REC <Timecode />
            </span>
            <span className="hidden sm:inline">· Liberia · West Africa</span>
            <span aria-hidden="true">·</span>
            <TypedTagline />
          </Reveal>
          <h1 className="display mx-auto max-w-5xl text-[clamp(2.6rem,6.4vw,6.8rem)] leading-[0.95]">
            {/* Screen readers get the plain sentence; the split letters below are visual only. */}
            <span className="sr-only">{HERO_LINES.map((line) => line.map((s) => s.text).join(' ')).join(' ')}</span>
            {HERO_LINES.map((line, li) => (
              <span key={li} className="block" aria-hidden="true">
                {line.map((seg, si) => (
                  <span key={si}>
                    {si > 0 && ' '}
                    <SplitText
                      tag="span"
                      text={seg.text}
                      className={`overflow-visible! ${seg.className ?? ''}`}
                      textAlign="inherit"
                      splitType="chars"
                      delay={25}
                      duration={1.1}
                      ease="expo.out"
                      from={{ opacity: 0, yPercent: 60, rotation: 4 }}
                      to={{ opacity: 1, yPercent: 0, rotation: 0, delay: seg.at }}
                      trigger="load"
                    />
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <Reveal delay={700} className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
            Media, events, digital, branding and AI — one Liberian group, a West African network.
          </Reveal>
        </div>

        {/* far + near ridges */}
        <Ridge
          base={250}
          amp={60}
          seed={1.3}
          fill="#e7b796"
          className="absolute inset-x-0 bottom-[14vh] h-[36vh] w-full"
          style={{ transform: 'translate3d(calc(var(--px, 0) * -10px), calc(var(--w) * -6vh), 0)' }}
        />
        <Ridge
          base={300}
          amp={42}
          seed={2.6}
          fill="#cf9271"
          className="absolute inset-x-0 bottom-[6vh] h-[30vh] w-full"
          style={{ transform: 'translate3d(calc(var(--px, 0) * -18px), calc(var(--w) * -12vh), 0)' }}
        />

        {/* the EMG monitor window */}
        <div
          className="absolute left-1/2 top-0 h-[min(60vh,600px)] w-[min(1080px,92vw)]"
          style={{ transform: 'translate3d(calc(-50% + var(--px, 0) * -24px), calc(60vh - var(--w) * 48vh + var(--py, 0) * -10px), 0)' }}
        >
          <Reveal delay={500} className="h-full">
            <div className="flex h-full flex-col rounded-[16px] bg-ink p-1.5 shadow-[0_50px_100px_-30px_rgba(60,30,10,0.55)] sm:p-2">
              <div className={`${mono} flex h-8 shrink-0 items-center justify-between px-2 text-[9px] text-black/55`}>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-black/25" />
                  <span className="h-2 w-2 rounded-full bg-black/25" />
                  <span className="h-2 w-2 rounded-full bg-black/25" />
                  <span className="ml-3 hidden sm:inline">EMG — showreel.mp4</span>
                </span>
                <span className="flex items-center gap-2 tabular-nums">
                  <span className="rec h-1.5 w-1.5 rounded-full bg-accent-soft" /> <Timecode />
                </span>
              </div>
              <div className="grid min-h-0 flex-1 gap-1.5 sm:gap-2 md:grid-cols-[210px_1fr]">
                <aside className="hidden flex-col gap-1 rounded-[10px] bg-ink-2 p-3 md:flex">
                  <span className="mb-3 h-6 w-24 rounded-full bg-black/10" />
                  {SIDEBAR.map((s, i) => (
                    <span key={s} className={`flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] transition-colors duration-300 ${i === row ? 'bg-black/10 text-black' : 'text-black/55'}`}>
                      <span className={`h-1.5 w-1.5 transition-all duration-300 ${i === row ? 'rounded-full bg-accent-soft' : 'rotate-45 bg-black/30'}`} />
                      {s}
                    </span>
                  ))}
                </aside>
                <div className="relative overflow-hidden rounded-[10px] bg-[radial-gradient(80%_80%_at_50%_30%,#5a3a2c,#1f1712_75%)]">
                  <video
                    ref={reel}
                    src={SHOWREEL_SRC}
                    poster={SHOWREEL_POSTER}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    tabIndex={-1}
                    className="absolute inset-0 h-full w-full object-cover object-[6%_50%] md:object-center"
                  />
                  {/* slim overlay: a soft top scrim and one control bar, so the film itself stays in view */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,19,15,0.62)_0%,rgba(22,19,15,0)_30%),radial-gradient(120%_90%_at_50%_50%,rgba(22,19,15,0)_60%,rgba(22,19,15,0.45)_100%)]" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3 text-black sm:p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setWatch(true)}
                        aria-label="Play the EMG showreel"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-white shadow-lg transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <LensMark size={24} />
                      </button>
                      <span className="hidden min-w-0 sm:block">
                        <span className="block truncate text-sm font-medium tracking-[-0.01em]">Exclusive Multimedia Group</span>
                        <span className={`${mono} block text-[9px] text-black/70`}>7 divisions · 6 countries</span>
                      </span>
                    </div>
                    <Link to="/request-a-proposal" className="shrink-0 rounded-[8px] bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent hover:text-black sm:text-sm">
                      Request a proposal
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* dark coast: palms + Monrovia skyline, in front of the window */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-full"
          style={{ transform: 'translate3d(calc(var(--px, 0) * -26px), calc(-1 * var(--c0) - var(--w) * 18vh - var(--d) * 20vh), 0)' }}
        >
          <Coast fill="#3a2219" className="block h-[40vh] w-full" />
          <div className="h-[60vh] bg-[#3a2219]" />
        </div>
        {/* paper dune: rises last and fastest, swallowing the scene into the page */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full" style={{ transform: 'translate3d(0, calc(var(--d) * -125vh), 0)' }}>
          <Ridge base={120} amp={70} seed={5.1} fill="var(--color-paper)" className="block h-[24vh] w-full" />
          <div className="-mt-px h-[110vh] bg-paper" />
        </div>

        <div className={`absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 ${mono} text-[9px] text-white/60 md:flex`} style={{ opacity: 'calc(1 - var(--q) * 4)' }}>
          ↓ Scroll
        </div>
      </div>
      <ShowreelModal open={watch} onClose={closeWatch} />
    </section>
  );
}

/* ───────── 2 · Crossing film strips ───────── */

function FilmStrips() {
  const ref = useScrollVar<HTMLElement>('through');
  const divs = [...DIVISIONS, ...DIVISIONS];
  const who = [...WHO_WE_SUPPORT, ...WHO_WE_SUPPORT];
  return (
    <section ref={ref} className="relative z-10 -mt-[38vh] overflow-clip pb-20 pt-10 md:pb-28" aria-label="Our divisions">
      {/* back strip */}
      <div className="relative -mx-[5vw] w-[110vw] rotate-[2.2deg] bg-accent py-1.5" style={{ translate: 'calc((var(--p, 0) - 0.5) * 18vw) 0' }}>
        <ul className="emg-marquee-rev flex w-max" style={{ '--mq': '70s' } as Vars} aria-hidden="true">
          {who.map((w, i) => (
            <li key={i} className={`${mono} flex items-center gap-6 whitespace-nowrap px-5 py-2 text-[11px] text-black`}>
              {w} <span className="h-1.5 w-1.5 rotate-45 bg-black" />
            </li>
          ))}
        </ul>
      </div>
      {/* front strip: a real piece of film */}
      <div
        className="relative z-10 -mx-[5vw] -mt-8 w-[110vw] -rotate-[2.5deg] bg-ink shadow-[0_30px_60px_-30px_rgba(22,19,15,0.6)]"
        style={{ translate: 'calc((var(--p, 0) - 0.5) * -14vw) 0' }}
      >
        <div className="sprocket-holes h-[7px] translate-y-2 opacity-90" />
        <ul className="emg-marquee flex w-max py-5" style={{ '--mq': '55s' } as Vars}>
          {divs.map((d, i) => (
            <li key={i} className="flex items-center gap-8 whitespace-nowrap px-8 text-black" aria-hidden={i >= DIVISIONS.length || undefined}>
              <span className={`${mono} text-[10px] text-accent-soft`}>{d.index}</span>
              <span className={`text-[clamp(1.8rem,3.6vw,3.2rem)] leading-none ${i % 2 ? 'serif-i' : 'display'}`}>{d.title}</span>
              <span className="text-accent-soft">✳</span>
            </li>
          ))}
        </ul>
        <div className="sprocket-holes h-[7px] -translate-y-2 opacity-90" />
      </div>
    </section>
  );
}

/* ───────── 3 · Magazine spread ───────── */

function Spread() {
  const ref = useScrollVar<HTMLElement>('through');
  return (
    <section ref={ref} className={`${pad} relative py-20 md:py-32`}>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal className={`${mono} mb-8 flex items-center gap-4 border-t border-white/15 pt-3 text-[10px] text-white/60`}>
            <span className="h-2 w-2 rotate-45 bg-accent" /> Introduction
          </Reveal>
          <Reveal as="h2" className="display text-[clamp(2.3rem,5vw,4.8rem)] leading-[0.98] [text-wrap:balance]">
            Your partner in media, digital and <span className="serif-i text-accent">creative</span> solutions.
          </Reveal>
          <div className="mt-10 grid gap-6 text-white/75 md:grid-cols-2 md:gap-8">
            {HOME.intro.paras.map((p, i) => (
              <ScrubP
                key={i}
                className={`text-[15px] leading-relaxed ${i === 0 ? 'md:col-span-2 text-lg text-white first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-accent sm:text-xl' : ''}`}
              >
                {p}
              </ScrubP>
            ))}
          </div>
          <Reveal delay={450} className="mt-10">
            <Button to="/about" variant="secondary">
              About EMG
            </Button>
          </Reveal>
        </div>

        {/* stacked prints: three depths */}
        <div className="relative h-[460px] sm:h-[540px] lg:col-span-5 lg:h-auto">
          <div className="absolute left-[4%] top-[4%] w-[62%]" style={{ transform: 'translate3d(0, calc((var(--p, 0) - 0.5) * 40px), 0) rotate(-4deg)' }}>
            <Print className="relative aspect-[4/5] w-full" grade="grayscale(1) contrast(1.15)" pos="40% 50%" caption="Monrovia" />
          </div>
          <div className="absolute right-[2%] top-[30%] w-[52%]" style={{ transform: 'translate3d(0, calc((var(--p, 0) - 0.5) * -110px), 0) rotate(5deg)' }}>
            <Print className="relative aspect-[4/5] w-full" grade="sepia(0.55) saturate(1.5)" pos="75% 50%" caption="Accra · Lagos" />
          </div>
          <div className="glass absolute bottom-[2%] left-[10%] max-w-[260px] rounded-[4px] p-5" style={{ transform: 'translate3d(0, calc((var(--p, 0) - 0.5) * -190px), 0) rotate(-2deg)' }}>
            <span className={`${mono} text-[9px] text-accent`}>Field note</span>
            <p className="serif-i mt-2 text-xl leading-snug">“Local knowledge, regional reach — one coordinated team.”</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 4 · Division index with a cursor-following print ───────── */

function DivisionIndex() {
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    const move = (e: PointerEvent) => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return;
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    window.addEventListener('pointermove', move, { passive: true });
    const off = onFrame(() => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      const v = Math.max(-12, Math.min(12, (tx - x) * 0.08));
      const bw = box.current?.offsetWidth ?? 0;
      const px = Math.max(0, Math.min(x + 48, bw - 316));
      if (prev.current) prev.current.style.transform = `translate3d(${px}px, ${y - 190}px, 0) rotate(${v}deg)`;
    });
    return () => {
      window.removeEventListener('pointermove', move);
      off();
    };
  }, []);

  return (
    <section className={`${pad} relative py-24 md:py-32`} aria-labelledby="idx-title">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal className={`${mono} mb-8 flex items-center gap-4 border-t border-white/15 pt-3 text-[10px] text-white/60`}>
            <span className="h-2 w-2 rotate-45 bg-accent" /> Our core services — index
          </Reveal>
          <Reveal as="h2" id="idx-title" className="display text-[clamp(2.3rem,5vw,4.8rem)] leading-[0.98]">
            One group. <span className="serif-i text-accent">Multiple solutions.</span>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <Button to="/services" variant="secondary">
            All services
          </Button>
        </Reveal>
      </div>

      <div ref={box} className="relative" onPointerLeave={() => setActive(-1)}>
        <ul className="border-b border-white/15">
          {DIVISIONS.map((dv, i) => (
            <Reveal as="li" key={dv.slug} delay={i * 60}>
              <Link
                to={`/services/${dv.slug}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(-1)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-t border-white/15 py-5 sm:grid-cols-[3.5rem_1fr_auto] md:py-7"
              >
                <span className={`${mono} text-[11px] transition-colors duration-300 ${active === i ? 'text-accent' : 'text-white/60'}`}>{dv.index}</span>
                <span className="min-w-0">
                  <span
                    className={`block text-[clamp(1.7rem,4.4vw,4.2rem)] leading-[1] transition-all duration-700 ease-[var(--ease-out-expo)] ${
                      active === i ? 'serif-i translate-x-3 text-accent' : 'display'
                    } ${active !== -1 && active !== i ? 'text-white/30' : ''}`}
                  >
                    {dv.title}
                  </span>
                  <span className="mt-2 block max-w-xl text-sm text-white/60 lg:hidden">{dv.summary}</span>
                </span>
                <span className="flex items-center gap-4">
                  <span className={`${mono} hidden text-[10px] text-white/60 sm:inline`}>{dv.subs.length} services</span>
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-[6px] border transition-all duration-500 ${
                      active === i ? 'rotate-45 border-accent bg-accent text-black' : 'border-white/20 text-white'
                    }`}
                  >
                    <ArrowUpRight size={16} />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* floating preview print (pointer devices only) */}
        <div
          ref={prev}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[380px] w-[300px] [@media(pointer:fine)]:lg:block"
        >
          <div className={`h-full w-full transition-all duration-500 ease-[var(--ease-out-expo)] ${active >= 0 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            <div className="sheet relative h-full w-full p-2 pb-14">
              <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(80%_80%_at_50%_30%,#6b4636,#1f1712_80%)]">
              </div>
              <div className="absolute inset-x-3 bottom-3">
                <span className={`${mono} text-[9px] text-accent`}>Division {active >= 0 ? DIVISIONS[active].index : ''}</span>
                <p className="mt-1 line-clamp-1 text-[13px] text-white/70">{active >= 0 ? DIVISIONS[active].headline : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Paragraph that brightens as it passes the reading line ───────── */
function ScrubP({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollVar<HTMLParagraphElement>('through');
  return (
    <p ref={ref} className={className} style={{ opacity: 'clamp(0.18, calc((var(--p, 0) - 0.12) * 4), 1)' }}>
      {children}
    </p>
  );
}

/* ───────── 4b · The deck — alternating sticky cards, each a small diorama ───────── */

const DECK = [
  { slug: 'events-experiences', sky: 'linear-gradient(180deg,#f6eadb,#efc4a2)', back: '#e3b391', grade: 'saturate(1.2)', note: 'Conferences · summits · hybrid' },
  { slug: 'media-production', sky: 'linear-gradient(180deg,#e7ecec,#c4d1d0)', back: '#a9bbb9', grade: 'grayscale(1) contrast(1.2)', note: 'Photo · film · livestream' },
  { slug: 'digital-solutions-technology', sky: 'linear-gradient(180deg,#efd8cb,#c98f8d)', back: '#b77b78', grade: 'sepia(0.5) saturate(1.5)', note: 'Web · platforms · IT' },
  { slug: 'ai-automation-innovation', sky: 'linear-gradient(180deg,#2b2a36,#5d4b58)', back: '#3e3442', grade: 'hue-rotate(160deg) saturate(1.4)', note: 'AI · automation · agents' },
];

function Deck() {
  const ref = useScrollVar<HTMLDivElement>('pin');
  const n = DECK.length;
  return (
    <section className={`${pad} relative pt-24 md:pt-32`} aria-labelledby="deck-title">
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal className={`${mono} mb-8 flex items-center gap-4 border-t border-white/15 pt-3 text-[10px] text-white/60`}>
            <span className="h-2 w-2 rotate-45 bg-accent" /> Inside EMG
          </Reveal>
          <Reveal as="h2" id="deck-title" className="display max-w-3xl text-[clamp(2.3rem,5vw,4.8rem)] leading-[0.98]">
            One place to plan, produce <span className="serif-i text-accent">and launch.</span>
          </Reveal>
        </div>
        <Reveal delay={200} className="max-w-sm text-sm leading-relaxed text-white/60 md:text-right">
          Four of our seven divisions, stacked the way a real project stacks them.
        </Reveal>
      </div>
      <div ref={ref} className="relative">
        {DECK.map((c, i) => {
          const dv = DIVISIONS.find((d) => d.slug === c.slug)!;
          const flip = i % 2 === 1;
          return (
            <article
              key={c.slug}
              className="sheet sticky mb-[12vh] grid overflow-hidden rounded-[18px] last:mb-0 md:min-h-[min(74vh,620px)] md:grid-cols-2"
              style={{
                top: `calc(96px + ${i * 14}px)`,
                transform: `scale(calc(1 - clamp(0, calc(var(--p, 0) * ${n - 1} - ${i}), 1) * 0.05))`,
                transformOrigin: '50% 0%',
              }}
            >
              <div className={`flex flex-col justify-between gap-8 p-7 sm:p-10 ${flip ? 'md:order-2' : ''}`}>
                <span className={`${mono} flex items-center gap-2 text-[10px] text-white/60`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {dv.short}
                </span>
                <div>
                  <h3 className="display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1]">{dv.headline}</h3>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">{dv.summary}</p>
                </div>
                <Link to={`/services/${dv.slug}`} className="group inline-flex items-center gap-3 text-sm text-white/75 hover:text-accent">
                  <span className="grid h-6 w-6 place-items-center border border-white/25 transition-transform duration-500 group-hover:rotate-90">+</span>
                  {dv.subs.length} services — {dv.cta}
                </Link>
              </div>
              {/* mini diorama: sky → back ridge → floating print → front ridge in card colour */}
              <div className={`relative m-2 min-h-[300px] overflow-hidden rounded-[12px] ${flip ? 'md:order-1' : ''}`} style={{ background: c.sky }} aria-hidden="true">
                <Ridge base={260} amp={50} seed={i * 1.7 + 0.4} fill={c.back} className="absolute inset-x-0 bottom-[16%] h-[45%] w-full" />
                <div className="float-y absolute left-1/2 top-[22%] w-[62%] -translate-x-1/2" style={{ animationDelay: `${i * -1.3}s` }}>
                  <div className="rounded-[10px] bg-ink p-1.5 shadow-[0_30px_60px_-20px_rgba(22,19,15,0.6)]">
                    <GlareHover
                      width="100%"
                      borderRadius="6px"
                      borderColor="transparent"
                      background="#1f1712"
                      glareColor="#faf8f4"
                      glareOpacity={0.3}
                      glareAngle={-30}
                      glareSize={60}
                      variant="sheen"
                      rimGlint={false}
                      transitionDuration={900}
                      className="block! w-full"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-[6px] bg-[radial-gradient(80%_80%_at_50%_30%,#6b4636,#1f1712_80%)]">
                      </div>
                    </GlareHover>
                    <div className={`${mono} flex justify-between px-1 pt-1.5 text-[8px] text-black/60`}>
                      <span>{c.note}</span>
                      <span className="text-accent-soft">● REC</span>
                    </div>
                  </div>
                </div>
                <Ridge base={330} amp={26} seed={i * 2.3 + 1.1} fill="var(--color-card)" className="absolute inset-x-0 -bottom-px h-[38%] w-full" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── 5 · How a project moves — sheets dealt onto the table ───────── */

function ProcessDeal() {
  const ref = useScrollVar<HTMLElement>('pin');
  const steps = ABOUT.approach;
  const n = steps.length;
  return (
    <section ref={ref} className="relative h-[320vh]" aria-labelledby="deal-title">
      <div className={`${pad} sticky top-0 flex h-screen flex-col overflow-hidden pt-28 supports-[height:100svh]:h-[100svh] lg:flex-row lg:items-center lg:gap-12 lg:pt-0`}>
        <div className="relative z-10 lg:w-[38%]">
          <span className={`${mono} flex items-center gap-4 border-t border-white/15 pt-3 text-[10px] text-white/60`}>
            <span className="h-2 w-2 rotate-45 bg-accent" /> Our approach
          </span>
          <h2 id="deal-title" className="display mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[0.98]">
            How every project <span className="serif-i text-accent">moves.</span>
          </h2>
          <p className="mt-5 hidden max-w-sm text-sm leading-relaxed text-white/60 sm:block">
            Five steps, one accountable team. Each stage is documented and handed to the next — scroll to deal them out.
          </p>
          <div className="mt-6 flex gap-1.5">
            {steps.map((s, i) => (
              <span key={s.title} className="h-1 flex-1 bg-white/10">
                <span className="block h-full origin-left bg-accent" style={{ transform: `scaleX(clamp(0, calc((var(--p, 0) * 1.25 - ${i * 0.2}) / 0.3), 1))` }} />
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex-1 [perspective:1400px]">
          <div className="relative mx-auto h-[min(58vh,440px)] w-[min(80vw,320px)] [--fan-x:18px] sm:[--fan-x:34px] lg:h-[440px] xl:[--fan-x:60px]">
            {steps.map((s, i) => {
              const k = i - (n - 1) / 2;
              return (
                <article
                  key={s.title}
                  className="sheet absolute inset-0 flex flex-col justify-between rounded-[4px] p-6 sm:p-7"
                  style={
                    {
                      '--s': `clamp(0, calc((var(--p, 0) * 1.25 - ${i * 0.2}) / 0.3), 1)`,
                      zIndex: i,
                      transform: `translate3d(calc((1 - var(--s)) * ${k * 6}vw + var(--s) * ${k} * var(--fan-x)), calc((1 - var(--s)) * 75vh + var(--s) * ${Math.abs(k) * 10}px), 0) rotate(calc((1 - var(--s)) * ${k * 9 + 12}deg + var(--s) * ${k * 4}deg)) rotateX(calc((1 - var(--s)) * 35deg))`,
                      opacity: 'calc(var(--s) * 4)',
                    } as Vars
                  }
                >
                  <div className="flex items-start justify-between">
                    <span className={`${mono} text-[10px] text-white/60`}>
                      Step {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                    </span>
                    <span className="display text-6xl leading-none text-accent">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="display text-4xl leading-none sm:text-5xl">{s.title}.</h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/65">{s.body}</p>
                  </div>
                  {i === n - 1 && (
                    <span className={`${mono} absolute left-6 top-14 rotate-[-8deg] border-2 border-accent bg-card/80 sm:left-7 px-3 py-1 text-[11px] text-accent`}>Delivered ✓</span>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 6 · Why EMG — sticky headline, scrolling ledger ───────── */

function Why() {
  return (
    <section className={`${pad} relative py-24 md:py-32`}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className={`${mono} mb-8 flex items-center gap-4 border-t border-white/15 pt-3 text-[10px] text-white/60`}>
            <span className="h-2 w-2 rotate-45 bg-accent" /> {HOME.why.badge}
          </Reveal>
          <Reveal as="h2" className="display text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[1] [text-wrap:balance]">
            Professional delivery. Regional perspective. <span className="serif-i text-accent">Practical results.</span>
          </Reveal>
        </div>
        <ol>
          {HOME.why.items.map((it, i) => (
            <Reveal as="li" key={it.title} className="spot group grid grid-cols-[4.5rem_1fr] gap-4 border-t border-white/15 py-8 last:border-b sm:grid-cols-[6rem_1fr]">
              <span className="display text-5xl leading-none text-white/15 transition-colors duration-500 group-hover:text-accent sm:text-6xl">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="display text-2xl leading-tight sm:text-3xl">{it.title}</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/60">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── 7 · Network ───────── */

function Network() {
  const ref = useScrollVar<HTMLElement>('through');
  return (
    <section ref={ref} className={`${pad} relative py-24 md:py-32`}>
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <Reveal className={`${mono} mb-8 flex items-center gap-4 border-t border-white/15 pt-3 text-[10px] text-white/60`}>
            <span className="h-2 w-2 rotate-45 bg-accent" /> Regional network
          </Reveal>
          <Reveal as="h2" className="display text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1]">
            Connected across <span className="serif-i text-accent">West Africa.</span>
          </Reveal>
          <ul className="mt-10">
            {NETWORK.map((n, i) => (
              <Reveal as="li" key={n.country} delay={i * 70} className="flex items-baseline justify-between gap-4 border-t border-white/15 py-3.5 last:border-b">
                <span className={`text-2xl sm:text-3xl ${n.hq ? 'serif-i text-accent' : 'display'}`}>{n.country}</span>
                <span className={`${mono} text-[10px] text-white/60`}>{n.hq ? 'HQ · ' : ''}{n.city}</span>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="sheet absolute inset-0 rotate-[3deg] rounded-[4px]" style={{ translate: '0 calc((var(--p, 0) - 0.5) * 50px)' }} />
          <Reveal className="relative">
            <div className="sheet rounded-[4px] p-3" style={{ transform: 'rotate(-1.5deg)', translate: '0 calc((var(--p, 0) - 0.5) * -30px)' }}>
              <NetworkMap />
            </div>
          </Reveal>
          <div className="glass absolute -bottom-6 right-4 rounded-[4px] px-5 py-4" style={{ translate: '0 calc((var(--p, 0) - 0.5) * -120px)' }}>
            <span className="display block text-5xl leading-none">
              6<span className="text-accent">.</span>
            </span>
            <span className={`${mono} text-[9px] text-white/60`}>Countries · one network</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 8 · Work — empty contact sheet ───────── */

function Work() {
  return (
    <Section label="Our work" title={<>Work that speaks <span className="serif-i text-accent">for itself.</span></>} intro={HOME.work.body}>
      <Reveal delay={120} className="mb-8 flex flex-wrap gap-2">
        {WORK.categories.slice(1).map((c) => (
          <Link key={c} to="/work" className={`${mono} rounded-[4px] border border-white/15 px-3 py-2 text-[10px] text-white/70 transition-colors hover:border-accent hover:text-accent`}>
            {c}
          </Link>
        ))}
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.length
          ? PROJECTS.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={160 + i * 100}>
                <article className="sheet rounded-[4px] p-2">
                  <div className="aspect-[4/3] overflow-hidden bg-ink">{p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}</div>
                  <div className="p-4">
                    <span className={`${mono} text-[10px] text-accent`}>{p.category}</span>
                    <h3 className="display mt-2 text-xl">{p.title}</h3>
                  </div>
                </article>
              </Reveal>
            ))
          : ['Featured event', 'Featured film', 'Featured digital project'].map((l, i) => (
              <Reveal key={l} delay={160 + i * 110} className={i === 1 ? 'lg:translate-y-10' : ''}>
                <PendingSlot label={l} note="Add a verified, permission-cleared project in src/data/site.ts → PROJECTS." />
              </Reveal>
            ))}
      </div>
      <Reveal delay={300} className="mt-16">
        <Button to="/work">Explore Our Portfolio</Button>
      </Reveal>
    </Section>
  );
}

/* ───────── 9 · Who we support — pinned paper tags ───────── */

function Support() {
  return (
    <section className={`${pad} relative py-20 md:py-28`} aria-labelledby="sup-title">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal as="h2" id="sup-title" className="display text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1]">
          We <span className="serif-i text-accent">support.</span>
        </Reveal>
        <Reveal delay={150}>
          <Button to="/industries" variant="secondary">
            Industries We Serve
          </Button>
        </Reveal>
      </div>
      <ul className="flex flex-wrap gap-3 sm:gap-4">
        {WHO_WE_SUPPORT.map((w, i) => (
          <Reveal as="li" key={w} delay={i * 70}>
            <span
              className="sheet inline-flex items-center gap-3 rounded-[4px] px-4 py-3 text-base transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:rotate-0 sm:px-5 sm:text-lg"
              style={{ transform: `rotate(${((i % 3) - 1) * 1.6}deg)` }}
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
              {i % 2 ? <span className="serif-i">{w}</span> : w}
            </span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/** Portfolio card (used by the Work page): a mounted print with caption. */
export function ProjectCard({ title, category, location, date, summary, image }: (typeof PROJECTS)[number]) {
  return (
    <article className="sheet group rounded-[4px] p-2">
      {/* React Bits GlareHover: a soft warm paper sheen crosses the photo on hover (off under reduced motion). */}
      <GlareHover
        width="100%"
        height="auto"
        borderRadius="0px"
        borderColor="transparent"
        background="var(--color-ink)"
        glareColor="#faf8f4"
        glareOpacity={0.35}
        glareAngle={-30}
        glareSize={60}
        variant="sheen"
        rimGlint={false}
        transitionDuration={900}
        className="block! aspect-[4/3] w-full"
      >
        {image && <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105" />}
      </GlareHover>
      <div className="p-4">
        <span className={`${mono} text-[10px] text-accent`}>{category}</span>
        <h3 className="display mt-2 text-xl">{title}</h3>
        <p className="mt-1 text-xs text-white/60">
          {location} · {date}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{summary}</p>
      </div>
    </article>
  );
}
