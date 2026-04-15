import type { UserRole } from '@prisma/client';
import {
  landingCategories,
  landingProducts,
  mockMedicines,
  mockOrders,
  mockPrescriptions,
  mockSuppliers,
  mockUsers,
} from '@/lib/data';
import type {
  CustomerOrder,
  Medicine,
  Prescription,
  PurchaseOrder,
  Supplier,
} from '@/lib/types';

type DemoCategory = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

type DemoSalesTransaction = {
  id: string;
  amount: number;
  items: number;
  timestamp: string;
};

type DemoUserPublic = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

type DemoStore = {
  products: Medicine[];
  customerOrders: CustomerOrder[];
  prescriptions: Prescription[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  salesTransactions: DemoSalesTransaction[];
  categories: DemoCategory[];
  users: DemoUserPublic[];
  stockVersion: number;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeRole(role: string): UserRole {
  const lower = role.toLowerCase();
  if (lower === 'admin') return 'admin';
  if (lower === 'pharmacist') return 'pharmacist';
  if (lower === 'staff') return 'staff';
  return 'customer';
}

function buildInitialProducts(): Medicine[] {
  const seen = new Set<string>();
  const merged = [...mockMedicines, ...landingProducts];

  return merged
    .filter((product) => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    })
    .map((product) => ({
      ...product,
      quantity: Math.max(0, Number(product.quantity) || 0),
      isNew: Boolean(product.isNew),
      requiresPrescription: Boolean(product.requiresPrescription),
    }));
}

function buildInitialCategories(products: Medicine[]): DemoCategory[] {
  const names = new Set<string>([
    ...products.map((p) => p.category),
    ...landingCategories.map((c) => c.name),
  ]);

  return Array.from(names)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((name, index) => ({
      id: `CAT-${String(index + 1).padStart(3, '0')}`,
      name,
      description: `${name} category`,
      image: null as unknown as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
}

function buildInitialUsers(): DemoUserPublic[] {
  const now = new Date();
  const fromMocks = mockUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email.toLowerCase(),
    phone: user.phone,
    role: normalizeRole(user.role),
    createdAt: now,
    updatedAt: now,
  }));

  const demoUsers: DemoUserPublic[] = [
    {
      id: 'ADM-DEMO',
      name: 'Demo Admin',
      email: 'admin@pharmanest.com',
      phone: '+91-90000-00001',
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'CUS-DEMO',
      name: 'Demo Customer',
      email: 'customer@pharmanest.com',
      phone: '+91-90000-00002',
      role: 'customer',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'STF-DEMO',
      name: 'Demo Staff',
      email: 'staff@pharmanest.com',
      phone: '+91-90000-00003',
      role: 'staff',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'PHM-DEMO',
      name: 'Demo Pharmacist',
      email: 'pharmacist@pharmanest.com',
      phone: '+91-90000-00004',
      role: 'pharmacist',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const map = new Map<string, DemoUserPublic>();
  for (const user of [...fromMocks, ...demoUsers]) {
    map.set(user.email, user);
  }
  return Array.from(map.values());
}

function buildInitialOrders(products: Medicine[]): CustomerOrder[] {
  const first = products[0];
  const second = products[1] ?? first;
  const now = new Date();

  return [
    {
      id: 'ORD-DEMO-001',
      customerId: 'CUS-DEMO',
      customerName: 'Demo Customer',
      customerEmail: 'customer@pharmanest.com',
      address: '221B Demo Street, Bengaluru, 560001',
      items: [
        {
          medicineId: first.id,
          name: first.name,
          genericName: first.genericName,
          unitPrice: first.price,
          quantity: 2,
        },
      ],
      subtotal: first.price * 2,
      deliveryFee: 0,
      total: first.price * 2,
      status: 'Delivered',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ORD-DEMO-002',
      customerId: 'CUS001',
      customerName: 'Olivia Martin',
      customerEmail: 'olivia.martin@email.com',
      address: '15 MG Road, Kochi, 682001',
      items: [
        {
          medicineId: second.id,
          name: second.name,
          genericName: second.genericName,
          unitPrice: second.price,
          quantity: 1,
        },
      ],
      subtotal: second.price,
      deliveryFee: 0,
      total: second.price,
      status: 'Processing',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function buildInitialPrescriptions(): Prescription[] {
  const list = clone(mockPrescriptions);
  list.push({
    id: 'PRES-DEMO-001',
    patientId: 'CUS-DEMO',
    patientName: 'Demo Customer',
    doctorName: 'Dr. Anita Nair',
    date: new Date().toISOString().slice(0, 10),
    status: 'verified',
    medicines: [
      {
        name: 'Amoxicillin 500mg Capsules',
        dosage: '1 capsule after food',
        quantity: 10,
      },
    ],
    notes: 'Demo verified prescription for showcase.',
  });
  return list;
}

function buildInitialSales(orders: CustomerOrder[]): DemoSalesTransaction[] {
  return orders.map((order, index) => ({
    id: `TXN-DEMO-${String(index + 1).padStart(3, '0')}`,
    amount: order.total,
    items: order.items.length,
    timestamp: order.createdAt,
  }));
}

function buildInitialStore(): DemoStore {
  const products = buildInitialProducts();
  const customerOrders = buildInitialOrders(products);

  return {
    products,
    customerOrders,
    prescriptions: buildInitialPrescriptions(),
    suppliers: clone(mockSuppliers),
    purchaseOrders: clone(mockOrders),
    salesTransactions: buildInitialSales(customerOrders),
    categories: buildInitialCategories(products),
    users: buildInitialUsers(),
    stockVersion: 1,
  };
}

const globalStore = globalThis as unknown as {
  __pharmanestDemoStore?: DemoStore;
};

export function getDemoStore(): DemoStore {
  if (!globalStore.__pharmanestDemoStore) {
    globalStore.__pharmanestDemoStore = buildInitialStore();
  }
  return globalStore.__pharmanestDemoStore;
}

export function nextDemoId(prefix: string): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${suffix}`;
}

export function bumpDemoStockVersion(): number {
  const store = getDemoStore();
  store.stockVersion += 1;
  return store.stockVersion;
}
