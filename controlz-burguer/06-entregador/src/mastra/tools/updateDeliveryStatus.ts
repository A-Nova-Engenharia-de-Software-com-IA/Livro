import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { deliveries, drivers } from "../store";

export const updateDeliveryStatusTool = createTool({
  id: "updateDeliveryStatus",
  description: "Atualiza o status de uma entrega e libera o entregador quando concluída",
  inputSchema: z.object({
    orderId: z.string().describe("ID do pedido"),
    status: z.enum(["aguardando", "em_rota", "entregue"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    orderId: z.string(),
    status: z.string(),
    driverFreed: z.boolean(),
  }),
  execute: async ({ orderId, status }) => {
    const delivery = deliveries.get(orderId);
    if (!delivery) return { success: false, orderId, status, driverFreed: false };
    deliveries.set(orderId, { ...delivery, status });
    let driverFreed = false;
    if (status === "entregue") {
      const driver = drivers.get(delivery.driverId);
      if (driver) { drivers.set(delivery.driverId, { ...driver, available: true }); driverFreed = true; }
    }
    return { success: true, orderId, status, driverFreed };
  },
});
