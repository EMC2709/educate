'use client';

import type { Rank } from '@/lib/ranks';

interface Props {
  rank: Rank;
  size?: number;
  uid?: string | number;
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function Glow({ id, color, dev = 3.5 }: { id: string; color: string; dev?: number }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={dev} result="blur" />
      <feFlood floodColor={color} floodOpacity="0.9" result="col" />
      <feComposite in="col" in2="blur" operator="in" result="glow" />
      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  );
}
function LG({ id, stops, x1 = '15%', y1 = '0%', x2 = '85%', y2 = '100%' }: {
  id: string; stops: [string, string, string?]; x1?: string; y1?: string; x2?: string; y2?: string;
}) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0%"   stopColor={stops[0]} />
      <stop offset="50%"  stopColor={stops[1]} />
      {stops[2] && <stop offset="100%" stopColor={stops[2]} />}
    </linearGradient>
  );
}
function RG({ id, cx = '40%', cy = '35%', r = '65%', stops }: {
  id: string; cx?: string; cy?: string; r?: string; stops: [string, string];
}) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      <stop offset="0%"   stopColor={stops[0]} />
      <stop offset="100%" stopColor={stops[1]} />
    </radialGradient>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COPPER — smooth rounded heater shield (classic medieval shape)
// ═══════════════════════════════════════════════════════════════════════════════
function CopperEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.82} height={h} viewBox="0 0 40 50">
      <defs>
        <LG id={`${p}a`} stops={['#D4855A', '#8B4020', '#5A2010']} />
        <LG id={`${p}b`} stops={['#C07040', '#7A3818']} />
        <LG id={`${p}c`} stops={['#E09060', '#A05028']} />
      </defs>
      {/* Outer — smooth heater shield with curved bottom */}
      <path d="M5,5 L35,5 L35,33 Q35,45 20,48 Q5,45 5,33 Z"
        fill={`url(#${p}a)`} stroke="#3A1808" strokeWidth="1.5" />
      {/* Bevel ring */}
      <path d="M8,8 L32,8 L32,31 Q32,42 20,45 Q8,42 8,31 Z"
        fill={`url(#${p}b)`} stroke="#3A1808" strokeWidth="0.8" />
      {/* Body fill */}
      <path d="M10,10 L30,10 L30,30 Q30,41 20,44 Q10,41 10,30 Z"
        fill={`url(#${p}c)`} />
      {/* Left shine stripe */}
      <path d="M10,10 L18,10 L18,30 Q15,37 10,38 L10,30 Z" fill="white" fillOpacity="0.15" />
      {/* Horizontal belt across centre */}
      <rect x="10" y="22" width="20" height="4" fill="#7A3818" fillOpacity="0.35" rx="1" />
      <line x1="10" y1="24" x2="30" y2="24" stroke="#3A1808" strokeWidth="0.5" strokeOpacity="0.4" />
      {/* Division */}
      <text x="20" y="17" textAnchor="middle" dominantBaseline="central"
        fill="#2A1005" fontSize="11" fontWeight="900" fontFamily="'Segoe UI',Arial,sans-serif">
        {div}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRONZE — circular coin / medallion
// ═══════════════════════════════════════════════════════════════════════════════
function BronzeEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  const ticks = Array.from({ length: 32 }, (_, i) => {
    const a = (i * 11.25 * Math.PI) / 180;
    const r1 = 21, r2 = i % 2 === 0 ? 23 : 22.2;
    return { x1: 24 + r1 * Math.cos(a), y1: 24 + r1 * Math.sin(a), x2: 24 + r2 * Math.cos(a), y2: 24 + r2 * Math.sin(a) };
  });
  return (
    <svg width={h} height={h} viewBox="0 0 48 48">
      <defs>
        <LG id={`${p}a`} stops={['#F0A060', '#A05820', '#6A3008']} />
        <LG id={`${p}b`} stops={['#D87838', '#8A4018']} />
        <RG id={`${p}c`}  cx="38%" cy="32%" r="65%" stops={['#FFCC80', '#B06020']} />
        <Glow id={`${p}gf`} color="#D07030" dev={2} />
      </defs>
      {/* Outer coin disc */}
      <circle cx="24" cy="24" r="23" fill={`url(#${p}a)`} stroke="#4A2008" strokeWidth="1.2" />
      {/* Edge milling ticks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#4A2008" strokeWidth="1" />
      ))}
      {/* Inner raised ring */}
      <circle cx="24" cy="24" r="18.5" fill={`url(#${p}b)`} stroke="#4A2008" strokeWidth="1" />
      {/* Inner disc face */}
      <circle cx="24" cy="24" r="13.5" fill={`url(#${p}c)`} />
      {/* Specular shine ellipse */}
      <ellipse cx="19" cy="17" rx="5.5" ry="3" fill="white" fillOpacity="0.28" transform="rotate(-25 19 17)" />
      {/* Division */}
      <text x="24" y="24" textAnchor="middle" dominantBaseline="central"
        fill="#3A1808" fontSize="13" fontWeight="900" fontFamily="'Segoe UI',Arial,sans-serif">
        {div}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SILVER — flat-top hexagonal plate
// ═══════════════════════════════════════════════════════════════════════════════
function SilverEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  // Flat-top hex (horizontal edges at top/bottom)
  // viewBox 0 0 44 50, center (22,25)
  return (
    <svg width={h * 0.9} height={h} viewBox="0 0 44 50">
      <defs>
        <LG id={`${p}a`} stops={['#D8E4F0', '#8898A8', '#404858']} />
        <LG id={`${p}b`} stops={['#B0C0D0', '#607080']} />
        <LG id={`${p}c`} stops={['#E8F4FF', '#9AAAB8']} />
      </defs>
      {/* Flat-top hexagon: top & bottom edges horizontal */}
      <path d="M8,5 L36,5 L43,25 L36,45 L8,45 L1,25 Z"
        fill={`url(#${p}a)`} stroke="#303840" strokeWidth="1.5" />
      <path d="M10,8 L34,8 L40,25 L34,42 L10,42 L4,25 Z"
        fill={`url(#${p}b)`} stroke="#303840" strokeWidth="0.8" />
      <path d="M12,11 L32,11 L38,25 L32,39 L12,39 L6,25 Z"
        fill={`url(#${p}c)`} />
      {/* Facet diagonal lines — give a machined plate look */}
      <line x1="12" y1="11" x2="6"  y2="25" stroke="white" strokeWidth="0.8" strokeOpacity="0.25" />
      <line x1="32" y1="11" x2="38" y2="25" stroke="#1A2028" strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1="12" y1="39" x2="6"  y2="25" stroke="#1A2028" strokeWidth="0.6" strokeOpacity="0.3" />
      {/* Shine triangle top-left */}
      <path d="M12,11 L22,11 L6,25 Z" fill="white" fillOpacity="0.18" />
      {/* Horizontal centre stripe */}
      <line x1="6" y1="25" x2="38" y2="25" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
      {/* Division */}
      <text x="22" y="25" textAnchor="middle" dominantBaseline="central"
        fill="#283038" fontSize="12" fontWeight="900" fontFamily="'Segoe UI',Arial,sans-serif">
        {div}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLD — baroque oval shield (smooth Bézier curves, ornate corner scrolls, glow)
// ═══════════════════════════════════════════════════════════════════════════════
function GoldEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.87} height={h} viewBox="0 0 44 52">
      <defs>
        <LG id={`${p}a`} stops={['#FFF0A0', '#E8B000', '#8A6000']} />
        <LG id={`${p}b`} stops={['#D8A000', '#906000']} />
        <LG id={`${p}c`} stops={['#FFE060', '#C89000']} />
        <Glow id={`${p}gf`} color="#FFD700" dev={3.5} />
      </defs>
      {/* Baroque rounded shield — cubic bezier top, straight sides, point */}
      <path d="M22,3 C12,1 3,9 3,20 L3,38 L22,51 L41,38 L41,20 C41,9 32,1 22,3 Z"
        fill={`url(#${p}a)`} stroke="#7A5000" strokeWidth="1.5" filter={`url(#${p}gf)`} />
      <path d="M22,7 C14,5 7,12 7,21 L7,37 L22,48 L37,37 L37,21 C37,12 30,5 22,7 Z"
        fill={`url(#${p}b)`} stroke="#7A5000" strokeWidth="0.9" />
      <path d="M22,10 C15,8 10,15 10,22 L10,36 L22,46 L34,36 L34,22 C34,15 29,8 22,10 Z"
        fill={`url(#${p}c)`} />
      {/* Shine — left quarter */}
      <path d="M10,22 C10,15 15,8 22,10 L22,30 L10,30 Z" fill="white" fillOpacity="0.22" />
      {/* Corner scroll knobs */}
      <circle cx="9"  cy="11" r="3"   fill="#FFE090" stroke="#9A7020" strokeWidth="0.8" />
      <circle cx="35" cy="11" r="3"   fill="#FFE090" stroke="#9A7020" strokeWidth="0.8" />
      <circle cx="22" cy="3"  r="2.5" fill="#FFEE90" stroke="#9A7020" strokeWidth="0.8" />
      <circle cx="8.5"  cy="10.5" r="1" fill="white" fillOpacity="0.7" />
      <circle cx="34.5" cy="10.5" r="1" fill="white" fillOpacity="0.7" />
      {/* Ornate horizontal divider bar */}
      <path d="M14,30 Q22,27 30,30" fill="none" stroke="#9A7020" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="30" r="1.2" fill="#FFD060" stroke="#9A7020" strokeWidth="0.6" />
      <circle cx="30" cy="30" r="1.2" fill="#FFD060" stroke="#9A7020" strokeWidth="0.6" />
      {/* Division */}
      <text x="22" y="21" textAnchor="middle" dominantBaseline="central"
        fill="#6A4800" fontSize="12" fontWeight="900" fontFamily="'Segoe UI',Arial,sans-serif">
        {div}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLATINUM — wide flat arrowhead / chevron pointing down (modern/sleek)
// ═══════════════════════════════════════════════════════════════════════════════
function PlatinumEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 1.15} height={h} viewBox="0 0 52 46">
      <defs>
        <LG id={`${p}a`} stops={['#90E8F8', '#1090B8', '#082840']} />
        <LG id={`${p}b`} stops={['#1888C0', '#083050']} />
        <LG id={`${p}c`} stops={['#50D0F0', '#0888B8']} />
        <RG id={`${p}gem`} stops={['#D0FFFF', '#00B8D8']} />
        <Glow id={`${p}gf`} color="#00D8F8" dev={4} />
      </defs>
      {/* Wide flat arrowhead / downward chevron */}
      <path d="M1,4 L51,4 L51,22 L26,44 L1,22 Z"
        fill={`url(#${p}a)`} stroke="#062030" strokeWidth="1.5" filter={`url(#${p}gf)`} />
      <path d="M5,7 L47,7 L47,21 L26,40 L5,21 Z"
        fill={`url(#${p}b)`} stroke="#062030" strokeWidth="0.8" />
      <path d="M8,9 L44,9 L44,20 L26,38 L8,20 Z"
        fill={`url(#${p}c)`} />
      {/* Horizontal scan-line facets */}
      <line x1="8"  y1="13.5" x2="44" y2="13.5" stroke="#A0E8FF" strokeWidth="0.6" strokeOpacity="0.45" />
      <line x1="10" y1="18"   x2="42" y2="18"   stroke="#A0E8FF" strokeWidth="0.6" strokeOpacity="0.35" />
      {/* Shine — top-left wedge */}
      <path d="M8,9 L26,9 L14,20 L8,20 Z" fill="white" fillOpacity="0.22" />
      {/* Diagonal slash edge lines */}
      <line x1="5"  y1="21" x2="8"  y2="20" stroke="#A0E8FF" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="47" y1="21" x2="44" y2="20" stroke="#A0E8FF" strokeWidth="1" strokeOpacity="0.5" />
      {/* Centre diamond gem */}
      <polygon points="26,12 32,18 26,24 20,18"
        fill={`url(#${p}gem)`} stroke="#00A8D0" strokeWidth="0.9" />
      <line x1="26" y1="12" x2="26" y2="24" stroke="white" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="20" y1="18" x2="32" y2="18" stroke="white" strokeWidth="0.4" strokeOpacity="0.4" />
      <polygon points="26,12 32,18 26,24 20,18" fill="white" fillOpacity="0.2" />
      {/* Corner sparkle */}
      <line x1="45" y1="6" x2="48" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="46.5" y1="4.5" x2="46.5" y2="7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Division */}
      <text x="26" y="11" textAnchor="middle" dominantBaseline="central"
        fill="#EAFEFF" fontSize="8" fontWeight="900" fontFamily="'Segoe UI',Arial,sans-serif">
        {div}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMERALD — tall gothic arch shield (pointed lancet window shape)
// ═══════════════════════════════════════════════════════════════════════════════
function EmeraldEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.72} height={h} viewBox="0 0 36 52">
      <defs>
        <LG id={`${p}a`} stops={['#90FF90', '#1AAA48', '#0A3018']} />
        <LG id={`${p}b`} stops={['#148840', '#083820']} />
        <LG id={`${p}c`} stops={['#50E878', '#10A840']} />
        <RG id={`${p}gem`} stops={['#CCFFCC', '#00DD44']} />
        <Glow id={`${p}gf`} color="#00FF80" dev={4} />
      </defs>
      {/* Gothic pointed arch — quadratic bezier sides meeting at a top spike, straight sides below */}
      <path d="M3,22 Q3,4 18,1 Q33,4 33,22 L33,44 L18,51 L3,44 Z"
        fill={`url(#${p}a)`} stroke="#062010" strokeWidth="1.5" filter={`url(#${p}gf)`} />
      <path d="M6,22 Q6,8 18,5 Q30,8 30,22 L30,42 L18,49 L6,42 Z"
        fill={`url(#${p}b)`} stroke="#062010" strokeWidth="0.8" />
      <path d="M8,23 Q8,11 18,8 Q28,11 28,23 L28,41 L18,48 L8,41 Z"
        fill={`url(#${p}c)`} />
      {/* Gothic tracery arch line */}
      <path d="M8,23 Q8,11 18,8 Q28,11 28,23" fill="none" stroke="#AAFFC0" strokeWidth="0.7" strokeOpacity="0.5" />
      {/* Shine — left half of arch */}
      <path d="M8,23 Q8,11 18,8 L18,32 L8,32 Z" fill="white" fillOpacity="0.18" />
      {/* Trefoil dot at apex */}
      <circle cx="18" cy="8" r="2" fill="#80FFB0" stroke="#10A840" strokeWidth="0.5" />
      <circle cx="18" cy="8" r="0.8" fill="white" fillOpacity="0.8" />
      {/* Vertical column line */}
      <line x1="18" y1="10" x2="18" y2="22" stroke="#AAFFC0" strokeWidth="0.7" strokeOpacity="0.5" />
      {/* Centre emerald gem */}
      <polygon points="18,24 24,30 18,36 12,30"
        fill={`url(#${p}gem)`} stroke="#00C040" strokeWidth="0.9" />
      <line x1="18" y1="24" x2="18" y2="36" stroke="white" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="12" y1="30" x2="24" y2="30" stroke="white" strokeWidth="0.4" strokeOpacity="0.4" />
      <polygon points="18,24 24,30 18,36 12,30" fill="white" fillOpacity="0.2" />
      {/* Finials at shoulder corners */}
      <circle cx="6"  cy="22" r="1.5" fill="#80FFB0" stroke="#10A840" strokeWidth="0.5" />
      <circle cx="30" cy="22" r="1.5" fill="#80FFB0" stroke="#10A840" strokeWidth="0.5" />
      {/* Division */}
      <text x="18" y="15" textAnchor="middle" dominantBaseline="central"
        fill="#EAFFEE" fontSize="8" fontWeight="900" fontFamily="'Segoe UI',Arial,sans-serif">
        {div}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIAMOND — elongated hexagonal gem cut (like a brilliant cut diamond side-on)
// ═══════════════════════════════════════════════════════════════════════════════
function DiamondEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.87} height={h} viewBox="0 0 46 54">
      <defs>
        <LG id={`${p}a`} stops={['#C0E8FF', '#2860E0', '#061040']} />
        <LG id={`${p}b`} stops={['#1848C8', '#040E30']} />
        <LG id={`${p}c`} stops={['#80C8FF', '#1850D0']} />
        <RG id={`${p}gem`} cx="38%" cy="30%" r="70%" stops={['#FFFFFF', '#2860E0']} />
        <Glow id={`${p}gf`} color="#60C0FF" dev={5} />
      </defs>
      {/* Elongated hexagon — gem cut shape */}
      <path d="M23,2 L44,18 L44,32 L23,52 L2,32 L2,18 Z"
        fill={`url(#${p}a)`} stroke="#040E30" strokeWidth="1.5" filter={`url(#${p}gf)`} />
      <path d="M23,6 L40,20 L40,31 L23,49 L6,31 L6,20 Z"
        fill={`url(#${p}b)`} stroke="#040E30" strokeWidth="0.8" />
      <path d="M23,9 L38,21 L38,30 L23,47 L8,30 L8,21 Z"
        fill={`url(#${p}c)`} />
      {/* Crown facet lines (above girdle at y=25) */}
      <line x1="23" y1="9"  x2="23" y2="25" stroke="white" strokeWidth="0.6" strokeOpacity="0.45" />
      <line x1="8"  y1="21" x2="23" y2="9"  stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="38" y1="21" x2="23" y2="9"  stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="8"  y1="21" x2="38" y2="21" stroke="white" strokeWidth="0.5" strokeOpacity="0.25" />
      {/* Pavilion facet lines (below girdle) */}
      <line x1="8"  y1="30" x2="23" y2="25" stroke="#1030A0" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="38" y1="30" x2="23" y2="25" stroke="#1030A0" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="8"  y1="30" x2="38" y2="30" stroke="#1030A0" strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Crown shine — top-left triangle */}
      <path d="M8,21 L23,9 L23,25 Z" fill="white" fillOpacity="0.28" />
      {/* Girdle highlight */}
      <line x1="2" y1="25" x2="44" y2="25" stroke="#A0D8FF" strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Centre gem */}
      <polygon points="23,18 30,25 23,32 16,25"
        fill={`url(#${p}gem)`} stroke="#2068E0" strokeWidth="1" />
      <line x1="23" y1="18" x2="23" y2="32" stroke="white" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="16" y1="25" x2="30" y2="25" stroke="white" strokeWidth="0.4" strokeOpacity="0.4" />
      <polygon points="23,18 30,25 23,32 16,25" fill="white" fillOpacity="0.2" />
      {/* Sparkle top-right */}
      <line x1="37" y1="10" x2="40" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38.5" y1="8.5" x2="38.5" y2="11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Wing facet edge markers */}
      <line x1="2"  y1="18" x2="6"  y2="21" stroke="#A0D8FF" strokeWidth="1.2" strokeOpacity="0.6" />
      <line x1="44" y1="18" x2="40" y2="21" stroke="#A0D8FF" strokeWidth="1.2" strokeOpacity="0.6" />
      {/* Division */}
      <text x="23" y="15" textAnchor="middle" dominantBaseline="central"
        fill="#D0EEFF" fontSize="8" fontWeight="900" fontFamily="'Segoe UI',Arial,sans-serif">
        {div}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAMPION — grand coat of arms: winged shield + triple crown + starburst
// ═══════════════════════════════════════════════════════════════════════════════
function ChampionEmblem({ p, h }: { p: string; h: number }) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    const long = i % 4 === 0;
    const r1 = 20, r2 = long ? 30 : 25;
    return { x1: 26 + r1 * Math.cos(a), y1: 38 + r1 * Math.sin(a), x2: 26 + r2 * Math.cos(a), y2: 38 + r2 * Math.sin(a) };
  });
  return (
    <svg width={h * 1.1} height={h} viewBox="0 0 52 56">
      <defs>
        <LG id={`${p}a`} stops={['#FFF8C0', '#FF9000', '#8B3A00']} />
        <LG id={`${p}b`} stops={['#E07000', '#7A2A00']} />
        <LG id={`${p}c`} stops={['#FFD040', '#D06000']} />
        <LG id={`${p}cr`} stops={['#FFFAD0', '#FFD000']} />
        <RG id={`${p}gem`}  cx="40%" cy="30%" r="70%" stops={['#FFFFFF', '#FF9000']} />
        <RG id={`${p}gl`}   cx="50%" cy="60%" r="55%" stops={['#FFD700', '#FF6000']} />
        <Glow id={`${p}gf`}  color="#FF9000" dev={5} />
        <Glow id={`${p}gf2`} color="#FFD700" dev={2.5} />
      </defs>
      {/* Starburst glow disc */}
      <ellipse cx="26" cy="38" rx="25" ry="25" fill={`url(#${p}gl)`} opacity="0.4" />
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="#FFD700" strokeWidth={i % 4 === 0 ? '1.8' : '0.8'} strokeOpacity="0.5" strokeLinecap="round" />
      ))}
      {/* Wings */}
      <path d="M8,22 L2,14 L0,28 L6,32 Z"  fill={`url(#${p}a)`} stroke="#8B3A00" strokeWidth="1" filter={`url(#${p}gf)`} />
      <path d="M44,22 L50,14 L52,28 L46,32 Z" fill={`url(#${p}a)`} stroke="#8B3A00" strokeWidth="1" filter={`url(#${p}gf)`} />
      {/* Shield outer */}
      <path d="M8,12 L16,12 L16,8 L20,11 L26,6 L32,11 L36,8 L36,12 L44,12 L44,36 L26,52 L8,36 Z"
        fill={`url(#${p}a)`} stroke="#7A2A00" strokeWidth="1.8" filter={`url(#${p}gf2)`} />
      {/* Shield inner bevel */}
      <path d="M11,15 L41,15 L41,35 L26,49 L11,35 Z" fill={`url(#${p}b)`} stroke="#7A2A00" strokeWidth="0.9" />
      {/* Shield body */}
      <path d="M13,17 L39,17 L39,34 L26,47 L13,34 Z" fill={`url(#${p}c)`} />
      {/* Shine */}
      <path d="M13,17 L26,17 L19,32 L13,32 Z" fill="white" fillOpacity="0.28" />
      {/* Crown spikes */}
      <polygon points="16,12 20,5 24,12" fill={`url(#${p}cr)`} stroke="#8B5000" strokeWidth="1" />
      <polygon points="22,12 26,3 30,12" fill={`url(#${p}cr)`} stroke="#8B5000" strokeWidth="1" />
      <polygon points="28,12 32,5 36,12" fill={`url(#${p}cr)`} stroke="#8B5000" strokeWidth="1" />
      {/* Crown gems */}
      <circle cx="20" cy="6" r="2"   fill="#FF4040" stroke="#8B2000" strokeWidth="0.6" />
      <circle cx="26" cy="3.5" r="2.5" fill="#FFD000" stroke="#8B5000" strokeWidth="0.7" />
      <circle cx="32" cy="6" r="2"   fill="#FF4040" stroke="#8B2000" strokeWidth="0.6" />
      <circle cx="19.2" cy="5.2" r="0.8" fill="white" fillOpacity="0.85" />
      <circle cx="25.2" cy="2.8" r="1"   fill="white" fillOpacity="0.85" />
      <circle cx="31.2" cy="5.2" r="0.8" fill="white" fillOpacity="0.85" />
      {/* 5-point star */}
      <polygon
        points="26,25 28.2,31.8 35.4,31.8 29.6,35.8 31.8,42.6 26,38.6 20.2,42.6 22.4,35.8 16.6,31.8 23.8,31.8"
        fill="white" fillOpacity="0.88" stroke="#C07000" strokeWidth="0.5" />
      {/* Centre amber gem over star */}
      <polygon points="26,27 30,31 26,35 22,31"
        fill={`url(#${p}gem)`} stroke="#E07000" strokeWidth="0.8" />
      <polygon points="26,27 30,31 26,35 22,31" fill="white" fillOpacity="0.32" />
      {/* Wing sparkles */}
      <line x1="3"  y1="18" x2="5.5" y2="18" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="4.3" y1="16.8" x2="4.3" y2="19.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="47"  y1="18" x2="49.5" y2="18" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="48.3" y1="16.8" x2="48.3" y2="19.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public export
// ═══════════════════════════════════════════════════════════════════════════════
export function RankEmblem({ rank, size = 48, uid = 0 }: Props) {
  const p = `re-${rank.tier.toLowerCase().replace(/\s/g, '')}-${uid}`;
  const div = rank.division;
  switch (rank.tier) {
    case 'Copper':   return <CopperEmblem   p={p} div={div} h={size} />;
    case 'Bronze':   return <BronzeEmblem   p={p} div={div} h={size} />;
    case 'Silver':   return <SilverEmblem   p={p} div={div} h={size} />;
    case 'Gold':     return <GoldEmblem     p={p} div={div} h={size} />;
    case 'Platinum': return <PlatinumEmblem p={p} div={div} h={size} />;
    case 'Emerald':  return <EmeraldEmblem  p={p} div={div} h={size} />;
    case 'Diamond':  return <DiamondEmblem  p={p} div={div} h={size} />;
    case 'Champion': return <ChampionEmblem p={p} h={size} />;
    default:         return null;
  }
}
