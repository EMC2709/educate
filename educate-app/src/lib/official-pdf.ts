/**
 * Fetching official exam-board PDFs (server-side only).
 *
 * Only https URLs on the allowlisted board domains are fetched, the allowlist is
 * re-checked after redirects, responses must be PDFs, and size and time are capped.
 */

export const ALLOWED_DOMAINS = [
  'physicsandmathstutor.com',
  'pmt.physicsandmathstutor.com',
  'aqa.org.uk',
  'filestore.aqa.org.uk',
  'qualifications.pearson.com',
  'ocr.org.uk',
  'wjec.co.uk',
  'eduqas.co.uk',
  'revisionworld.com',
];

/** Where to send a student when a direct board PDF link no longer works. */
const BOARD_PAST_PAPER_PAGES: Record<string, string> = {
  'aqa.org.uk': 'https://www.aqa.org.uk/find-past-papers-and-mark-schemes',
};

const MAX_PDF_BYTES = 30 * 1024 * 1024;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';

export function isAllowedHost(hostname: string): boolean {
  return ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`));
}

/** Parse and check a URL; returns null unless it is https on an allowlisted host. */
export function allowedOfficialUrl(raw: string): URL | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  return u.protocol === 'https:' && isAllowedHost(u.hostname) ? u : null;
}

export function boardPastPapersPage(hostname: string): string | null {
  const key = Object.keys(BOARD_PAST_PAPER_PAGES).find(d => hostname === d || hostname.endsWith(`.${d}`));
  return key ? BOARD_PAST_PAPER_PAGES[key] : null;
}

// ── Does a PDF exist? (cached: positive 12 h, negative 1 h) ──────────────────
const existsCache = new Map<string, { ok: boolean; at: number }>();

export async function officialPdfExists(raw: string): Promise<boolean> {
  const url = allowedOfficialUrl(raw);
  if (!url) return false;
  const hit = existsCache.get(url.href);
  if (hit && Date.now() - hit.at < (hit.ok ? 12 : 1) * 3600_000) return hit.ok;

  let ok = false;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(6000),
    });
    const final = allowedOfficialUrl(res.url || url.href);
    ok = res.ok && !!final && (res.headers.get('content-type') ?? '').toLowerCase().includes('pdf');
  } catch {
    ok = false;
  }
  if (existsCache.size > 2000) existsCache.clear();
  existsCache.set(url.href, { ok, at: Date.now() });
  return ok;
}

// ── Fetch a PDF (small per-instance cache) ───────────────────────────────────
const pdfCache = new Map<string, { buf: Buffer; at: number }>();
const PDF_CACHE_MS = 30 * 60 * 1000;
const PDF_CACHE_MAX = 6;

export async function fetchOfficialPdf(raw: string): Promise<Buffer> {
  const url = allowedOfficialUrl(raw);
  if (!url) throw new Error('URL not permitted');

  const hit = pdfCache.get(url.href);
  if (hit && Date.now() - hit.at < PDF_CACHE_MS) return hit.buf;

  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/pdf' },
    signal: AbortSignal.timeout(15000),
  });
  if (!allowedOfficialUrl(res.url || url.href)) throw new Error('Redirected off the allowlist');
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  if (!(res.headers.get('content-type') ?? '').toLowerCase().includes('pdf')) throw new Error('Not a PDF');
  const declared = Number(res.headers.get('content-length') ?? 0);
  if (declared > MAX_PDF_BYTES) throw new Error('PDF too large');

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_PDF_BYTES) throw new Error('PDF too large');

  if (pdfCache.size >= PDF_CACHE_MAX) {
    const oldest = [...pdfCache.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) pdfCache.delete(oldest[0]);
  }
  pdfCache.set(url.href, { buf, at: Date.now() });
  return buf;
}
