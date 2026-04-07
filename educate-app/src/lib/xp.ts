import { supabaseAdmin } from './supabase';

// ── Points per mark by question type ──────────────────────────────────────────
const XP_PER_MARK: Record<string, number> = {
  'past-paper': 10, // 8-20 marks → 80-200 XP
  long: 8,          // 6-8 marks → 48-64 XP
  mid: 6,           // 3-5 marks → 18-30 XP
  short: 5,         // 1-2 marks → 5-10 XP
};

/** Calculate XP earned from marks awarded */
export function calculateXP(questionType: string, marksAwarded: number): number {
  const rate = XP_PER_MARK[questionType] ?? 8;
  return marksAwarded * rate;
}

// ── Level thresholds ──────────────────────────────────────────────────────────
// Level N requires LEVEL_THRESHOLDS[N] total XP. Grows quadratically.
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Level 2 = 100, Level 3 = 300, Level 4 = 600, Level 5 = 1000, ...
  return Math.floor(50 * level * (level - 1));
}

/** Given total XP, compute the current level */
export function levelFromXP(totalXP: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

/** Get level progress as a fraction 0-1 */
export function levelProgress(totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number; progress: number } {
  const level = levelFromXP(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const progress = nextLevelXP > currentLevelXP
    ? (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)
    : 1;
  return { level, currentLevelXP, nextLevelXP, progress };
}

// ── Level titles ──────────────────────────────────────────────────────────────
const LEVEL_TITLES: Record<number, string> = {
  1: 'Beginner',
  2: 'Learner',
  3: 'Student',
  5: 'Scholar',
  8: 'Expert',
  10: 'Master',
  15: 'Genius',
  20: 'Legend',
  25: 'Mythic',
  30: 'Transcendent',
};

export function getLevelTitle(level: number): string {
  let title = 'Beginner';
  for (const [threshold, t] of Object.entries(LEVEL_TITLES)) {
    if (level >= Number(threshold)) title = t;
  }
  return title;
}

// ── Database helpers ──────────────────────────────────────────────────────────

/** Ensure a profile exists for the user, creating one if needed */
export async function ensureProfile(userId: string, displayName?: string): Promise<{ xp: number; level: number; display_name: string }> {
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('xp, level, display_name')
    .eq('user_id', userId)
    .single();

  if (existing) return existing;

  const { data: created } = await supabaseAdmin
    .from('profiles')
    .insert({ user_id: userId, display_name: displayName || 'Student' })
    .select('xp, level, display_name')
    .single();

  return created ?? { xp: 0, level: 1, display_name: displayName || 'Student' };
}

/** Award XP to a user and update their level */
export async function awardXP(userId: string, xpGained: number): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  const profile = await ensureProfile(userId);
  const newXP = profile.xp + xpGained;
  const newLevel = levelFromXP(newXP);
  const leveledUp = newLevel > profile.level;

  await supabaseAdmin
    .from('profiles')
    .update({ xp: newXP, level: newLevel, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  return { newXP, newLevel, leveledUp };
}

/** Get top N users by XP for the leaderboard */
export async function getLeaderboard(limit = 50): Promise<Array<{ user_id: string; display_name: string; avatar_url: string | null; xp: number; level: number }>> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('user_id, display_name, avatar_url, xp, level')
    .order('xp', { ascending: false })
    .limit(limit);

  return data ?? [];
}

/** Get friends leaderboard for a user */
export async function getFriendsLeaderboard(userId: string): Promise<Array<{ user_id: string; display_name: string; avatar_url: string | null; xp: number; level: number }>> {
  // Get accepted friend IDs
  const { data: friendships } = await supabaseAdmin
    .from('friendships')
    .select('requester_id, addressee_id')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .eq('status', 'accepted');

  const friendIds = (friendships ?? []).map(f =>
    f.requester_id === userId ? f.addressee_id : f.requester_id
  );
  friendIds.push(userId); // Include self

  if (friendIds.length === 0) return [];

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('user_id, display_name, avatar_url, xp, level')
    .in('user_id', friendIds)
    .order('xp', { ascending: false });

  return data ?? [];
}
