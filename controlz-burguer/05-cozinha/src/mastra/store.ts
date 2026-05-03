export type ItemStatus = "aguardando" | "preparando" | "pronto";

export interface KitchenItem {
  itemId: string;
  name: string;
  qty: number;
  status: ItemStatus;
}

export interface KitchenOrder {
  orderId: string;
  items: KitchenItem[];
  enteredAt: string;
  completedAt?: string;
}

// TODO: substituir por persistência real em produção
export const queue = new Map<string, KitchenOrder>();
export const completedOrders: KitchenOrder[] = [];
