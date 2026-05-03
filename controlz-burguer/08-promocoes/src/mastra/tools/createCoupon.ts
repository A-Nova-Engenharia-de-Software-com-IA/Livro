import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { coupons, type Coupon } from "../store";
import { randomUUID } from "crypto";

export const createCouponTool = createTool({
  id: "createCoupon",
  description: "Cria um novo cupom de desconto",
  inputSchema: z.object({
    code: z.string().describe("Código do cupom ex: CTRL10 (será convertido para maiúsculas)"),
    discountPercent: z.number().min(1).max(100).describe("Percentual de desconto"),
    validUntil: z.string().describe("Data de validade ISO ex: 2025-12-31"),
    conditions: z.string().optional().describe("Condições de uso ex: Pedido mínimo R$30"),
  }),
  outputSchema: z.object({
    id: z.string(),
    code: z.string(),
    discountPercent: z.number(),
    validUntil: z.string(),
    active: z.boolean(),
  }),
  execute: async ({ code, discountPercent, validUntil, conditions }) => {
    const coupon: Coupon = {
      id: randomUUID(),
      code: code.toUpperCase(),
      discountPercent,
      validUntil,
      conditions,
      usageCount: 0,
      active: true,
      createdAt: new Date().toISOString(),
    };
    coupons.set(coupon.code, coupon);
    return coupon;
  },
});
