import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fakeOrders } from "../store";

export const getRevenueTool = createTool({
  id: "getRevenue",
  description: "Calcula o faturamento total e por categoria no período",
  inputSchema: z.object({
    periodDays: z.number().int().positive().default(30).describe("Número de dias para análise"),
  }),
  outputSchema: z.object({
    totalRevenue: z.number(),
    totalOrders: z.number(),
    averageTicket: z.number(),
    byCategory: z.array(z.object({
      category: z.string(),
      revenue: z.number(),
      percentage: z.number(),
    })),
    periodDays: z.number(),
  }),
  execute: async ({ periodDays }) => {
    const filtered = fakeOrders.filter(o => o.dayOffset <= periodDays);
    const totalRevenue = parseFloat(filtered.reduce((s, o) => s + o.total, 0).toFixed(2));
    const totalOrders = filtered.length;
    const averageTicket = totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0;
    const catMap = new Map<string, number>();
    for (const o of filtered) catMap.set(o.category, (catMap.get(o.category) ?? 0) + o.total);
    const byCategory = Array.from(catMap.entries())
      .map(([category, revenue]) => ({ category, revenue: parseFloat(revenue.toFixed(2)), percentage: parseFloat((revenue / totalRevenue * 100).toFixed(1)) }))
      .sort((a, b) => b.revenue - a.revenue);
    return { totalRevenue, totalOrders, averageTicket, byCategory, periodDays: periodDays };
  },
});
