import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { products } from "../store";

export const deleteProductTool = createTool({
  id: "deleteProduct",
  description: "Remove um produto do cardápio pelo ID",
  inputSchema: z.object({
    id: z.string().describe("ID do produto a remover"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ id }) => {
    const existed = products.delete(id);
    return {
      success: existed,
      message: existed ? "Produto removido com sucesso" : "Produto não encontrado",
    };
  },
});
