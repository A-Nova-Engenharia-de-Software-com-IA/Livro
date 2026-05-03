import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { transactions, type Transaction } from "../store";
import { randomUUID } from "crypto";

export const chargeCardTool = createTool({
  id: "chargeCard",
  description: "Processa pagamento via cartão (90% aprovação mock)",
  inputSchema: z.object({
    orderId: z.string().describe("ID do pedido"),
    amount: z.number().positive().describe("Valor em reais"),
    cardLast4: z.string().length(4).describe("Últimos 4 dígitos do cartão"),
    type: z.enum(["credito", "debito"]).default("credito"),
  }),
  outputSchema: z.object({
    transactionId: z.string(),
    orderId: z.string(),
    amount: z.number(),
    status: z.enum(["aprovado", "recusado"]),
    cardLast4: z.string(),
    message: z.string(),
    // TODO: integrar com gateway real (Stripe, Cielo, Stone, etc.)
  }),
  execute: async ({ orderId, amount, cardLast4, type }) => {
    const txId = randomUUID();
    const approved = Math.random() > 0.1;
    const status: "aprovado" | "recusado" = approved ? "aprovado" : "recusado";
    const tx: Transaction = {
      id: txId, orderId, amount, method: type, status,
      details: { cardLast4 },
      createdAt: new Date().toISOString(),
    };
    transactions.set(txId, tx);
    return { transactionId: txId, orderId, amount, status, cardLast4, message: approved ? "Pagamento aprovado!" : "Cartão recusado. Tente outro cartão ou use Pix." };
  },
});
