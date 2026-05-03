import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { stock } from "../store";

export const getStockTool = createTool({
  id: "getStock",
  description: "Consulta o estoque de um insumo pelo SKU",
  inputSchema: z.object({
    sku: z.string().describe("Código do insumo"),
  }),
  outputSchema: z.object({
    item: z.object({
      sku: z.string(),
      name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      minThreshold: z.number(),
      belowThreshold: z.boolean(),
    }).nullable(),
    found: z.boolean(),
  }),
  execute: async ({ sku }) => {
    const item = stock.get(sku) ?? null;
    if (!item) return { item: null, found: false };
    return { item: { ...item, belowThreshold: item.quantity <= item.minThreshold }, found: true };
  },
});
