export type Profile = {
  name: string;
  email: string;
  avatarId: string;
};

export type Sale = {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  avatarId: string;
};

export type Medicine = {
  id: string;
  name: string;
  genericName: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  expiryDate: string;
  imageId: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  previousPrice?: number;
};

export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
};

export type CartItem = {
    medicineId: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Pharmacist' | 'Staff';
  totalSpent: number;
  avatarId: string;
};

export type PrescriptionMedicine = {
  name: string;
  dosage: string;
  quantity: number;
};

export type Prescription = {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  medicines: PrescriptionMedicine[];
  patientId: string;
};

export type PurchaseOrder = {
  id: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: 'Pending' | 'Shipped' | 'Received' | 'Cancelled';
  total: number;
};

export type LandingCategory = {
  id: string;
  name: string;
  imageId: string;
  imageHint: string;
};
