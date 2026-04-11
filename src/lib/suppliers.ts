import { prisma } from '@/lib/prisma';
import type { Category, Supplier } from '@prisma/client';

// ============= CATEGORIES =============

export async function createCategory(name: string, description?: string, image?: string): Promise<Category> {
  return prisma.category.create({
    data: { name, description, image },
  });
}

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({ where: { id } });
}

export async function updateCategory(
  id: string,
  name?: string,
  description?: string,
  image?: string
): Promise<Category | null> {
  const existing = await getCategoryById(id);
  if (!existing) return null;

  return prisma.category.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      description: description ?? existing.description,
      image: image ?? existing.image,
    },
  });
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await prisma.category.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ============= SUPPLIERS =============

export type CreateSupplierInput = {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNo?: string;
};

export async function createSupplier(input: CreateSupplierInput): Promise<Supplier> {
  return prisma.supplier.create({
    data: {
      name: input.name,
      contactPerson: input.contactPerson,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      gstNo: input.gstNo,
    },
  });
}

export async function getSuppliers(skip?: number, take?: number): Promise<Supplier[]> {
  return prisma.supplier.findMany({
    skip: skip ?? 0,
    take: take ?? 100,
    orderBy: { name: 'asc' },
  });
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  return prisma.supplier.findUnique({ where: { id } });
}

export async function searchSuppliers(query: string): Promise<Supplier[]> {
  const lowerQuery = query.toLowerCase();
  return prisma.supplier.findMany({
    where: {
      OR: [
        { name: { contains: lowerQuery } },
        { email: { contains: lowerQuery } },
        { contactPerson: { contains: lowerQuery } },
      ],
    },
    take: 50,
  });
}

export async function updateSupplier(id: string, input: Partial<CreateSupplierInput>): Promise<Supplier | null> {
  const existing = await getSupplierById(id);
  if (!existing) return null;

  return prisma.supplier.update({
    where: { id },
    data: {
      name: input.name ?? existing.name,
      contactPerson: input.contactPerson ?? existing.contactPerson,
      email: input.email ?? existing.email,
      phone: input.phone ?? existing.phone,
      address: input.address ?? existing.address,
      city: input.city ?? existing.city,
      state: input.state ?? existing.state,
      pincode: input.pincode ?? existing.pincode,
      gstNo: input.gstNo ?? existing.gstNo,
    },
  });
}

export async function deleteSupplier(id: string): Promise<boolean> {
  try {
    await prisma.supplier.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
