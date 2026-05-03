import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { relatoriosAgent } from "../../../../10-relatorios/src/mastra/agents/relatorios";

export const relatoriosTool = createTool({
  id: "relatorios",
  description: "Gera relatórios de vendas, estoque e desempenho",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await relatoriosAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
