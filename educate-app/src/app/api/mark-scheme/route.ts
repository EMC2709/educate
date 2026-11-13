import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { EXAM_CODE_CAPTURE, parseExamCode, formatExamCode } from '@/lib/past-paper-match';
import { aqaMarkSchemeCandidates } from '@/lib/aqa-mark-scheme';
import { officialPdfExists, fetchOfficialPdf } from '@/lib/official-pdf';
import { renderPdfPage, getPdfPageCount } from '@/lib/pdf-render';

export const runtime = 'nodejs';
export const maxDuration = 30;

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
