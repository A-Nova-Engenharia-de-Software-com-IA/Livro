import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { drivers } from "../store";

export const listDriversTool = createTool({
  id: "listDrivers",
  description: "Lista entregadores, opcionalmente apenas os disponíveis",
  inputSchema: z.object({
    available: z.boolean().optional().describe("Se true, retorna apenas entregadores disponíveis"),
  }),
  outputSchema: z.object({
    drivers: z.array(z.object({
      id: z.string(),
      name: z.string(),
      vehicle: z.string(),
      available: z.boolean(),
    })),
    total: z.number(),
    availableCount: z.number(),
  }),
  execute: async ({ available }) => {
    let list = Array.from(drivers.values());
    if (available !== undefined) list = list.filter(d => d.available === available);
    const availableCount = Array.from(drivers.values()).filter(d => d.available).length;
    return { drivers: list, total: list.length, availableCount };
  },
});
