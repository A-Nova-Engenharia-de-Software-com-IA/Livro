import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { products } from "../store";

export const updateProductTool = createTool({
  id: "updateProduct",
  description: "Atualiza campos de um produto existente no cardápio",
  inputSchema: z.object({
    id: z.string().describe("ID do produto"),
    fields: z.object({
      name: z.string().optional(),
      price: z.number().positive().optional(),
      category: z.string().optional(),
      variations: z.array(z.string()).optional(),
      active: z.boolean().optional(),
    }),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    product: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      category: z.string(),
    }).nullable(),
  }),
  execute: async ({ id, fields }) => {
    const product = products.get(id);
    if (!product) return { success: false, product: null };
    const updated = { ...product, ...fields };
    products.set(id, updated);
    return { success: true, product: updated };
  },
});
