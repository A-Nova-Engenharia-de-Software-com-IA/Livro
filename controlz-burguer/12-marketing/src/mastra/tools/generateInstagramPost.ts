import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { generatedContents, type GeneratedContent } from "../store";
import { randomUUID } from "crypto";

export const generateInstagramPostTool = createTool({
  id: "generateInstagramPost",
  description: "Gera um post para Instagram promovendo um produto da ControlZ Burger",
  inputSchema: z.object({
    product: z.string().describe("Nome do produto a promover"),
    tone: z.string().optional().default("divertido").describe("Tom: divertido, premium, urgente, nostálgico"),
    hashtags: z.array(z.string()).optional().describe("Hashtags extras a incluir"),
  }),
  outputSchema: z.object({
    id: z.string(),
    caption: z.string(),
    hashtags: z.array(z.string()),
    createdAt: z.string(),
  }),
  execute: async ({ product, tone, hashtags }) => {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Crie um post para Instagram para a hamburgueria ControlZ Burger promovendo: ${product}
Tom: ${tone ?? "divertido"}
Hashtags extras: ${(hashtags ?? []).join(", ") || "nenhuma"}

Responda em JSON: {"caption": "texto do post com emojis", "hashtags": ["hashtag1","hashtag2",...]}
Use até 5 hashtags relevantes. Seja criativo e apetitoso!`,
    });
    try {
      const parsed = JSON.parse(text.trim());
      const content: GeneratedContent = { id: randomUUID(), type: "instagram_post", prompt: product, content: parsed.caption, createdAt: new Date().toISOString() };
      generatedContents.push(content);
      return { id: content.id, caption: parsed.caption, hashtags: parsed.hashtags ?? [], createdAt: content.createdAt };
    } catch {
      return { id: randomUUID(), caption: text, hashtags: hashtags ?? [], createdAt: new Date().toISOString() };
    }
  },
});
