/**
 * Lightweight per-key rate limiter.
 *
 * This is intentionally dependency-free and stores buckets in memory, so it
 * works on a single Node process. For multi-region / serverless deployments,
 * swap the `bucketStore` for an Upstash Ratelimit client (drop-in: same shape).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const bucketStore = new Map<string, Bucket>();

// Periodic cleanup so the map doesn't grow unbounded under high cardinality.
let cleanupInterval: ReturnType<typeof setInterval> | null = null;
function ensureCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of bucketStore.entries()) {
      if (bucket.resetAt < now) bucketStore.delete(key);
    }
  }, 60_000);
  // Don't keep the process alive for the cleanup timer.
  if (typeof cleanupInterval === 'object' && cleanupInterval && 'unref' in cleanupInterval) {
    (cleanupInterval as { unref: () => void }).unref();
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}

/**
 * Increment the bucket for `key` and return whether the request is allowed.
 * `limit` requests per `windowMs` window.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  ensureCleanup();
  const now = Date.now();
  const existing = bucketStore.get(key);

  if (!existing || existing.resetAt < now) {
    const bucket: Bucket = { count: 1, resetAt: now + windowMs };
    bucketStore.set(key, bucket);
    return { ok: true, remaining: limit - 1, resetAt: bucket.resetAt, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSec: 0,
  };
}

/**
 * Resolve a stable identifier for the requester. Prefers the authenticated
 * user id; falls back to the client IP from common proxy headers.
 */
export function getRateLimitKey(prefix: string, userId: string | null, request: Request): string {
  if (userId) return `${prefix}:user:${userId}`;
  const fwd =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown';
  return `${prefix}:ip:${fwd}`;
}

/**
 * Build a Response with the standard rate-limit headers.
 */
export function rateLimitHeaders(limit: number, result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    ...(result.retryAfterSec > 0 ? { 'Retry-After': String(result.retryAfterSec) } : {}),
  };
}
