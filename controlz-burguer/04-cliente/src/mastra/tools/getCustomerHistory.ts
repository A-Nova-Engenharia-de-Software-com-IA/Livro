import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { customers, orderHistory } from "../store";

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
    // TODO: integrar com o serviço 02-pedidos para buscar dados reais dos pedidos
  }),
  execute: async ({ id }) => {
    const customer = customers.get(id);
    const orderIds = orderHistory.get(id) ?? [];
    return {
      customerId: id,
      customerName: customer?.name ?? null,
      orderIds,
      totalOrders: orderIds.length,
    };
  },
});
