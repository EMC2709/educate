/**
 * The school "AI off" switch (organisations.ai_disabled), checked on the server.
 *
 * A school's teacher can switch AI features off for everyone in that school. Every route
 * that calls a model asks here first, so the switch works whatever the browser sends.
 * People who are not in a school are never affected.
 */
import { sql } from './db';

export const AI_DISABLED_MESSAGE = 'AI features are switched off for your school.';

export async function isAiDisabledFor(userId: string): Promise<boolean> {
  try {
    const rows = await sql`
      SELECT o.ai_disabled
      FROM profiles p
      JOIN organisations o ON o.id = p.org_id
      WHERE p.user_id = ${userId}
      LIMIT 1
    ` as Array<{ ai_disabled: boolean | null }>;
    return rows[0]?.ai_disabled === true;
  } catch (err) {
    // If the database cannot be reached, AI stays available rather than failing for every student
    console.error('[ai-access] could not read the school AI setting:', err instanceof Error ? err.message : err);
    return false;
  }
}
