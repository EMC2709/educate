import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * POST /api/shared-flashcards/[id]/clone
 * Copies a public deck and all its cards into the signed-in user's account.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Sign in to copy decks' }, { status: 401 });
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id: sourceDeckId } = await params;

  try {
    // Verify the source deck is public
    const source = await sql`
      SELECT id, name, subject, card_count
      FROM   user_flashcard_decks
      WHERE  id = ${sourceDeckId} AND is_public = true
    `;
    if (!source.length) {
      return NextResponse.json({ error: 'Deck not found or not public' }, { status: 404 });
    }
    const orig = source[0] as { id: string; name: string; subject: string | null; card_count: number };

    // Create a new deck owned by the current user
    const newDecks = await sql`
      INSERT INTO user_flashcard_decks (user_id, name, subject, card_count)
      VALUES (${userId}, ${'Copy of ' + orig.name}, ${orig.subject}, ${orig.card_count})
      RETURNING id
    `;
    const newDeckId = (newDecks[0] as { id: string }).id;

    // Copy all cards from the source deck
    const cards = await sql`
      SELECT term, definition, example, position
      FROM   user_flashcards
      WHERE  deck_id = ${sourceDeckId}
      ORDER  BY position ASC, created_at ASC
    `;

    if (cards.length > 0) {
      const cardsJson = JSON.stringify(
        cards.map((c: Record<string, unknown>) => ({
          term:       c.term,
          definition: c.definition,
          example:    c.example ?? null,
          position:   c.position,
        })),
      );

      await sql`
        INSERT INTO user_flashcards (deck_id, user_id, term, definition, example, position)
        SELECT
          ${newDeckId},
          ${userId},
          c->>'term',
          c->>'definition',
          c->>'example',
          (c->>'position')::int
        FROM json_array_elements(${cardsJson}::json) AS c
      `;
    }

    return NextResponse.json({
      deck: {
        id:         newDeckId,
        name:       'Copy of ' + orig.name,
        subject:    orig.subject,
        card_count: orig.card_count,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }, { status: 201 });
  } catch (err) {
    console.error('[shared-flashcards clone]', err);
    return NextResponse.json({ error: 'Failed to clone deck' }, { status: 500 });
  }
}
