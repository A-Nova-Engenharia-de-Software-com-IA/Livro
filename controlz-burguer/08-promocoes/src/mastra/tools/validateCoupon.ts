import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { coupons } from "../store";

export const validateCouponTool = createTool({
  id: "validateCoupon",
  description: "Valida um cupom e calcula o desconto para um pedido",
  inputSchema: z.object({
    code: z.string().describe("Código do cupom"),
    orderTotal: z.number().positive().describe("Valor total do pedido em reais"),
  }),
  outputSchema: z.object({
    valid: z.boolean(),
    code: z.string(),
    discountPercent: z.number(),
    discountAmount: z.number(),
    finalTotal: z.number(),
    message: z.string(),
  }),
  execute: async ({ code, orderTotal }) => {
    const coupon = coupons.get(code.toUpperCase());
    if (!coupon) return { valid: false, code, discountPercent: 0, discountAmount: 0, finalTotal: orderTotal, message: "Cupom não encontrado" };
    if (!coupon.active) return { valid: false, code, discountPercent: 0, discountAmount: 0, finalTotal: orderTotal, message: "Cupom inativo" };
    if (new Date(coupon.validUntil) < new Date()) return { valid: false, code, discountPercent: 0, discountAmount: 0, finalTotal: orderTotal, message: "Cupom expirado" };
    coupons.set(coupon.code, { ...coupon, usageCount: coupon.usageCount + 1 });
    const discountAmount = parseFloat((orderTotal * coupon.discountPercent / 100).toFixed(2));
    const finalTotal = parseFloat((orderTotal - discountAmount).toFixed(2));
    return { valid: true, code: coupon.code, discountPercent: coupon.discountPercent, discountAmount, finalTotal, message: `${coupon.discountPercent}% aplicado! Você economizou R$ ${discountAmount.toFixed(2)}` };
  },
});
