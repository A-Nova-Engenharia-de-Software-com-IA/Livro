import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { cardapioAgent } from "../../../../01-cardapio/src/mastra/agents/cardapio";

export const cardapioTool = createTool({
  id: "cardapio",
  description: "Gerencia o cardápio: cria, lista, atualiza e remove produtos",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await cardapioAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
