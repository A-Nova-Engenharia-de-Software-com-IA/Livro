import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { pagamentosAgent } from "../../../../07-pagamentos/src/mastra/agents/pagamentos";

export const pagamentosTool = createTool({
  id: "pagamentos",
  description: "Processa pagamentos: registra, consulta e gerencia transações",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await pagamentosAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
