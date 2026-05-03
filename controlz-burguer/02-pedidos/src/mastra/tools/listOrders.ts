import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { orders } from "../store";

export const listOrdersTool = createTool({
  id: "listOrders",
  description: "Lista pedidos, opcionalmente filtrando por status ou cliente",
  inputSchema: z.object({
    status: z.enum(["novo", "em_preparo", "pronto", "em_entrega", "entregue", "cancelado"]).optional(),
    customerId: z.string().optional(),
  }),
  outputSchema: z.object({
    orders: z.array(z.object({
      id: z.string(),
      customerId: z.string(),
      status: z.string(),
      total: z.number(),
      createdAt: z.string(),
    })),
    total: z.number(),
  }),
  execute: async ({ status, customerId }) => {
    let list = Array.from(orders.values());
    if (status) list = list.filter(o => o.status === status);
    if (customerId) list = list.filter(o => o.customerId === customerId);
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { orders: list, total: list.length };
  },
});
