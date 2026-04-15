import type { Profile, Sale, Medicine, Supplier, User, Prescription, PurchaseOrder, LandingCategory } from './types';

export const mockUser: Profile = {
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
    { id: 'MED001', name: 'Paracetamol 500mg', genericName: 'Paracetamol', description: 'For fever and pain relief.', category: 'Painkiller', price: 497, quantity: 150, expiryDate: '2025-12-31', imageId: 'med-image-1' },
    { id: 'MED002', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', description: 'Antibiotic for bacterial infections.', category: 'Antibiotic', requiresPrescription: true, price: 1037, quantity: 8, expiryDate: '2025-01-15', imageId: 'med-image-2' },
    { id: 'MED003', name: 'Ibuprofen 200mg', genericName: 'Ibuprofen', description: 'Nonsteroidal anti-inflammatory drug.', category: 'Painkiller', price: 664, quantity: 0, expiryDate: '2024-08-01', imageId: 'med-image-3' },
    { id: 'MED004', name: 'Loratadine 10mg', genericName: 'Loratadine', description: 'Antihistamine for allergies.', category: 'Antihistamine', price: 601, quantity: 2, expiryDate: '2024-07-20', imageId: 'med-image-4' },
    { id: 'MED005', name: 'Aspirin 81mg', genericName: 'Aspirin', description: 'Low-dose for cardiovascular health.', category: 'Cardiovascular', price: 373, quantity: 200, expiryDate: '2026-05-30', imageId: 'med-image-5' },
    { id: 'MED006', name: 'Omeprazole 20mg', genericName: 'Omeprazole', description: 'For acid reflux and heartburn.', category: 'Gastrointestinal', price: 1245, quantity: 75, expiryDate: '2023-09-01', imageId: 'med-image-6' },
    { id: 'MED007', name: 'Metformin 500mg', genericName: 'Metformin', description: 'For type 2 diabetes.', category: 'Diabetes', requiresPrescription: true, price: 838, quantity: 120, expiryDate: '2025-11-20', imageId: 'med-image-7' },
    { id: 'MED008', name: 'Salbutamol Inhaler', genericName: 'Salbutamol', description: 'For asthma and COPD.', category: 'Respiratory', requiresPrescription: true, price: 2075, quantity: 40, expiryDate: '2024-10-10', imageId: 'med-image-8' },
    { id: 'MED009', name: 'Cetirizine 10mg', genericName: 'Cetirizine', description: 'Antihistamine for allergies.', category: 'Antihistamine', price: 560, quantity: 90, expiryDate: '2026-01-15', imageId: 'med-image-9' },
    { id: 'MED010', name: 'Vitamin D3 1000 IU', genericName: 'Cholecalciferol', description: 'Dietary supplement.', category: 'Vitamins', price: 829, quantity: 300, expiryDate: '2026-08-01', imageId: 'med-image-10' },
    { id: 'MED011', name: 'Dextromethorphan Cough Syrup 100ml', genericName: 'Dextromethorphan', description: 'Relief from dry cough and throat irritation.', category: 'Respiratory', price: 285, quantity: 110, expiryDate: '2026-03-20', imageId: 'lprod-image-6' },
    { id: 'MED012', name: 'Paracetamol Pediatric Syrup 60ml', genericName: 'Paracetamol', description: 'Fever and pain relief syrup for children.', category: 'Painkiller', price: 165, quantity: 140, expiryDate: '2026-04-18', imageId: 'lprod-image-11' },
    { id: 'MED013', name: 'Iron and Folic Acid Syrup 200ml', genericName: 'Ferrous Ascorbate', description: 'Supports hemoglobin and nutrition in deficiency states.', category: 'Vitamins', price: 349, quantity: 85, expiryDate: '2026-01-31', imageId: 'lprod-image-10' },
    { id: 'MED014', name: 'Zinc Sulphate Oral Drops 15ml', genericName: 'Zinc Sulphate', description: 'Pediatric zinc drops for dietary supplementation.', category: 'Vitamins', price: 149, quantity: 95, expiryDate: '2026-02-11', imageId: 'lprod-image-9' },
];

export const weeklySalesData = [
  { name: 'Mon', sales: 182000 },
  { name: 'Tue', sales: 245000 },
  { name: 'Wed', sales: 198000 },
  { name: 'Thu', sales: 310000 },
  { name: 'Fri', sales: 275000 },
  { name: 'Sat', sales: 220000 },
  { name: 'Sun', sales: 160000 },
];

export const mockSuppliers: Supplier[] = [
    { id: 'SUP001', name: 'Global Pharma Inc.', contactPerson: 'John Doe', email: 'john.doe@globalpharma.com', phone: '+1-202-555-0173' },
    { id: 'SUP002', name: 'MedLife Supplies', contactPerson: 'Jane Smith', email: 'jane.smith@medlifesupplies.com', phone: '+44-20-7946-0958' },
    { id: 'SUP003', name: 'Wellness Distributors', contactPerson: 'David Chen', email: 'david.chen@wellnessdist.com', phone: '+65-6321-4567' },
    { id: 'SUP004', name: 'HealthCare Logistics', contactPerson: 'Maria Garcia', email: 'maria.garcia@hclogistics.net', phone: '+34-91-123-4567' },
    { id: 'SUP005', name: 'Asia-Pacific Meds', contactPerson: 'Li Wei', email: 'li.wei@apmeds.com', phone: '+86-10-1234-5678' },
];

export const mockUsers: User[] = [
    { id: 'CUS001', name: 'Olivia Martin', email: 'olivia.martin@email.com', phone: '+1-202-555-0111', role: 'Pharmacist', totalSpent: 1659.17, avatarId: 'user-avatar-1' },
    { id: 'CUS002', name: 'Jackson Lee', email: 'jackson.lee@email.com', phone: '+1-202-555-0122', role: 'Staff', totalSpent: 3237.00, avatarId: 'user-avatar-2' },
    { id: 'CUS003', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', phone: '+1-202-555-0133', role: 'Staff', totalSpent: 2481.70, avatarId: 'user-avatar-3' },
    { id: 'CUS004', name: 'William Kim', email: 'will@email.com', phone: '+1-202-555-0144', role: 'Admin', totalSpent: 8217.00, avatarId: 'user-avatar-4' },
    { id: 'CUS005', name: 'Sofia Davis', email: 'sofia.davis@email.com', phone: '+1-202-555-0155', role: 'Pharmacist', totalSpent: 3237.00, avatarId: 'user-avatar-5' },
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

export const mockOrders: PurchaseOrder[] = [
    { id: 'PO-001', supplierName: 'Global Pharma Inc.', orderDate: '2024-07-20', expectedDate: '2024-07-27', status: 'Shipped', total: 150000 },
    { id: 'PO-002', supplierName: 'MedLife Supplies', orderDate: '2024-07-18', expectedDate: '2024-07-25', status: 'Received', total: 75000 },
    { id: 'PO-003', supplierName: 'Wellness Distributors', orderDate: '2024-07-22', expectedDate: '2024-07-29', status: 'Pending', total: 210000 },
    { id: 'PO-004', supplierName: 'HealthCare Logistics', orderDate: '2024-07-15', expectedDate: '2024-07-22', status: 'Cancelled', total: 50000 },
];

export const landingCategories: LandingCategory[] = [
    { id: 'cat-1', name: 'Personal Care', imageId: 'cat-image-1', imageHint: 'skincare products' },
    { id: 'cat-2', name: 'Vitamins', imageId: 'cat-image-2', imageHint: 'vitamin bottles' },
    { id: 'cat-3', name: 'Baby Care', imageId: 'cat-image-3', imageHint: 'baby products' },
    { id: 'cat-4', name: 'Medical Devices', imageId: 'cat-image-4', imageHint: 'medical equipment' },
    { id: 'cat-5', name: 'Pain Relief', imageId: 'cat-image-5', imageHint: 'painkiller pills' },
    { id: 'cat-6', name: 'Health Foods', imageId: 'cat-image-6', imageHint: 'healthy food' },
];

export const landingProducts: Medicine[] = [
    { id: 'LPROD001', name: 'Multivitamin Gummies', genericName: 'Multivitamin', description: 'Tasty and chewy multivitamin gummies for adults.', category: 'Vitamins', price: 1299, quantity: 100, expiryDate: '2026-01-01', imageId: 'lprod-image-1', rating: 5, reviews: 120, previousPrice: 1599, isNew: true },
    { id: 'LPROD002', name: 'Gentle Skin Cleanser', genericName: 'Cetyl Alcohol', description: 'A mild, non-irritating cleanser for all skin types.', category: 'Personal Care', price: 850, quantity: 80, expiryDate: '2025-11-01', imageId: 'lprod-image-2', rating: 4, reviews: 98, isNew: true },
    { id: 'LPROD003', name: 'Organic Baby Shampoo', genericName: 'Organic Shampoo', description: 'Tear-free and gentle shampoo for babies.', category: 'Baby Care', price: 650, quantity: 120, expiryDate: '2025-09-01', imageId: 'lprod-image-3', rating: 5, reviews: 75, isNew: true },
    { id: 'LPROD004', name: 'Digital Thermometer', genericName: 'Thermometer', description: 'Fast and accurate digital thermometer.', category: 'Medical Devices', price: 499, quantity: 200, expiryDate: '2030-01-01', imageId: 'lprod-image-4', rating: 4, reviews: 210, previousPrice: 699 },
    { id: 'LPROD005', name: 'Vitamin C Effervescent Tablets', genericName: 'Ascorbic Acid', description: 'Boost your immunity with Vitamin C.', category: 'Vitamins', price: 349, quantity: 300, expiryDate: '2025-08-01', imageId: 'lprod-image-5', rating: 5, reviews: 150, previousPrice: 499, isNew: true },
    { id: 'LPROD006', name: 'Pain Relief Spray', genericName: 'Diclofenac', description: 'Instant relief from muscle and joint pain.', category: 'Pain Relief', price: 250, quantity: 150, expiryDate: '2025-06-01', imageId: 'lprod-image-6', rating: 4, reviews: 88, isNew: false },
    { id: 'LPROD007', name: 'Protein Bar - Chocolate', genericName: 'Protein Supplement', description: 'Healthy and delicious protein bar.', category: 'Health Foods', price: 150, quantity: 400, expiryDate: '2025-05-01', imageId: 'lprod-image-7', rating: 5, reviews: 180, isNew: false },
    { id: 'LPROD008', name: 'Sunscreen SPF 50', genericName: 'Sunscreen', description: 'Broad-spectrum protection against UVA and UVB rays.', category: 'Personal Care', price: 799, quantity: 90, expiryDate: '2026-03-01', imageId: 'lprod-image-8', rating: 4, reviews: 112, previousPrice: 999 },
    { id: 'LPROD009', name: 'Baby Diaper Pants (Medium)', genericName: 'Diapers', description: 'Soft and absorbent diaper pants for babies.', category: 'Baby Care', price: 999, quantity: 250, expiryDate: '2026-10-01', imageId: 'lprod-image-9', rating: 5, reviews: 250, isNew: true },
    { id: 'LPROD010', name: 'Omega-3 Fish Oil Capsules', genericName: 'Fish Oil', description: 'Supports heart and brain health.', category: 'Vitamins', price: 1100, quantity: 130, expiryDate: '2026-02-01', imageId: 'lprod-image-10', rating: 5, reviews: 190 },
    { id: 'LPROD013', name: 'Amoxicillin 500mg Capsules', genericName: 'Amoxicillin', description: 'Prescription antibiotic for bacterial infections.', category: 'Antibiotic', requiresPrescription: true, price: 1199, quantity: 70, expiryDate: '2026-01-01', imageId: 'med-image-2', rating: 4, reviews: 54, isNew: true },
    { id: 'LPROD011', name: 'Knee Pain Relief Patch', genericName: 'Herbal Patch', description: 'Herbal patch for effective knee pain relief.', category: 'Pain Relief', price: 450, quantity: 180, expiryDate: '2025-07-01', imageId: 'lprod-image-11', rating: 4, reviews: 65, previousPrice: 550 },
    { id: 'LPROD012', name: 'Blood Pressure Monitor', genericName: 'BP Monitor', description: 'Automatic digital blood pressure monitor.', category: 'Medical Devices', price: 2500, quantity: 60, expiryDate: '2032-01-01', imageId: 'lprod-image-12', rating: 5, reviews: 132 },
    { id: 'LPROD014', name: 'Cough Syrup Honey-Base 100ml', genericName: 'Dextromethorphan', description: 'Non-drowsy syrup support for dry cough episodes.', category: 'Respiratory', price: 315, quantity: 95, expiryDate: '2026-07-12', imageId: 'lprod-image-6', rating: 4, reviews: 71, isNew: true },
    { id: 'LPROD015', name: 'Children Fever Syrup 60ml', genericName: 'Paracetamol', description: 'Fast acting fever syrup formulated for pediatric use.', category: 'Baby Care', price: 179, quantity: 130, expiryDate: '2026-06-01', imageId: 'lprod-image-3', rating: 5, reviews: 102, previousPrice: 219 },
    { id: 'LPROD016', name: 'Vitamin D Oral Drops 30ml', genericName: 'Cholecalciferol', description: 'Daily vitamin D drops to support immunity and bones.', category: 'Vitamins', price: 229, quantity: 125, expiryDate: '2026-09-05', imageId: 'lprod-image-9', rating: 4, reviews: 86, isNew: true },
];
