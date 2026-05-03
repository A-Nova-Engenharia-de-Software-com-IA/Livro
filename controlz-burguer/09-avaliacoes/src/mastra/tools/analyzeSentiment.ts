import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const analyzeSentimentTool = createTool({
  id: "analyzeSentiment",
  description: "Analisa o sentimento de um comentário usando LLM",
  inputSchema: z.object({
    comment: z.string().describe("Comentário do cliente para análise"),
  }),
  outputSchema: z.object({
    sentiment: z.enum(["positivo", "neutro", "negativo"]),
    themes: z.array(z.string()).describe("Temas recorrentes identificados"),
    confidence: z.string().describe("Alta, média ou baixa"),
    summary: z.string(),
  }),
  execute: async ({ comment }) => {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Analise o sentimento do seguinte comentário de um cliente de hamburgueria e responda em JSON:
Comentário: "${comment}"

Responda SOMENTE com JSON no formato:
{"sentiment": "positivo|neutro|negativo", "themes": ["tema1","tema2"], "confidence": "alta|média|baixa", "summary": "resumo em uma frase"}`,
    });
    try {
      const parsed = JSON.parse(text.trim());
      return parsed;
    } catch {
      return { sentiment: "neutro" as const, themes: [], confidence: "baixa", summary: "Não foi possível analisar o comentário" };
    }
  },
});
