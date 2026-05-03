export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  rating: number; // 1-10 para NPS
  comment: string;
  sentiment?: "positivo" | "neutro" | "negativo";
  themes?: string[];
  createdAt: string;
}

// TODO: substituir por persistência real em produção
export const reviews: Review[] = [];
