import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { stock } from "../store";

export const listStockTool = createTool({
  id: "listStock",
  description: "Lista todos os insumos do estoque, opcionalmente apenas os com estoque baixo",
  inputSchema: z.object({
    lowStockOnly: z.boolean().optional().describe("Se true, retorna apenas itens abaixo do mínimo"),
  }),
  outputSchema: z.object({
    items: z.array(z.object({
      sku: z.string(),
      name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      minThreshold: z.number(),
      belowThreshold: z.boolean(),
    })),
    total: z.number(),
    criticalCount: z.number(),
  }),
  execute: async ({ lowStockOnly }) => {
    let items = Array.from(stock.values()).map(i => ({ ...i, belowThreshold: i.quantity <= i.minThreshold }));
    if (lowStockOnly) items = items.filter(i => i.belowThreshold);
    const criticalCount = items.filter(i => i.belowThreshold).length;
    return { items, total: items.length, criticalCount };
  },
});
