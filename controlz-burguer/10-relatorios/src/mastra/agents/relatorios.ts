import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { getTopProductsTool } from "../tools/getTopProducts";
import { getRevenueTool } from "../tools/getRevenue";
import { getPeakHoursTool } from "../tools/getPeakHours";
import { generateExecutiveSummaryTool } from "../tools/generateExecutiveSummary";

export const relatoriosAgent = new Agent({
  id: "relatorios-agent",
  name: "relatoriosAgent",
  description: "Gera relatórios e analytics de vendas da ControlZ Burger.",
  instructions: `Você é o analista de dados da ControlZ Burger.
Gere relatórios de vendas, produtos mais vendidos e horários de pico.
Apresente os dados de forma clara, com números formatados em R$.
Calcule variações percentuais quando relevante.
Gere resumos executivos concisos para a diretoria.`,
  model: openai("gpt-4o-mini"),
  tools: {
    getTopProducts: getTopProductsTool,
    getRevenue: getRevenueTool,
    getPeakHours: getPeakHoursTool,
    generateExecutiveSummary: generateExecutiveSummaryTool,
  },
});
