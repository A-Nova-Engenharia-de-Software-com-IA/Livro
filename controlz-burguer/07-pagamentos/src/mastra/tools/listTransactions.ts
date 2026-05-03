import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { transactions } from "../store";

export const listTransactionsTool = createTool({
  id: "listTransactions",
  description: "Lista transações, opcionalmente filtrando por pedido ou status",
  inputSchema: z.object({
    orderId: z.string().optional(),
    status: z.enum(["pendente", "aprovado", "recusado", "estornado"]).optional(),
  }),
  outputSchema: z.object({
    transactions: z.array(z.object({
      id: z.string(),
      orderId: z.string(),
      amount: z.number(),
      method: z.string(),
      status: z.string(),
      createdAt: z.string(),
    })),
    total: z.number(),
    totalApproved: z.number(),
  }),
  execute: async ({ orderId, status }) => {
    let list = Array.from(transactions.values());
    if (orderId) list = list.filter(t => t.orderId === orderId);
    if (status) list = list.filter(t => t.status === status);
    const totalApproved = parseFloat(list.filter(t => t.status === "aprovado").reduce((s, t) => s + t.amount, 0).toFixed(2));
    return { transactions: list, total: list.length, totalApproved };
  },
});
