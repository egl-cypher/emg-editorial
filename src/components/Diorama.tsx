/**
 * Procedural landscape silhouettes for the layered hero (AIS-style diorama, West-African coast).
 * All shapes are generated once from deterministic maths — no image assets needed.
 */

/** Smooth ridge line across a 1600-wide viewBox. */
export function ridgePath(base: number, amp: number, seed: number, h = 400) {
  const pts: string[] = [];
  for (let x = 0; x <= 1600; x += 20) {
    const y =
      base -
      amp * (0.55 * Math.sin((x / 1600) * Math.PI * 2.2 + seed) + 0.3 * Math.sin((x / 1600) * Math.PI * 5.3 + seed * 2.1) + 0.15 * Math.sin((x / 1600) * Math.PI * 11 + seed * 3.7));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,${h} L${pts.join(' L')} L1600,${h} Z`;
}

export function Ridge({ base, amp, seed, fill, className = '', style }: { base: number; amp: number; seed: number; fill: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path d={ridgePath(base, amp, seed)} fill={fill} />
    </svg>
  );
}

/** One coconut palm: curved trunk + drooping fronds. */
function Palm({ x, h, lean, s = 1 }: { x: number; h: number; lean: number; s?: number }) {
  const topX = x + lean;
  const topY = 400 - h;
  const fronds = [-150, -115, -80, -40, 0, 40, 80, 115, 150];
  return (
    <g>
      <path
        d={`M${x - 5 * s},400 Q${x + lean * 0.2},${400 - h * 0.5} ${topX - 2 * s},${topY} L${topX + 2 * s},${topY} Q${x + lean * 0.25 + 6 * s},${400 - h * 0.5} ${x + 5 * s},400 Z`}
      />
      {fronds.map((a) => {
        const r = (a * Math.PI) / 180;
        const len = 62 * s;
        const ex = topX + Math.sin(r) * len;
        const ey = topY - Math.cos(r) * len * 0.45 + Math.abs(Math.sin(r)) * 38 * s;
        const cx = topX + Math.sin(r) * len * 0.5;
        const cy = topY - 26 * s;
        return <path key={a} d={`M${topX},${topY} Q${cx},${cy - 20 * s} ${ex},${ey} Q${cx},${cy + 4 * s} ${topX},${topY + 3 * s} Z`} />;
      })}
    </g>
  );
}

/** Foreground: low coast, a Monrovia-style skyline and palms. Drawn in a single fill. */
export function Coast({ fill, className = '', style }: { fill: string; className?: string; style?: React.CSSProperties }) {
  const buildings = [
    [560, 46, 70],
    [612, 30, 104],
    [648, 40, 58],
    [694, 24, 142],
    [722, 52, 84],
    [780, 34, 120],
    [818, 44, 66],
    [868, 28, 96],
    [900, 58, 52],
  ];
  return (
    <svg viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice" className={className} style={style} aria-hidden="true">
      <g fill={fill}>
        <path d={ridgePath(352, 16, 4.2)} />
        {buildings.map(([x, w, h]) => (
          <rect key={x} x={x} y={360 - h} width={w} height={h + 40} />
        ))}
        {/* radio mast */}
        <rect x="705" y="160" width="3" height="80" />
        <Palm x={90} h={250} lean={40} s={1.15} />
        <Palm x={190} h={190} lean={-30} />
        <Palm x={300} h={290} lean={55} s={1.2} />
        <Palm x={420} h={170} lean={-20} s={0.85} />
        <Palm x={1080} h={210} lean={-35} />
        <Palm x={1190} h={300} lean={-60} s={1.25} />
        <Palm x={1320} h={180} lean={30} s={0.9} />
        <Palm x={1450} h={260} lean={-45} s={1.1} />
        <Palm x={1560} h={200} lean={-25} />
      </g>
    </svg>
  );
}
