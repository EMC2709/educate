import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * GET /api/past-papers
 *
 * List papers (metadata only — fast):
 *   ?country=Scotland&examType=GCSE&subject=Maths&limit=20&offset=0
 *
 * Single paper + its questions:
 *   ?id=<uuid>
 *
 * Response is cached at the CDN edge for 5 minutes.
 * With 100s of students the DB is hit ~once per 5 min per unique query.
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const p        = req.nextUrl.searchParams;
  const id       = p.get('id');
  const country  = p.get('country')  || null;
  const examType = p.get('examType') || null;
  const subject  = p.get('subject')  || null;
  const limit    = Math.min(parseInt(p.get('limit')  ?? '20'), 100);
  const offset   = parseInt(p.get('offset') ?? '0');

  try {
    if (id) {
      // Single paper with questions — used when student opens a paper
      const papers = await sql`
        SELECT id, drive_file_id, country, exam_type, subject, title, year, paper_number,
               total_questions, has_images, processed_at
        FROM past_papers WHERE id = ${id} LIMIT 1
      `;
      if (papers.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const questions = await sql`
        SELECT id, question_number, question_text, marks, topic, has_image, image_desc, difficulty
        FROM questions WHERE paper_id = ${id}
        ORDER BY question_number NULLS LAST
      `;

      return NextResponse.json(
        { paper: papers[0], questions },
        { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
      );
    }

    // List view — filters applied, metadata only
    const papers = await sql`
      SELECT id, country, exam_type, subject, title, year, paper_number, total_questions, has_images
      FROM past_papers
      WHERE processed = true
        ${country  ? sql`AND country   = ${country}`  : sql``}
        ${examType ? sql`AND exam_type = ${examType}` : sql``}
        ${subject  ? sql`AND subject   = ${subject}`  : sql``}
      ORDER BY subject, year DESC NULLS LAST, title
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Distinct filter values for the UI dropdowns
    const meta = await sql`
      SELECT
        array_agg(DISTINCT country   ORDER BY country)   AS countries,
        array_agg(DISTINCT exam_type ORDER BY exam_type) AS exam_types,
        array_agg(DISTINCT subject   ORDER BY subject)   AS subjects
      FROM past_papers WHERE processed = true
    `;

    return NextResponse.json(
      { papers, meta: meta[0], total: papers.length, offset },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
