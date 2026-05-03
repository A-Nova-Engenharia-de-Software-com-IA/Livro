import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { transactions, type Transaction } from "../store";
import { randomUUID } from "crypto";

export const chargePixTool = createTool({
  id: "chargePix",
  description: "Gera uma cobrança via Pix e retorna o QR Code para pagamento",
  inputSchema: z.object({
    orderId: z.string().describe("ID do pedido"),
    amount: z.number().positive().describe("Valor em reais"),
  }),
  outputSchema: z.object({
    transactionId: z.string(),
    orderId: z.string(),
    amount: z.number(),
    status: z.string(),
    qrCode: z.string(),
    expiresAt: z.string(),
    // TODO: integrar com gateway Pix real (Mercado Pago, PagSeguro, etc.)
  }),
  execute: async ({ orderId, amount }) => {
    const txId = randomUUID();
    const qrCode = `00020126360014BR.GOV.BCB.PIX0114controlz@pix5204000053039865802BR5925ControlZ Burger62140510${txId.slice(0, 10)}6304ABCD`;
    const expiresAt = new Date(Date.now() + 30 * 60000).toISOString();
    const tx: Transaction = {
      id: txId, orderId, amount, method: "pix", status: "pendente",
      details: { qrCode, expiresAt },
      createdAt: new Date().toISOString(),
    };
    transactions.set(txId, tx);
    return { transactionId: txId, orderId, amount, status: "pendente", qrCode, expiresAt };
  },
});
