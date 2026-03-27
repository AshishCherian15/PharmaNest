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
    amount: 165917,
    avatarId: 'user-avatar-1',
  },
  {
    id: '2',
    customerName: 'Jackson Lee',
    customerEmail: 'jackson.lee@email.com',
    amount: 323700,
    avatarId: 'user-avatar-2',
  },
  {
    id: '3',
    customerName: 'Isabella Nguyen',
    customerEmail: 'isabella.nguyen@email.com',
    amount: 248170,
    avatarId: 'user-avatar-3',
  },
  {
    id: '4',
    customerName: 'William Kim',
    customerEmail: 'will@email.com',
    amount: 821700,
    avatarId: 'user-avatar-4',
  },
  {
    id: '5',
    customerName: 'Sofia Davis',
    customerEmail: 'sofia.davis@email.com',
    amount: 323700,
    avatarId: 'user-avatar-5',
  },
];

export const mockMedicines: Medicine[] = [
    { id: 'MED001', name: 'Paracetamol 500mg', description: 'For fever and pain relief.', category: 'Painkiller', price: 497, quantity: 150, expiryDate: '2025-12-31', imageId: 'med-image-1' },
    { id: 'MED002', name: 'Amoxicillin 250mg', description: 'Antibiotic for bacterial infections.', category: 'Antibiotic', price: 1037, quantity: 8, expiryDate: '2025-01-15', imageId: 'med-image-2' },
    { id: 'MED003', name: 'Ibuprofen 200mg', description: 'Nonsteroidal anti-inflammatory drug.', category: 'Painkiller', price: 664, quantity: 0, expiryDate: '2024-08-01', imageId: 'med-image-3' },
    { id: 'MED004', name: 'Loratadine 10mg', description: 'Antihistamine for allergies.', category: 'Antihistamine', price: 601, quantity: 2, expiryDate: '2024-07-20', imageId: 'med-image-4' },
    { id: 'MED005', name: 'Aspirin 81mg', description: 'Low-dose for cardiovascular health.', category: 'Cardiovascular', price: 373, quantity: 200, expiryDate: '2026-05-30', imageId: 'med-image-5' },
    { id: 'MED006', name: 'Omeprazole 20mg', description: 'For acid reflux and heartburn.', category: 'Gastrointestinal', price: 1245, quantity: 75, expiryDate: '2023-09-01', imageId: 'med-image-6' },
    { id: 'MED007', name: 'Metformin 500mg', description: 'For type 2 diabetes.', category: 'Diabetes', price: 838, quantity: 120, expiryDate: '2025-11-20', imageId: 'med-image-7' },
    { id: 'MED008', name: 'Salbutamol Inhaler', description: 'For asthma and COPD.', category: 'Respiratory', price: 2075, quantity: 40, expiryDate: '2024-10-10', imageId: 'med-image-8' },
    { id: 'MED009', name: 'Cetirizine 10mg', description: 'Antihistamine for allergies.', category: 'Antihistamine', price: 560, quantity: 90, expiryDate: '2026-01-15', imageId: 'med-image-9' },
    { id: 'MED010', name: 'Vitamin D3 1000 IU', description: 'Dietary supplement.', category: 'Vitamins', price: 829, quantity: 300, expiryDate: '2026-08-01', imageId: 'med-image-10' },
];

export const weeklySalesData = [
  { name: 'Mon', sales: Math.floor(Math.random() * 200000) + 100000 },
  { name: 'Tue', sales: Math.floor(Math.random() * 200000) + 100000 },
  { name: 'Wed', sales: Math.floor(Math.random() * 200000) + 100000 },
  { name: 'Thu', sales: Math.floor(Math.random() * 200000) + 100000 },
  { name: 'Fri', sales: Math.floor(Math.random() * 200000) + 100000 },
  { name: 'Sat', sales: Math.floor(Math.random() * 200000) + 100000 },
  { name: 'Sun', sales: Math.floor(Math.random() * 200000) + 100000 },
];
