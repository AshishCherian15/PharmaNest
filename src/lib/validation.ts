'use client';

/**
 * Form Validation Utilities
 * Centralized validation for all form inputs across the application
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (India format)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$|^\+91[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Validate password strength
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export function validatePassword(password: string): { valid: boolean; feedback: string[] } {
  const feedback: string[] = [];
  
  if (password.length < 8) feedback.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) feedback.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) feedback.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) feedback.push('Password must contain at least one number');
  
  return {
    valid: feedback.length === 0,
    feedback,
  };
}

/**
 * Validate medicine form
 */
export function validateMedicineForm(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Medicine name must be at least 2 characters' });
  }

  // Generic name validation
  if (!data.genericName || typeof data.genericName !== 'string' || data.genericName.trim().length < 2) {
    errors.push({ field: 'genericName', message: 'Generic name must be at least 2 characters' });
  }

  // Category validation
  if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Please select a category' });
  }

  // Price validation
  const price = parseFloat(data.price as string);
  if (isNaN(price) || price <= 0) {
    errors.push({ field: 'price', message: 'Price must be greater than 0' });
  }

  // Quantity validation
  const quantity = parseInt(data.quantity as string, 10);
  if (isNaN(quantity) || quantity < 0) {
    errors.push({ field: 'quantity', message: 'Quantity must be a non-negative number' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate customer/user form
 */
export function validateUserForm(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  // Email validation
  if (!data.email || !validateEmail(data.email as string)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Phone validation
  if (!data.phone || !validatePhone(data.phone as string)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate supplier form
 */
export function validateSupplierForm(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Supplier name must be at least 2 characters' });
  }

  // Contact person validation
  if (!data.contactPerson || typeof data.contactPerson !== 'string' || data.contactPerson.trim().length < 2) {
    errors.push({ field: 'contactPerson', message: 'Contact person name must be at least 2 characters' });
  }

  // Email validation
  if (!data.email || !validateEmail(data.email as string)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Phone validation
  if (!data.phone || !validatePhone(data.phone as string)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate login form
 */
export function validateLoginForm(identifier: string, password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!identifier || identifier.trim().length === 0) {
    errors.push({ field: 'identifier', message: 'Email or username is required' });
  }

  if (!password || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate registration form
 */
export function validateRegistrationForm(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  // Email validation
  if (!data.email || !validateEmail(data.email as string)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Phone validation
  if (!data.phone || !validatePhone(data.phone as string)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  // Password validation
  if (!data.password || typeof data.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    const { valid, feedback } = validatePassword(data.password);
    if (!valid) {
      errors.push({ field: 'password', message: feedback[0] });
    }
  }

  // Password confirmation
  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
