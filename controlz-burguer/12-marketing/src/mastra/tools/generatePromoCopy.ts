import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { generatedContents, type GeneratedContent } from "../store";
import { randomUUID } from "crypto";

export const generatePromoCopyTool = createTool({
  id: "generatePromoCopy",
  description: "Gera texto promocional para uma oferta ou campanha",
  inputSchema: z.object({
    promoDetails: z.string().describe("Detalhes da promoção ex: '2 X-Burgers por R$39,90 no domingo'"),
    tone: z.string().optional().default("urgente").describe("Tom: urgente, amigável, premium"),
  }),
  outputSchema: z.object({
    id: z.string(),
    headline: z.string(),
    body: z.string(),
    cta: z.string(),
    createdAt: z.string(),
  }),
  execute: async ({ promoDetails, tone }) => {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Crie uma copy promocional para ControlZ Burger.
Promoção: ${promoDetails}
Tom: ${tone ?? "urgente"}

Responda em JSON: {"headline": "título chamativo", "body": "texto persuasivo 2-3 frases", "cta": "chamada para ação"}`,
    });
    try {
      const parsed = JSON.parse(text.trim());
      const content: GeneratedContent = { id: randomUUID(), type: "promo_copy", prompt: promoDetails, content: parsed.headline, createdAt: new Date().toISOString() };
      generatedContents.push(content);
      return { id: content.id, ...parsed, createdAt: content.createdAt };
    } catch {
      return { id: randomUUID(), headline: "", body: text, cta: "Peça agora!", createdAt: new Date().toISOString() };
    }
  },
});
