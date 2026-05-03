import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { coupons } from "../store";

export const listCouponsTool = createTool({
  id: "listCoupons",
  description: "Lista todos os cupons, opcionalmente apenas os ativos",
  inputSchema: z.object({
    active: z.boolean().optional().describe("Se true, retorna apenas cupons ativos e dentro da validade"),
  }),
  outputSchema: z.object({
    coupons: z.array(z.object({
      id: z.string(),
      code: z.string(),
      discountPercent: z.number(),
      validUntil: z.string(),
      usageCount: z.number(),
      active: z.boolean(),
    })),
    total: z.number(),
  }),
  execute: async ({ active }) => {
    let list = Array.from(coupons.values());
    if (active) {
      const now = new Date().toISOString();
      list = list.filter(c => c.active && c.validUntil >= now);
    }
    return { coupons: list, total: list.length };
  },
});
