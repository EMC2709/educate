import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * GET /api/shared-flashcards?search=&subject=&limit=24&offset=0
 * Returns public flashcard decks for the community browse page.
 * No auth required — public content.
 */
export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ decks: [] });

  const { searchParams } = new URL(request.url);
  const search  = searchParams.get('search')?.trim()  || '';
  const subject = searchParams.get('subject')?.trim() || '';
  const limit   = Math.min(parseInt(searchParams.get('limit')  || '24', 10), 60);
  const offset  = Math.max(parseInt(searchParams.get('offset') || '0',  10), 0);

  try {
    const rows = await sql`
      SELECT   id, name, subject, card_count, shared_by_name, updated_at
      FROM     user_flashcard_decks
      WHERE    is_public = true
        AND    card_count > 0
        AND    (${search} = '' OR name ILIKE ${'%' + search + '%'})
        AND    (${subject} = '' OR subject ILIKE ${'%' + subject + '%'})
      ORDER BY updated_at DESC
      LIMIT  ${limit}
      OFFSET ${offset}
    `;
    return NextResponse.json({ decks: rows });
  } catch (err) {
    console.error('[shared-flashcards GET]', err);
    return NextResponse.json({ decks: [] });
  }
}
