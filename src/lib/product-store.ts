import { prisma } from '@/lib/prisma';
import type { Medicine } from '@/lib/types';
import { ensureCatalogSeeded } from '@/lib/pharmanest-seed';
import { removeStockForProduct, upsertStockForProduct } from '@/lib/catalog-stock';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { getDemoStore, nextDemoId } from '@/lib/demo/demo-store';

type DbMedicine = {
  id: string;
  name: string;
  genericName: string;
  description: string | null;
  category: { name: string };
  price: number;
  quantity: number;
  expiryDate: Date | null;
  image: string | null;
  requiresPrescription: boolean;
  rating: number | null;
  reviews: number | null;
  isNew: boolean;
  previousPrice: number | null;
};

function mapMedicine(medicine: DbMedicine): Medicine {
  return {
    id: medicine.id,
    name: medicine.name,
    genericName: medicine.genericName,
    description: medicine.description ?? '',
    category: medicine.category.name,
    requiresPrescription: medicine.requiresPrescription,
    price: medicine.price,
    quantity: medicine.quantity,
    expiryDate: medicine.expiryDate?.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    imageId: medicine.image ?? 'med-image-1',
    rating: medicine.rating ?? undefined,
    reviews: medicine.reviews ?? undefined,
    isNew: medicine.isNew,
    previousPrice: medicine.previousPrice ?? undefined,
  };
}

export async function getAllProducts(): Promise<Medicine[]> {
  if (isDemoModeEnabled()) {
    return [...getDemoStore().products];
  }

  await ensureCatalogSeeded();
  const medicines = await prisma.medicine.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return medicines.map((medicine) => mapMedicine(medicine as DbMedicine));
}

export async function getProductById(id: string): Promise<Medicine | undefined> {
  if (isDemoModeEnabled()) {
    return getDemoStore().products.find((product) => product.id === id);
  }

  await ensureCatalogSeeded();
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });

  return medicine ? mapMedicine(medicine as DbMedicine) : undefined;
}

export async function createProduct(input: Medicine): Promise<Medicine> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const created: Medicine = {
      ...input,
      id: input.id?.trim() ? input.id : nextDemoId('MED-DEMO'),
    };
    store.products.unshift(created);
    return created;
  }

  await ensureCatalogSeeded();
  const category = await prisma.category.upsert({
    where: { name: input.category },
    update: {},
    create: { name: input.category },
  });

  const medicine = await prisma.medicine.create({
    data: {
      id: input.id,
      name: input.name,
      genericName: input.genericName,
      description: input.description,
      categoryId: category.id,
      price: input.price,
      quantity: input.quantity,
      expiryDate: new Date(input.expiryDate),
      image: input.imageId,
      requiresPrescription: Boolean(input.requiresPrescription),
      rating: input.rating ?? null,
      reviews: input.reviews ?? null,
      isNew: Boolean(input.isNew),
      previousPrice: input.previousPrice ?? null,
    },
    include: { category: { select: { name: true } } },
  });

  await upsertStockForProduct(medicine.id, medicine.quantity);
  return mapMedicine(medicine as DbMedicine);
}

export async function updateProduct(id: string, input: Medicine): Promise<Medicine | null> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.products.findIndex((product) => product.id === id);
    if (index < 0) return null;
    const updated: Medicine = {
      ...input,
      id,
    };
    store.products[index] = updated;
    return updated;
  }

  await ensureCatalogSeeded();
  const existing = await getProductById(id);
  if (!existing) return null;

  const category = await prisma.category.upsert({
    where: { name: input.category },
    update: {},
    create: { name: input.category },
  });

  const medicine = await prisma.medicine.update({
    where: { id },
    data: {
      name: input.name,
      genericName: input.genericName,
      description: input.description,
      categoryId: category.id,
      price: input.price,
      quantity: input.quantity,
      expiryDate: new Date(input.expiryDate),
      image: input.imageId,
      requiresPrescription: Boolean(input.requiresPrescription),
      rating: input.rating ?? null,
      reviews: input.reviews ?? null,
      isNew: Boolean(input.isNew),
      previousPrice: input.previousPrice ?? null,
    },
    include: { category: { select: { name: true } } },
  });

  await upsertStockForProduct(medicine.id, medicine.quantity);
  return mapMedicine(medicine as DbMedicine);
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const index = store.products.findIndex((product) => product.id === id);
    if (index < 0) return false;
    store.products.splice(index, 1);
    return true;
  }

  await ensureCatalogSeeded();
  try {
    await prisma.medicine.delete({ where: { id } });
    await removeStockForProduct(id);
    return true;
  } catch {
    return false;
  }
}
