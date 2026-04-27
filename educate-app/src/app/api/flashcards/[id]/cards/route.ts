import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';

const createSchema = z.object({
  term:       z.string().min(1).max(500),
  definition: z.string().min(1).max(2000),
  example:    z.string().max(1000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id: deckId } = await params;

  // Verify deck ownership
  const decks = await sql`
    SELECT id FROM user_flashcard_decks WHERE id = ${deckId} AND user_id = ${userId}
  `;
  if (!decks.length) return NextResponse.json({ error: 'Deck not found' }, { status: 404 });

  const body = createSchema.parse(await request.json());

  try {
    // Next position after the current last card
    const pos = await sql`
      SELECT COALESCE(MAX(position), -1) + 1 AS next_pos
      FROM   user_flashcards
      WHERE  deck_id = ${deckId}
    `;
    const nextPos = (pos[0] as { next_pos: number }).next_pos;

    const rows = await sql`
      INSERT INTO user_flashcards (deck_id, user_id, term, definition, example, position)
      VALUES (${deckId}, ${userId}, ${body.term}, ${body.definition}, ${body.example ?? null}, ${nextPos})
      RETURNING id, term, definition, example, position
    `;

    // Increment deck card_count
    await sql`
      UPDATE user_flashcard_decks
      SET    card_count = card_count + 1, updated_at = now()
      WHERE  id = ${deckId}
    `;

    return NextResponse.json({ card: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('[flashcards/[id]/cards POST]', err);
    return NextResponse.json({ error: 'Failed to add card' }, { status: 500 });
  }
}
