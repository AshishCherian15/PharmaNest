import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import type { User, UserRole } from '@prisma/client';

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
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  
  return {
    ...user,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function searchUsers(query: string): Promise<UserPublic[]> {
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
  const existing = await getUserById(id);
  if (!existing) return null;

  const updateData: any = {
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
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return !!user;
}
