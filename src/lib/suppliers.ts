import { prisma } from '@/lib/prisma';
import type { Category, Supplier } from '@prisma/client';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { getDemoStore, nextDemoId } from '@/lib/demo/demo-store';

// ============= CATEGORIES =============

export async function createCategory(name: string, description?: string, image?: string): Promise<Category> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const now = new Date();
    const category = {
      id: nextDemoId('CAT'),
      name,
      description: description ?? null,
      image: image ?? null,
      createdAt: now,
      updatedAt: now,
    } as unknown as Category;
    store.categories.push({
      id: category.id,
      name: category.name,
      description: category.description ?? undefined,
      image: category.image ?? undefined,
      createdAt: now,
      updatedAt: now,
    });
    return category;
  }

  return prisma.category.create({
    data: { name, description, image },
  });
}

export async function getCategories(): Promise<Category[]> {
  if (isDemoModeEnabled()) {
    return [...getDemoStore().categories]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description ?? null,
        image: category.image ?? null,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      } as unknown as Category));
  }

  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (isDemoModeEnabled()) {
    const category = getDemoStore().categories.find((entry) => entry.id === id);
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      description: category.description ?? null,
      image: category.image ?? null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    } as unknown as Category;
  }

  return prisma.category.findUnique({ where: { id } });
}

export async function updateCategory(
  id: string,
  name?: string,
  description?: string,
  image?: string
): Promise<Category | null> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.categories.findIndex((entry) => entry.id === id);
    if (index < 0) return null;
    const current = store.categories[index];
    const updated = {
      ...current,
      name: name ?? current.name,
      description: description ?? current.description,
      image: image ?? current.image,
      updatedAt: new Date(),
    };
    store.categories[index] = updated;
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description ?? null,
      image: updated.image ?? null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    } as unknown as Category;
  }

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
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.categories.findIndex((entry) => entry.id === id);
    if (index < 0) return false;
    store.categories.splice(index, 1);
    return true;
  }

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
  if (isDemoModeEnabled()) {
    const now = new Date();
    const supplier = {
      id: nextDemoId('SUP'),
      name: input.name,
      contactPerson: input.contactPerson,
      email: input.email,
      phone: input.phone,
      address: input.address ?? null,
      city: input.city ?? null,
      state: input.state ?? null,
      pincode: input.pincode ?? null,
      gstNo: input.gstNo ?? null,
      createdAt: now,
      updatedAt: now,
    } as unknown as Supplier;

    const store = getDemoStore();
    store.suppliers.push({
      id: supplier.id,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
    });

    return supplier;
  }

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
  if (isDemoModeEnabled()) {
    const start = skip ?? 0;
    const end = start + (take ?? 100);
    return [...getDemoStore().suppliers]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(start, end)
      .map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: null,
        city: null,
        state: null,
        pincode: null,
        gstNo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Supplier));
  }

  return prisma.supplier.findMany({
    skip: skip ?? 0,
    take: take ?? 100,
    orderBy: { name: 'asc' },
  });
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  if (isDemoModeEnabled()) {
    const supplier = getDemoStore().suppliers.find((entry) => entry.id === id);
    if (!supplier) return null;
    return {
      id: supplier.id,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: null,
      city: null,
      state: null,
      pincode: null,
      gstNo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Supplier;
  }

  return prisma.supplier.findUnique({ where: { id } });
}

export async function searchSuppliers(query: string): Promise<Supplier[]> {
  if (isDemoModeEnabled()) {
    const lowerQuery = query.toLowerCase();
    return getSuppliers(0, 100).then((suppliers) =>
      suppliers.filter((supplier) =>
        [supplier.name, supplier.email, supplier.contactPerson]
          .join(' ')
          .toLowerCase()
          .includes(lowerQuery)
      )
    );
  }

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
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.suppliers.findIndex((entry) => entry.id === id);
    if (index < 0) return null;
    const current = store.suppliers[index];
    const updated = {
      ...current,
      name: input.name ?? current.name,
      contactPerson: input.contactPerson ?? current.contactPerson,
      email: input.email ?? current.email,
      phone: input.phone ?? current.phone,
    };
    store.suppliers[index] = updated;
    return {
      id: updated.id,
      name: updated.name,
      contactPerson: updated.contactPerson,
      email: updated.email,
      phone: updated.phone,
      address: input.address ?? null,
      city: input.city ?? null,
      state: input.state ?? null,
      pincode: input.pincode ?? null,
      gstNo: input.gstNo ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Supplier;
  }

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
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.suppliers.findIndex((entry) => entry.id === id);
    if (index < 0) return false;
    store.suppliers.splice(index, 1);
    return true;
  }

  try {
    await prisma.supplier.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
