import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getProductById } from "../store";

export const getProductTool = createTool({
  id: "getProduct",
  description: "Busca um produto pelo ID",
  inputSchema: z.object({
    id: z.string().describe("ID do produto"),
  }),
  outputSchema: z.object({
    product: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      category: z.string(),
      variations: z.array(z.string()).optional(),
      active: z.boolean(),
    }).nullable(),
    found: z.boolean(),
  }),
  execute: async ({ id }) => {
    const product = await getProductById(id);
    return { product, found: !!product };
  },
});
