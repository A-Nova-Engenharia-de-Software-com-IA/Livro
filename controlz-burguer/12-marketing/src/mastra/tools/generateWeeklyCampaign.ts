import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { generatedContents, type GeneratedContent } from "../store";
import { randomUUID } from "crypto";

export const generateWeeklyCampaignTool = createTool({
  id: "generateWeeklyCampaign",
  description: "Gera uma campanha semanal com 7 posts (um por dia) em torno de um tema",
  inputSchema: z.object({
    theme: z.string().describe("Tema da semana ex: 'volta às aulas', 'fim de semana', 'lançamento X-Duplo'"),
  }),
  outputSchema: z.object({
    id: z.string(),
    theme: z.string(),
    posts: z.array(z.object({
      day: z.string(),
      caption: z.string(),
    })),
    createdAt: z.string(),
  }),
  execute: async ({ theme }) => {
    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Crie uma campanha semanal de redes sociais para a hamburgueria ControlZ Burger com tema: "${theme}"
Gere 7 posts, um para cada dia da semana (${days.join(", ")}).
Responda em JSON: {"posts": [{"day": "Segunda", "caption": "texto com emojis"}, ...]}
Cada post deve ser diferente, criativo e relacionado ao tema.`,
    });
    try {
      const parsed = JSON.parse(text.trim());
      const content: GeneratedContent = { id: randomUUID(), type: "weekly_campaign", prompt: theme, content: JSON.stringify(parsed.posts), createdAt: new Date().toISOString() };
      generatedContents.push(content);
      return { id: content.id, theme: theme, posts: parsed.posts, createdAt: content.createdAt };
    } catch {
      return { id: randomUUID(), theme: theme, posts: days.map(day => ({ day, caption: text })), createdAt: new Date().toISOString() };
    }
  },
});
