import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { mastra } from "../index";

export const callClickupAgentTool = createTool({
  id: "call-clickup-agent",
  description: "Delega uma tarefa para o agente especialista de ClickUp.",
  inputSchema: z.object({
    prompt: z.string().min(1).describe("Pedido em linguagem natural para o agente de ClickUp"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async ({ prompt }) => {
    const agent = mastra.getAgent("clickupAgent");
    const res = await agent.generate(prompt);
    return { output: res.text };
  },
});