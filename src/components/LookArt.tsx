import type { Look } from "@/lib/data";

// Deterministic PRNG so server + client render identical art.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const W = 300, H = 400;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Where the sides fade from full hair to bare skin, per cut.
const FADE: Record<Look["kind"], [number, number]> = {
  skin: [128, 176],
  mid: [135, 205],
  low: [152, 238],
  crop: [135, 195],
  top: [128, 182],
  beard: [140, 200],
};
const TOP_LEN: Record<Look["kind"], number> = { skin: 11, mid: 10, low: 9, crop: 7, top: 26, beard: 8 };

/** Procedural cut illustration (stubble that fades to skin); stand-in until real photos are uploaded. */
export default function LookArt({ look, muted = false, className = "" }: { look: Look; muted?: boolean; className?: string }) {
  const r = rng(look.seed);
  const [hair, skin, accent] = look.palette;
  const kind = look.kind;
  const [f0, f1] = FADE[kind];
  const cx = 150, cy = 196, rx = 84, ry = 108;
  const topExtra = kind === "top" ? 34 : kind === "crop" ? 4 : 10;

  const ticks: { x1: number; y1: number; x2: number; y2: number; o: number; w: number }[] = [];
  for (let y = 40; y < 340; y += 4.2) {
    for (let x = 40; x < 260; x += 4.2) {
      const px = x + (r() - 0.5) * 4, py = y + (r() - 0.5) * 4;
      const nx = (px - cx) / rx, ny = (py - cy) / ry;
      const inHead = nx * nx + ny * ny < 1;
      const inVolume = (px - cx) ** 2 / (rx + 6) ** 2 + (py - (cy - topExtra * 0.5)) ** 2 / (ry + topExtra) ** 2 < 1;
      let d = 0;
      let len = 6;
      if (py < 138 && inVolume) {
        // the top
        d = 1;
        len = TOP_LEN[kind] + r() * 4;
        if (kind === "top" && py < 120) len += r() * 6;
      } else if (inHead && Math.abs(px - cx) > 52 && py >= 138 && py < 250) {
        // the sides: fade out downward
        d = 1 - smooth(f0, f1, py);
        len = 2 + d * 9;
      } else if (kind === "beard" && inHead && py > 196) {
        // beard: dense at the jaw, fading toward the cheeks and lip
        const jaw = smooth(206, 262, py);
        const mask = Math.abs(px - cx) < 82 - (py - 196) * 0.35 ? 1 : 0;
        d = jaw * mask * (py > 232 || Math.abs(px - cx) > 20 ? 1 : 0.35);
        len = 4 + d * 7;
      }
      if (d <= 0 || r() > d * 1.05) continue;
      const a = (r() - 0.5) * 0.7 + 0.1;
      ticks.push({ x1: px, y1: py, x2: px + Math.sin(a) * len, y2: py - Math.cos(a) * len, o: 0.25 + d * 0.65, w: 0.9 + d * 0.5 });
    }
  }

  const id = `la-${look.id}${muted ? "-m" : ""}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={muted ? { filter: "saturate(0.2) brightness(0.8) contrast(0.9)" } : undefined}
      role="img"
      aria-label={`${look.title} — illustrative preview`}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a4d57" />
          <stop offset="1" stopColor="#2a2c33" />
        </linearGradient>
        <radialGradient id={`${id}-skin`} cx="0.42" cy="0.38" r="0.75">
          <stop offset="0" stopColor={skin} />
          <stop offset="1" stopColor={skin} stopOpacity="0.72" />
        </radialGradient>
        <linearGradient id={`${id}-stripe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      {/* diagonal brand stripe */}
      <polygon points="-20,300 140,-20 190,-20 -20,360" fill={`url(#${id}-stripe)`} opacity="0.5" />
      {/* neck + shoulders */}
      <path d="M96 318 Q150 300 204 318 L230 400 L70 400 Z" fill={skin} opacity="0.78" />
      <rect x="116" y="290" width="68" height="40" rx="18" fill={skin} opacity="0.85" />
      {/* ears */}
      <ellipse cx={cx - rx + 2} cy={cy + 6} rx="9" ry="20" fill={skin} />
      <ellipse cx={cx + rx - 2} cy={cy + 6} rx="9" ry="20" fill={skin} />
      {/* head */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-skin)`} />
      {/* shades */}
      <g>
        <rect x={cx - 52} y={cy - 12} width="46" height="24" rx="9" fill="#0b0b0d" />
        <rect x={cx + 6} y={cy - 12} width="46" height="24" rx="9" fill="#0b0b0d" />
        <rect x={cx - 8} y={cy - 6} width="16" height="4" rx="2" fill="#0b0b0d" />
        <path d={`M${cx - 46} ${cy - 8}l16 -3`} stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        <path d={`M${cx + 12} ${cy - 8}l16 -3`} stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* the hair */}
      <g fill="none" strokeLinecap="round" stroke={hair}>
        {ticks.map((t, i) => (
          <path key={i} d={`M${t.x1.toFixed(1)} ${t.y1.toFixed(1)}L${t.x2.toFixed(1)} ${t.y2.toFixed(1)}`} strokeWidth={t.w} opacity={t.o} />
        ))}
      </g>
      {/* razor-sharp hairline edge */}
      <path d={`M${cx - 52} 138 Q${cx} ${kind === "top" ? 98 : 120} ${cx + 52} 138`} fill="none" stroke={accent} strokeWidth="1.2" opacity="0.55" />
      <rect width={W} height={H} fill="#000" opacity="0.06" />
    </svg>
  );
}
