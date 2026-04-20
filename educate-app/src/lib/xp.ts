import { sql } from './db';

// ── Points per mark by question type ──────────────────────────────────────────
const XP_PER_MARK: Record<string, number> = {
  'past-paper': 10,
  long: 8,
  mid: 6,
  short: 5,
};

export function calculateXP(questionType: string, marksAwarded: number): number {
  const rate = XP_PER_MARK[questionType] ?? 8;
  return marksAwarded * rate;
}

// ── Level thresholds ──────────────────────────────────────────────────────────
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

export function levelProgress(totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number; progress: number } {
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

// ── Database helpers ──────────────────────────────────────────────────────────

export async function ensureProfile(userId: string, displayName?: string): Promise<{ xp: number; level: number; display_name: string; role: string; org_id: string | null; year_group: number | null }> {
  const rows = await sql`SELECT xp, level, display_name, role, org_id, year_group FROM profiles WHERE user_id = ${userId}`;
  if (rows.length > 0) return rows[0] as { xp: number; level: number; display_name: string; role: string; org_id: string | null; year_group: number | null };

  const created = await sql`
    INSERT INTO profiles (user_id, display_name)
    VALUES (${userId}, ${displayName || 'Student'})
    ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name
    RETURNING xp, level, display_name, role, org_id, year_group
  `;
  return (created[0] as { xp: number; level: number; display_name: string; role: string; org_id: string | null; year_group: number | null }) ?? { xp: 0, level: 1, display_name: displayName || 'Student', role: 'student', org_id: null, year_group: null };
}

export async function awardXP(userId: string, xpGained: number): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  // Atomic increment — avoids race condition where two simultaneous answers
  // both read the same xp value and the second write overwrites the first.
  const result = await sql`
    INSERT INTO profiles (user_id, xp, level, display_name)
    VALUES (${userId}, ${xpGained}, 1, 'Student')
    ON CONFLICT (user_id) DO UPDATE
      SET xp = profiles.xp + ${xpGained},
          updated_at = now()
    RETURNING xp, level, display_name
  `;

  const row = result[0] as { xp: number; level: number };
  const newXP = row.xp;
  const oldLevel = row.level;
  const newLevel = levelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;

  // Update level separately if it changed
  if (leveledUp) {
    await sql`UPDATE profiles SET level = ${newLevel}, updated_at = now() WHERE user_id = ${userId}`;
  }

  return { newXP, newLevel, leveledUp };
}

export async function getLeaderboard(limit = 50): Promise<Array<{ user_id: string; display_name: string; avatar_url: string | null; xp: number; level: number }>> {
  const rows = await sql`
    SELECT user_id, display_name, avatar_url, xp, level
    FROM profiles ORDER BY xp DESC LIMIT ${limit}
  `;
  return rows as Array<{ user_id: string; display_name: string; avatar_url: string | null; xp: number; level: number }>;
}

export async function getFriendsLeaderboard(userId: string): Promise<Array<{ user_id: string; display_name: string; avatar_url: string | null; xp: number; level: number }>> {
  const friendships = await sql`
    SELECT requester_id, addressee_id FROM friendships
    WHERE (requester_id = ${userId} OR addressee_id = ${userId}) AND status = 'accepted'
  `;

  const friendIds = (friendships as Array<{ requester_id: string; addressee_id: string }>).map(f =>
    f.requester_id === userId ? f.addressee_id : f.requester_id
  );
  friendIds.push(userId);

  if (friendIds.length === 0) return [];

  const rows = await sql`
    SELECT user_id, display_name, avatar_url, xp, level
    FROM profiles WHERE user_id = ANY(${friendIds}) ORDER BY xp DESC
  `;
  return rows as Array<{ user_id: string; display_name: string; avatar_url: string | null; xp: number; level: number }>;
}
