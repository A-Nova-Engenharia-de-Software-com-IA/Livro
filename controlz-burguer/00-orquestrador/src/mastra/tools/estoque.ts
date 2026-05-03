import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { estoqueAgent } from "../../../../03-estoque/src/mastra/agents/estoque";

export const estoqueTool = createTool({
  id: "estoque",
  description: "Controla estoque: entradas, saídas e alertas de estoque baixo",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await estoqueAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
