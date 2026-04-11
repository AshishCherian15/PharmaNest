import type { NextRequest } from 'next/server';

type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const stores = new Map<string, RateLimitStore>();

function getStore(key: string): RateLimitStore {
  if (!stores.has(key)) {
    stores.set(key, new Map());
  }
  return stores.get(key)!;
}

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Max requests per window
  keyGenerator?: (req: NextRequest) => string;
}

export function createRateLimiter(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs ?? 15 * 60 * 1000; // 15 minutes default
  const maxRequests = options.maxRequests ?? 100;
  const keyGenerator = options.keyGenerator ?? ((req) => {
    return req.headers.get('x-forwarded-for') || 
           req.headers.get('cf-connecting-ip') || 
           'unknown';
  });

  return function limiter(req: NextRequest): { ok: boolean; retryAfter?: number } {
    const key = keyGenerator(req);
    const store = getStore('default');
    const now = Date.now();

    let record = store.get(key);

    // If no record or window expired, reset
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
      store.set(key, record);
    }

    record.count += 1;

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { ok: false, retryAfter };
    }

    return { ok: true };
  };
}

/**
 * Auth-specific rate limiter: 5 attempts per 15 minutes per IP
 */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

/**
 * Checkout limiter: 10 attempts per 1 minute per user
 */
export const checkoutLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  maxRequests: 10,
});

/**
 * API limiter: 100 requests per 1 minute per IP (general purpose)
 */
export const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  maxRequests: 100,
});
