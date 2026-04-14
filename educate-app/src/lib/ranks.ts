/** Rainbow Six Siege-inspired rank system based on XP */

export interface Rank {
  tier: string;        // e.g. 'Gold'
  division: string;    // e.g. 'III' (empty string for Champion)
  label: string;       // e.g. 'Gold III'
  icon: string;        // emoji
  color: string;       // primary hex colour
  glowColor: string;   // rgba glow for cards
  minXP: number;
}

const DIVISIONS = ['V', 'IV', 'III', 'II', 'I'] as const;

// XP thresholds for each tier × division (index 0 = V, index 4 = I)
const TIERS: Array<{ tier: string; icon: string; color: string; glowColor: string; thresholds: number[] }> = [
  {
    tier: 'Copper',
    icon: '🟤',
    color: '#b87333',
    glowColor: 'rgba(184,115,51,0.35)',
    thresholds: [0, 50, 120, 220, 350],
  },
  {
    tier: 'Bronze',
    icon: '🟠',
    color: '#cd7f32',
    glowColor: 'rgba(205,127,50,0.35)',
    thresholds: [500, 750, 1_050, 1_400, 1_800],
  },
  {
    tier: 'Silver',
    icon: '⚪',
    color: '#c0c0c0',
    glowColor: 'rgba(192,192,192,0.35)',
    thresholds: [2_300, 2_900, 3_600, 4_400, 5_300],
  },
  {
    tier: 'Gold',
    icon: '🟡',
    color: '#ffd700',
    glowColor: 'rgba(255,215,0,0.35)',
    thresholds: [6_500, 8_000, 9_800, 12_000, 15_000],
  },
  {
    tier: 'Platinum',
    icon: '🔷',
    color: '#30aabc',
    glowColor: 'rgba(48,170,188,0.35)',
    thresholds: [18_500, 22_500, 27_000, 32_000, 38_000],
  },
  {
    tier: 'Emerald',
    icon: '💚',
    color: '#50c878',
    glowColor: 'rgba(80,200,120,0.35)',
    thresholds: [45_000, 53_000, 63_000, 75_000, 90_000],
  },
  {
    tier: 'Diamond',
    icon: '💎',
    color: '#a3d8f4',
    glowColor: 'rgba(163,216,244,0.35)',
    thresholds: [108_000, 130_000, 156_000, 188_000, 225_000],
  },
];

const CHAMPION_XP = 270_000;

// Build flat list of all ranks
export const ALL_RANKS: Rank[] = [
  ...TIERS.flatMap(t =>
    DIVISIONS.map((div, i) => ({
      tier: t.tier,
      division: div,
      label: `${t.tier} ${div}`,
      icon: t.icon,
      color: t.color,
      glowColor: t.glowColor,
      minXP: t.thresholds[i],
    }))
  ),
  {
    tier: 'Champion',
    division: '',
    label: 'Champion',
    icon: '👑',
    color: '#f9d71c',
    glowColor: 'rgba(249,215,28,0.45)',
    minXP: CHAMPION_XP,
  },
];

export function getRank(xp: number): Rank {
  // Walk backwards to find the highest rank the player qualifies for
  for (let i = ALL_RANKS.length - 1; i >= 0; i--) {
    if (xp >= ALL_RANKS[i].minXP) return ALL_RANKS[i];
  }
  return ALL_RANKS[0]; // Copper V fallback
}

export function getNextRank(xp: number): Rank | null {
  const current = getRank(xp);
  const idx = ALL_RANKS.findIndex(r => r.label === current.label);
  return idx < ALL_RANKS.length - 1 ? ALL_RANKS[idx + 1] : null;
}

export function rankProgress(xp: number): {
  rank: Rank;
  nextRank: Rank | null;
  progressPct: number;
  xpIntoRank: number;
  xpNeeded: number;
} {
  const rank = getRank(xp);
  const next = getNextRank(xp);
  if (!next) {
    return { rank, nextRank: null, progressPct: 100, xpIntoRank: 0, xpNeeded: 0 };
  }
  const xpIntoRank = xp - rank.minXP;
  const xpNeeded = next.minXP - rank.minXP;
  const progressPct = Math.min(100, Math.round((xpIntoRank / xpNeeded) * 100));
  return { rank, nextRank: next, progressPct, xpIntoRank, xpNeeded };
}
