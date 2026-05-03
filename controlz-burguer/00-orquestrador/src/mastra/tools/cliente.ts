import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { clienteAgent } from "../../../../04-cliente/src/mastra/agents/cliente";

export const clienteTool = createTool({
  id: "cliente",
  description: "Gerencia clientes: cadastro, histórico e fidelidade",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await clienteAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
