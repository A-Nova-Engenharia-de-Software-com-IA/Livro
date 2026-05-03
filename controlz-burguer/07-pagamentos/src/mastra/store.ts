export type PaymentStatus = "pendente" | "aprovado" | "recusado" | "estornado";
export type PaymentMethod = "pix" | "credito" | "debito";

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  details: Record<string, string>;
  createdAt: string;
}

// TODO: integrar com gateway real (Stripe, MercadoPago, etc.) em produção
export const transactions = new Map<string, Transaction>();
