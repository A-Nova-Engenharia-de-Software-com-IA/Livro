import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { deleteProductById } from "../store";

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
    const deleted = await deleteProductById(id);
    return {
      success: deleted,
      message: deleted ? "Produto removido com sucesso" : "Produto não encontrado",
    };
  },
});
