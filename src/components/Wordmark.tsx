import { LOGO_SRC } from '../assets';

/**
 * EMG lens mark: a ring split into three arcs (Create / Capture / Connect),
 * a play/capture triangle and an amber "REC" node. The arcs counter-rotate on hover.
 */
export function LensMark({ size = 36, spin = false, className = '' }: { size?: number; spin?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" className={`group/mark ${className}`} aria-hidden="true">
      <g className={`origin-center transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:rotate-[120deg] ${spin ? 'spin-slow' : ''}`} style={{ transformBox: 'fill-box' }}>
        <path d="M32 6 A26 26 0 0 1 54.5 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M51.5 49.5 A26 26 0 0 1 12.5 49.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M9.5 45 A26 26 0 0 1 27 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="54.5" cy="45" r="4.2" fill="#C8381A" />
      </g>
      <path d="M26 21.5 L44 32 L26 42.5 Z" fill="currentColor" />
    </svg>
  );
}

/** EMG brand block: lens mark + name + tagline. */
export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group flex items-center gap-3 text-white">
      {LOGO_SRC ? <img src={LOGO_SRC} alt="EMG" className="h-8 w-auto" /> : <LensMark size={34} />}
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[14px] font-medium tracking-[-0.02em]">
            EMG<span className="text-white/60"> · Exclusive Multimedia</span>
          </span>
          <span className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.26em] text-white/60">
            Create <span className="text-accent">/</span> Capture <span className="text-accent">/</span> Connect
          </span>
        </span>
      )}
    </span>
  );
}
