import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from '../lib/router';
import { NAV, DIVISIONS } from '../data/site';
import Reveal from './Reveal';
import Wordmark from './Wordmark';
import { mono } from './ui';
import { getLenis } from '../lib/motion';

export default function Navbar() {
  const { path } = useLocation();
  const [open, setOpen] = useState<string | null>(null); // desktop dropdown
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [path]);

  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // tuck away while reading down, return on any upward scroll
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 400);
        lastY = y;
      }
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    if (mobile) getLenis()?.stop();
    else getLenis()?.start();
  }, [mobile]);

  const active = (to: string) => (to === '/' ? path === '/' : path.startsWith(to));
  const enter = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full px-3 pt-3 transition-transform duration-700 ease-[var(--ease-out-expo)] sm:px-5 ${
        hidden && !open && !mobile ? '-translate-y-[130%]' : ''
      }`}
    >
      <nav
        className={`mx-auto flex max-w-[1440px] items-center justify-between gap-6 rounded-[14px] border py-2 pl-4 pr-2 transition-all duration-700 ease-[var(--ease-out-expo)] sm:pl-5 ${
          scrolled || open || mobile
            ? 'border-white/10 bg-card shadow-[0_18px_40px_-24px_rgba(22,19,15,0.35)]'
            : 'border-transparent bg-transparent'
        }`}
        aria-label="Main"
      >
        <Reveal delay={0}>
          <Link to="/" aria-label="EMG home">
            <Wordmark />
          </Link>
        </Reveal>

        <ul className="hidden items-center gap-6 xl:flex 2xl:gap-8">
          {NAV.map((item, i) => {
            const hasMenu = item.label === 'About EMG' || item.label === 'Our Services';
            return (
              <Reveal
                as="li"
                key={item.label}
                delay={100 + i * 70}
                className="relative"
              >
                <div onMouseEnter={() => hasMenu && enter(item.label)} onMouseLeave={() => hasMenu && leave()}>
                  <Link
                    to={item.to}
                    aria-haspopup={hasMenu || undefined}
                    aria-expanded={hasMenu ? open === item.label : undefined}
                    onFocus={() => hasMenu && enter(item.label)}
                    className={`relative flex items-center gap-1 py-2 text-sm transition-colors duration-300 hover:text-white ${
                      active(item.to) ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {item.label}
                    {item.label === 'Our Services' && (
                      <sup className="font-mono text-[10px] text-white/60">{DIVISIONS.length}</sup>
                    )}
                    {hasMenu && (
                      <ChevronDown
                        size={13}
                        className={`text-white/60 transition-transform duration-300 ${open === item.label ? 'rotate-180' : ''}`}
                      />
                    )}
                    {active(item.to) && <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent " />}
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Reveal delay={600}>
            <Link
              to="/request-a-proposal"
              className="hidden h-10 items-center rounded-[8px] bg-white px-5 text-[13px] font-medium tracking-[-0.01em] text-black transition-colors duration-300 hover:bg-accent hover:text-black sm:inline-flex"
            >
              Request a Proposal
            </Link>
          </Reveal>
          <button
            type="button"
            onClick={() => setMobile((m) => !m)}
            aria-label={mobile ? 'Close menu' : 'Open menu'}
            aria-expanded={mobile}
            className="grid h-11 w-11 place-items-center rounded-[10px] border border-white/15 bg-card xl:hidden"
          >
            {mobile ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Desktop dropdowns */}
      <div
        onMouseEnter={() => window.clearTimeout(closeTimer.current)}
        onMouseLeave={leave}
        className={`absolute inset-x-5 top-full mx-auto mt-2 hidden max-w-[1440px] overflow-hidden rounded-[18px] border border-white/10 bg-card shadow-[0_40px_80px_-30px_rgba(22,19,15,0.4)] transition-all duration-500 ease-[var(--ease-out-expo)] xl:block ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        {open === 'Our Services' && <ServicesMenu />}
        {open === 'About EMG' && <AboutMenu />}
      </div>

      {/* Mobile menu */}
      <div
        data-lenis-prevent
        className={`fixed inset-x-3 bottom-3 top-[76px] overflow-y-auto rounded-[18px] border border-white/10 bg-card transition-all duration-500 ease-[var(--ease-out-expo)] xl:hidden ${
          mobile ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
        }`}
      >
        <ul className="px-5 py-6 sm:px-8">
          {NAV.map((item, i) => (
            <li key={item.label} className="border-b border-white/10">
              <Link to={item.to} className="flex items-center gap-4 py-4 text-2xl text-white">
                <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </Link>
              {item.label === 'Our Services' && (
                <ul className="grid gap-1 pb-4 pl-10">
                  {DIVISIONS.map((dv) => (
                    <li key={dv.slug}>
                      <Link to={`/services/${dv.slug}`} className="block py-1.5 text-sm text-white/70">
                        {dv.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="px-5 pb-28 sm:px-8">
          <Link
            to="/request-a-proposal"
            className="flex items-center justify-center gap-1 rounded-full bg-white py-3.5 text-sm font-medium text-black"
          >
            Request a Proposal <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function ServicesMenu() {
  return (
    <div className="grid grid-cols-[1fr_2.2fr] gap-10 px-12 py-8">
      <div className="flex flex-col justify-between border-r border-white/10 pr-10">
        <div>
          <span className={`${mono} text-[10px] text-accent`}>Our Services</span>
          <p className="mt-3 text-2xl leading-snug text-white">One Group. Multiple Solutions.</p>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Seven service divisions. Engage us for one assignment or combine services under one coordinated project.
          </p>
        </div>
        <Link to="/services" className="mt-6 inline-flex items-center gap-1 text-sm text-white hover:text-accent">
          View All Services <ChevronRight size={14} />
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-10">
        {DIVISIONS.map((dv) => (
          <li key={dv.slug}>
            <Link to={`/services/${dv.slug}`} className="group flex gap-4 border-b border-white/10 py-3.5">
              <span className="pt-0.5 font-mono text-[11px] tracking-[0.15em] text-white/60 group-hover:text-accent">
                {dv.index}
              </span>
              <span>
                <span className="flex items-center gap-1 text-[15px] text-white">
                  {dv.title}
                  <ChevronRight size={14} className="text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-white" />
                </span>
                <span className="mt-0.5 block text-xs text-white/60">
                  {dv.subs
                    .slice(0, 3)
                    .map((s) => s.title)
                    .join(' · ')}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AboutMenu() {
  const about = NAV.find((n) => n.label === 'About EMG')!;
  return (
    <div className="grid grid-cols-[1fr_2.2fr] gap-10 px-12 py-8">
      <div className="border-r border-white/10 pr-10">
        <span className={`${mono} text-[10px] text-accent`}>About EMG</span>
        <p className="mt-3 text-2xl leading-snug text-white">A Liberian Company. A Regional Network.</p>
      </div>
      <ul className="grid grid-cols-3 gap-x-10">
        {about.children!.map((c, i) => (
          <li key={c.label}>
            <Link to={c.to} className="group flex items-center gap-4 border-b border-white/10 py-4 text-[15px] text-white">
              <span className="font-mono text-[11px] tracking-[0.15em] text-white/60 group-hover:text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
