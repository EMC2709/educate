import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { downloadPdfBuffer } from '@/lib/drive';
import { renderPdfPage } from '@/lib/pdf-render';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Simple per-instance cache — reduces Drive downloads for hot papers
// (Vercel will also CDN-cache the final PNG response for 1 year.)
const pdfCache = new Map<string, { buf: Buffer; at: number }>();
const PDF_CACHE_MS = 5 * 60 * 1000;
const PDF_CACHE_MAX = 8; // keep tiny — each PDF ~1 MB

function cachePut(id: string, buf: Buffer) {
  if (pdfCache.size >= PDF_CACHE_MAX) {
    const oldest = [...pdfCache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) pdfCache.delete(oldest[0]);
  }
  pdfCache.set(id, { buf, at: Date.now() });
}
function cacheGet(id: string): Buffer | null {
  const hit = pdfCache.get(id);
  if (!hit) return null;
  if (Date.now() - hit.at > PDF_CACHE_MS) { pdfCache.delete(id); return null; }
  return hit.buf;
}

/**
 * GET /api/paper-page?id=<paperId>&page=<N>&w=<width>
 *
 * Returns a PNG of the specified page (1-based).
 * First hit: ~2-4s (Drive download + render). Subsequent hits: instant (Vercel CDN).
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const p = req.nextUrl.searchParams;
  const paperId = p.get('id');
  const pageNum = parseInt(p.get('page') ?? '1');
  const width   = Math.min(Math.max(parseInt(p.get('w') ?? '1000'), 200), 2000);

  if (!paperId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (!Number.isFinite(pageNum) || pageNum < 1) return NextResponse.json({ error: 'Invalid page' }, { status: 400 });

  try {
    const rows = await sql`SELECT drive_file_id FROM past_papers WHERE id = ${paperId} LIMIT 1`;
    if (rows.length === 0 || !rows[0].drive_file_id) {
      return NextResponse.json({ error: 'Paper not found or no PDF' }, { status: 404 });
    }
    const fileId = rows[0].drive_file_id as string;

    let pdfBuf = cacheGet(fileId);
    if (!pdfBuf) {
      pdfBuf = await downloadPdfBuffer(fileId);
      cachePut(fileId, pdfBuf);
    }

    const { png, pageCount } = await renderPdfPage({ pdfBuffer: pdfBuf, pageNumber: pageNum, width });

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': String(png.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Page-Count': String(pageCount),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'render failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
