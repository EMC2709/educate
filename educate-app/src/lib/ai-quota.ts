/**
 * Daily AI allowance per student, kept in the database (table `ai_usage`).
 *
 * The in-memory rate limiter only stops bursts and resets whenever a server instance
 * restarts, so on its own it puts no ceiling on what one account can spend. Every route
 * that calls a model takes one use from the matching bucket here, just before the call.
 *
 * Days run on UK time, so allowances come back at midnight in London.
 * The limits below are starting values, to be set from real usage; paid plans would
 * raise them per user later.
 */
import { sql } from './db';

export type AiBucket = 'tutor' | 'study' | 'answer_marking' | 'question_gen' | 'paper_marking';

export const AI_DAILY_LIMITS: Record<AiBucket, number> = {
  tutor: 40,          // tutor chat and topic chat messages (Sonnet 5.5), including "Generate with AI" on the notes page
  study: 10,          // study tools from notes (Sonnet 5.5) and revision notes (Haiku)
  answer_marking: 60, // AI marking of single answers (Haiku); over the limit, the built-in marker takes over
  question_gen: 10,   // AI-written questions for subjects with no built-in bank (Haiku)
  paper_marking: 2,   // marking a whole paper against its mark scheme (Opus): the expensive one
};

const WHAT: Record<AiBucket, string> = {
  tutor: 'AI tutor messages',
  study: 'AI study tools and notes',
  answer_marking: 'AI-marked answers',
  question_gen: 'AI-written question sets',
  paper_marking: 'AI-marked papers',
};

export function aiLimitMessage(bucket: AiBucket): string {
  return `You've used today's ${AI_DAILY_LIMITS[bucket]} ${WHAT[bucket]}. You can use them again from midnight.`;
}

export interface AiUseResult {
  ok: boolean;
  limit: number;
  /** Uses counted today, including this one when ok */
  used: number | null;
}

/**
 * Take one use from today's allowance. Atomic: the row is only incremented while it is
 * under the limit, so parallel requests can't overshoot.
 */
export async function takeAiUse(userId: string, bucket: AiBucket): Promise<AiUseResult> {
  const limit = AI_DAILY_LIMITS[bucket];
  try {
    const rows = await sql`
      INSERT INTO ai_usage (user_id, day, bucket, uses)
      VALUES (${userId}, (now() AT TIME ZONE 'Europe/London')::date, ${bucket}, 1)
      ON CONFLICT (user_id, day, bucket)
      DO UPDATE SET uses = ai_usage.uses + 1, updated_at = now()
      WHERE ai_usage.uses < ${limit}
      RETURNING uses
    ` as Array<{ uses: number }>;
    if (rows.length === 0) return { ok: false, limit, used: limit };
    return { ok: true, limit, used: rows[0].uses };
  } catch (err) {
    // If the database cannot be reached, AI stays available (the burst rate limits still apply),
    // matching the school AI switch. Logged loudly, because no daily cap is enforced meanwhile.
    console.error('[ai-quota] could not record AI use, allowing it:', err instanceof Error ? err.message : err);
    return { ok: true, limit, used: null };
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
