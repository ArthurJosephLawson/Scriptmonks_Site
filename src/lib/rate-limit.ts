export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

// In-memory fixed-window counter. Best-effort only: each serverless instance
// keeps its own Map, so limits are per-instance. Upgrade path: Upstash Redis
// (or similar) with a shared counter + TTL.
const hits = new Map<string, { windowStart: number; count: number }>();

export function rateLimit(
  key: string,
  { max, windowMs }: RateLimitOptions,
  now = Date.now(),
): RateLimitResult {
  const entry = hits.get(key);
  if (!entry || now - entry.windowStart >= windowMs) {
    hits.set(key, { windowStart: now, count: 1 });
    return { allowed: true, retryAfterMs: 0 };
  }
  if (entry.count >= max) {
    return { allowed: false, retryAfterMs: windowMs - (now - entry.windowStart) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

export function resetRateLimits(): void {
  hits.clear();
}
