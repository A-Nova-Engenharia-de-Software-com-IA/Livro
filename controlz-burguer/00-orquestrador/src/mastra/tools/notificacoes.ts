import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { notificacoesAgent } from "../../../../11-notificacoes/src/mastra/agents/notificacoes";

export const notificacoesTool = createTool({
  id: "notificacoes",
  description: "Envia notificações para clientes e equipe",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await notificacoesAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
