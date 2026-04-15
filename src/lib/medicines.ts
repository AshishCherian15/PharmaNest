import { prisma } from '@/lib/prisma';
import type { Medicine } from '@prisma/client';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { getDemoStore, nextDemoId } from '@/lib/demo/demo-store';

export type CreateMedicineInput = {
  name: string;
  genericName: string;
  description?: string;
  dosage?: string;
  manufacturer?: string;
  categoryId: string;
  price: number; // in paise
  hsn?: string;
  quantity?: number;
  reorderLevel?: number;
  expiryDate?: string; // ISO string
  batchNo?: string;
  image?: string;
};

export type UpdateMedicineInput = Partial<CreateMedicineInput>;

function toDemoMedicine(product: {
  id: string;
  name: string;
  genericName: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  expiryDate: string;
  imageId: string;
  requiresPrescription?: boolean;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  previousPrice?: number;
}, categoryId: string): Medicine {
  const now = new Date();
  return {
    id: product.id,
    name: product.name,
    genericName: product.genericName,
    description: product.description ?? null,
    dosage: null,
    manufacturer: null,
    categoryId,
    price: product.price,
    hsn: null,
    quantity: product.quantity,
    reorderLevel: 10,
    expiryDate: product.expiryDate ? new Date(product.expiryDate) : null,
    batchNo: null,
    image: product.imageId,
    requiresPrescription: Boolean(product.requiresPrescription),
    rating: product.rating ?? null,
    reviews: product.reviews ?? null,
    isNew: Boolean(product.isNew),
    previousPrice: product.previousPrice ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

function categoryNameFromId(categoryId: string): string {
  const store = getDemoStore();
  return store.categories.find((category) => category.id === categoryId)?.name ?? 'General';
}

function categoryIdFromName(categoryName: string): string {
  const store = getDemoStore();
  return store.categories.find((category) => category.name === categoryName)?.id ?? store.categories[0]?.id ?? 'CAT-001';
}

export async function createMedicine(input: CreateMedicineInput): Promise<Medicine> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const medicine = toDemoMedicine(
      {
        id: nextDemoId('MED-DEMO'),
        name: input.name,
        genericName: input.genericName,
        description: input.description,
        category: categoryNameFromId(input.categoryId),
        price: input.price,
        quantity: input.quantity ?? 0,
        expiryDate: input.expiryDate ?? new Date().toISOString().slice(0, 10),
        imageId: input.image ?? 'med-image-1',
      },
      input.categoryId
    );

    store.products.unshift({
      id: medicine.id,
      name: medicine.name,
      genericName: medicine.genericName,
      description: medicine.description ?? '',
      category: categoryNameFromId(input.categoryId),
      requiresPrescription: medicine.requiresPrescription,
      price: medicine.price,
      quantity: medicine.quantity,
      expiryDate: medicine.expiryDate?.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      imageId: medicine.image ?? 'med-image-1',
      rating: medicine.rating ?? undefined,
      reviews: medicine.reviews ?? undefined,
      isNew: medicine.isNew,
      previousPrice: medicine.previousPrice ?? undefined,
    });

    return medicine;
  }

  return prisma.medicine.create({
    data: {
      name: input.name,
      genericName: input.genericName,
      description: input.description,
      dosage: input.dosage,
      manufacturer: input.manufacturer,
      categoryId: input.categoryId,
      price: input.price,
      hsn: input.hsn,
      quantity: input.quantity ?? 0,
      reorderLevel: input.reorderLevel ?? 10,
      expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
      batchNo: input.batchNo,
      image: input.image,
    },
  });
}

export async function getMedicines(
  categoryId?: string,
  skip?: number,
  take?: number
): Promise<Medicine[]> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const medicines = store.products
      .filter((product) => !categoryId || categoryIdFromName(product.category) === categoryId)
      .slice(skip ?? 0, (skip ?? 0) + (take ?? 100))
      .map((product) => toDemoMedicine(product, categoryIdFromName(product.category)));
    return medicines;
  }

  return prisma.medicine.findMany({
    where: categoryId ? { categoryId } : undefined,
    skip: skip ?? 0,
    take: take ?? 100,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  if (isDemoModeEnabled()) {
    const product = getDemoStore().products.find((entry) => entry.id === id);
    return product ? toDemoMedicine(product, categoryIdFromName(product.category)) : null;
  }

  return prisma.medicine.findUnique({
    where: { id },
  });
}

export async function getMedicineByName(name: string): Promise<Medicine | null> {
  if (isDemoModeEnabled()) {
    const product = getDemoStore().products.find((entry) => entry.name === name);
    return product ? toDemoMedicine(product, categoryIdFromName(product.category)) : null;
  }

  return prisma.medicine.findUnique({
    where: { name },
  });
}

export async function updateMedicine(
  id: string,
  input: UpdateMedicineInput
): Promise<Medicine | null> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.products.findIndex((entry) => entry.id === id);
    if (index < 0) return null;
    const current = store.products[index];
    const updated = {
      ...current,
      name: input.name ?? current.name,
      genericName: input.genericName ?? current.genericName,
      description: input.description ?? current.description,
      category: input.categoryId ? categoryNameFromId(input.categoryId) : current.category,
      price: input.price ?? current.price,
      quantity: input.quantity ?? current.quantity,
      expiryDate: input.expiryDate ?? current.expiryDate,
      imageId: input.image ?? current.imageId,
      requiresPrescription: current.requiresPrescription,
    };
    store.products[index] = updated;
    return toDemoMedicine(updated, categoryIdFromName(updated.category));
  }

  const existing = await getMedicineById(id);
  if (!existing) return null;

  return prisma.medicine.update({
    where: { id },
    data: {
      name: input.name ?? existing.name,
      genericName: input.genericName ?? existing.genericName,
      description: input.description ?? existing.description,
      dosage: input.dosage ?? existing.dosage,
      manufacturer: input.manufacturer ?? existing.manufacturer,
      categoryId: input.categoryId ?? existing.categoryId,
      price: input.price ?? existing.price,
      hsn: input.hsn ?? existing.hsn,
      quantity: input.quantity ?? existing.quantity,
      reorderLevel: input.reorderLevel ?? existing.reorderLevel,
      expiryDate: input.expiryDate ? new Date(input.expiryDate) : existing.expiryDate,
      batchNo: input.batchNo ?? existing.batchNo,
      image: input.image ?? existing.image,
    },
  });
}

export async function deleteMedicine(id: string): Promise<boolean> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.products.findIndex((entry) => entry.id === id);
    if (index < 0) return false;
    store.products.splice(index, 1);
    return true;
  }

  try {
    await prisma.medicine.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

export async function searchMedicines(query: string): Promise<Medicine[]> {
  if (isDemoModeEnabled()) {
    const lowerQuery = query.toLowerCase();
    return getDemoStore().products
      .filter((product) =>
        [product.name, product.genericName, product.category]
          .join(' ')
          .toLowerCase()
          .includes(lowerQuery)
      )
      .slice(0, 50)
      .map((product) => toDemoMedicine(product, categoryIdFromName(product.category)));
  }

  const lowerQuery = query.toLowerCase();
  return prisma.medicine.findMany({
    where: {
      OR: [
        { name: { contains: lowerQuery } },
        { genericName: { contains: lowerQuery } },
        { manufacturer: { contains: lowerQuery } },
      ],
    },
    take: 50,
  });
}

export async function getLowStockMedicines(threshold: number = 10): Promise<Medicine[]> {
  if (isDemoModeEnabled()) {
    return getDemoStore().products
      .filter((product) => product.quantity <= threshold)
      .sort((a, b) => a.quantity - b.quantity)
      .map((product) => toDemoMedicine(product, categoryIdFromName(product.category)));
  }

  return prisma.medicine.findMany({
    where: {
      quantity: {
        lte: threshold,
      },
    },
    orderBy: { quantity: 'asc' },
  });
}

export async function getExpiringMedicines(daysThreshold: number = 60): Promise<Medicine[]> {
  if (isDemoModeEnabled()) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysThreshold);

    return getDemoStore().products
      .filter((product) => {
        const expiry = new Date(product.expiryDate);
        return expiry >= today && expiry <= futureDate;
      })
      .sort((a, b) => (a.expiryDate > b.expiryDate ? 1 : -1))
      .map((product) => toDemoMedicine(product, categoryIdFromName(product.category)));
  }

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysThreshold);

  return prisma.medicine.findMany({
    where: {
      expiryDate: {
        lte: futureDate,
        gte: new Date(),
      },
    },
    orderBy: { expiryDate: 'asc' },
  });
}
