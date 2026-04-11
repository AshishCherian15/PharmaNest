import { describe, expect, it } from 'vitest';
import type { NextRequest } from 'next/server';
import { createRateLimiter, checkoutLimiter } from './rate-limit';

function createRequest(input: {
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  path?: string;
} = {}): NextRequest {
  const headerMap = new Map<string, string>();
  for (const [key, value] of Object.entries(input.headers ?? {})) {
    headerMap.set(key.toLowerCase(), value);
  }

  const cookieStore = new Map<string, string>();
  for (const [key, value] of Object.entries(input.cookies ?? {})) {
    cookieStore.set(key, value);
  }

  return {
    headers: {
      get(name: string) {
        return headerMap.get(name.toLowerCase()) ?? null;
      },
    },
    cookies: {
      get(name: string) {
        const value = cookieStore.get(name);
        return value ? { name, value } : undefined;
      },
    },
    nextUrl: {
      pathname: input.path ?? '/test',
    },
  } as unknown as NextRequest;
}

describe('rate limiter', () => {
  it('isolates counters between limiter instances', () => {
    const limiterA = createRateLimiter({ maxRequests: 1, windowMs: 60_000, storeKey: 'test-a' });
    const limiterB = createRateLimiter({ maxRequests: 1, windowMs: 60_000, storeKey: 'test-b' });

    const req = createRequest({ headers: { 'x-forwarded-for': '10.0.0.1' } });

    expect(limiterA(req).ok).toBe(true);
    expect(limiterA(req).ok).toBe(false);

    // Different store key means fresh quota.
    expect(limiterB(req).ok).toBe(true);
  });

  it('uses session cookie key for checkout limiter when available', () => {
    const reqA = createRequest({ cookies: { pharmanest_session: 'session-a' } });
    const reqB = createRequest({ cookies: { pharmanest_session: 'session-b' } });

    for (let i = 0; i < 10; i += 1) {
      expect(checkoutLimiter(reqA).ok).toBe(true);
    }
    expect(checkoutLimiter(reqA).ok).toBe(false);

    // Different session should not be throttled by session-a traffic.
    expect(checkoutLimiter(reqB).ok).toBe(true);
  });

  it('falls back to client key when checkout session is missing', () => {
    const limiter = createRateLimiter({
      maxRequests: 1,
      windowMs: 60_000,
      storeKey: 'test-fallback',
    });

    const req = createRequest({ headers: { 'x-forwarded-for': '10.0.0.9, 10.0.0.10' } });
    expect(limiter(req).ok).toBe(true);
    expect(limiter(req).ok).toBe(false);
  });
});
