import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { cozinhaAgent } from "../../../../05-cozinha/src/mastra/agents/cozinha";

export const cozinhaTool = createTool({
  id: "cozinha",
  description: "Gerencia a cozinha: filas de preparo e status dos pedidos",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await cozinhaAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
