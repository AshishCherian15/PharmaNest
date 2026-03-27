export type User = {
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
  description: string;
  category: string;
  price: number;
  quantity: number;
  expiryDate: string;
  imageId: string;
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

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  avatarId: string;
};
