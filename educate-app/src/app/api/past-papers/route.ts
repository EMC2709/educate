import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import {
  dbSubjectsFor, parseYearLabel, examCodePattern, pickPaper, ANY_EXAM_CODE_PATTERN,
  EXAM_CODE_CAPTURE, parseExamCode, formatExamCode,
  type PaperCandidate, type PaperSelection,
} from '@/lib/past-paper-match';
import { cleanPaperQuestions } from '@/lib/question-text';

// Stored-paper codes per board + subject (scanning question text takes a second or two)
const availableCache = new Map<string, { codes: string[]; at: number }>();
const AVAILABLE_CACHE_MS = 15 * 60 * 1000;

/**
 * GET /api/past-papers
 *
 * List papers (metadata only — fast):
 *   ?country=Scotland&examType=GCSE&subject=Maths&limit=20&offset=0
 *
 * Single paper + its questions:
 *   ?id=<uuid>
 *
 * Which papers of a subject are stored (canonical exam codes, e.g. "jun23/8300/1h"):
 *   ?available=1&examType=GCSE_AQA&subject=Mathematics  → { codes: string[] }
 *
 * Resolve the paper a student picked (subject-locked, never cross-subject):
 *   ?resolve=1&examType=GCSE_AQA&subject=Mathematics&yearLabel=2023&paperNumber=1&tier=H[&component=Biology][&paperLetter=l]
 *   yearLabel is "2023" (June) or "Nov 2023". Returns { paper, match } where match is
 *   'exact' | 'metadata' | 'subject' (see lib/past-paper-match.ts) or paper: null.
 *
 * `subject` also matches known DB aliases (e.g. "Combined Science" → "Combined Science Trilogy").
 *
 * Response is cached at the CDN edge for 5 minutes.
 * With 100s of students the DB is hit ~once per 5 min per unique query.
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const p         = req.nextUrl.searchParams;
  const id        = p.get('id');
  const country   = p.get('country')   || null;
  const examType  = p.get('examType')  || null;
  const subject   = p.get('subject')   || null;
  const component = p.get('component') || null;  // Biology, Chemistry, Physics (for Combined Science)
  const year      = p.get('year')      ? parseInt(p.get('year')!) : null;
  const paperNum  = p.get('paperNumber') || null;
  const limit     = Math.min(Math.max(parseInt(p.get('limit')  ?? '20', 10) || 20, 1), 100);
  const offset    = Math.max(parseInt(p.get('offset') ?? '0', 10) || 0, 0);
  const letterRaw = (p.get('paperLetter') ?? '').toLowerCase();
  const paperLetter = letterRaw === 'l' || letterRaw === 's' || letterRaw === 'r' || letterRaw === 'w' ? letterRaw : null;

  try {
    if (p.get('available')) {
      // Which sittings/papers of this subject are stored, as canonical exam codes
      // (e.g. "jun23/8300/1h"). The papers page uses this to offer only papers Educate has.
      if (!examType || !subject) {
        return NextResponse.json({ error: 'examType and subject are required' }, { status: 400 });
      }
      const key = `${examType}|${subject}`;
      const hit = availableCache.get(key);
      if (hit && Date.now() - hit.at < AVAILABLE_CACHE_MS) {
        return NextResponse.json({ codes: hit.codes }, { headers: { 'Cache-Control': 'private, max-age=600' } });
      }
      const rows = await sql`
        SELECT DISTINCT lower(m[1]) AS code
        FROM past_papers p
        JOIN questions q ON q.paper_id = p.id
        CROSS JOIN LATERAL regexp_matches(q.question_text, ${EXAM_CODE_CAPTURE}, 'gi') AS m
        WHERE p.processed = true AND p.total_questions > 0
          AND p.exam_type = ${examType}
          AND p.subject = ANY(${dbSubjectsFor(subject)})
      ` as unknown as Array<{ code: string }>;
      const codes = [...new Set(rows.map(r => parseExamCode(r.code)).filter(c => c !== null).map(formatExamCode))].sort();
      if (availableCache.size > 500) availableCache.clear();
      availableCache.set(key, { codes, at: Date.now() });
      return NextResponse.json({ codes }, { headers: { 'Cache-Control': 'private, max-age=600' } });
    }

    if (p.get('resolve')) {
      if (!examType || !subject) {
        return NextResponse.json({ error: 'examType and subject are required' }, { status: 400 });
      }
      const parsed = parseYearLabel(p.get('yearLabel') ?? p.get('year'));
      const pnMatch = (paperNum ?? '').match(/(\d+)/);
      const tierRaw = (p.get('tier') ?? '').toUpperCase().charAt(0);
      const sel: PaperSelection = {
        year: parsed?.year ?? 0,
        session: parsed?.session ?? 'June',
        paperNumber: pnMatch ? parseInt(pnMatch[1]) : null,
        tier: tierRaw === 'H' || tierRaw === 'F' ? tierRaw : null,
        component,
        paperLetter,
      };
      const codeRe = parsed ? examCodePattern(sel) : null;

      const cands = await sql`
        SELECT p.id, p.year, p.subject, p.paper_number, p.component, p.total_questions,
               s.n_rows, s.hits, s.other_hits, s.marks
        FROM past_papers p
        JOIN LATERAL (
          SELECT count(*)::int AS n_rows,
                 ${codeRe
                   ? sql`count(*) FILTER (WHERE q.question_text ~* ${codeRe})::int AS hits,
                         count(*) FILTER (WHERE q.question_text ~* ${ANY_EXAM_CODE_PATTERN}
                                            AND NOT q.question_text ~* ${codeRe})::int AS other_hits,`
                   : sql`0 AS hits,
                         count(*) FILTER (WHERE q.question_text ~* ${ANY_EXAM_CODE_PATTERN})::int AS other_hits,`}
                 -- same clamp as the practice page: >25 is a mis-parsed section total, 0/NULL counts as 1
                 sum(CASE WHEN q.marks > 25 THEN 1 ELSE COALESCE(NULLIF(q.marks, 0), 1) END)::int AS marks
          FROM questions q WHERE q.paper_id = p.id
        ) s ON true
        WHERE p.processed = true AND p.total_questions > 0
          AND p.exam_type = ${examType}
          AND p.subject = ANY(${dbSubjectsFor(subject)})
          ${component ? sql`AND (p.component IS NULL OR p.component = ${component})` : sql``}
      ` as unknown as PaperCandidate[];

      const picked = pickPaper(cands, sel);
      return NextResponse.json(
        picked
          ? {
              paper: {
                id: picked.paper.id, year: picked.paper.year, subject: picked.paper.subject,
                paper_number: picked.paper.paper_number, component: picked.paper.component,
                total_questions: picked.paper.n_rows, marks: picked.paper.marks,
              },
              match: picked.match,
            }
          : { paper: null, match: null },
        { headers: { 'Cache-Control': 'private, max-age=300' } }
      );
    }

    if (id) {
      // Single paper with questions — used when student opens a paper
      const papers = await sql`
        SELECT id, drive_file_id, country, exam_type, subject, title, year, paper_number,
               component, total_questions, has_images, processed_at
        FROM past_papers WHERE id = ${id} LIMIT 1
      `;
      if (papers.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const rows = await sql`
        SELECT id, question_number, question_text, marks, topic, has_image, image_desc,
               difficulty, mark_scheme
        FROM questions WHERE paper_id = ${id}
        ORDER BY question_number NULLS LAST
      `;
      // Strip the printed page furniture the scraper kept (page markers, footers, "[Turn over]")
      const questions = cleanPaperQuestions(rows as { question_number: string | null; question_text: string | null }[]);

      return NextResponse.json(
        { paper: papers[0], questions },
        { headers: { 'Cache-Control': 'private, max-age=300' } }
      );
    }

    // List view — filters applied, metadata only
    const papers = await sql`
      SELECT id, country, exam_type, subject, title, year, paper_number, component,
             total_questions, has_images
      FROM past_papers
      WHERE processed = true AND total_questions > 0
        ${country   ? sql`AND country      = ${country}`   : sql``}
        ${examType  ? sql`AND exam_type    = ${examType}`  : sql``}
        ${subject   ? sql`AND subject      = ANY(${dbSubjectsFor(subject)})` : sql``}
        ${component ? sql`AND component    = ${component}` : sql``}
        ${year      ? sql`AND year         = ${year}`      : sql``}
        ${paperNum  ? sql`AND paper_number = ${paperNum}`  : sql``}
      ORDER BY year DESC NULLS LAST, subject, paper_number NULLS LAST, title
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Distinct filter values for the UI dropdowns
    const meta = await sql`
      SELECT
        array_agg(DISTINCT country      ORDER BY country)      AS countries,
        array_agg(DISTINCT exam_type    ORDER BY exam_type)    AS exam_types,
        array_agg(DISTINCT subject      ORDER BY subject)      AS subjects,
        array_agg(DISTINCT year         ORDER BY year DESC)    AS years,
        array_agg(DISTINCT component    ORDER BY component)    AS components,
        array_agg(DISTINCT paper_number ORDER BY paper_number) AS paper_numbers
      FROM past_papers WHERE processed = true AND total_questions > 0
    `;

    return NextResponse.json(
      { papers, meta: meta[0], total: papers.length, offset },
      { headers: { 'Cache-Control': 'private, max-age=300' } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
