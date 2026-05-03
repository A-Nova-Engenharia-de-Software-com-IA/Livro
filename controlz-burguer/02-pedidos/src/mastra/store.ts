export type OrderStatus =
  | "novo"
  | "em_preparo"
  | "pronto"
  | "em_entrega"
  | "entregue"
  | "cancelado";

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  paymentMethod: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// TODO: substituir por persistência real em produção
export const orders = new Map<string, Order>();
