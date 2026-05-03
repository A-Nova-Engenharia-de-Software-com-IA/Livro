import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { queue } from "../store";

export const getQueueTool = createTool({
  id: "getQueue",
  description: "Retorna a fila atual de pedidos da cozinha",
  inputSchema: z.object({}),
  outputSchema: z.object({
    orders: z.array(z.object({
      orderId: z.string(),
      items: z.array(z.object({
        itemId: z.string(),
        name: z.string(),
        qty: z.number(),
        status: z.string(),
      })),
      enteredAt: z.string(),
    })),
    total: z.number(),
  }),
  execute: async () => {
    const orders = Array.from(queue.values());
    return { orders, total: orders.length };
  },
});
