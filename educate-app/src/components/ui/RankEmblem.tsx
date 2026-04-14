'use client';

import type { Rank } from '@/lib/ranks';

interface Props {
  rank: Rank;
  size?: number;
  uid?: string | number;
}

// ── Shared shield paths (all in viewBox "0 0 40 50") ─────────────────────────
// outer shield, inner shield, body fill, two-chevron strip
const S = {
  outer:  'M6,5 L34,5 L34,32 L20,46 L6,32 Z',
  inner:  'M9,8 L31,8 L31,31 L20,43 L9,31 Z',
  body:   'M10,9 L30,9 L30,30 L20,42 L10,30 Z',
  chev1:  'M11,31 L20,25 L29,31',
  chev2:  'M11,35 L20,29 L29,35',
  // crown variant – V-notch top
  outerC: 'M6,5 L13,5 L13,2 L16,2 L16,5 L20,5 L24,5 L24,2 L27,2 L27,5 L34,5 L34,32 L20,46 L6,32 Z',
  innerC: 'M9,8 L31,8 L31,31 L20,43 L9,31 Z',
  // large crown variant (gold+)
  outerG: 'M6,5 L11,5 L11,1 L15,4 L20,0 L25,4 L29,1 L29,5 L34,5 L34,32 L20,46 L6,32 Z',
};

// ── Filter / gradient helpers ─────────────────────────────────────────────────
function Glow({ id, color, dev = 3.5 }: { id: string; color: string; dev?: number }) {
  return (
    <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={dev} result="blur" />
      <feFlood floodColor={color} floodOpacity="0.8" result="col" />
      <feComposite in="col" in2="blur" operator="in" result="glow" />
      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  );
}
function LG({ id, stops }: { id: string; stops: [string, string, string?] }) {
  return (
    <linearGradient id={id} x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%"   stopColor={stops[0]} />
      <stop offset="50%"  stopColor={stops[1]} />
      {stops[2] && <stop offset="100%" stopColor={stops[2]} />}
    </linearGradient>
  );
}
function RG({ id, cx = '40%', cy = '35%', r = '65%', stops }: { id: string; cx?: string; cy?: string; r?: string; stops: [string, string] }) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      <stop offset="0%"   stopColor={stops[0]} />
      <stop offset="100%" stopColor={stops[1]} />
    </radialGradient>
  );
}

// ── Division label ────────────────────────────────────────────────────────────
function Div({ div, y = 13, fill = '#000', size = 10 }: { div: string; y?: number; fill?: string; size?: number }) {
  return (
    <text x="20" y={y} textAnchor="middle" dominantBaseline="central"
      fill={fill} fontSize={size} fontWeight="900" fontFamily="'Segoe UI',Arial,sans-serif" letterSpacing="0.3">
      {div}
    </text>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COPPER — warm rust-brown, simple flat shield, single chevron
// ═══════════════════════════════════════════════════════════════════════════════
function CopperEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.82} height={h} viewBox="0 0 40 50">
      <defs>
        <LG id={`${p}a`} stops={['#D4855A', '#8B4020', '#5A2010']} />
        <LG id={`${p}b`} stops={['#C07040', '#7A3818']} />
        <LG id={`${p}c`} stops={['#E09060', '#A05028']} />
      </defs>
      {/* Outer */}
      <path d={S.outer} fill={`url(#${p}a)`} stroke="#3A1808" strokeWidth="1.5" />
      {/* Inner bevel */}
      <path d={S.inner} fill={`url(#${p}b)`} stroke="#3A1808" strokeWidth="0.8" />
      {/* Body */}
      <path d={S.body} fill={`url(#${p}c)`} />
      {/* Single chevron */}
      <polyline points="11,31 20,25 29,31" fill="none" stroke="#3A1808" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* Div */}
      <Div div={div} y={18} fill="#2A1005" size={10} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRONZE — amber-orange, crown nubs, two chevrons
// ═══════════════════════════════════════════════════════════════════════════════
function BronzeEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.82} height={h} viewBox="0 0 40 50">
      <defs>
        <LG id={`${p}a`} stops={['#F0A060', '#A05820', '#6A3008']} />
        <LG id={`${p}b`} stops={['#D87838', '#8A4018']} />
        <LG id={`${p}c`} stops={['#F8B878', '#C07030']} />
      </defs>
      {/* Crown-notch outer */}
      <path d={S.outerC} fill={`url(#${p}a)`} stroke="#4A2008" strokeWidth="1.5" />
      {/* Crown inner fill */}
      <path d="M9,8 L31,8 L31,31 L20,43 L9,31 Z" fill={`url(#${p}b)`} stroke="#4A2008" strokeWidth="0.8" />
      <path d={S.body} fill={`url(#${p}c)`} />
      {/* Two chevrons */}
      <polyline points="11,29 20,23 29,29" fill="none" stroke="#4A2008" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="11,33 20,27 29,33" fill="none" stroke="#4A2008" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <Div div={div} y={16} fill="#3A1808" size={10} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SILVER — cool steel blue-grey, angled top, two chevrons, bright highlight
// ═══════════════════════════════════════════════════════════════════════════════
function SilverEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.82} height={h} viewBox="0 0 40 50">
      <defs>
        <LG id={`${p}a`} stops={['#D8E4F0', '#8898A8', '#404858']} />
        <LG id={`${p}b`} stops={['#B0C0D0', '#607080']} />
        <LG id={`${p}c`} stops={['#E8F0F8', '#9AAAB8']} />
        <LG id={`${p}sh`} stops={['#FFFFFF', '#FFFFFF']} />
      </defs>
      {/* Outer */}
      <path d={S.outerC} fill={`url(#${p}a)`} stroke="#303840" strokeWidth="1.5" />
      <path d={S.innerC} fill={`url(#${p}b)`} stroke="#303840" strokeWidth="0.8" />
      <path d={S.body} fill={`url(#${p}c)`} />
      {/* Shine stripe */}
      <path d="M10,9 L20,9 L13,26 L10,26 Z" fill="white" fillOpacity="0.22" />
      {/* Two chevrons */}
      <polyline points="11,29 20,23 29,29" fill="none" stroke="#30404A" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="11,33 20,27 29,33" fill="none" stroke="#30404A" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <Div div={div} y={16} fill="#283038" size={10} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLD — rich golden yellow, large crown spikes, double chevron, soft glow
// ═══════════════════════════════════════════════════════════════════════════════
function GoldEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.82} height={h} viewBox="0 0 40 50">
      <defs>
        <LG id={`${p}a`} stops={['#FFF0A0', '#E8B000', '#8A6000']} />
        <LG id={`${p}b`} stops={['#D8A000', '#906000']} />
        <LG id={`${p}c`} stops={['#FFE060', '#C89000']} />
        <Glow id={`${p}gf`} color="#FFD700" dev={3} />
      </defs>
      {/* Large crown outer */}
      <path d={S.outerG} fill={`url(#${p}a)`} stroke="#7A5000" strokeWidth="1.5" filter={`url(#${p}gf)`} />
      <path d={S.innerC} fill={`url(#${p}b)`} stroke="#7A5000" strokeWidth="0.9" />
      <path d={S.body} fill={`url(#${p}c)`} />
      {/* Crown gems */}
      <circle cx="11" cy="2.5" r="1.5" fill="#FFE090" stroke="#9A7020" strokeWidth="0.6" />
      <circle cx="20" cy="1" r="2" fill="#FFEE90" stroke="#9A7020" strokeWidth="0.6" />
      <circle cx="29" cy="2.5" r="1.5" fill="#FFE090" stroke="#9A7020" strokeWidth="0.6" />
      {/* Shine */}
      <path d="M10,9 L20,9 L14,24 L10,24 Z" fill="white" fillOpacity="0.28" />
      {/* Two chevrons */}
      <polyline points="11,29 20,23 29,29" fill="none" stroke="#8A6000" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="11,33 20,27 29,33" fill="none" stroke="#8A6000" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <Div div={div} y={16} fill="#6A4800" size={10} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLATINUM — dark steel + vivid cyan/teal, faceted centre gem, teal glow
// ═══════════════════════════════════════════════════════════════════════════════
function PlatinumEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.82} height={h} viewBox="0 0 40 50">
      <defs>
        <LG id={`${p}a`} stops={['#90E8F8', '#1090B8', '#082840']} />
        <LG id={`${p}b`} stops={['#1888C0', '#083050']} />
        <LG id={`${p}c`} stops={['#50D0F0', '#0888B8']} />
        <RG id={`${p}gem`} stops={['#D0FFFF', '#00B8D8']} />
        <Glow id={`${p}gf`} color="#00D8F8" dev={3.5} />
      </defs>
      <path d={S.outerG} fill={`url(#${p}a)`} stroke="#062030" strokeWidth="1.5" filter={`url(#${p}gf)`} />
      <path d={S.innerC} fill={`url(#${p}b)`} stroke="#062030" strokeWidth="0.9" />
      <path d={S.body} fill={`url(#${p}c)`} />
      {/* Crown gems – teal */}
      <circle cx="11" cy="2.5" r="1.5" fill="#80F0FF" stroke="#0888B8" strokeWidth="0.6" />
      <circle cx="20" cy="1" r="2" fill="#A0FFFF" stroke="#0888B8" strokeWidth="0.6" />
      <circle cx="29" cy="2.5" r="1.5" fill="#80F0FF" stroke="#0888B8" strokeWidth="0.6" />
      {/* Shine */}
      <path d="M10,9 L20,9 L14,24 L10,24 Z" fill="white" fillOpacity="0.32" />
      {/* Centre diamond gem */}
      <polygon points="20,19 25,23 20,27 15,23" fill={`url(#${p}gem)`} stroke="#00A8D0" strokeWidth="0.8" />
      <polygon points="20,19 25,23 20,27 15,23" fill="white" fillOpacity="0.3" />
      <line x1="20" y1="19" x2="20" y2="27" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Chevrons */}
      <polyline points="11,31 20,25 29,31" fill="none" stroke="#062030" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="11,35 20,29 29,35" fill="none" stroke="#062030" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <Div div={div} y={13} fill="#EAFEFF" size={8} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMERALD — dark forest + vivid emerald green, green gem, bright glow
// ═══════════════════════════════════════════════════════════════════════════════
function EmeraldEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.82} height={h} viewBox="0 0 40 50">
      <defs>
        <LG id={`${p}a`} stops={['#90FF90', '#1AAA48', '#0A3018']} />
        <LG id={`${p}b`} stops={['#148840', '#083820']} />
        <LG id={`${p}c`} stops={['#50E878', '#10A840']} />
        <RG id={`${p}gem`} stops={['#CCFFCC', '#00DD44']} />
        <Glow id={`${p}gf`} color="#00FF80" dev={4} />
      </defs>
      <path d={S.outerG} fill={`url(#${p}a)`} stroke="#062010" strokeWidth="1.5" filter={`url(#${p}gf)`} />
      <path d={S.innerC} fill={`url(#${p}b)`} stroke="#062010" strokeWidth="0.9" />
      <path d={S.body} fill={`url(#${p}c)`} />
      {/* Crown gems – emerald */}
      <circle cx="11" cy="2.5" r="1.5" fill="#80FFB0" stroke="#10A840" strokeWidth="0.6" />
      <circle cx="20" cy="1" r="2" fill="#AAFFC0" stroke="#10A840" strokeWidth="0.6" />
      <circle cx="29" cy="2.5" r="1.5" fill="#80FFB0" stroke="#10A840" strokeWidth="0.6" />
      <path d="M10,9 L20,9 L14,24 L10,24 Z" fill="white" fillOpacity="0.28" />
      {/* Centre emerald gem */}
      <polygon points="20,19 25,23 20,27 15,23" fill={`url(#${p}gem)`} stroke="#00C040" strokeWidth="0.8" />
      <polygon points="20,19 25,23 20,27 15,23" fill="white" fillOpacity="0.25" />
      <line x1="20" y1="19" x2="20" y2="27" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" />
      <polyline points="11,31 20,25 29,31" fill="none" stroke="#062010" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="11,35 20,29 29,35" fill="none" stroke="#062010" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <Div div={div} y={13} fill="#EAFFEE" size={8} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIAMOND — deep navy + brilliant ice-blue, crystalline facets, sparkle, strong glow
// ═══════════════════════════════════════════════════════════════════════════════
function DiamondEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  return (
    <svg width={h * 0.88} height={h} viewBox="0 0 44 50">
      <defs>
        <LG id={`${p}a`} stops={['#C0E8FF', '#2860E0', '#061040']} />
        <LG id={`${p}b`} stops={['#1848C8', '#040E30']} />
        <LG id={`${p}c`} stops={['#80C8FF', '#1850D0']} />
        <RG id={`${p}gem`} stops={['#FFFFFF', '#70C8FF']} />
        <Glow id={`${p}gf`} color="#60C0FF" dev={4.5} />
      </defs>
      {/* Wider viewbox — wing-like side extensions */}
      <path d="M2,26 L8,18 L8,5 L36,5 L36,18 L42,26 L36,32 L36,32 L22,46 L8,32 Z"
        fill={`url(#${p}a)`} stroke="#040E30" strokeWidth="1.5" filter={`url(#${p}gf)`} />
      {/* Inner shield */}
      <path d="M11,8 L33,8 L33,31 L22,43 L11,31 Z" fill={`url(#${p}b)`} stroke="#040E30" strokeWidth="0.8" />
      <path d="M13,10 L31,10 L31,30 L22,41 L13,30 Z" fill={`url(#${p}c)`} />
      {/* Crown spike */}
      <polygon points="22,0 25,5 19,5" fill="#80D0FF" stroke="#040E30" strokeWidth="0.8" />
      <circle cx="22" cy="0" r="1.5" fill="#E0F8FF" />
      {/* Shine */}
      <path d="M13,10 L22,10 L16,24 L13,24 Z" fill="white" fillOpacity="0.35" />
      {/* Large centre diamond gem */}
      <polygon points="22,17 28,23 22,29 16,23" fill={`url(#${p}gem)`} stroke="#2068E0" strokeWidth="1" />
      <line x1="22" y1="17" x2="22" y2="29" stroke="white" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="16" y1="23" x2="28" y2="23" stroke="white" strokeWidth="0.4" strokeOpacity="0.4" />
      <polygon points="22,17 28,23 22,29 16,23" fill="white" fillOpacity="0.25" />
      {/* Wing facet lines */}
      <line x1="8" y1="18" x2="11" y2="18" stroke="#A0D8FF" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="33" y1="18" x2="36" y2="18" stroke="#A0D8FF" strokeWidth="1" strokeOpacity="0.6" />
      {/* Sparkle cross top-right */}
      <line x1="32" y1="5" x2="35" y2="5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="33.5" y1="3.5" x2="33.5" y2="6.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      {/* Chevrons */}
      <polyline points="14,33 22,27 30,33" fill="none" stroke="#040E30" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="14,37 22,31 30,37" fill="none" stroke="#040E30" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <Div div={div} y={13} fill="#D0EEFF" size={9} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAMPION — intense orange-gold, massive wings, crown, 3 gems, starburst, max glow
// ═══════════════════════════════════════════════════════════════════════════════
function ChampionEmblem({ p, h }: { p: string; h: number }) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    const long = i % 4 === 0;
    const r1 = 22, r2 = long ? 32 : 27;
    return { x1: 26 + r1 * Math.cos(a), y1: 38 + r1 * Math.sin(a), x2: 26 + r2 * Math.cos(a), y2: 38 + r2 * Math.sin(a) };
  });
  return (
    <svg width={h * 1.1} height={h} viewBox="0 0 52 56">
      <defs>
        <LG id={`${p}a`} stops={['#FFF8C0', '#FF9000', '#8B3A00']} />
        <LG id={`${p}b`} stops={['#E07000', '#7A2A00']} />
        <LG id={`${p}c`} stops={['#FFD040', '#D06000']} />
        <LG id={`${p}cr`} stops={['#FFFAD0', '#FFD000']} />
        <RG id={`${p}gem`} cx="40%" cy="30%" r="70%" stops={['#FFFFFF', '#FF9000']} />
        <RG id={`${p}gl`} cx="50%" cy="60%" r="55%" stops={['#FFD700', '#FF6000']} />
        <Glow id={`${p}gf`} color="#FF9000" dev={5} />
        <Glow id={`${p}gf2`} color="#FFD700" dev={2.5} />
      </defs>

      {/* Outer starburst glow disc */}
      <ellipse cx="26" cy="38" rx="26" ry="26" fill={`url(#${p}gl)`} opacity="0.45" />
      {/* Starburst rays */}
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="#FFD700" strokeWidth={i % 4 === 0 ? '1.8' : '0.8'} strokeOpacity="0.5" strokeLinecap="round" />
      ))}

      {/* Wing left */}
      <path d="M8,22 L2,14 L0,28 L6,32 Z" fill={`url(#${p}a)`} stroke="#8B3A00" strokeWidth="1" filter={`url(#${p}gf)`} />
      {/* Wing right */}
      <path d="M44,22 L50,14 L52,28 L46,32 Z" fill={`url(#${p}a)`} stroke="#8B3A00" strokeWidth="1" filter={`url(#${p}gf)`} />

      {/* Shield outer */}
      <path d="M8,12 L16,12 L16,8 L20,11 L26,6 L32,11 L36,8 L36,12 L44,12 L44,36 L26,52 L8,36 Z"
        fill={`url(#${p}a)`} stroke="#7A2A00" strokeWidth="1.8" filter={`url(#${p}gf2)`} />
      {/* Shield inner */}
      <path d="M11,15 L41,15 L41,35 L26,49 L11,35 Z" fill={`url(#${p}b)`} stroke="#7A2A00" strokeWidth="0.9" />
      <path d="M13,17 L39,17 L39,34 L26,47 L13,34 Z" fill={`url(#${p}c)`} />

      {/* Shine */}
      <path d="M13,17 L26,17 L19,32 L13,32 Z" fill="white" fillOpacity="0.3" />

      {/* Crown spikes */}
      <polygon points="16,12 20,5 24,12" fill={`url(#${p}cr)`} stroke="#8B5000" strokeWidth="1" />
      <polygon points="22,12 26,3 30,12" fill={`url(#${p}cr)`} stroke="#8B5000" strokeWidth="1" />
      <polygon points="28,12 32,5 36,12" fill={`url(#${p}cr)`} stroke="#8B5000" strokeWidth="1" />

      {/* Crown gems */}
      <circle cx="20" cy="6" r="2" fill="#FF4040" stroke="#8B2000" strokeWidth="0.6" />
      <circle cx="26" cy="3.5" r="2.5" fill="#FFD000" stroke="#8B5000" strokeWidth="0.7" />
      <circle cx="32" cy="6" r="2" fill="#FF4040" stroke="#8B2000" strokeWidth="0.6" />
      {/* Gem shines */}
      <circle cx="19.2" cy="5.2" r="0.8" fill="white" fillOpacity="0.85" />
      <circle cx="25.2" cy="2.8" r="1" fill="white" fillOpacity="0.85" />
      <circle cx="31.2" cy="5.2" r="0.8" fill="white" fillOpacity="0.85" />

      {/* 5-point star + large centre gem */}
      <polygon points="26,25 28.2,31.8 35.4,31.8 29.6,35.8 31.8,42.6 26,38.6 20.2,42.6 22.4,35.8 16.6,31.8 23.8,31.8"
        fill="white" fillOpacity="0.9" stroke="#C07000" strokeWidth="0.5" />
      {/* Centre amber gem over star */}
      <polygon points="26,27 30,31 26,35 22,31" fill={`url(#${p}gem)`} stroke="#E07000" strokeWidth="0.8" />
      <polygon points="26,27 30,31 26,35 22,31" fill="white" fillOpacity="0.35" />

      {/* Wing sparkles */}
      <line x1="3" y1="18" x2="5.5" y2="18" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="4.3" y1="16.8" x2="4.3" y2="19.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="47" y1="18" x2="49.5" y2="18" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="48.3" y1="16.8" x2="48.3" y2="19.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" />

      {/* Corner sparkle */}
      <line x1="10" y1="10" x2="12" y2="10" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="11" y1="9" x2="11" y2="11" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="40" y1="10" x2="42" y2="10" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="41" y1="9" x2="41" y2="11" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.8" />
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
