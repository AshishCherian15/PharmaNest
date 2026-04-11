import { hashPassword } from '@/lib/auth';
import { mockMedicines, mockOrders, mockPrescriptions, mockSuppliers, landingProducts, mockUsers } from '@/lib/data';
import { prisma } from '@/lib/prisma';

type SeedPromiseStore = {
  catalog?: Promise<void>;
  reference?: Promise<void>;
  prescriptions?: Promise<void>;
};

const globalStore = globalThis as unknown as SeedPromiseStore;

function getDefaultPassword(): string {
  return process.env.AUTH_DEFAULT_PASSWORD?.trim() || 'admin';
}

function normalizeProducts() {
  const products = new Map<string, (typeof landingProducts)[number]>();
  for (const product of [...landingProducts, ...mockMedicines]) {
    products.set(product.id, product);
  }
  return Array.from(products.values());
}

function normalizePrescriptionPatientId(patientId: string): string {
  const normalized = patientId.replace(/[^a-z0-9]/gi, '').toUpperCase();
  const match = normalized.match(/^CUS(\d{3})$/);
  if (!match) return patientId;
  return `CUS-${match[1]}`;
}

async function seedDemoUsers(): Promise<void> {
  const passwordHash = await hashPassword(getDefaultPassword());

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

  for (const [index, user] of mockUsers.slice(1, 5).entries()) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: `CUS-${String(index + 2).padStart(3, '0')}`,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'customer',
        passwordHash,
      },
    });
  }
}

export async function ensureCatalogSeeded(): Promise<void> {
  if (!globalStore.catalog) {
    globalStore.catalog = (async () => {
      const existingCount = await prisma.medicine.count();
      if (existingCount > 0) {
        await prisma.stockState.upsert({
          where: { id: 'catalog' },
          update: {},
          create: { id: 'catalog', version: 1 },
        });
        return;
      }

      const products = normalizeProducts();
      const categories = Array.from(new Set(products.map((product) => product.category)));

      await prisma.category.createMany({
        data: categories.map((name) => ({ name })),
      });

      const categoryRows = await prisma.category.findMany();
      const categoryMap = new Map(categoryRows.map((category) => [category.name, category.id]));

      for (const product of products) {
        const categoryId = categoryMap.get(product.category);
        if (!categoryId) continue;

        await prisma.medicine.create({
          data: {
            id: product.id,
            name: product.name,
            genericName: product.genericName,
            description: product.description,
            categoryId,
            price: product.price,
            quantity: product.quantity,
            reorderLevel: product.quantity <= 10 ? 10 : 5,
            expiryDate: product.expiryDate ? new Date(product.expiryDate) : null,
            image: product.imageId,
            requiresPrescription: Boolean(product.requiresPrescription),
            rating: product.rating ?? null,
            reviews: product.reviews ?? null,
            isNew: Boolean(product.isNew),
            previousPrice: product.previousPrice ?? null,
          },
        });
      }

      await prisma.stockState.upsert({
        where: { id: 'catalog' },
        update: {},
        create: { id: 'catalog', version: 1 },
      });
    })();
  }

  await globalStore.catalog;
}

export async function ensureReferenceDataSeeded(): Promise<void> {
  if (!globalStore.reference) {
    globalStore.reference = (async () => {
      await seedDemoUsers();
      await ensureCatalogSeeded();

      const supplierCount = await prisma.supplier.count();
      if (supplierCount === 0) {
        for (const supplier of mockSuppliers) {
          await prisma.supplier.create({
            data: {
              id: supplier.id,
              name: supplier.name,
              contactPerson: supplier.contactPerson,
              email: supplier.email,
              phone: supplier.phone,
            },
          });
        }
      }

      const purchaseOrderCount = await prisma.purchaseOrder.count();
      if (purchaseOrderCount === 0) {
        const suppliers = await prisma.supplier.findMany({ select: { id: true, name: true } });
        const supplierMap = new Map(suppliers.map((supplier) => [supplier.name, supplier.id]));

        for (const order of mockOrders) {
          const supplierId = supplierMap.get(order.supplierName);
          if (!supplierId) continue;

          await prisma.purchaseOrder.create({
            data: {
              id: order.id,
              supplierId,
              orderNo: order.id,
              orderDate: new Date(order.orderDate),
              expectedDeliveryDate: order.expectedDate ? new Date(order.expectedDate) : null,
              total: order.total,
              status: order.status,
            },
          });
        }
      }
    })();
  }

  await globalStore.reference;
}

export async function ensurePrescriptionSeeded(): Promise<void> {
  if (!globalStore.prescriptions) {
    globalStore.prescriptions = (async () => {
      await seedDemoUsers();
      await ensureCatalogSeeded();

      const prescriptionCount = await prisma.prescription.count();
      if (prescriptionCount > 0) return;

      const medicines = await prisma.medicine.findMany({ select: { id: true, name: true } });
      const medicineMap = new Map(medicines.map((medicine) => [medicine.name, medicine.id]));

      for (const record of mockPrescriptions) {
        const customerId = normalizePrescriptionPatientId(record.patientId);
        const customer = await prisma.user.findUnique({ where: { id: customerId }, select: { id: true } });
        if (!customer) continue;

        await prisma.prescription.create({
          data: {
            id: record.id,
            customerId: customer.id,
            patientName: record.patientName,
            doctorName: record.doctorName,
            prescriptionDate: new Date(record.date),
            status: record.status === 'verified' ? 'verified' : record.status === 'rejected' ? 'rejected' : 'pending',
            notes: record.notes,
            documentUrl: record.imageDataUrl,
            items: {
              create: record.medicines
                .map((item) => ({
                  medicineId: medicineMap.get(item.name),
                  dosage: item.dosage,
                  quantity: item.quantity,
                  instructions: item.dosage,
                }))
                .filter((item): item is { medicineId: string; dosage: string; quantity: number; instructions: string } => Boolean(item.medicineId)),
            },
          },
        });
      }
    })();
  }

  await globalStore.prescriptions;
}