export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferences?: string[];
  points: number;
  createdAt: string;
}

// TODO: substituir por persistência real em produção
export const customers = new Map<string, Customer>();

// Histórico de pedidos mockado por cliente
export const orderHistory = new Map<string, string[]>(); // customerId → orderIds
