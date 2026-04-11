import { prisma } from '@/lib/prisma';
import type { Medicine } from '@prisma/client';

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

export async function createMedicine(input: CreateMedicineInput): Promise<Medicine> {
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
  return prisma.medicine.findMany({
    where: categoryId ? { categoryId } : undefined,
    skip: skip ?? 0,
    take: take ?? 100,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  return prisma.medicine.findUnique({
    where: { id },
  });
}

export async function getMedicineByName(name: string): Promise<Medicine | null> {
  return prisma.medicine.findUnique({
    where: { name },
  });
}

export async function updateMedicine(
  id: string,
  input: UpdateMedicineInput
): Promise<Medicine | null> {
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
