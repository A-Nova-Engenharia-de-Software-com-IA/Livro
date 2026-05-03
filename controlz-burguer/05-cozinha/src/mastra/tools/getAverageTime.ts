import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { completedOrders } from "../store";

export const getAverageTimeTool = createTool({
  id: "getAverageTime",
  description: "Calcula o tempo médio de preparo dos últimos pedidos concluídos",
  inputSchema: z.object({
    lastN: z.number().int().positive().default(10).describe("Quantos últimos pedidos considerar"),
  }),
  outputSchema: z.object({
    averageMinutes: z.number(),
    samplesUsed: z.number(),
    message: z.string(),
  }),
  execute: async ({ lastN }) => {
    const sample = completedOrders.slice(-lastN).filter(o => o.completedAt);
    if (sample.length === 0) return { averageMinutes: 0, samplesUsed: 0, message: "Sem dados suficientes ainda" };
    const totalMs = sample.reduce((sum, o) => sum + (new Date(o.completedAt!).getTime() - new Date(o.enteredAt).getTime()), 0);
    const avgMin = parseFloat((totalMs / sample.length / 60000).toFixed(1));
    return { averageMinutes: avgMin, samplesUsed: sample.length, message: `Média dos últimos ${sample.length} pedidos: ${avgMin} min` };
  },
});
