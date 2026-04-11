import { NextResponse } from 'next/server';

/**
 * Standardized API response types and utilities
 * Ensures all endpoints return consistent response formats
 */

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

const RESERVED_SUCCESS_KEYS = new Set(['success', 'data', 'timestamp']);

function getLegacyPayload(data: unknown): Record<string, unknown> {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {};
  }

  const safePayload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (!RESERVED_SUCCESS_KEYS.has(key)) {
      safePayload[key] = value;
    }
  }

  return safePayload;
}

/**
 * Create a standardized success response
 * @param data - Response payload
 * @param status - HTTP status code (default: 200)
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  const legacyPayload = getLegacyPayload(data);

  return NextResponse.json(
    {
      success: true,
      data,
      ...legacyPayload,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Create a standardized error response
 * @param message - Error message for end user
 * @param status - HTTP status code (default: 400)
 * @param code - Error code for client-side handling
 * @param details - Additional error details
 */
export function apiError(
  message: string,
  status = 400,
  code?: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const errorObj: {
    message: string;
    code?: string;
    details?: unknown;
  } = { message };

  if (code) {
    errorObj.code = code;
  }
  if (details !== undefined) {
    errorObj.details = details;
  }

  return NextResponse.json(
    {
      success: false,
      message,
      ...(code ? { code } : {}),
      ...(details !== undefined ? { details } : {}),
      error: errorObj,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Common error responses
 */
export const ApiErrors = {
  unauthorized: () =>
    apiError('Unauthorized. Please log in.', 401, 'UNAUTHORIZED'),
  forbidden: () =>
    apiError('Access denied. Insufficient permissions.', 403, 'FORBIDDEN'),
  notFound: (resource: string) =>
    apiError(`${resource} not found.`, 404, 'NOT_FOUND'),
  badRequest: (message: string) =>
    apiError(message, 400, 'BAD_REQUEST'),
  conflict: (message: string) =>
    apiError(message, 409, 'CONFLICT'),
  unprocessable: (message: string) =>
    apiError(message, 422, 'UNPROCESSABLE_ENTITY'),
  rateLimited: () =>
    apiError('Too many requests. Please try again later.', 429, 'RATE_LIMITED'),
  serverError: (isDevelopment = false) =>
    apiError(
      'An unexpected error occurred. Please try again.',
      500,
      'INTERNAL_SERVER_ERROR',
      isDevelopment ? { message: 'Check server logs for details' } : undefined
    ),
};

/**
 * Wrap async route handlers with error handling
 * @param handler - Async request handler
 */
export function withErrorHandling(
  handler: (req?: Request) => Promise<NextResponse>
) {
  return async (req?: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const message = error instanceof Error ? error.message : 'Unknown error';

      if (isDevelopment) {
        console.error(`[API Error] ${message}`, error);
      }

      return ApiErrors.serverError(isDevelopment);
    }
  };
}
