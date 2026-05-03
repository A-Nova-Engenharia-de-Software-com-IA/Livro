import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { drivers, deliveries, type Delivery } from "../store";

export const assignDriverTool = createTool({
  id: "assignDriver",
  description: "Atribui automaticamente um entregador disponível para um pedido",
  inputSchema: z.object({
    orderId: z.string().describe("ID do pedido"),
    address: z.string().describe("Endereço de entrega"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    driverId: z.string().nullable(),
    driverName: z.string().nullable(),
    estimatedMinutes: z.number(),
    message: z.string(),
  }),
  execute: async ({ orderId, address }) => {
    const available = Array.from(drivers.values()).find(d => d.available);
    if (!available) return { success: false, driverId: null, driverName: null, estimatedMinutes: 0, message: "Nenhum entregador disponível" };

    drivers.set(available.id, { ...available, available: false });

    // TODO: calcular rota real com API de mapas (Google Maps, OSRM, etc.)
    const estimatedMinutes = Math.floor(Math.random() * 20) + 15;

    const delivery: Delivery = {
      orderId,
      driverId: available.id,
      address,
      status: "em_rota",
      estimatedMinutes,
      assignedAt: new Date().toISOString(),
    };
    deliveries.set(orderId, delivery);
    return { success: true, driverId: available.id, driverName: available.name, estimatedMinutes, message: `${available.name} está a caminho! Previsão: ${estimatedMinutes} min` };
  },
});
