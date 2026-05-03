import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { promocoesAgent } from "../../../../08-promocoes/src/mastra/agents/promocoes";

export const promocoesTool = createTool({
  id: "promocoes",
  description: "Gerencia promoções e cupons de desconto",
  inputSchema: z.object({
    mensagem: z.string().describe("Pergunta ou instrução para o agente"),
  }),
  outputSchema: z.object({ resposta: z.string() }),
  execute: async ({ mensagem }) => {
    const result = await promocoesAgent.generate(mensagem);
    return { resposta: result.text };
  },
});
