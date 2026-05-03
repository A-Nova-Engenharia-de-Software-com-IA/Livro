import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { reviews } from "../store";

export const getNPSTool = createTool({
  id: "getNPS",
  description: "Calcula o Net Promoter Score (NPS) dos últimos N reviews. Promotores: 9-10, Detratores: 1-6.",
  inputSchema: z.object({
    lastN: z.number().int().positive().default(50).describe("Quantas últimas avaliações considerar"),
  }),
  outputSchema: z.object({
    nps: z.number().describe("NPS de -100 a 100"),
    promoters: z.number(),
    passives: z.number(),
    detractors: z.number(),
    totalSamples: z.number(),
    interpretation: z.string(),
  }),
  execute: async ({ lastN }) => {
    const sample = reviews.slice(-lastN);
    if (sample.length === 0) return { nps: 0, promoters: 0, passives: 0, detractors: 0, totalSamples: 0, interpretation: "Sem dados suficientes" };
    const promoters = sample.filter(r => r.rating >= 9).length;
    const passives = sample.filter(r => r.rating >= 7 && r.rating <= 8).length;
    const detractors = sample.filter(r => r.rating <= 6).length;
    const nps = Math.round(((promoters - detractors) / sample.length) * 100);
    const interpretation = nps >= 75 ? "Excelente" : nps >= 50 ? "Muito bom" : nps >= 0 ? "Bom" : "Precisa melhorar";
    return { nps, promoters, passives, detractors, totalSamples: sample.length, interpretation };
  },
});
