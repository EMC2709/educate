/**
 * Who can open which stored past paper (table `paper_opens`).
 *
 * Students and teachers in a school with an active licence open every paper. Everyone else
 * gets FREE_PAPER_LIMIT papers to try, for good: the first papers they open are theirs to go
 * back to, and any other paper is refused. Every route that serves a stored paper's content
 * (questions, PDF, page images, page count, mark scheme) asks here first.
 */
import { sql } from './db';
import { getAccessTier } from './school-licence';
import { FREE_PAPER_LIMIT } from './plan-limits';

export { FREE_PAPER_LIMIT } from './plan-limits';

export const PAPER_LIMIT_MESSAGE =
  `You've opened your ${FREE_PAPER_LIMIT} free past papers, and you can go back to them at any time. ` +
  'Every past paper comes with an Educate school licence. Ask your teacher about Educate for your school.';

// Allowed (user, paper) pairs per server instance, so the page images of one paper
// don't each repeat the lookup.
const allowed = new Map<string, number>();
const ALLOWED_MS = 10 * 60_000;

export async function canOpenPaper(userId: string, paperId: string): Promise<boolean> {
  const key = `${userId}|${paperId}`;
  const at = allowed.get(key);
  if (at && Date.now() - at < ALLOWED_MS) return true;

  let ok: boolean;
  if ((await getAccessTier(userId)) === 'school') {
    ok = true;
  } else {
    try {
      // Record the paper only while the student is under the limit. Two different papers
      // opened in the same instant could both get in; that is accepted.
      const rows = await sql`
        WITH existing AS (
          SELECT 1 FROM paper_opens WHERE user_id = ${userId} AND paper_id = ${paperId}
        ), added AS (
          INSERT INTO paper_opens (user_id, paper_id)
          SELECT ${userId}, ${paperId}
          WHERE NOT EXISTS (SELECT 1 FROM existing)
            AND (SELECT count(*) FROM paper_opens WHERE user_id = ${userId}) < ${FREE_PAPER_LIMIT}
          ON CONFLICT DO NOTHING
          RETURNING 1
        )
        SELECT (EXISTS (SELECT 1 FROM existing) OR EXISTS (SELECT 1 FROM added)) AS ok
      ` as Array<{ ok: boolean }>;
      ok = rows[0]?.ok === true;
    } catch (err) {
      // Same as the AI allowance: if the table can't be reached, let the paper through and log it.
      console.error('[paper-access] could not check free papers, allowing it:', err instanceof Error ? err.message : err);
      return true;
    }
  }

  if (ok) {
    if (allowed.size > 5000) allowed.clear();
    allowed.set(key, Date.now());
  }
  return ok;
}

/** The 403 every paper route returns when the free papers are used up. */
export function paperLimitResponse() {
  return Response.json({ error: PAPER_LIMIT_MESSAGE, code: 'paper_limit' }, { status: 403, headers: { 'Cache-Control': 'private, no-store' } });
}
