import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { mastra } from "../index";

export const callEmailAgentTool = createTool({
  id: "call-email-agent",
  description: "Delega uma tarefa para o agente especialista de Email (redigir/enviar).",
  inputSchema: z.object({
    prompt: z.string().min(1).describe("Pedido em linguagem natural para o agente de Email"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async ({ prompt }) => {
    const agent = mastra.getAgent("emailAgent"); // use o nome que aparece na lista do Mastra
    const res = await agent.generate(prompt);
    return { output: res.text };
  },
});