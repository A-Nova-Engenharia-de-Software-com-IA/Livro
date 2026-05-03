import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fakeOrders } from "../store";

export const getTopProductsTool = createTool({
  id: "getTopProducts",
  description: "Retorna os produtos mais vendidos no período",
  inputSchema: z.object({
    periodDays: z.number().int().positive().default(30).describe("Número de dias para análise"),
    limit: z.number().int().positive().default(5).describe("Quantidade de produtos no ranking"),
  }),
  outputSchema: z.object({
    products: z.array(z.object({
      name: z.string(),
      category: z.string(),
      totalQty: z.number(),
      totalRevenue: z.number(),
      rank: z.number(),
    })),
    periodDays: z.number(),
  }),
  execute: async ({ periodDays, limit }) => {
    const filtered = fakeOrders.filter(o => o.dayOffset <= periodDays);
    const totals = new Map<string, { name: string; category: string; qty: number; revenue: number }>();
    for (const o of filtered) {
      const existing = totals.get(o.product) ?? { name: o.product, category: o.category, qty: 0, revenue: 0 };
      totals.set(o.product, { ...existing, qty: existing.qty + o.qty, revenue: existing.revenue + o.total });
    }
    const sorted = Array.from(totals.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, limit)
      .map((p, i) => ({ name: p.name, category: p.category, totalQty: p.qty, totalRevenue: parseFloat(p.revenue.toFixed(2)), rank: i + 1 }));
    return { products: sorted, periodDays: periodDays };
  },
});
