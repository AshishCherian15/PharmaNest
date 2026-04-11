/**
 * Request validation utilities
 * Centralized validation for common request patterns
 */

/**
 * Validate required string fields
 */
export function validateRequiredString(
  value: unknown,
  fieldName: string,
  minLength = 1,
  maxLength?: number
): { valid: boolean; error?: string } {
  const str = String(value ?? '').trim();

  if (!str) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (str.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  if (maxLength && str.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(
  value: unknown,
  fieldName = 'Email'
): { valid: boolean; error?: string } {
  const str = String(value ?? '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!str) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (!emailRegex.test(str)) {
    return { valid: false, error: `${fieldName} must be a valid email address` };
  }

  return { valid: true };
}

/**
 * Validate phone number (basic Indian format)
 */
export function validatePhone(
  value: unknown,
  fieldName = 'Phone'
): { valid: boolean; error?: string } {
  const str = String(value ?? '').trim();
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

  if (!str) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (!phoneRegex.test(str)) {
    return {
      valid: false,
      error: `${fieldName} must be a valid phone number`,
    };
  }

  return { valid: true };
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(
  value: unknown,
  fieldName: string
): { valid: boolean; error?: string; value?: number } {
  const num = Number(value ?? 0);

  if (!Number.isFinite(num)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }

  if (num <= 0) {
    return {
      valid: false,
      error: `${fieldName} must be greater than zero`,
    };
  }

  return { valid: true, value: num };
}

/**
 * Validate array of items
 */
export function validateArray<T>(
  value: unknown,
  fieldName: string,
  minItems = 1
): { valid: boolean; error?: string; value?: T[] } {
  if (!Array.isArray(value)) {
    return { valid: false, error: `${fieldName} must be an array` };
  }

  if (value.length < minItems) {
    return {
      valid: false,
      error: `${fieldName} must contain at least ${minItems} item${minItems !== 1 ? 's' : ''}`,
    };
  }

  return { valid: true, value: value as T[] };
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T = unknown>(
  value: unknown
): { ok: boolean; data?: T; error?: string } {
  try {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return { ok: true, data: parsed as T };
    }
    return { ok: true, data: value as T };
  } catch {
    return { ok: false, error: 'Invalid JSON' };
  }
}

/**
 * Rate limit validation (helper for future middleware)
 */
export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

/**
 * Get value from request body safely
 */
export function getBodyValue(body: Record<string, unknown>, key: string): unknown {
  return body[key] ?? null;
}

/**
 * Validate request has required fields
 */
export function validateBodyFields(
  body: unknown,
  requiredFields: string[]
): { valid: boolean; errors: string[] } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, errors: ['Request body must be valid JSON'] };
  }

  const errors: string[] = [];
  const bodyObj = body as Record<string, unknown>;

  for (const field of requiredFields) {
    if (!bodyObj[field]) {
      errors.push(`${field} is required`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
