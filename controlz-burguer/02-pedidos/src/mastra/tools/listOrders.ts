import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getAllOrders } from "../store";

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
    const list = await getAllOrders({ status, customerId });
    return { orders: list, total: list.length };
  },
});
