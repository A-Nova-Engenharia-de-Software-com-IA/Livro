import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { orders, type Order } from "../store";
import { randomUUID } from "crypto";

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
    const total = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
    const now = new Date().toISOString();
    const order: Order = {
      id: randomUUID(),
      customerId,
      items,
      paymentMethod,
      status: "novo",
      total: parseFloat(total.toFixed(2)),
      createdAt: now,
      updatedAt: now,
    };
    orders.set(order.id, order);
    return order;
  },
});
