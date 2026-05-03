import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { entregadorAgent } from "../../../../06-entregador/src/mastra/agents/entregador";

export const entregadorTool = createTool({
  id: "entregador",
  description: "Gerencia entregas: atribuição de entregadores e rastreamento",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await entregadorAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
