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
