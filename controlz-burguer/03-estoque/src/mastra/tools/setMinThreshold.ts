import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { stock } from "../store";

export const setMinThresholdTool = createTool({
  id: "setMinThreshold",
  description: "Define o estoque mínimo de alerta para um insumo",
  inputSchema: z.object({
    sku: z.string().describe("Código do insumo"),
    min: z.number().min(0).describe("Quantidade mínima antes do alerta"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    sku: z.string(),
    minThreshold: z.number(),
    message: z.string(),
  }),
  execute: async ({ sku, min }) => {
    const item = stock.get(sku);
    if (!item) return { success: false, sku, minThreshold: 0, message: "Insumo não encontrado" };
    stock.set(sku, { ...item, minThreshold: min, updatedAt: new Date().toISOString() });
    return { success: true, sku, minThreshold: min, message: `Mínimo definido: ${min} ${item.unit}` };
  },
});
