import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { queue, type KitchenOrder } from "../store";
import { randomUUID } from "crypto";

export const addToQueueTool = createTool({
  id: "addToQueue",
  description: "Adiciona um pedido à fila de produção da cozinha",
  inputSchema: z.object({
    orderId: z.string().describe("ID do pedido"),
    items: z.array(z.object({
      name: z.string(),
      qty: z.number().int().positive(),
    })).describe("Itens a preparar"),
  }),
  outputSchema: z.object({
    orderId: z.string(),
    queuePosition: z.number(),
    totalItemsInQueue: z.number(),
    enteredAt: z.string(),
  }),
  execute: async ({ orderId, items }) => {
    const order: KitchenOrder = {
      orderId,
      items: items.map(i => ({ itemId: randomUUID(), name: i.name, qty: i.qty, status: "aguardando" })),
      enteredAt: new Date().toISOString(),
    };
    queue.set(orderId, order);
    const position = Array.from(queue.keys()).indexOf(orderId) + 1;
    const totalItems = Array.from(queue.values()).reduce((sum, o) => sum + o.items.length, 0);
    return { orderId, queuePosition: position, totalItemsInQueue: totalItems, enteredAt: order.enteredAt };
  },
});
