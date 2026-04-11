import { UserRole } from '@prisma/client';
import { AuthRole, SessionUser, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type StoredUserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
};

function toSessionUser(user: StoredUserRecord): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AuthRole,
  };
}

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

export async function ensureDefaultUsers(): Promise<void> {
  const pwd = getDefaultPassword();
  const passwordHash = await hashPassword(pwd);

  await prisma.user.upsert({
    where: { email: 'admin@pharmanest.com' },
    update: {},
    create: {
      id: 'ADM-001',
      name: 'Admin User',
      email: 'admin@pharmanest.com',
      phone: '+91-90000-00001',
      role: 'admin',
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'customer@pharmanest.com' },
    update: {},
    create: {
      id: 'CUS-001',
      name: 'Customer User',
      email: 'customer@pharmanest.com',
      phone: '+91-90000-00002',
      role: 'customer',
      passwordHash,
    },
  });
}

export async function validateCredentialsDb(
  identifier: string,
  password: string,
  preferredRole?: AuthRole
): Promise<SessionUser | null> {
  await ensureDefaultUsers();

  const normalizedId = identifier.trim().toLowerCase();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });

  if (
    process.env.NODE_ENV !== 'production' &&
    normalizedId === 'admin'
  ) {
    const devPassword = getDefaultPassword();
    const isValidDevPassword = await verifyPassword(password, await hashPassword(devPassword));
    if (isValidDevPassword) {
      const scoped = preferredRole
        ? users.find((user) => user.role === preferredRole)
        : users[0];
      return scoped ? toSessionUser(scoped) : null;
    }
  }

  const matched = users.find((user) => {
    const email = user.email.toLowerCase();
    const username = email.split('@')[0] ?? '';
    const name = user.name.toLowerCase();
    return email === normalizedId || username === normalizedId || name === normalizedId;
  });

  if (!matched) return null;
  
  const passwordMatches = await verifyPassword(password, matched.passwordHash);
  if (!passwordMatches) return null;

  return toSessionUser(matched);
}

function buildUserId(role: AuthRole, count: number): string {
  const prefix = role === 'admin' ? 'ADM' : 'CUS';
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
}

export async function registerUserDb(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: AuthRole;
}): Promise<{ ok: true; user: SessionUser } | { ok: false; message: string }> {
  await ensureDefaultUsers();

  const exists = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: { id: true },
  });

  if (exists) {
    return { ok: false, message: 'Email already registered' };
  }

  let nextCount = await prisma.user.count({ where: { role: input.role } });

  let id = buildUserId(input.role, nextCount);
  while (await prisma.user.findUnique({ where: { id }, select: { id: true } })) {
    nextCount += 1;
    id = buildUserId(input.role, nextCount);
  }

  const passwordHash = await hashPassword(input.password);

  const created = await prisma.user.create({
    data: {
      id,
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      role: input.role,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });

  return { ok: true, user: toSessionUser(created) };
}
