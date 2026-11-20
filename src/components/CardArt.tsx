/**
 * CardArt: animated, code-drawn designs for the site's framed cards (prints, deck cards, previews).
 * Ten concepts, each its own idea (stage lights, a camera viewfinder, a page assembling, an automation flow,
 * a brand kit, a course, operations, the Monrovia coast, a West Africa route, the EMG orbit).
 *
 * - SVG in a 400x300 box, `slice` so it fills portrait and landscape frames; key content sits in the middle
 *   (x 90–310, y 40–260) so both crops read.
 * - CSS-only motion (classes in index.css, `.art .anim`), running only while the card is on screen,
 *   and fully still under prefers-reduced-motion. Without JS the final frame shows.
 * - Purely decorative: aria-hidden.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export type ArtName = 'stage' | 'viewfinder' | 'browser' | 'flow' | 'brandkit' | 'course' | 'ops' | 'coast' | 'route' | 'orbit';

const DIVISION_ART: Record<string, ArtName> = {
  'events-experiences': 'stage',
  'media-production': 'viewfinder',
  'digital-solutions-technology': 'browser',
  'branding-creative-communications': 'brandkit',
  'ai-automation-innovation': 'flow',
  'training-professional-development': 'course',
  'corporate-business-support': 'ops',
};
export const artForDivision = (slug: string): ArtName => DIVISION_ART[slug] ?? 'orbit';

const P = '#f3efe8'; // paper
const PD = 'rgba(243,239,232,0.35)'; // paper, dim
const A = '#c8381a'; // vermilion
const AS = '#e2603f'; // accent-soft
const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

function useLive<T extends Element>() {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '120px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, live] as const;
}

export default function CardArt({ name, className = '' }: { name: ArtName; className?: string }) {
  const [ref, live] = useLive<HTMLDivElement>();
  const Art = ARTS[name];
  return (
    <div ref={ref} aria-hidden="true" className={`art pointer-events-none absolute inset-0 ${live ? 'is-live' : ''} ${className}`}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Art />
      </svg>
    </div>
  );
}

/* ───────── the ten concepts ───────── */

function Stage() {
  return (
    <g>
      <defs>
        <linearGradient id="beamA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={AS} stopOpacity="0.55" /><stop offset="1" stopColor={AS} stopOpacity="0" /></linearGradient>
        <linearGradient id="beamP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P} stopOpacity="0.35" /><stop offset="1" stopColor={P} stopOpacity="0" /></linearGradient>
      </defs>
      <polygon className="anim art-beam tb-t" points="130,46 152,46 210,235 72,235" fill="url(#beamA)" />
      <polygon className="anim art-beam-r tb-t" points="248,46 270,46 328,235 190,235" fill="url(#beamP)" style={d(-1.4)} />
      <polygon className="anim art-beam tb-t" points="189,46 211,46 250,235 150,235" fill="url(#beamP)" style={d(-2.6)} />
      <path d="M60 44 H340 M60 54 H340" stroke={P} strokeWidth="2" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${60 + i * 20} ${i % 2 ? 44 : 54} L${80 + i * 20} ${i % 2 ? 54 : 44}`} stroke={PD} strokeWidth="1" />)}
      {[141, 200, 259].map((x) => <rect key={x} x={x - 8} y={54} width="16" height="12" rx="3" stroke={P} strokeWidth="1.5" />)}
      <rect x="150" y="130" width="100" height="60" rx="4" stroke={P} strokeWidth="1.5" />
      <path d="M192 148 L192 172 L212 160 Z" fill={A} />
      <ellipse cx="200" cy="214" rx="112" ry="20" stroke={P} strokeWidth="2" />
      <ellipse cx="200" cy="214" rx="96" ry="14" stroke={PD} strokeWidth="1" />
      {[0, 1, 2].map((r) => Array.from({ length: 13 - r }, (_, i) => {
        const x = 80 + r * 10 + i * 20, y = 248 + r * 14;
        return <circle key={`${r}-${i}`} className={(i + r) % 3 === 0 ? 'anim art-twinkle' : ''} style={d(((i * 7 + r * 3) % 10) / 4)} cx={x} cy={y} r="3.4" fill={(i + r) % 3 === 0 ? AS : PD} />;
      }))}
      <g transform="translate(96 74)">
        <rect width="54" height="20" rx="10" fill={A} />
        <circle className="anim art-blink" cx="12" cy="10" r="3.5" fill={P} />
        <text x="21" y="14" fill={P} fontSize="10" fontFamily="Geist Mono, monospace" letterSpacing="1">LIVE</text>
      </g>
    </g>
  );
}

function Viewfinder() {
  return (
    <g>
      {[[96, 52, 1, 1], [304, 52, -1, 1], [96, 248, 1, -1], [304, 248, -1, -1]].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M${x} ${y + sy * 22} V${y} H${x + sx * 22}`} stroke={P} strokeWidth="2.5" />
      ))}
      <path d="M166 52 V248 M234 52 V248 M96 118 H304 M96 182 H304" stroke={PD} strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="200" cy="140" r="26" stroke={P} strokeWidth="1.6" />
      <path d="M152 236 C 156 192, 244 192, 248 236" stroke={P} strokeWidth="1.6" />
      <g className="anim art-focus tb-c">
        {[[176, 116, 1, 1], [224, 116, -1, 1], [176, 168, 1, -1], [224, 168, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M${x} ${y + sy * 10} V${y} H${x + sx * 10}`} stroke={AS} strokeWidth="2" />
        ))}
      </g>
      <circle className="anim art-blink" cx="112" cy="70" r="4.5" fill={A} />
      <text x="122" y="74" fill={P} fontSize="11" fontFamily="Geist Mono, monospace">REC</text>
      <text x="292" y="74" fill={P} fontSize="11" fontFamily="Geist Mono, monospace" textAnchor="end">00:12:48<tspan className="anim art-blink">:</tspan>16</text>
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} className="anim art-meter tb-b" style={{ animationDuration: `${0.6 + (i % 3) * 0.23}s`, ...d(i * 0.11) }} x={110 + i * 7} y={206} width="4" height="26" rx="1" fill={i > 3 ? A : P} />)}
      <g className="anim art-strip">
        {Array.from({ length: 16 }, (_, i) => (
          <g key={i} transform={`translate(${i * 44 - 40} 262)`}>
            <rect width="40" height="26" rx="2" stroke={PD} strokeWidth="1.2" />
            <rect x="5" y="5" width="30" height="16" rx="1" fill={i % 3 === 1 ? 'rgba(200,56,26,0.45)' : 'rgba(243,239,232,0.12)'} />
          </g>
        ))}
      </g>
    </g>
  );
}

function Browser() {
  const seq = (i: number) => ({ className: 'anim art-build', style: d(i * 0.35) });
  return (
    <g>
      <rect x="92" y="56" width="216" height="170" rx="8" stroke={P} strokeWidth="2" />
      <path d="M92 76 H308" stroke={PD} strokeWidth="1.2" />
      {[104, 114, 124].map((x, i) => <circle key={x} cx={x} cy="66" r="3" fill={i === 0 ? A : PD} />)}
      <rect x="142" y="61" width="110" height="10" rx="5" stroke={PD} strokeWidth="1" />
      <rect {...seq(0)} x="104" y="86" width="118" height="62" rx="4" fill="rgba(243,239,232,0.10)" stroke={P} strokeWidth="1.2" />
      <path className="anim art-draw" d="M110 136 L130 128 L146 132 L164 116 L184 120 L210 98" stroke={AS} strokeWidth="2" pathLength={1} strokeDasharray="1" />
      <rect {...seq(1)} x="230" y="88" width="66" height="8" rx="2" fill={P} />
      <rect {...seq(1.4)} x="230" y="104" width="54" height="6" rx="2" fill={PD} />
      <rect {...seq(1.8)} x="230" y="118" width="44" height="6" rx="2" fill={PD} />
      <rect {...seq(2.2)} x="230" y="132" width="40" height="14" rx="7" fill={A} />
      {[0, 1, 2].map((i) => <rect key={i} {...seq(2.6 + i * 0.3)} x={104 + i * 66} y="158" width="58" height="56" rx="4" stroke={PD} strokeWidth="1.2" fill="rgba(243,239,232,0.06)" />)}
      <rect x="292" y="118" width="54" height="100" rx="10" fill="#1f1712" stroke={P} strokeWidth="1.8" />
      <rect {...seq(1.2)} x="300" y="134" width="38" height="24" rx="3" fill="rgba(243,239,232,0.12)" />
      <rect {...seq(1.6)} x="300" y="166" width="30" height="5" rx="2" fill={PD} />
      <rect {...seq(2.0)} x="300" y="178" width="34" height="10" rx="5" fill={A} />
      <g className="anim art-cursor">
        <path d="M0 0 L0 20 L5 15 L9 24 L13 22 L9 13 L16 13 Z" fill={P} stroke="#1f1712" strokeWidth="1" />
      </g>
      <circle className="anim art-click tb-c" cx="250" cy="139" r="10" stroke={AS} strokeWidth="1.6" />
    </g>
  );
}

function Flow() {
  const node = (x: number, y: number, label: string, hot = false) => (
    <g transform={`translate(${x - 30} ${y - 15})`}>
      <rect width="60" height="30" rx="8" fill={hot ? A : '#1f1712'} stroke={hot ? AS : P} strokeWidth="1.6" />
      <text x="30" y="19" fill={P} fontSize="9.5" fontFamily="Geist Mono, monospace" textAnchor="middle" letterSpacing="0.8">{label}</text>
    </g>
  );
  const links = ['M135 150 C 155 150, 160 150, 170 150', 'M230 150 C 250 150, 250 104, 270 104', 'M230 150 C 250 150, 250 196, 270 196'];
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => Array.from({ length: 7 }, (_, j) => <circle key={`${i}-${j}`} cx={70 + i * 33} cy={46 + j * 36} r="1.2" fill={PD} />))}
      {links.map((p, i) => <path key={i} d={p} stroke={PD} strokeWidth="1.6" />)}
      <path d="M300 104 C 318 104, 318 150, 300 150 M300 196 C 318 196, 318 150, 300 150" stroke={PD} strokeWidth="1.6" transform="translate(0 0)" />
      {links.map((p, i) => <circle key={i} className="anim art-travel" style={{ offsetPath: `path('${p}')`, ...d(i * 0.6) } as CSSProperties} r="3.5" fill={AS} />)}
      {node(105, 150, 'INPUT')}
      <circle className="anim art-ping tb-c" cx="200" cy="150" r="22" stroke={AS} strokeWidth="1.4" />
      {node(200, 150, 'AI', true)}
      {node(270, 104, 'TASK')}
      {node(270, 196, 'TASK')}
      <g transform="translate(322 136)"><circle cx="14" cy="14" r="14" fill="#1f1712" stroke={P} strokeWidth="1.6" /><path d="M8 14 L12 18 L20 10" stroke={AS} strokeWidth="2.2" /></g>
      <g transform="translate(150 62)">
        <rect width="100" height="30" rx="15" fill="rgba(243,239,232,0.10)" stroke={PD} strokeWidth="1.2" />
        {[0, 1, 2].map((i) => <circle key={i} className="anim art-type" style={d(i * 0.18)} cx={36 + i * 14} cy="15" r="3.2" fill={P} />)}
      </g>
    </g>
  );
}

function Brandkit() {
  return (
    <g>
      <g className="anim art-spin tb-c">
        <circle cx="160" cy="146" r="66" stroke={P} strokeWidth="1.6" strokeDasharray="2 7" />
      </g>
      <circle cx="160" cy="146" r="52" stroke={P} strokeWidth="2" />
      <path d="M138 118 H184 V128 H150 V141 H178 V151 H150 V164 H184 V174 H138 Z" stroke={P} strokeWidth="2" />
      {[P, A, '#1f1712'].map((c, i) => (
        <rect key={i} className="anim art-fan tb-bl" style={{ ...d(i * 0.15), ['--r' as string]: `${(i - 1) * 12}deg` } as CSSProperties} x="250" y="98" width="44" height="78" rx="6" fill={c} stroke={P} strokeWidth="1.4" />
      ))}
      <text className="anim art-wght" x="248" y="232" fill={P} fontSize="44" fontFamily="Fraunces, serif">Aa</text>
      <path d="M100 236 C 130 200, 170 260, 214 222" stroke={AS} strokeWidth="2" />
      {[[100, 236], [214, 222]].map(([x, y], i) => <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill="#1f1712" stroke={P} strokeWidth="1.4" />)}
      <path d="M100 236 L122 206 M214 222 L196 252" stroke={PD} strokeWidth="1" />
      {[[122, 206], [196, 252]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={AS} />)}
    </g>
  );
}

function Course() {
  return (
    <g>
      <circle cx="150" cy="122" r="46" stroke={PD} strokeWidth="8" />
      <circle className="anim art-ring" cx="150" cy="122" r="46" stroke={A} strokeWidth="8" pathLength={1} strokeDasharray="1" transform="rotate(-90 150 122)" />
      <path d="M126 118 L150 106 L174 118 L150 130 Z M136 123 V134 C 144 140, 156 140, 164 134 V123" stroke={P} strokeWidth="1.8" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(214 ${82 + i * 30})`}>
          <rect width="18" height="18" rx="4" stroke={P} strokeWidth="1.6" />
          <path className="anim art-tick" style={d(i * 0.6)} d="M4 9 L8 13 L14 5" stroke={AS} strokeWidth="2.2" pathLength={1} strokeDasharray="1" />
          <rect x="28" y="6" width={70 - i * 12} height="6" rx="3" fill={PD} />
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} className="anim art-rise tb-b" style={d(i * 0.2)} x={110 + i * 22} y={248 - (i + 1) * 12} width="14" height={(i + 1) * 12} rx="2" fill={i === 4 ? A : P} />)}
      <path d="M100 248 H330" stroke={PD} strokeWidth="1.2" />
      <g transform="translate(236 186)">
        <rect width="84" height="56" rx="4" stroke={P} strokeWidth="1.6" />
        <rect x="12" y="12" width="44" height="5" rx="2" fill={PD} />
        <rect x="12" y="24" width="32" height="5" rx="2" fill={PD} />
        <circle cx="66" cy="40" r="9" fill={A} />
        <path d="M61 47 L58 58 L66 54 L74 58 L71 47" fill={A} />
      </g>
    </g>
  );
}

function Ops() {
  return (
    <g>
      {['To do', 'Doing', 'Done'].map((c, i) => (
        <g key={c} transform={`translate(${96 + i * 72} 56)`}>
          <rect width="64" height="128" rx="6" stroke={PD} strokeWidth="1.2" />
          <text x="8" y="16" fill={PD} fontSize="8.5" fontFamily="Geist Mono, monospace" letterSpacing="0.6">{c.toUpperCase()}</text>
          <rect x="7" y={i === 2 ? 26 : 70} width="50" height="22" rx="4" fill="rgba(243,239,232,0.10)" stroke={PD} strokeWidth="1" />
        </g>
      ))}
      <g className="anim art-kanban">
        <rect x="103" y="82" width="50" height="22" rx="4" fill={A} />
        <rect x="111" y="90" width="26" height="5" rx="2" fill={P} />
      </g>
      {Array.from({ length: 28 }, (_, i) => (
        <rect key={i} className={i === 17 ? 'anim art-blink' : ''} x={96 + (i % 7) * 16} y={198 + Math.floor(i / 7) * 13} width="12" height="9" rx="2" fill={i === 17 ? A : i % 5 === 0 ? P : 'rgba(243,239,232,0.18)'} />
      ))}
      {Array.from({ length: 18 }, (_, i) => <rect key={i} className="anim art-meter tb-b" style={{ animationDuration: `${1.4 + (i % 4) * 0.3}s`, ...d(i * 0.07) }} x={218 + i * 5.2} y={206} width="3" height="40" rx="1" fill={i === 11 ? A : P} opacity={0.85} />)}
      <g transform="translate(280 196) scale(0.9)">
        <path d="M22 0 L42 8 V22 C 42 36, 32 44, 22 48 C 12 44, 2 36, 2 22 V8 Z" fill="#1f1712" stroke={P} strokeWidth="1.8" />
        <path d="M13 24 L20 31 L32 18" stroke={AS} strokeWidth="2.4" />
      </g>
    </g>
  );
}

function Coast() {
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1c15" /><stop offset="1" stopColor="#7a3a24" /></linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6c08a" /><stop offset="1" stopColor={AS} /></linearGradient>
        <clipPath id="sunclip"><rect x="0" y="0" width="400" height="196" /></clipPath>
      </defs>
      <rect width="400" height="300" fill="url(#sky)" />
      <g clipPath="url(#sunclip)">
        <g className="anim art-sun">
          <circle cx="200" cy="170" r="58" fill="url(#sun)" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="130" y={168 + i * 9} width="140" height={2 + i * 1.2} fill="#5a2a1a" />)}
        </g>
      </g>
      <path d="M86 196 V176 H98 V168 H110 V184 H122 V150 H130 V140 H134 V150 H140 V184 H152 V172 H168 V196" fill="#1f1712" />
      <path d="M232 196 V180 H246 V160 H262 V176 H272 V166 H288 V196" fill="#1f1712" />
      {[[110, 1], [296, -1]].map(([x, s], i) => (
        <g key={i} transform={`translate(${x} 196) scale(${s} 1)`}>
          <path d="M0 0 C 2 -30, 8 -56, 18 -80" stroke="#1f1712" strokeWidth="4" />
          <path d="M18 -80 C 4 -86, -10 -82, -18 -70 M18 -80 C 30 -90, 44 -88, 52 -76 M18 -80 C 14 -96, 22 -104, 34 -106 M18 -80 C 8 -94, -4 -98, -12 -94" stroke="#1f1712" strokeWidth="5" />
        </g>
      ))}
      <rect y="196" width="400" height="104" fill="#3a2219" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} className="anim art-shimmer" style={d(i * 0.4)} x={150 + (i % 3) * 18 - i * 4} y={206 + i * 12} width={100 - i * 10} height="2" rx="1" fill="#f6c08a" opacity="0.6" />)}
    </g>
  );
}

function Route() {
  const coast = 'M60 92 C 84 110, 96 140, 120 156 C 150 176, 190 184, 230 182 C 270 180, 300 176, 340 184';
  const arc = 'M126 160 Q 190 76, 268 178';
  return (
    <g>
      {Array.from({ length: 34 }, (_, i) => {
        const t = i / 33;
        const x = 60 + t * 280, y = 92 + Math.sin(t * Math.PI * 0.9) * 74 + (t > 0.6 ? (t - 0.6) * 40 : 0);
        return <circle key={i} cx={x} cy={y} r="1.6" fill={PD} />;
      })}
      <path d={coast} stroke={PD} strokeWidth="1" strokeDasharray="1 5" />
      <path className="anim art-draw" d={arc} stroke={AS} strokeWidth="2" strokeDasharray="1" pathLength={1} />
      <path d={arc} stroke={PD} strokeWidth="1" strokeDasharray="3 5" />
      <g className="anim art-travel" style={{ offsetPath: `path('${arc}')`, offsetRotate: 'auto' } as CSSProperties}>
        <path d="M-7 -4 L7 0 L-7 4 L-4 0 Z" fill={P} />
      </g>
      {[[126, 160, 'MONROVIA'], [210, 182, 'ACCRA'], [268, 178, 'LAGOS']].map(([x, y, n], i) => (
        <g key={n as string}>
          <circle className="anim art-ping tb-c" style={d(i * 0.5)} cx={x as number} cy={y as number} r="10" stroke={AS} strokeWidth="1.2" />
          <circle cx={x as number} cy={y as number} r="4" fill={i === 0 ? A : P} />
          <text x={x as number} y={(y as number) + 22} fill={P} fontSize="9" fontFamily="Geist Mono, monospace" textAnchor="middle" letterSpacing="1">{n}</text>
        </g>
      ))}
      <path d="M96 236 H304" stroke={PD} strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={96 + i * 54} y={246} width="44" height="6" rx="3" fill={i === 1 ? A : 'rgba(243,239,232,0.18)'} />)}
    </g>
  );
}

function Orbit() {
  return (
    <g>
      <ellipse cx="200" cy="150" rx="118" ry="44" stroke={PD} strokeWidth="1" transform="rotate(-18 200 150)" />
      <ellipse cx="200" cy="150" rx="96" ry="34" stroke={PD} strokeWidth="1" transform="rotate(24 200 150)" />
      <g transform="rotate(-18 200 150)">
        <g transform="translate(200 150) scale(1 0.373)">
          <g className="anim art-spin-slow">
            {[0, 1, 2, 3].map((i) => { const a = (i / 4) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 118} cy={Math.sin(a) * 118} r={i === 0 ? 7 : 5} fill={i === 0 ? A : P} />; })}
          </g>
        </g>
      </g>
      <g transform="rotate(24 200 150)">
        <g transform="translate(200 150) scale(1 0.354)">
          <g className="anim art-spin-rev">
            {[0, 1, 2].map((i) => { const a = (i / 3) * Math.PI * 2 + 0.6; return <circle key={i} cx={Math.cos(a) * 96} cy={Math.sin(a) * 96} r="5" fill={i === 1 ? AS : P} />; })}
          </g>
        </g>
      </g>
      <circle cx="200" cy="150" r="40" fill="#1f1712" stroke={P} strokeWidth="2" />
      <path d="M184 128 H218 V136 H193 V146 H214 V154 H193 V164 H218 V172 H184 Z" stroke={P} strokeWidth="1.8" />
      <circle className="anim art-ping tb-c" cx="200" cy="150" r="48" stroke={AS} strokeWidth="1.2" />
    </g>
  );
}

const ARTS: Record<ArtName, () => ReactNode> = { stage: Stage, viewfinder: Viewfinder, browser: Browser, flow: Flow, brandkit: Brandkit, course: Course, ops: Ops, coast: Coast, route: Route, orbit: Orbit };

/* ───────── process steps (on light paper sheets: ink + vermilion) ───────── */

const I = '#16130f';
const ID = 'rgba(22,19,15,0.25)';

export function StepArt({ step }: { step: number }) {
  const [ref, live] = useLive<HTMLDivElement>();
  const art = [
    <g key="u">
      <rect x="20" y="16" width="96" height="40" rx="12" stroke={I} strokeWidth="1.8" />
      <path d="M40 56 L36 68 L52 56" stroke={I} strokeWidth="1.8" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} className="anim art-meter tb-c" style={{ animationDuration: `${0.7 + (i % 3) * 0.25}s`, ...d(i * 0.08) }} x={32 + i * 9} y={28} width="4" height="16" rx="2" fill={i % 3 ? I : A} />)}
      <rect x="132" y="40" width="84" height="34" rx="12" fill={A} />
      {[0, 1, 2].map((i) => <circle key={i} className="anim art-type" style={d(i * 0.18)} cx={158 + i * 16} cy="57" r="3.5" fill="#f3efe8" />)}
    </g>,
    <g key="p">
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${20 + i * 55} 12 V84`} stroke={ID} strokeWidth="1" />)}
      {[[20, 70], [60, 80], [110, 70], [150, 56]].map(([x, w], i) => <rect key={i} className="anim art-grow tb-l" style={d(i * 0.3)} x={x} y={18 + i * 16} width={w} height="9" rx="4" fill={i === 3 ? A : I} />)}
      <path d="M216 74 L224 66 L232 74 L224 82 Z" fill={A} />
    </g>,
    <g key="c">
      <path className="anim art-draw" d="M20 70 C 50 10, 90 90, 130 30 S 200 60, 226 24" stroke={A} strokeWidth="2.4" pathLength={1} strokeDasharray="1" />
      <circle className="anim art-pop tb-c" style={d(0.2)} cx="60" cy="74" r="12" stroke={I} strokeWidth="1.8" />
      <rect className="anim art-pop tb-c" style={d(0.5)} x="112" y="60" width="22" height="22" stroke={I} strokeWidth="1.8" />
      <path className="anim art-pop tb-c" style={d(0.8)} d="M176 84 L190 60 L204 84 Z" stroke={I} strokeWidth="1.8" />
    </g>,
    <g key="d">
      <path d="M30 70 H200" stroke={ID} strokeWidth="1.6" strokeDasharray="4 6" />
      <g className="anim art-deliver">
        <rect x="0" y="-22" width="34" height="28" rx="3" fill="#f3efe8" stroke={I} strokeWidth="1.8" transform="translate(20 62)" />
        <path d="M20 47 L37 40 L54 47" stroke={I} strokeWidth="1.8" />
      </g>
      <path d="M210 70 V22" stroke={I} strokeWidth="1.8" />
      <path d="M210 22 L232 30 L210 38 Z" fill={A} />
      <circle cx="210" cy="70" r="4" fill={I} />
    </g>,
    <g key="i">
      <g className="anim art-spin tb-c">
        <path d="M70 22 A 28 28 0 1 1 44 40" stroke={I} strokeWidth="2" />
        <path d="M40 30 L44 41 L54 36" stroke={I} strokeWidth="2" />
      </g>
      <path className="anim art-draw" d="M120 76 L142 64 L160 68 L180 46 L200 50 L226 20" stroke={A} strokeWidth="2.4" pathLength={1} strokeDasharray="1" />
      <path d="M218 20 L226 20 L226 28" stroke={A} strokeWidth="2.4" />
      <path d="M116 84 H232" stroke={ID} strokeWidth="1.2" />
    </g>,
  ][step];
  return (
    <div ref={ref} aria-hidden="true" className={`art pointer-events-none ${live ? 'is-live' : ''}`}>
      <svg viewBox="0 0 250 92" className="h-auto w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">{art}</svg>
    </div>
  );
}
