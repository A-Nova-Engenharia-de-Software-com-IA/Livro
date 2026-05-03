import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { pedidosAgent } from "../../../../02-pedidos/src/mastra/agents/pedidos";

export const pedidosTool = createTool({
  id: "pedidos",
  description: "Gerencia pedidos: criação, acompanhamento e status",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await pedidosAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
