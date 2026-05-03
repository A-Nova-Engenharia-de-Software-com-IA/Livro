import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { stock, type StockItem } from "../store";

export const addStockTool = createTool({
  id: "addStock",
  description: "Adiciona ou atualiza quantidade de um insumo no estoque",
  inputSchema: z.object({
    sku: z.string().describe("Código único do insumo"),
    name: z.string().optional().describe("Nome do insumo (obrigatório para novos itens)"),
    quantity: z.number().positive().describe("Quantidade a adicionar"),
    unit: z.string().optional().describe("Unidade de medida: unidade, kg, litro, pacote"),
  }),
  outputSchema: z.object({
    sku: z.string(),
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    isNew: z.boolean(),
  }),
  execute: async ({ sku, name, quantity, unit }) => {
    const existing = stock.get(sku);
    if (existing) {
      const updated: StockItem = { ...existing, quantity: existing.quantity + quantity, updatedAt: new Date().toISOString() };
      stock.set(sku, updated);
      return { ...updated, isNew: false };
    }
    const item: StockItem = {
      sku,
      name: name ?? sku,
      quantity,
      unit: unit ?? "unidade",
      minThreshold: 0,
      updatedAt: new Date().toISOString(),
    };
    stock.set(sku, item);
    return { ...item, isNew: true };
  },
});
