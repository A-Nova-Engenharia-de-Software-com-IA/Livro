import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { stock } from "../store";

export const decreaseStockTool = createTool({
  id: "decreaseStock",
  description: "Diminui a quantidade de um insumo no estoque",
  inputSchema: z.object({
    sku: z.string().describe("Código do insumo"),
    quantity: z.number().positive().describe("Quantidade a retirar"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    sku: z.string(),
    remaining: z.number(),
    belowThreshold: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ sku, quantity }) => {
    const item = stock.get(sku);
    if (!item) return { success: false, sku, remaining: 0, belowThreshold: true, message: "Insumo não encontrado" };
    if (item.quantity < quantity) return { success: false, sku, remaining: item.quantity, belowThreshold: true, message: "Estoque insuficiente" };
    const remaining = item.quantity - quantity;
    stock.set(sku, { ...item, quantity: remaining, updatedAt: new Date().toISOString() });
    const belowThreshold = remaining <= item.minThreshold;
    return { success: true, sku, remaining, belowThreshold, message: belowThreshold ? `⚠️ Estoque baixo: ${remaining} ${item.unit}` : "OK" };
  },
});
