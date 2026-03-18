import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { mastra } from "../index";

export const callSlackAgentTool = createTool({
  id: "call-slack-agent",
  description: "Delega uma tarefa para o agente especialista de Slack.",
  inputSchema: z.object({
    prompt: z.string().min(1).describe("Pedido em linguagem natural para o agente de Slack"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async ({ prompt }) => {
    const agent = mastra.getAgent("slackAgent");
    const res = await agent.generate(prompt);
    return { output: res.text };
  },
});