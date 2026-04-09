import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * GET /api/past-papers
 * Query params:
 *   country   - filter by country
 *   examType  - filter by exam type
 *   subject   - filter by subject
 *   q         - full-text search across raw_text
 *   limit     - max results (default 20)
 *   offset    - pagination offset
 *
 * GET /api/past-papers?id=<uuid>
 *   Returns full paper including page_analyses and questions
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const p = req.nextUrl.searchParams;
  const id       = p.get('id');
  const country  = p.get('country');
  const examType = p.get('examType');
  const subject  = p.get('subject');
  const q        = p.get('q');
  const limit    = Math.min(parseInt(p.get('limit') ?? '20'), 100);
  const offset   = parseInt(p.get('offset') ?? '0');

  try {
    // Single paper by ID (includes full content)
    if (id) {
      const rows = await sql`
        SELECT id, drive_file_id, country, exam_type, subject, title, year, paper_number,
               raw_text, page_analyses, questions, processed_at
        FROM past_papers WHERE id = ${id} LIMIT 1
      `;
      if (rows.length === 0) return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
      return NextResponse.json(rows[0]);
    }

    // List / filter (no raw_text to keep response small)
    let rows;
    if (q) {
      // Full-text search
      rows = await sql`
        SELECT id, country, exam_type, subject, title, year, paper_number, processed_at,
               ts_rank(to_tsvector('english', coalesce(raw_text, '')), plainto_tsquery('english', ${q})) AS rank
        FROM past_papers
        WHERE
          to_tsvector('english', coalesce(raw_text, '')) @@ plainto_tsquery('english', ${q})
          ${country  ? sql`AND country   = ${country}`  : sql``}
          ${examType ? sql`AND exam_type = ${examType}` : sql``}
          ${subject  ? sql`AND subject   = ${subject}`  : sql``}
        ORDER BY rank DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      rows = await sql`
        SELECT id, country, exam_type, subject, title, year, paper_number, processed_at
        FROM past_papers
        WHERE
          1=1
          ${country  ? sql`AND country   = ${country}`  : sql``}
          ${examType ? sql`AND exam_type = ${examType}` : sql``}
          ${subject  ? sql`AND subject   = ${subject}`  : sql``}
        ORDER BY country, exam_type, subject, year DESC NULLS LAST, title
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // Also return available filter values
    const meta = await sql`
      SELECT DISTINCT country FROM past_papers ORDER BY country
    `;

    return NextResponse.json({
      papers: rows,
      total:  rows.length,
      offset,
      countries: (meta as Array<{ country: string }>).map(r => r.country),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
