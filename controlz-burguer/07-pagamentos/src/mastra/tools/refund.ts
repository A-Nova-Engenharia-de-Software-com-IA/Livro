import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { transactions } from "../store";
import { randomUUID } from "crypto";

export const refundTool = createTool({
  id: "refund",
  description: "Realiza estorno total ou parcial de uma transação aprovada",
  inputSchema: z.object({
    transactionId: z.string().describe("ID da transação original"),
    amount: z.number().positive().describe("Valor a estornar em reais"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    refundId: z.string().nullable(),
    originalTransactionId: z.string(),
    refundedAmount: z.number(),
    message: z.string(),
    // TODO: chamar API real do gateway para processar o estorno
  }),
  execute: async ({ transactionId, amount }) => {
    const tx = transactions.get(transactionId);
    if (!tx) return { success: false, refundId: null, originalTransactionId: transactionId, refundedAmount: 0, message: "Transação não encontrada" };
    if (tx.status !== "aprovado") return { success: false, refundId: null, originalTransactionId: transactionId, refundedAmount: 0, message: "Apenas transações aprovadas podem ser estornadas" };
    if (amount > tx.amount) return { success: false, refundId: null, originalTransactionId: transactionId, refundedAmount: 0, message: "Valor de estorno maior que o original" };
    transactions.set(transactionId, { ...tx, status: "estornado" });
    return { success: true, refundId: randomUUID(), originalTransactionId: transactionId, refundedAmount: amount, message: `Estorno de R$ ${amount.toFixed(2)} processado` };
  },
});
