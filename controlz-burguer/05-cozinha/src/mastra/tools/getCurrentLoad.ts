import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { queue } from "../store";

export const getCurrentLoadTool = createTool({
  id: "getCurrentLoad",
  description: "Retorna a carga atual da cozinha",
  inputSchema: z.object({}),
  outputSchema: z.object({
    activeOrders: z.number(),
    totalItems: z.number(),
    pendingItems: z.number(),
    readyItems: z.number(),
    loadLevel: z.enum(["livre", "moderado", "ocupado", "sobrecarregado"]),
  }),
  execute: async () => {
    const orders = Array.from(queue.values());
    const allItems = orders.flatMap(o => o.items);
    const activeOrders = orders.length;
    const pendingItems = allItems.filter(i => i.status !== "pronto").length;
    const readyItems = allItems.filter(i => i.status === "pronto").length;
    const loadLevel =
      activeOrders === 0 ? "livre" :
      activeOrders <= 3 ? "moderado" :
      activeOrders <= 7 ? "ocupado" : "sobrecarregado";
    return { activeOrders, totalItems: allItems.length, pendingItems, readyItems, loadLevel };
  },
});
