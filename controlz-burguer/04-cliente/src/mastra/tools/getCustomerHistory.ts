import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCustomerById, getCustomerOrderIds } from "../store";

export const getCustomerHistoryTool = createTool({
  id: "getCustomerHistory",
  description: "Retorna o histórico de pedidos de um cliente",
  inputSchema: z.object({
    id: z.string().describe("ID do cliente"),
  }),
  outputSchema: z.object({
    customerId: z.string(),
    customerName: z.string().nullable(),
    orderIds: z.array(z.string()),
    totalOrders: z.number(),
  }),
  execute: async ({ id }) => {
    const [customer, orderIds] = await Promise.all([
      getCustomerById(id),
      getCustomerOrderIds(id),
    ]);
    return {
      customerId: id,
      customerName: customer?.name ?? null,
      orderIds,
      totalOrders: orderIds.length,
    };
  },
});
