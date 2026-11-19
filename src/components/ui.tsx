/**
 * EMG · Editorial design-system primitives.
 * Material: warm studio paper, stacked sheets and framed film.
 * Type: Fraunces (soft optical serif) for display + Geist for text + Geist Mono for labels.
 * Accent: REC red, used for live signals, focus and the one emphasised word.
 * NB: in this theme the colour token "white" is ink and "black" is paper (see index.css).
 */
import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '../lib/router';
import Magnet from './Magnet';

export const pad = 'px-5 sm:px-8 md:px-12';
export const headline =
  'display leading-[0.95] text-white text-[clamp(2.7rem,7.6vw,7.25rem)] [text-wrap:balance]';
export const headlineMd = 'display leading-[1] text-white text-[clamp(2.2rem,4.6vw,4.25rem)] [text-wrap:balance]';
export const lead = 'text-lg sm:text-xl leading-relaxed text-white/85 font-light';
export const body = 'text-sm sm:text-base leading-relaxed text-white/70';
export const mono = 'font-mono uppercase tracking-[0.14em]';
export const glass = 'glass';

/** Pill badge with a live amber dot. */
export function Badge({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 border-y border-white/20 py-1.5 ${mono} text-[10px] text-white/80`}>
      <span className={`h-2 w-2 ${accent ? 'rec rounded-full bg-accent' : 'rotate-45 bg-white/70'}`} />
      {children}
    </span>
  );
}

/** Mono eyebrow, e.g. "( 01 ) MEDIA PRODUCTION" */
export function Eyebrow({ children, n, className = '' }: { children: ReactNode; n?: string; className?: string }) {
  return (
    <span className={`${mono} inline-flex items-center gap-3 text-[10px] text-white/60 ${className}`}>
      {n && <span className="text-accent">( {n} )</span>}
      {children}
    </span>
  );
}

type BtnProps = { to: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'accent'; size?: 'sm' | 'md'; arrow?: boolean; className?: string };

/** Pill button: label slides up and is replaced by a copy; icon disc rotates on hover. */
export function Button({ to, children, variant = 'primary', size = 'md', arrow, className = '' }: BtnProps) {
  const sizes = size === 'sm' ? 'h-10 pl-4 pr-1.5 text-xs' : 'h-12 pl-5 pr-1.5 text-sm';
  const disc = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const variants = {
    primary: 'bg-white text-black',
    accent: 'bg-accent text-black',
    secondary: 'border border-white/25 bg-transparent text-white hover:border-white',
  } as const;
  const discV = {
    primary: 'bg-black text-white',
    accent: 'bg-black text-accent',
    secondary: 'bg-white text-black',
  } as const;
  const showArrow = arrow ?? true;
  const link = (
    <Link
      to={to}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-[6px] font-medium tracking-[-0.01em] transition-transform duration-500 ease-[var(--ease-out-expo)] active:scale-[0.97] ${sizes} ${
        showArrow ? '' : 'pr-5'
      } ${variants[variant]} ${className}`}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{children}</span>
        <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {showArrow && (
        <span className={`grid shrink-0 place-items-center rounded-[4px] ${disc} ${discV[variant]} transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45`}>
          <ArrowUpRight size={size === 'sm' ? 14 : 16} />
        </span>
      )}
    </Link>
  );
  if (variant === 'secondary') return link;
  // Solid buttons get a subtle magnetic pull (React Bits Magnet). Off for touch and reduced motion.
  return (
    <Magnet padding={48} magnetStrength={5} maxOffset={8}>
      {link}
    </Magnet>
  );
}

/** Numbered index row — hover slides an amber rule in and nudges the title. */
export function IndexRow({
  n,
  title,
  body,
  to,
  last,
  size = 'md',
}: {
  n: string;
  title: string;
  body?: string;
  to?: string;
  last?: boolean;
  size?: 'md' | 'lg';
}) {
  const inner = (
    <>
      <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
      <span className="pt-1.5 font-mono text-[10px] tracking-[0.18em] text-white/60 transition-colors duration-300 group-hover:text-accent">{n}</span>
      <div className="min-w-0 flex-1 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
        <h3 className={`flex items-center gap-2 font-normal tracking-[-0.02em] text-white ${size === 'lg' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
          {title}
          {to && (
            <ArrowUpRight
              size={16}
              className="shrink-0 text-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
            />
          )}
        </h3>
        {body && <p className="mt-1.5 text-sm leading-relaxed text-white/60">{body}</p>}
      </div>
    </>
  );
  const cls = `group relative flex gap-5 py-5 ${last ? '' : 'border-b border-white/10'}`;
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`spot glass rounded-[22px] ${className}`}>{children}</div>;
}

/** List with amber ticks. */
export function TickList({ items, cols = 1 }: { items: string[]; cols?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-8 ${cols === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((it) => (
        <li key={it} className="flex gap-3 border-b border-white/10 py-3 text-sm text-white/80 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
          {it}
        </li>
      ))}
    </ul>
  );
}

/** Placeholder used where verified content is still to come — styled as an empty film frame. */
export function PendingSlot({ label, note }: { label: string; note?: string }) {
  return (
    <div className="spot group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] p-5">
      <div className="pointer-events-none absolute inset-3 rounded-[14px] border border-dashed border-white/10" />
      {/* viewfinder corners */}
      {['left-5 top-5 border-l border-t', 'right-5 top-5 border-r border-t', 'left-5 bottom-5 border-l border-b', 'right-5 bottom-5 border-r border-b'].map((c) => (
        <span key={c} className={`pointer-events-none absolute h-3 w-3 border-white/40 ${c}`} />
      ))}
      <span className={`${mono} relative flex items-center gap-2 pl-3 pt-3 text-[9px] text-white/60`}>
        <span className="rec h-1.5 w-1.5 rounded-full bg-ember" /> Awaiting verified content
      </span>
      <div className="relative px-3 pb-3">
        <p className="text-lg font-light tracking-[-0.02em] text-white/90">{label}</p>
        {note && <p className="mt-1 text-xs leading-relaxed text-white/60">{note}</p>}
      </div>
    </div>
  );
}

export function ExternalHint() {
  return <ArrowUpRight size={14} className="inline text-white/60" />;
}
