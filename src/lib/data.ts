import type { User, Sale, Medicine, Supplier, Customer, Prescription } from './types';

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

export const mockSuppliers: Supplier[] = [
    { id: 'SUP001', name: 'Global Pharma Inc.', contactPerson: 'John Doe', email: 'john.doe@globalpharma.com', phone: '+1-202-555-0173' },
    { id: 'SUP002', name: 'MedLife Supplies', contactPerson: 'Jane Smith', email: 'jane.smith@medlifesupplies.com', phone: '+44-20-7946-0958' },
    { id: 'SUP003', name: 'Wellness Distributors', contactPerson: 'David Chen', email: 'david.chen@wellnessdist.com', phone: '+65-6321-4567' },
    { id: 'SUP004', name: 'HealthCare Logistics', contactPerson: 'Maria Garcia', email: 'maria.garcia@hclogistics.net', phone: '+34-91-123-4567' },
    { id: 'SUP005', name: 'Asia-Pacific Meds', contactPerson: 'Li Wei', email: 'li.wei@apmeds.com', phone: '+86-10-1234-5678' },
];

export const mockCustomers: Customer[] = [
    { id: 'CUS001', name: 'Olivia Martin', email: 'olivia.martin@email.com', phone: '+1-202-555-0111', totalSpent: 1659.17, avatarId: 'user-avatar-1' },
    { id: 'CUS002', name: 'Jackson Lee', email: 'jackson.lee@email.com', phone: '+1-202-555-0122', totalSpent: 3237.00, avatarId: 'user-avatar-2' },
    { id: 'CUS003', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', phone: '+1-202-555-0133', totalSpent: 2481.70, avatarId: 'user-avatar-3' },
    { id: 'CUS004', name: 'William Kim', email: 'will@email.com', phone: '+1-202-555-0144', totalSpent: 8217.00, avatarId: 'user-avatar-4' },
    { id: 'CUS005', name: 'Sofia Davis', email: 'sofia.davis@email.com', phone: '+1-202-555-0155', totalSpent: 3237.00, avatarId: 'user-avatar-5' },
];

export const monthlySalesData = [
  { month: 'Jan', sales: 245000 },
  { month: 'Feb', sales: 289000 },
  { month: 'Mar', sales: 312000 },
  { month: 'Apr', sales: 278000 },
  { month: 'May', sales: 345000 },
  { month: 'Jun', sales: 375424 },
];

export const salesByCategory = [
    { category: 'Painkiller', sales: 4000, percent: 0.40 },
    { category: 'Antibiotic', sales: 3000, percent: 0.30 },
    { category: 'Antihistamine', sales: 1500, percent: 0.15 },
    { category: 'Vitamins', sales: 1000, percent: 0.10 },
    { category: 'Other', sales: 500, percent: 0.05 },
];

export const mockPrescriptions: Prescription[] = [
  {
    id: 'PRES001',
    patientName: 'Olivia Martin',
    patientId: 'CUS001',
    doctorName: 'Dr. Evelyn Reed',
    date: '2024-07-25',
    status: 'pending',
    medicines: [
      { name: 'Amoxicillin 250mg', dosage: '1 tablet twice a day', quantity: 14 },
      { name: 'Ibuprofen 200mg', dosage: 'As needed for pain', quantity: 20 },
    ]
  },
  {
    id: 'PRES002',
    patientName: 'Jackson Lee',
    patientId: 'CUS002',
    doctorName: 'Dr. Alan Grant',
    date: '2024-07-24',
    status: 'verified',
    medicines: [
      { name: 'Metformin 500mg', dosage: '1 tablet daily', quantity: 30 },
    ]
  },
  {
    id: 'PRES003',
    patientName: 'William Kim',
    patientId: 'CUS004',
    doctorName: 'Dr. Evelyn Reed',
    date: '2024-07-23',
    status: 'pending',
    medicines: [
      { name: 'Salbutamol Inhaler', dosage: '2 puffs as needed', quantity: 1 },
    ]
  },
    {
    id: 'PRES004',
    patientName: 'Sofia Davis',
    patientId: 'CUS005',
    doctorName: 'Dr. Ellie Sattler',
    date: '2024-07-22',
    status: 'rejected',
    medicines: [
      { name: 'Aspirin 81mg', dosage: '1 tablet daily', quantity: 30 },
    ]
  },
  {
    id: 'PRES005',
    patientName: 'Isabella Nguyen',
    patientId: 'CUS003',
    doctorName: 'Dr. Alan Grant',
    date: '2024-07-21',
    status: 'verified',
    medicines: [
        { name: 'Loratadine 10mg', dosage: '1 tablet daily for 7 days', quantity: 7 },
    ]
  },
];
