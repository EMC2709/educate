import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * GET /api/questions — the hot path for students practising
 *
 * Params:
 *   subject    required  e.g. Maths
 *   examType   optional  e.g. GCSE
 *   country    optional  e.g. Scotland
 *   component  optional  e.g. Biology (for Combined Science)
 *   topic      optional  e.g. trigonometry
 *   marks      optional  exact mark value
 *   hasImage   optional  true/false
 *   q          optional  full-text keyword search
 *   limit      optional  default 10, max 50
 *   random     optional  true = random order (for quiz mode)
 *
 * Cached at CDN edge for 5 minutes → handles 100s of concurrent students
 * hitting the same subject/topic combo with zero extra DB load.
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const p         = req.nextUrl.searchParams;
  const subject   = p.get('subject');
  const examType  = p.get('examType')  || null;
  const country   = p.get('country')   || null;
  const component = p.get('component') || null;
  const topic     = p.get('topic')     || null;
  const marksRaw  = p.get('marks');
  const marks    = marksRaw ? parseInt(marksRaw) : null;
  const hasImage = p.get('hasImage') === 'true' ? true : p.get('hasImage') === 'false' ? false : null;
  const q        = p.get('q')        || null;
  const random   = p.get('random') === 'true';
  const limit    = Math.min(parseInt(p.get('limit') ?? '10'), 50);

  if (!subject) return NextResponse.json({ error: 'subject required' }, { status: 400 });

  try {
    let rows;

    if (q) {
      // Full-text search mode
      rows = await sql`
        SELECT qs.id, qs.question_number, qs.question_text, qs.marks, qs.topic,
               qs.has_image, qs.image_desc, qs.difficulty,
               pp.subject, pp.exam_type, pp.country, pp.year, pp.title, pp.drive_file_id,
               ts_rank(to_tsvector('english', coalesce(qs.question_text,'') || ' ' || coalesce(qs.topic,'')),
                       plainto_tsquery('english', ${q})) AS rank
        FROM questions qs
        JOIN past_papers pp ON pp.id = qs.paper_id
        WHERE pp.subject = ${subject}
          AND to_tsvector('english', coalesce(qs.question_text,'') || ' ' || coalesce(qs.topic,''))
              @@ plainto_tsquery('english', ${q})
          ${examType  ? sql`AND pp.exam_type  = ${examType}`            : sql``}
          ${country   ? sql`AND pp.country    = ${country}`             : sql``}
          ${component ? sql`AND pp.component  = ${component}`           : sql``}
          ${topic     ? sql`AND qs.topic ILIKE ${'%' + topic + '%'}`    : sql``}
          ${marks     ? sql`AND qs.marks      = ${marks}`               : sql``}
          ${hasImage !== null ? sql`AND qs.has_image = ${hasImage}`      : sql``}
        ORDER BY rank DESC
        LIMIT ${limit}
      `;
    } else if (random) {
      // Random questions for quiz mode — VERY fast with tablesample or ORDER BY random()
      rows = await sql`
        SELECT qs.id, qs.question_number, qs.question_text, qs.marks, qs.topic,
               qs.has_image, qs.image_desc, qs.difficulty,
               pp.subject, pp.exam_type, pp.country, pp.year, pp.title, pp.drive_file_id
        FROM questions qs
        JOIN past_papers pp ON pp.id = qs.paper_id
        WHERE pp.subject = ${subject}
          ${examType  ? sql`AND pp.exam_type  = ${examType}`            : sql``}
          ${country   ? sql`AND pp.country    = ${country}`             : sql``}
          ${component ? sql`AND pp.component  = ${component}`           : sql``}
          ${topic     ? sql`AND qs.topic ILIKE ${'%' + topic + '%'}`    : sql``}
          ${marks     ? sql`AND qs.marks      = ${marks}`               : sql``}
          ${hasImage !== null ? sql`AND qs.has_image = ${hasImage}`      : sql``}
        ORDER BY random()
        LIMIT ${limit}
      `;
    } else {
      // Standard filtered list
      rows = await sql`
        SELECT qs.id, qs.question_number, qs.question_text, qs.marks, qs.topic,
               qs.has_image, qs.image_desc, qs.difficulty,
               pp.subject, pp.exam_type, pp.country, pp.year, pp.title, pp.drive_file_id
        FROM questions qs
        JOIN past_papers pp ON pp.id = qs.paper_id
        WHERE pp.subject = ${subject}
          ${examType  ? sql`AND pp.exam_type  = ${examType}`            : sql``}
          ${country   ? sql`AND pp.country    = ${country}`             : sql``}
          ${component ? sql`AND pp.component  = ${component}`           : sql``}
          ${topic     ? sql`AND qs.topic ILIKE ${'%' + topic + '%'}`    : sql``}
          ${marks     ? sql`AND qs.marks      = ${marks}`               : sql``}
          ${hasImage !== null ? sql`AND qs.has_image = ${hasImage}`      : sql``}
        ORDER BY pp.year DESC NULLS LAST, qs.question_number
        LIMIT ${limit}
      `;
    }

    // Cache at CDN — random mode gets short TTL, filtered gets 5 min
    const ttl = random ? 0 : 300;
    const cacheHeader = ttl > 0
      ? `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 2}`
      : 'no-store';

    return NextResponse.json(
      { questions: rows, count: (rows as unknown[]).length },
      { headers: { 'Cache-Control': cacheHeader } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
