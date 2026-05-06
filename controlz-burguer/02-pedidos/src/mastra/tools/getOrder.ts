import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getOrderById } from "../store";

export const getOrderTool = createTool({
  id: "getOrder",
  description: "Busca um pedido pelo ID com todos os seus itens",
  inputSchema: z.object({
    id: z.string().describe("ID do pedido"),
  }),
  outputSchema: z.object({
    order: z.object({
      id: z.string(),
      customerId: z.string(),
      items: z.array(z.object({
        productId: z.string(),
        productName: z.string(),
        qty: z.number(),
        unitPrice: z.number(),
      })),
      paymentMethod: z.string(),
      status: z.string(),
      total: z.number(),
      createdAt: z.string(),
    }).nullable(),
    found: z.boolean(),
  }),
  execute: async ({ id }) => {
    const order = await getOrderById(id);
    return { order, found: !!order };
  },
});
