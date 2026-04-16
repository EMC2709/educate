import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { downloadPdfBuffer } from '@/lib/drive';
import { getPdfPageCount } from '@/lib/pdf-render';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * GET /api/paper-pagecount?id=<paperId>
 *
 * Returns { pageCount: number } for a paper's PDF.
 * Results cached in past_papers.page_count column once computed.
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const paperId = req.nextUrl.searchParams.get('id');
  if (!paperId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const rows = await sql`SELECT drive_file_id, page_count FROM past_papers WHERE id = ${paperId} LIMIT 1`;
    if (rows.length === 0 || !rows[0].drive_file_id) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }
    if (rows[0].page_count && rows[0].page_count > 0) {
      return NextResponse.json(
        { pageCount: rows[0].page_count },
        { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
      );
    }

    const pdfBuf = await downloadPdfBuffer(rows[0].drive_file_id as string);
    const pageCount = await getPdfPageCount(pdfBuf);

    // Best-effort persist so future students skip the Drive roundtrip
    await sql`UPDATE past_papers SET page_count = ${pageCount} WHERE id = ${paperId}`.catch(() => {});

    return NextResponse.json(
      { pageCount },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'pagecount failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
