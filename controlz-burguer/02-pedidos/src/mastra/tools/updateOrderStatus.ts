import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { updateOrderStatus } from "../store";

export const updateOrderStatusTool = createTool({
  id: "updateOrderStatus",
  description: "Atualiza o status de um pedido",
  inputSchema: z.object({
    id: z.string().describe("ID do pedido"),
    status: z.enum(["novo", "em_preparo", "pronto", "em_entrega", "entregue", "cancelado"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    orderId: z.string(),
    previousStatus: z.string().nullable(),
    newStatus: z.string(),
  }),
  execute: async ({ id, status }) => {
    const { previousStatus, updated } = await updateOrderStatus(id, status);
    return { success: updated, orderId: id, previousStatus, newStatus: status };
  },
});
