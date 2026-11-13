import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { EXAM_CODE_CAPTURE, parseExamCode, formatExamCode } from '@/lib/past-paper-match';
import { aqaMarkSchemeCandidates } from '@/lib/aqa-mark-scheme';
import { officialPdfExists, fetchOfficialPdf } from '@/lib/official-pdf';
import { renderPdfPage, getPdfPageCount, extractPdfText } from '@/lib/pdf-render';
import { markPaperWithAI } from '@/lib/ai-paper-marking';
import { isAiDisabledFor, AI_DISABLED_MESSAGE } from '@/lib/ai-access';
import { z } from 'zod';

export const runtime = 'nodejs';
// AI marking of a whole paper can take a minute or more
export const maxDuration = 300;

// Extracted mark-scheme text per official URL (small, cached per instance)
const textCache = new Map<string, { text: string; at: number }>();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Resolved = { url: string | null; examCode: string | null; pageCount: number | null; at: number };
const resolved = new Map<string, Resolved>();
const RESOLVED_MS = 6 * 3600_000;

/**
 * Work out the official mark scheme for a stored paper from the exam code in its
 * own question text (most frequent code first). AQA GCSE only for now.
 */
async function resolveMarkScheme(paperId: string): Promise<Resolved | 'not-found'> {
  const hit = resolved.get(paperId);
  if (hit && Date.now() - hit.at < RESOLVED_MS) return hit;

  const papers = await sql`SELECT exam_type FROM past_papers WHERE id = ${paperId} LIMIT 1` as unknown as Array<{ exam_type: string }>;
  if (papers.length === 0) return 'not-found';

  let result: Resolved = { url: null, examCode: null, pageCount: null, at: Date.now() };
  if (papers[0].exam_type === 'GCSE_AQA') {
    const codes = await sql`
      SELECT lower(m[1]) AS code, count(*)::int AS n
      FROM questions q
      CROSS JOIN LATERAL regexp_matches(q.question_text, ${EXAM_CODE_CAPTURE}, 'gi') AS m
      WHERE q.paper_id = ${paperId}
      GROUP BY 1 ORDER BY 2 DESC LIMIT 5
    ` as unknown as Array<{ code: string; n: number }>;

    outer: for (const row of codes) {
      const code = parseExamCode(row.code);
      if (!code) continue;
      for (const candidate of aqaMarkSchemeCandidates(code)) {
        if (await officialPdfExists(candidate)) {
          result = { url: candidate, examCode: formatExamCode(code), pageCount: null, at: Date.now() };
          break outer;
        }
      }
      // Remember the paper's code even when AQA does not publish its mark scheme
      if (!result.examCode) result.examCode = formatExamCode(code);
    }
  }

  if (resolved.size > 5000) resolved.clear();
  resolved.set(paperId, result);
  return result;
}

/**
 * GET /api/mark-scheme?id=<paperUuid>
 *   → { available, officialUrl, examCode, pageCount }
 * GET /api/mark-scheme?id=<paperUuid>&format=pdf      → the mark scheme PDF (same origin, frameable)
 * GET /api/mark-scheme?id=<paperUuid>&page=N[&w=900]  → one page as a PNG (for phones)
 *
 * Signed-in users only, like the paper itself.
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (!rateLimit(`mark-scheme:user:${userId}`, 240, 60_000).ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const p = req.nextUrl.searchParams;
  const paperId = p.get('id') ?? '';
  if (!UUID_RE.test(paperId)) return NextResponse.json({ error: 'Invalid paper id' }, { status: 400 });

  let info: Resolved | 'not-found';
  try {
    info = await resolveMarkScheme(paperId);
  } catch (err) {
    console.error('[mark-scheme] resolve failed:', err instanceof Error ? err.message : 'unknown error');
    return NextResponse.json({ error: 'Could not look up the mark scheme' }, { status: 500 });
  }
  if (info === 'not-found') return NextResponse.json({ error: 'Paper not found' }, { status: 404 });

  const pageRaw = p.get('page');
  const wantPdf = p.get('format') === 'pdf';

  if (!info.url) {
    if (pageRaw || wantPdf) return NextResponse.json({ error: 'No mark scheme available' }, { status: 404 });
    return NextResponse.json(
      { available: false, officialUrl: null, examCode: info.examCode, pageCount: null },
      { headers: { 'Cache-Control': 'private, max-age=600' } },
    );
  }

  try {
    const pdf = await fetchOfficialPdf(info.url);

    if (wantPdf) {
      return new NextResponse(new Uint8Array(pdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': String(pdf.length),
          'Content-Disposition': `inline; filename="${info.url.split('/').pop() ?? 'mark-scheme.pdf'}"`,
          'Cache-Control': 'private, max-age=3600',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    if (pageRaw) {
      const pageNum = parseInt(pageRaw, 10);
      if (!Number.isFinite(pageNum) || pageNum < 1) return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
      const width = Math.min(Math.max(parseInt(p.get('w') ?? '900', 10) || 900, 200), 1600);
      const { png, pageCount } = await renderPdfPage({ pdfBuffer: pdf, pageNumber: pageNum, width });
      return new NextResponse(new Uint8Array(png), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': String(png.length),
          'Cache-Control': 'private, max-age=86400',
          'X-Page-Count': String(pageCount),
        },
      });
    }

    if (info.pageCount === null) info.pageCount = await getPdfPageCount(pdf);
    return NextResponse.json(
      { available: true, officialUrl: info.url, examCode: info.examCode, pageCount: info.pageCount },
      { headers: { 'Cache-Control': 'private, max-age=3600' } },
    );
  } catch (err) {
    console.error('[mark-scheme] fetch/render failed:', err instanceof Error ? err.message : 'unknown error');
    return NextResponse.json({ error: 'Could not load the mark scheme. Please try again.' }, { status: 502 });
  }
}

const markSchema = z.object({
  id: z.string().regex(UUID_RE),
  answers: z.array(z.object({
    index: z.number().int().min(0).max(500),
    question: z.string().min(1).max(4000),
    answer: z.string().min(1).max(8000),
    maxMarks: z.number().int().min(1).max(25),
  })).min(1).max(120),
});

/**
 * POST /api/mark-scheme  { id, answers: [{ index, question, answer, maxMarks }] }
 *   → { results: [{ index, marksAwarded, maxMarks, feedback }], overallComment }
 *
 * AI marking of a student's answers against the paper's official mark scheme.
 * Signed-in only and rate limited: each call reads the whole mark scheme.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Sign in to use AI marking.' }, { status: 401 });
  if (!rateLimit(`ai-marking:user:${userId}`, 6, 15 * 60_000).ok) {
    return NextResponse.json({ error: 'You have used AI marking a lot in the last few minutes. Please wait a little and try again.' }, { status: 429 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI marking is not available right now.' }, { status: 503 });
  }
  if (await isAiDisabledFor(userId)) {
    return NextResponse.json({ error: AI_DISABLED_MESSAGE }, { status: 403 });
  }

  const parsed = markSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Nothing to mark.' }, { status: 400 });
  const { id, answers } = parsed.data;

  let info: Resolved | 'not-found';
  try {
    info = await resolveMarkScheme(id);
  } catch {
    return NextResponse.json({ error: 'Could not look up the mark scheme.' }, { status: 500 });
  }
  if (info === 'not-found') return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
  if (!info.url) return NextResponse.json({ error: 'There is no mark scheme to mark against for this paper.' }, { status: 404 });

  try {
    let text = textCache.get(info.url);
    if (!text || Date.now() - text.at > RESOLVED_MS) {
      const pdf = await fetchOfficialPdf(info.url);
      text = { text: await extractPdfText(pdf), at: Date.now() };
      if (textCache.size > 50) textCache.clear();
      textCache.set(info.url, text);
    }
    if (text.text.length < 200) {
      return NextResponse.json({ error: 'The mark scheme could not be read for AI marking.' }, { status: 502 });
    }

    const outcome = await markPaperWithAI(text.text, answers);
    if (!outcome.ok) {
      return NextResponse.json(
        { error: outcome.reason === 'refused' ? 'The AI could not mark these answers.' : 'The AI marking did not come back complete. Please try again.' },
        { status: 502 },
      );
    }
    return NextResponse.json(outcome, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[ai-marking] failed:', err instanceof Error ? err.message : 'unknown error');
    return NextResponse.json({ error: 'AI marking failed. Please try again.' }, { status: 502 });
  }
}
