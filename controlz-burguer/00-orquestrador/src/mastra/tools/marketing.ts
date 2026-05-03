import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { marketingAgent } from "../../../../12-marketing/src/mastra/agents/marketing";

export const marketingTool = createTool({
  id: "marketing",
  description: "Cria campanhas de marketing e conteúdo para redes sociais",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await marketingAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
