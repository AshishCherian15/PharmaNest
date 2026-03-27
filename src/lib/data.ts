import type { User, Sale, Medicine } from './types';

export const mockUser: User = {
  name: 'Sofia Davis',
  email: 'sofia.davis@pharmanest.com',
  avatarId: 'user-avatar-1',
};

export const mockSales: Sale[] = [
  {
    id: '1',
    customerName: 'Olivia Martin',
    customerEmail: 'olivia.martin@email.com',
    amount: 1999,
    avatarId: 'user-avatar-1',
  },
  {
    id: '2',
    customerName: 'Jackson Lee',
    customerEmail: 'jackson.lee@email.com',
    amount: 3900,
    avatarId: 'user-avatar-2',
  },
  {
    id: '3',
    customerName: 'Isabella Nguyen',
    customerEmail: 'isabella.nguyen@email.com',
    amount: 2990,
    avatarId: 'user-avatar-3',
  },
  {
    id: '4',
    customerName: 'William Kim',
    customerEmail: 'will@email.com',
    amount: 9900,
    avatarId: 'user-avatar-4',
  },
  {
    id: '5',
    customerName: 'Sofia Davis',
    customerEmail: 'sofia.davis@email.com',
    amount: 3900,
    avatarId: 'user-avatar-5',
  },
];

export const mockMedicines: Medicine[] = [
    { id: 'MED001', name: 'Paracetamol 500mg', quantity: 15, expiryDate: '2024-12-31' },
    { id: 'MED002', name: 'Amoxicillin 250mg', quantity: 8, expiryDate: '2025-01-15' },
    { id: 'MED003', name: 'Ibuprofen 200mg', quantity: 50, expiryDate: '2024-08-01' },
    { id: 'MED004', name: 'Loratadine 10mg', quantity: 2, expiryDate: '2024-07-20' },
];

export const weeklySalesData = [
  { name: 'Mon', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Tue', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Wed', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Thu', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Fri', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Sat', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Sun', sales: Math.floor(Math.random() * 2000) + 1000 },
];
