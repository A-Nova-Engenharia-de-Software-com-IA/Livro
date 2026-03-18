import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { mastra } from "../index";

export const callWhatsAppAgentTool = createTool({
  id: "call-whatsapp-agent",
  description: "Delega para o WhatsApp Agent enviar mensagens via Twilio.",
  inputSchema: z.object({
    prompt: z.string().describe("Instrução para o agente de WhatsApp"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async ({ prompt }) => {
    // ✅ aqui você pega o agente pelo ID cadastrado no mastra index
    const agent = mastra.getAgent("whatsappAgent");

    // ✅ padrão: usar generate/run do Agent (varia por versão)
    // Se sua versão usa .generate:
    const result = await agent.generate(prompt);

    // Se sua versão usa .run:
    // const result = await agent.run(prompt);

    return {
      output: (result as any)?.text || (result as any)?.outputText || JSON.stringify(result, null, 2),
    };
  },
});