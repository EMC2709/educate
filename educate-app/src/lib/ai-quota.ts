/**
 * Daily AI allowance per student, kept in the database (table `ai_usage`).
 *
 * The in-memory rate limiter only stops bursts and resets whenever a server instance
 * restarts, so on its own it puts no ceiling on what one account can spend. Every route
 * that calls a model takes one use from the matching bucket here, just before the call.
 *
 * There are two tiers (see lib/school-licence.ts): a small free taster for everyone, and the
 * full allowance for students and teachers whose school has an active licence.
 *
 * Days run on UK time, so allowances come back at midnight in London.
 * The limits below are starting values, to be set from real usage.
 */
import { sql } from './db';
import { getAccessTier } from './school-licence';
import { AI_DAILY_LIMITS, type AccessTier, type AiBucket } from './plan-limits';

export { AI_DAILY_LIMITS, type AiBucket } from './plan-limits';

const ONE: Record<AiBucket, string> = {
  tutor: 'AI tutor message',
  study: 'AI study tool or set of notes',
  answer_marking: 'AI-marked answer',
  question_gen: 'AI-written question set',
  paper_marking: 'AI-marked paper',
};

const WHAT: Record<AiBucket, string> = {
  tutor: 'AI tutor messages',
  study: 'AI study tools and notes',
  answer_marking: 'AI-marked answers',
  question_gen: 'AI-written question sets',
  paper_marking: 'AI-marked papers',
};

export function aiLimitMessage(bucket: AiBucket, tier: AccessTier = 'school'): string {
  const limit = AI_DAILY_LIMITS[tier][bucket];
  if (tier === 'free') {
    const schoolLimit = AI_DAILY_LIMITS.school[bucket];
    if (limit === 0) {
      return `${WHAT[bucket][0].toUpperCase()}${WHAT[bucket].slice(1)} come with an Educate school licence (${schoolLimit} a day). Ask your teacher about Educate for your school.`;
    }
    const what = limit === 1 ? `free ${ONE[bucket]}` : `${limit} free ${WHAT[bucket]}`;
    return `You've used today's ${what}. More from midnight. Schools with an Educate licence get ${schoolLimit} a day.`;
  }
  return `You've used today's ${limit} ${WHAT[bucket]}. You can use them again from midnight.`;
}

export interface AiUseResult {
  ok: boolean;
  tier: AccessTier;
  limit: number;
  /** Uses counted today, including this one when ok */
  used: number | null;
  /** What to tell the student when ok is false */
  message: string;
}

/**
 * Take one use from today's allowance. Atomic: the row is only incremented while it is
 * under the limit, so parallel requests can't overshoot.
 */
export async function takeAiUse(userId: string, bucket: AiBucket): Promise<AiUseResult> {
  const tier = await getAccessTier(userId);
  const limit = AI_DAILY_LIMITS[tier][bucket];
  const message = aiLimitMessage(bucket, tier);
  if (limit <= 0) return { ok: false, tier, limit, used: 0, message };
  try {
    const rows = await sql`
      INSERT INTO ai_usage (user_id, day, bucket, uses)
      VALUES (${userId}, (now() AT TIME ZONE 'Europe/London')::date, ${bucket}, 1)
      ON CONFLICT (user_id, day, bucket)
      DO UPDATE SET uses = ai_usage.uses + 1, updated_at = now()
      WHERE ai_usage.uses < ${limit}
      RETURNING uses
    ` as Array<{ uses: number }>;
    if (rows.length === 0) return { ok: false, tier, limit, used: limit, message };
    return { ok: true, tier, limit, used: rows[0].uses, message };
  } catch (err) {
    // If the database cannot be reached, AI stays available (the burst rate limits still apply),
    // matching the school AI switch. Logged loudly, because no daily cap is enforced meanwhile.
    console.error('[ai-quota] could not record AI use, allowing it:', err instanceof Error ? err.message : err);
    return { ok: true, tier, limit, used: null, message };
  }
}

/** Give a use back when the model call failed, so a student isn't charged for an error. */
export async function refundAiUse(userId: string, bucket: AiBucket): Promise<void> {
  try {
    await sql`
      UPDATE ai_usage SET uses = GREATEST(uses - 1, 0), updated_at = now()
      WHERE user_id = ${userId} AND bucket = ${bucket}
        AND day = (now() AT TIME ZONE 'Europe/London')::date
    `;
  } catch (err) {
    console.error('[ai-quota] could not refund AI use:', err instanceof Error ? err.message : err);
  }
}
