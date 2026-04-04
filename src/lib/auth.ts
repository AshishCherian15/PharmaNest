import crypto from 'crypto';

export const AUTH_COOKIE = 'pharmanest_session';

export type AuthRole = 'admin' | 'customer';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

type StoredUser = SessionUser & {
  phone: string;
  passwordHash: string;
};

type SessionPayload = SessionUser & {
  iat: number;
  exp: number;
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

// Get default password from environment or development default
function getDefaultPassword(): string {
  const pwd = process.env.AUTH_DEFAULT_PASSWORD?.trim();

  if (process.env.NODE_ENV === 'production') {
    if (!pwd) throw new Error('AUTH_DEFAULT_PASSWORD must be set in production');
    if (pwd.length < 8) {
      throw new Error('AUTH_DEFAULT_PASSWORD must be at least 8 characters in production');
    }
    return pwd;
  }

  return pwd && pwd.length > 0 ? pwd : 'admin';
}

function getDefaultUsers(): StoredUser[] {
  const pwd = getDefaultPassword();
  return [
    {
      id: 'ADM-001',
      name: 'Admin User',
      email: 'admin@pharmanest.com',
      phone: '+91-90000-00001',
      role: 'admin',
      passwordHash: hashPassword(pwd),
    },
    {
      id: 'CUS-001',
      name: 'Customer User',
      email: 'customer@pharmanest.com',
      phone: '+91-90000-00002',
      role: 'customer',
      passwordHash: hashPassword(pwd),
    },
  ];
}

function getStore(): StoredUser[] {
  const globalStore = globalThis as unknown as { __pharmanestUsers?: StoredUser[] };
  if (!globalStore.__pharmanestUsers) {
    globalStore.__pharmanestUsers = [...getDefaultUsers()];
  }
  return globalStore.__pharmanestUsers;
}

function secret(): string {
  return process.env.AUTH_SECRET ?? 'pharmanest-dev-secret-change-in-production';
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, 'base64').toString();
}

function sign(input: string): string {
  return crypto
    .createHmac('sha256', secret())
    .update(input)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function createSessionToken(user: SessionUser): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...user,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function parseSessionToken(token?: string): SessionUser | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expected = sign(`${header}.${body}`);
  if (signature !== expected) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

function toSessionUser(user: StoredUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function findUserByIdentifier(identifier: string): StoredUser | undefined {
  const users = getStore();
  const normalized = identifier.trim().toLowerCase();

  return users.find((user) => {
    const email = user.email.toLowerCase();
    const username = email.split('@')[0] ?? '';
    const name = user.name.toLowerCase();

    return email === normalized || username === normalized || name === normalized;
  });
}

export function validateCredentials(
  identifier: string,
  password: string,
  preferredRole?: AuthRole
): SessionUser | null {
  const users = getStore();
  const normalizedId = identifier.trim().toLowerCase();
  const hashedPassword = hashPassword(password);

  // Check if development mode allows universal admin credential
  const devPassword = getDefaultPassword();
  if (
    process.env.NODE_ENV !== 'production' &&
    normalizedId === 'admin' &&
    hashedPassword === hashPassword(devPassword)
  ) {
    const scoped = preferredRole
      ? users.find((user) => user.role === preferredRole)
      : users[0];
    return scoped ? toSessionUser(scoped) : null;
  }

  const user = findUserByIdentifier(identifier);
  if (!user) return null;
  // Use constant-time comparison to prevent timing attacks
  if (!constantTimeCompare(user.passwordHash, hashedPassword)) return null;
  return toSessionUser(user);
}

// Constant-time string comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function registerUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: AuthRole;
}): { ok: true; user: SessionUser } | { ok: false; message: string } {
  const users = getStore();
  const exists = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (exists) {
    return { ok: false, message: 'Email already registered' };
  }

  const idPrefix = input.role === 'admin' ? 'ADM' : 'CUS';
  const id = `${idPrefix}-${String(users.length + 1).padStart(3, '0')}`;

  const stored: StoredUser = {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    role: input.role,
    passwordHash: hashPassword(input.password),
  };

  users.push(stored);
  return {
    ok: true,
    user: {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      role: stored.role,
    },
  };
}

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};
