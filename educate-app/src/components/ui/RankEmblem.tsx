'use client';

import type { Rank } from '@/lib/ranks';

interface Props {
  rank: Rank;
  /** Rendered height in px (width auto-scales per shape) */
  size?: number;
  /** Unique suffix so multiple emblems on one page don't share SVG def IDs */
  uid?: string | number;
}

// ─── Copper ──────────────────────────────────────────────────────────────────
// Simple hexagon badge, dull & unimpressive
function CopperEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  const w = h * 0.84;
  return (
    <svg width={w} height={h} viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${p}-bg`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#c08050" />
          <stop offset="100%" stopColor="#5a2e10" />
        </radialGradient>
      </defs>
      <polygon points="20,3 36,12 36,34 20,43 4,34 4,12"
        fill={`url(#${p}-bg)`} stroke="#3a1e08" strokeWidth="2" />
      <polygon points="20,8 31,14 31,30 20,36 9,30 9,14"
        fill="none" stroke="#3a1e08" strokeWidth="0.8" strokeOpacity="0.45" />
      <text x="20" y="25" textAnchor="middle" dominantBaseline="central"
        fill="#2a1005" fontSize="13" fontWeight="900" fontFamily="Georgia,serif">
        {div}
      </text>
    </svg>
  );
}

// ─── Bronze ──────────────────────────────────────────────────────────────────
// Basic rounded shield, bronze gradient
function BronzeEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  const w = h * 0.84;
  return (
    <svg width={w} height={h} viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${p}-bg`} x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#e89a4a" />
          <stop offset="45%" stopColor="#c07830" />
          <stop offset="100%" stopColor="#6a3e10" />
        </linearGradient>
      </defs>
      <path d="M4,5 Q4,2 8,2 L32,2 Q36,2 36,5 L36,28 L20,46 L4,28 Z"
        fill={`url(#${p}-bg)`} stroke="#5a300a" strokeWidth="1.8" />
      <path d="M8,7 L32,7 L32,27 L20,41 L8,27 Z"
        fill="none" stroke="#5a300a" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="8" y1="20" x2="32" y2="20" stroke="#5a300a" strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Chevron */}
      <polyline points="12,14 20,10 28,14" fill="none" stroke="#5a300a" strokeWidth="1.2" strokeOpacity="0.55" strokeLinejoin="round" />
      <text x="20" y="31" textAnchor="middle" dominantBaseline="central"
        fill="#3a1a05" fontSize="11" fontWeight="900" fontFamily="Georgia,serif">
        {div}
      </text>
    </svg>
  );
}

// ─── Silver ──────────────────────────────────────────────────────────────────
// Heater shield, metallic silver with shine stripe
function SilverEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  const w = h * 0.84;
  return (
    <svg width={w} height={h} viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${p}-bg`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="40%" stopColor="#cacaca" />
          <stop offset="100%" stopColor="#7a7a7a" />
        </linearGradient>
        <linearGradient id={`${p}-sh`} x1="0%" y1="0%" x2="55%" y2="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Shield */}
      <path d="M4,5 Q4,2 8,2 L32,2 Q36,2 36,5 L36,28 Q36,40 20,47 Q4,40 4,28 Z"
        fill={`url(#${p}-bg)`} stroke="#7a7a7a" strokeWidth="1.8" />
      {/* Shine */}
      <path d="M4,5 Q4,2 8,2 L32,2 Q36,2 36,5 L36,28 Q36,40 20,47 Q4,40 4,28 Z"
        fill={`url(#${p}-sh)`} />
      {/* Inner border */}
      <path d="M8,7 L32,7 L32,27 Q32,37 20,43 Q8,37 8,27 Z"
        fill="none" stroke="#999" strokeWidth="0.9" />
      {/* 5-point star */}
      <polygon
        points="20,13 21.9,18.8 28,18.8 23.1,22.2 25,28 20,24.6 15,28 16.9,22.2 12,18.8 18.1,18.8"
        fill="none" stroke="#888" strokeWidth="1" />
      <text x="20" y="36" textAnchor="middle" dominantBaseline="central"
        fill="#666" fontSize="9" fontWeight="900" fontFamily="Georgia,serif" letterSpacing="0.5">
        {div}
      </text>
    </svg>
  );
}

// ─── Gold ────────────────────────────────────────────────────────────────────
// Notched-top shield, gold gradient, sunburst, glow
function GoldEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  const w = h * 0.84;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    return { x1: 20 + 5 * Math.cos(a), y1: 22 + 5 * Math.sin(a), x2: 20 + 9.5 * Math.cos(a), y2: 22 + 9.5 * Math.sin(a) };
  });
  return (
    <svg width={w} height={h} viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${p}-bg`} x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#fffacc" />
          <stop offset="30%" stopColor="#ffd700" />
          <stop offset="70%" stopColor="#c89000" />
          <stop offset="100%" stopColor="#8a5e00" />
        </linearGradient>
        <radialGradient id={`${p}-gl`} cx="50%" cy="45%" r="52%">
          <stop offset="0%" stopColor="#ffe566" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
        </radialGradient>
        <filter id={`${p}-gf`}>
          <feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="20" cy="26" rx="19" ry="20" fill={`url(#${p}-gl)`} />
      {/* V-notch shield */}
      <path d="M4,5 Q4,2 8,2 L14,2 Q17,2 20,7 Q23,2 26,2 L32,2 Q36,2 36,5 L36,28 Q36,40 20,47 Q4,40 4,28 Z"
        fill={`url(#${p}-bg)`} stroke="#c89000" strokeWidth="1.8" filter={`url(#${p}-gf)`} />
      {/* Inner V-notch border */}
      <path d="M7,7 L13,7 Q16,7 20,11 Q24,7 27,7 L33,7 L33,27 Q33,37 20,43 Q7,37 7,27 Z"
        fill="none" stroke="#c89000" strokeWidth="0.8" strokeOpacity="0.65" />
      {/* Sunburst */}
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="#c89000" strokeWidth="1" strokeOpacity="0.8" />
      ))}
      <circle cx="20" cy="22" r="4.5" fill="none" stroke="#c89000" strokeWidth="1.1" />
      <circle cx="20" cy="22" r="2" fill="#c89000" />
      <text x="20" y="37" textAnchor="middle" dominantBaseline="central"
        fill="#7a5500" fontSize="9" fontWeight="900" fontFamily="Georgia,serif" letterSpacing="0.5">
        {div}
      </text>
    </svg>
  );
}

// ─── Platinum ────────────────────────────────────────────────────────────────
// Kite pentagon, platinum-teal gradient, geometric inner diamond, teal glow
function PlatinumEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  const w = h * 0.84;
  return (
    <svg width={w} height={h} viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${p}-bg`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#e8f6f8" />
          <stop offset="45%" stopColor="#78cce0" />
          <stop offset="100%" stopColor="#1488a0" />
        </linearGradient>
        <radialGradient id={`${p}-gl`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#30aabc" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#30aabc" stopOpacity="0" />
        </radialGradient>
        <filter id={`${p}-gf`}>
          <feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="20" cy="26" rx="20" ry="22" fill={`url(#${p}-gl)`} />
      {/* Kite pentagon */}
      <path d="M20,2 L36,15 L36,32 L20,46 L4,32 L4,15 Z"
        fill={`url(#${p}-bg)`} stroke="#1488a0" strokeWidth="1.8" filter={`url(#${p}-gf)`} />
      {/* Inner diamond */}
      <path d="M20,9 L31,22 L20,35 L9,22 Z"
        fill="none" stroke="#1488a0" strokeWidth="0.9" strokeOpacity="0.65" />
      {/* Crosshairs */}
      <line x1="20" y1="9" x2="20" y2="35" stroke="#1488a0" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="9" y1="22" x2="31" y2="22" stroke="#1488a0" strokeWidth="0.5" strokeOpacity="0.4" />
      {/* Centre gem */}
      <polygon points="20,18 24,22 20,26 16,22" fill="#1488a0" fillOpacity="0.9" />
      <polygon points="20,18 24,22 20,26 16,22" fill="white" fillOpacity="0.35" />
      <text x="20" y="38" textAnchor="middle" dominantBaseline="central"
        fill="#0c6070" fontSize="8" fontWeight="900" fontFamily="'Segoe UI',sans-serif" letterSpacing="1.2">
        {div}
      </text>
    </svg>
  );
}

// ─── Emerald ─────────────────────────────────────────────────────────────────
// Hexagonal gem with cut facets, green glow
function EmeraldEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  const w = h * 0.88;
  return (
    <svg width={w} height={h} viewBox="0 0 40 46" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${p}-bg`} cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#90ffcc" />
          <stop offset="50%" stopColor="#22b060" />
          <stop offset="100%" stopColor="#004520" />
        </radialGradient>
        <radialGradient id={`${p}-gl`} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#50c878" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#50c878" stopOpacity="0" />
        </radialGradient>
        <filter id={`${p}-gf`}>
          <feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <polygon points="20,1 38,11 38,33 20,43 2,33 2,11" fill={`url(#${p}-gl)`} />
      {/* Gem hex */}
      <polygon points="20,3 36,12 36,32 20,41 4,32 4,12"
        fill={`url(#${p}-bg)`} stroke="#009040" strokeWidth="1.8" filter={`url(#${p}-gf)`} />
      {/* Top table facet */}
      <polygon points="20,3 36,12 20,16 4,12" fill="white" fillOpacity="0.22" stroke="#009040" strokeWidth="0.7" strokeOpacity="0.55" />
      {/* Bottom table facet */}
      <polygon points="20,41 36,32 20,28 4,32" fill="none" stroke="#009040" strokeWidth="0.7" strokeOpacity="0.45" />
      {/* Vertical facet lines */}
      <line x1="4" y1="12" x2="20" y2="16" stroke="#aaffcc" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="36" y1="12" x2="20" y2="16" stroke="#003010" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="20" y1="16" x2="20" y2="28" stroke="#009040" strokeWidth="0.55" strokeOpacity="0.5" />
      <line x1="4" y1="32" x2="20" y2="28" stroke="#aaffcc" strokeWidth="0.6" strokeOpacity="0.45" />
      <line x1="36" y1="32" x2="20" y2="28" stroke="#003010" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* Division */}
      <text x="20" y="22" textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="9" fontWeight="900" fontFamily="'Segoe UI',sans-serif" letterSpacing="0.8">
        {div}
      </text>
    </svg>
  );
}

// ─── Diamond ─────────────────────────────────────────────────────────────────
// Brilliant diamond rhombus, ice-blue, facets + sparkle, strong glow
function DiamondEmblem({ p, div, h }: { p: string; div: string; h: number }) {
  const w = h * 0.78;
  return (
    <svg width={w} height={h} viewBox="0 0 38 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${p}-bg`} cx="35%" cy="28%" r="62%">
          <stop offset="0%" stopColor="#f0fbff" />
          <stop offset="40%" stopColor="#72d8ff" />
          <stop offset="100%" stopColor="#0055aa" />
        </radialGradient>
        <radialGradient id={`${p}-gl`} cx="50%" cy="45%" r="58%">
          <stop offset="0%" stopColor="#72d8ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0088cc" stopOpacity="0" />
        </radialGradient>
        <filter id={`${p}-gf`}>
          <feGaussianBlur stdDeviation="3.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="19" cy="24" rx="20" ry="25" fill={`url(#${p}-gl)`} />
      {/* Diamond shape */}
      <path d="M19,2 L37,19 L19,46 L1,19 Z"
        fill={`url(#${p}-bg)`} stroke="#0088cc" strokeWidth="1.6" filter={`url(#${p}-gf)`} />
      {/* Table (top facet) */}
      <path d="M19,2 L29,13 L19,17 L9,13 Z" fill="white" fillOpacity="0.38" />
      {/* Girdle line */}
      <line x1="1" y1="19" x2="37" y2="19" stroke="white" strokeWidth="0.5" strokeOpacity="0.38" />
      {/* Crown facets */}
      <line x1="1" y1="19" x2="19" y2="17" stroke="white" strokeWidth="0.6" strokeOpacity="0.45" />
      <line x1="37" y1="19" x2="19" y2="17" stroke="#0055aa" strokeWidth="0.6" strokeOpacity="0.55" />
      {/* Pavilion facets */}
      <line x1="1" y1="19" x2="19" y2="34" stroke="#0055aa" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="37" y1="19" x2="19" y2="34" stroke="#0044aa" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="19" y1="46" x2="19" y2="34" stroke="#0066cc" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="9" y1="13" x2="29" y2="13" stroke="white" strokeWidth="0.4" strokeOpacity="0.3" />
      {/* Sparkle top-right */}
      <line x1="28" y1="6" x2="30" y2="6" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="29" y1="5" x2="29" y2="7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      {/* Division */}
      <text x="19" y="24" textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="8" fontWeight="900" fontFamily="'Segoe UI',sans-serif" letterSpacing="1.2">
        {div}
      </text>
    </svg>
  );
}

// ─── Champion ────────────────────────────────────────────────────────────────
// Crown + ornate shield, rainbow shimmer, star, maximum impressiveness
function ChampionEmblem({ p, h }: { p: string; h: number }) {
  const w = h * 0.84;
  // 12 starburst rays
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const long = i % 3 === 0;
    return { x1: 20 + 17 * Math.cos(a), y1: 38 + 17 * Math.sin(a), x2: 20 + (long ? 24 : 21) * Math.cos(a), y2: 38 + (long ? 24 : 21) * Math.sin(a) };
  });
  return (
    <svg width={w} height={h} viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${p}-sh`} x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#fff9cc" />
          <stop offset="28%" stopColor="#ffd700" />
          <stop offset="55%" stopColor="#ff9900" />
          <stop offset="100%" stopColor="#cc5500" />
        </linearGradient>
        <linearGradient id={`${p}-cr`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff6c0" />
          <stop offset="100%" stopColor="#ffc000" />
        </linearGradient>
        <radialGradient id={`${p}-gl`} cx="50%" cy="58%" r="52%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.75" />
          <stop offset="65%" stopColor="#ff9000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
        </radialGradient>
        <filter id={`${p}-gf`}>
          <feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${p}-gf2`}>
          <feGaussianBlur stdDeviation="1.8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer glow */}
      <ellipse cx="20" cy="38" rx="22" ry="22" fill={`url(#${p}-gl)`} filter={`url(#${p}-gf)`} />
      {/* Starburst rays */}
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="#ffd700" strokeWidth={i % 3 === 0 ? '1.5' : '0.7'} strokeOpacity="0.5" />
      ))}

      {/* Shield body */}
      <path d="M5,26 Q5,22 9,22 L15,22 Q18,22 20,27 Q22,22 25,22 L31,22 Q35,22 35,26 L35,40 Q35,51 20,58 Q5,51 5,40 Z"
        fill={`url(#${p}-sh)`} stroke="#c88800" strokeWidth="1.6" filter={`url(#${p}-gf2)`} />
      {/* Shield inner */}
      <path d="M8,27 L15,27 Q18,27 20,31 Q22,27 25,27 L32,27 L32,39 Q32,47 20,54 Q8,47 8,39 Z"
        fill="none" stroke="#c88800" strokeWidth="0.75" strokeOpacity="0.6" />

      {/* Crown base bar */}
      <rect x="10" y="17" width="20" height="7" rx="1.5"
        fill={`url(#${p}-cr)`} stroke="#c88800" strokeWidth="1.2" />
      {/* Crown spikes */}
      <polygon points="10,17 13,9 16,17" fill={`url(#${p}-cr)`} stroke="#c88800" strokeWidth="1.1" />
      <polygon points="17,17 20,5 23,17" fill={`url(#${p}-cr)`} stroke="#c88800" strokeWidth="1.1" />
      <polygon points="24,17 27,9 30,17" fill={`url(#${p}-cr)`} stroke="#c88800" strokeWidth="1.1" />

      {/* Crown gem highlights */}
      <circle cx="14.5" cy="13" r="2" fill="#ff3333" />
      <circle cx="20" cy="9" r="2.5" fill="#ff9900" />
      <circle cx="25.5" cy="13" r="2" fill="#ff3333" />
      {/* Gem shine */}
      <circle cx="13.8" cy="12.3" r="0.7" fill="white" fillOpacity="0.8" />
      <circle cx="19.3" cy="8.2" r="0.9" fill="white" fillOpacity="0.8" />
      <circle cx="24.8" cy="12.3" r="0.7" fill="white" fillOpacity="0.8" />

      {/* 5-point star in shield */}
      <polygon
        points="20,32 21.8,37.5 27.6,37.5 22.9,40.9 24.7,46.4 20,43 15.3,46.4 17.1,40.9 12.4,37.5 18.2,37.5"
        fill="white" fillOpacity="0.92" stroke="#c88800" strokeWidth="0.6" />

      {/* Corner sparkles */}
      <line x1="7" y1="24" x2="9" y2="24" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.85" />
      <line x1="8" y1="23" x2="8" y2="25" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.85" />
      <line x1="31" y1="24" x2="33" y2="24" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.85" />
      <line x1="32" y1="23" x2="32" y2="25" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.85" />
      <line x1="13" y1="4" x2="14.4" y2="4" stroke="white" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="13.7" y1="3.3" x2="13.7" y2="4.7" stroke="white" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="25.6" y1="4" x2="27" y2="4" stroke="white" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="26.3" y1="3.3" x2="26.3" y2="4.7" stroke="white" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
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
