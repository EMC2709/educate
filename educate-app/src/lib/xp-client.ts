/** Client-side XP/level helpers (no Supabase imports) */

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(50 * level * (level - 1));
}

export function levelFromXP(totalXP: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

export function levelProgress(totalXP: number) {
  const level = levelFromXP(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const progress = nextLevelXP > currentLevelXP
    ? (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)
    : 1;
  return { level, currentLevelXP, nextLevelXP, progress };
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Beginner', 2: 'Learner', 3: 'Student', 5: 'Scholar',
  8: 'Expert', 10: 'Master', 15: 'Genius', 20: 'Legend',
  25: 'Mythic', 30: 'Transcendent',
};

export function getLevelTitle(level: number): string {
  let title = 'Beginner';
  for (const [threshold, t] of Object.entries(LEVEL_TITLES)) {
    if (level >= Number(threshold)) title = t;
  }
  return title;
}
