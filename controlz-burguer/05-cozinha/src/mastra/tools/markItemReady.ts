import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { queue, completedOrders } from "../store";

export const markItemReadyTool = createTool({
  id: "markItemReady",
  description: "Marca um item como pronto. Quando todos os itens estiverem prontos, o pedido sai da fila.",
  inputSchema: z.object({
    orderId: z.string().describe("ID do pedido"),
    itemId: z.string().describe("ID do item, ou 'all' para marcar todos"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    orderId: z.string(),
    orderComplete: z.boolean(),
    readyItems: z.number(),
    totalItems: z.number(),
  }),
  execute: async ({ orderId, itemId }) => {
    const order = queue.get(orderId);
    if (!order) return { success: false, orderId, orderComplete: false, readyItems: 0, totalItems: 0 };

    order.items = order.items.map(item =>
      (itemId === "all" || item.itemId === itemId) ? { ...item, status: "pronto" as const } : item
    );
    queue.set(orderId, order);

    const readyItems = order.items.filter(i => i.status === "pronto").length;
    const orderComplete = readyItems === order.items.length;
    if (orderComplete) {
      completedOrders.push({ ...order, completedAt: new Date().toISOString() });
      queue.delete(orderId);
    }
    return { success: true, orderId, orderComplete, readyItems, totalItems: order.items.length };
  },
});
