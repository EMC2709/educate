import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { downloadPdfBuffer } from '@/lib/drive';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Small per-instance cache — same pattern as /api/paper-page.
const pdfCache = new Map<string, { buf: Buffer; at: number }>();
const PDF_CACHE_MS = 5 * 60 * 1000;
const PDF_CACHE_MAX = 8;

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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function safeFilename(title: string | null | undefined): string {
  const base = (title ?? 'past-paper')
    .replace(/[^A-Za-z0-9 ._-]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 120) || 'past-paper';
  return base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`;
}

/**
 * GET /api/paper-pdf?id=<paperUuid>
 *
 * Streams the original past-paper PDF to a signed-in user, so students never
 * need Google Drive access. The Drive file id is looked up server-side from
 * past_papers — a raw Drive id is never accepted from the client.
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const paperId = req.nextUrl.searchParams.get('id');
  if (!paperId) return NextResponse.json({ error: 'Missing paper id' }, { status: 400 });
  if (!UUID_RE.test(paperId)) return NextResponse.json({ error: 'Invalid paper id' }, { status: 400 });

  let row: { drive_file_id: string | null; title: string | null } | undefined;
  try {
    const rows = await sql`SELECT drive_file_id, title FROM past_papers WHERE id = ${paperId} LIMIT 1`;
    row = (rows as Array<{ drive_file_id: string | null; title: string | null }>)[0];
  } catch {
    return NextResponse.json({ error: 'Could not look up paper' }, { status: 500 });
  }
  if (!row || !row.drive_file_id) {
    return NextResponse.json({ error: 'Paper not found or no PDF available' }, { status: 404 });
  }

  try {
    const fileId = row.drive_file_id;
    let pdfBuf = cacheGet(fileId);
    if (!pdfBuf) {
      pdfBuf = await downloadPdfBuffer(fileId);
      cachePut(fileId, pdfBuf);
    }

    const filename = safeFilename(row.title);
    return new NextResponse(new Uint8Array(pdfBuf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdfBuf.length),
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    // Log the failure without any credential material
    console.error('[paper-pdf] Drive download failed:', err instanceof Error ? err.message : 'unknown error');
    return NextResponse.json({ error: 'Could not load the original paper. Please try again later.' }, { status: 502 });
  }
}
