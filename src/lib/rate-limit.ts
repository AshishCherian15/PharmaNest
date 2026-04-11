import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

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
  storeKey?: string; // Isolates counters between limiters
  keyGenerator?: (req: NextRequest) => string;
}

let limiterCounter = 0;

function getClientKey(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const firstForwardedIp = forwardedFor?.split(',')[0]?.trim();
  const connectingIp = req.headers.get('cf-connecting-ip')?.trim();
  const ip = firstForwardedIp || connectingIp;

  if (ip) {
    return `ip:${ip}`;
  }

  const userAgent = req.headers.get('user-agent')?.trim() || 'unknown';
  const path = req.nextUrl?.pathname || 'unknown';
  return `ua:${userAgent}|path:${path}`;
}

export function createRateLimiter(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs ?? 15 * 60 * 1000; // 15 minutes default
  const maxRequests = options.maxRequests ?? 100;
  const storeKey = options.storeKey ?? `limiter-${++limiterCounter}`;
  const keyGenerator = options.keyGenerator ?? getClientKey;

  return function limiter(req: NextRequest): { ok: boolean; retryAfter?: number } {
    const key = keyGenerator(req);
    const store = getStore(storeKey);
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
  storeKey: 'auth',
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

/**
 * Checkout limiter: 10 attempts per 1 minute per user
 */
export const checkoutLimiter = createRateLimiter({
  storeKey: 'checkout',
  windowMs: 1 * 60 * 1000,
  maxRequests: 10,
  keyGenerator: (req) => {
    const session = req.cookies.get(AUTH_COOKIE)?.value;
    return session ? `session:${session}` : getClientKey(req);
  },
});

/**
 * API limiter: 100 requests per 1 minute per IP (general purpose)
 */
export const apiLimiter = createRateLimiter({
  storeKey: 'api',
  windowMs: 1 * 60 * 1000,
  maxRequests: 100,
});
