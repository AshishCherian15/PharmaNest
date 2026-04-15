import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import type { User, UserRole } from '@prisma/client';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { getDemoStore, nextDemoId } from '@/lib/demo/demo-store';

export type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
};

export type UpdateUserInput = {
  name?: string;
  phone?: string;
  role?: UserRole;
  password?: string;
};

export async function createUser(input: CreateUserInput): Promise<User> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const now = new Date();
    const user = {
      id: nextDemoId('USR-DEMO'),
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      role: input.role,
      passwordHash: 'demo-mode-password',
      createdAt: now,
      updatedAt: now,
    } as User;

    store.users.unshift({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: now,
      updatedAt: now,
    });

    return user;
  }

  const passwordHash = await hashPassword(input.password);
  
  return prisma.user.create({
    data: {
      id: `USR${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      passwordHash,
    },
  });
}

export type UserPublic = Omit<User, 'passwordHash'>;

export async function getUsers(skip?: number, take?: number): Promise<UserPublic[]> {
  if (isDemoModeEnabled()) {
    const start = skip ?? 0;
    const end = start + (take ?? 100);
    return [...getDemoStore().users]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(start, end);
  }

  return prisma.user.findMany({
    skip: skip ?? 0,
    take: take ?? 100,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  }) as Promise<UserPublic[]>;
}

export async function getUserById(id: string): Promise<(User & { createdAt: Date; updatedAt: Date }) | null> {
  if (isDemoModeEnabled()) {
    const user = getDemoStore().users.find((entry) => entry.id === id);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      passwordHash: 'demo-mode-password',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  
  return {
    ...user,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function searchUsers(query: string): Promise<UserPublic[]> {
  if (isDemoModeEnabled()) {
    const lowerQuery = query.toLowerCase();
    return getDemoStore().users.filter((user) =>
      [user.name, user.email].join(' ').toLowerCase().includes(lowerQuery)
    );
  }

  const lowerQuery = query.toLowerCase();
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: lowerQuery } },
        { email: { contains: lowerQuery } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    take: 50,
  }) as Promise<UserPublic[]>;
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.users.findIndex((entry) => entry.id === id);
    if (index < 0) return null;
    const current = store.users[index];
    const updated = {
      ...current,
      name: input.name ?? current.name,
      phone: input.phone ?? current.phone,
      role: input.role ?? current.role,
      updatedAt: new Date(),
    };
    store.users[index] = updated;
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      passwordHash: 'demo-mode-password',
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  const existing = await getUserById(id);
  if (!existing) return null;

  const updateData: Partial<Pick<User, 'name' | 'phone' | 'role' | 'passwordHash'>> = {
    name: input.name ?? existing.name,
    phone: input.phone ?? existing.phone,
    role: input.role ?? existing.role,
  };

  if (input.password) {
    updateData.passwordHash = await hashPassword(input.password);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteUser(id: string): Promise<boolean> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.users.findIndex((entry) => entry.id === id);
    if (index < 0) return false;
    store.users.splice(index, 1);
    return true;
  }

  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check for duplicate email (case-insensitive)
 */
export async function emailExists(email: string): Promise<boolean> {
  if (isDemoModeEnabled()) {
    return getDemoStore().users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return !!user;
}
