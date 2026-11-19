import { NETWORK } from '../data/site';
import { mono } from './ui';

/**
 * Stylised West Africa coastline with EMG's team locations.
 * Copy rule: these are places where team members are based — not offices (brief §14).
 */
export default function NetworkMap() {
  const hq = NETWORK.find((n) => n.hq)!;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-card">
      <svg viewBox="0 0 520 340" className="h-auto w-full" role="img" aria-label="Map of EMG's regional team network in West Africa">
        <defs>
          <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="rgba(22,19,15,0.10)" />
          </pattern>
          <linearGradient id="arc" x1="0" x2="1">
            <stop offset="0" stopColor="#c8381a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#c8381a" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <rect width="520" height="340" fill="url(#dots)" />
        {/* simplified landmass: West African bulge */}
        <path
          d="M10 60 L120 40 L240 30 L380 40 L510 60 L510 230 L470 236 L430 244 L380 250 L330 262 L280 270 L240 282 L200 286 L160 284 L128 276 L104 258 L84 236 L64 208 L48 182 L30 150 L14 110 Z"
          fill="rgba(22,19,15,0.06)"
          stroke="rgba(22,19,15,0.25)"
          strokeWidth="1"
        />
        {/* connection arcs from HQ */}
        {NETWORK.filter((n) => !n.hq).map((n) => {
          const mx = (hq.x + n.x) / 2;
          const my = Math.min(hq.y, n.y) - 50;
          return (
            <path
              key={n.country}
              d={`M${hq.x} ${hq.y} Q${mx} ${my} ${n.x} ${n.y}`}
              fill="none"
              stroke="url(#arc)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          );
        })}
        {NETWORK.map((n) => (
          <g key={n.country}>
            {n.hq && <circle cx={n.x} cy={n.y} r="7" fill="#c8381a" className="emg-pulse" />}
            <circle cx={n.x} cy={n.y} r={n.hq ? 5 : 3.5} fill={n.hq ? '#c8381a' : '#16130f'} />
            <text
              x={n.x + (n.country === 'Guinea' || n.country === 'Sierra Leone' ? 10 : 0)}
              y={n.y + (n.hq ? 24 : n.country === 'Guinea' || n.country === 'Sierra Leone' ? 4 : -12)}
              textAnchor={n.country === 'Guinea' || n.country === 'Sierra Leone' ? 'start' : 'middle'}
              fill={n.hq ? '#c8381a' : 'rgba(22,19,15,0.8)'}
              fontSize="10"
              letterSpacing="1.5"
              style={{ textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
            >
              {n.country}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 px-5 py-3.5">
        <span className={`${mono} flex items-center gap-2 text-[10px] text-white/70`}>
          <span className="h-2 w-2 rounded-full bg-accent" /> Headquarters · Monrovia
        </span>
        <span className={`${mono} flex items-center gap-2 text-[10px] text-white/60`}>
          <span className="h-1.5 w-1.5 rounded-full bg-white" /> Team members based
        </span>
      </div>
    </div>
  );
}
