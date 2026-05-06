import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { insertOrder } from "../store";

export const createOrderTool = createTool({
  id: "createOrder",
  description: "Cria um novo pedido",
  inputSchema: z.object({
    customerId: z.string().describe("ID do cliente"),
    items: z.array(z.object({
      productId: z.string(),
      productName: z.string(),
      qty: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })).describe("Itens do pedido"),
    paymentMethod: z.enum(["pix", "credito", "debito", "dinheiro"]).describe("Forma de pagamento"),
  }),
  outputSchema: z.object({
    id: z.string(),
    customerId: z.string(),
    total: z.number(),
    status: z.string(),
    createdAt: z.string(),
  }),
  execute: async ({ customerId, items, paymentMethod }) => {
    return insertOrder({ customerId, items, paymentMethod });
  },
});
