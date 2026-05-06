import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getAllProducts } from "../store";

export const listProductsTool = createTool({
  id: "listProducts",
  description: "Lista produtos do cardápio, opcionalmente filtrando por categoria",
  inputSchema: z.object({
    category: z.string().optional().describe("Filtrar por categoria"),
  }),
  outputSchema: z.object({
    products: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      category: z.string(),
      variations: z.array(z.string()).optional(),
      active: z.boolean(),
    })),
    total: z.number(),
  }),
  execute: async ({ category }) => {
    const list = await getAllProducts(category);
    return { products: list, total: list.length };
  },
});
