export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  validUntil: string;
  conditions?: string;
  usageCount: number;
  active: boolean;
  createdAt: string;
}

export interface TimeBasedRule {
  id: string;
  description: string;
  rule: string;
  createdAt: string;
}

// TODO: substituir por persistência real em produção
export const coupons = new Map<string, Coupon>();
export const timeRules: TimeBasedRule[] = [];
