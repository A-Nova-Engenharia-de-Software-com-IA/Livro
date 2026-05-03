import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { avaliacoesAgent } from "../../../../09-avaliacoes/src/mastra/agents/avaliacoes";

export const avaliacoesTool = createTool({
  id: "avaliacoes",
  description: "Gerencia avaliações de clientes e analisa sentimento",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await avaliacoesAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
