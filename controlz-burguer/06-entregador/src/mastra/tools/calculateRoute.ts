import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const calculateRouteTool = createTool({
  id: "calculateRoute",
  description: "Calcula distância e tempo estimado entre dois endereços",
  inputSchema: z.object({
    fromAddress: z.string().describe("Endereço de origem (restaurante)"),
    toAddress: z.string().describe("Endereço de destino (cliente)"),
  }),
  outputSchema: z.object({
    fromAddress: z.string(),
    toAddress: z.string(),
    distanceKm: z.number(),
    estimatedMinutes: z.number(),
    // TODO: integrar com Google Maps Directions API para dados reais
  }),
  execute: async ({ fromAddress, toAddress }) => {
    const distanceKm = parseFloat((Math.random() * 9 + 1).toFixed(1));
    const estimatedMinutes = Math.round(distanceKm * 3 + 5);
    return { fromAddress, toAddress, distanceKm, estimatedMinutes };
  },
});
