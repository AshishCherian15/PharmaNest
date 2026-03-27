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
    { id: 'MED001', name: 'Paracetamol 500mg', description: 'For fever and pain relief.', category: 'Painkiller', price: 5.99, quantity: 150, expiryDate: '2025-12-31' },
    { id: 'MED002', name: 'Amoxicillin 250mg', description: 'Antibiotic for bacterial infections.', category: 'Antibiotic', price: 12.50, quantity: 8, expiryDate: '2025-01-15' },
    { id: 'MED003', name: 'Ibuprofen 200mg', description: 'Nonsteroidal anti-inflammatory drug.', category: 'Painkiller', price: 8.00, quantity: 50, expiryDate: '2024-08-01' },
    { id: 'MED004', name: 'Loratadine 10mg', description: 'Antihistamine for allergies.', category: 'Antihistamine', price: 7.25, quantity: 2, expiryDate: '2024-07-20' },
    { id: 'MED005', name: 'Aspirin 81mg', description: 'Low-dose for cardiovascular health.', category: 'Cardiovascular', price: 4.50, quantity: 200, expiryDate: '2026-05-30' },
    { id: 'MED006', name: 'Omeprazole 20mg', description: 'For acid reflux and heartburn.', category: 'Gastrointestinal', price: 15.00, quantity: 75, expiryDate: '2025-09-01' },
    { id: 'MED007', name: 'Metformin 500mg', description: 'For type 2 diabetes.', category: 'Diabetes', price: 10.10, quantity: 120, expiryDate: '2025-11-20' },
    { id: 'MED008', name: 'Salbutamol Inhaler', description: 'For asthma and COPD.', category: 'Respiratory', price: 25.00, quantity: 40, expiryDate: '2024-10-10' },
    { id: 'MED009', name: 'Cetirizine 10mg', description: 'Antihistamine for allergies.', category: 'Antihistamine', price: 6.75, quantity: 90, expiryDate: '2026-01-15' },
    { id: 'MED010', name: 'Vitamin D3 1000 IU', description: 'Dietary supplement.', category: 'Vitamins', price: 9.99, quantity: 300, expiryDate: '2026-08-01' },
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
