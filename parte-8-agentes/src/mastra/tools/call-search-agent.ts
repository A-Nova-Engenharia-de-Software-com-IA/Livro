import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { mastra } from "../index";

export const callSearchAgentTool = createTool({
  id: "call-search-agent",
  description: "Delega uma tarefa para o agente de pesquisa na web.",
  inputSchema: z.object({
    prompt: z.string().min(1).describe("Pergunta ou tema para pesquisar na web"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async ({ prompt }) => {
    const agent = mastra.getAgent("searchAgent"); // use o nome que aparece na lista do Mastra
    const res = await agent.generate(prompt);
    return { output: res.text };
  },
});