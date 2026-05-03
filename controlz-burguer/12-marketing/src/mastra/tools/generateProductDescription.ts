import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { generatedContents, type GeneratedContent } from "../store";
import { randomUUID } from "crypto";

export const generateProductDescriptionTool = createTool({
  id: "generateProductDescription",
  description: "Gera descrição apetitosa de um produto para o cardápio",
  inputSchema: z.object({
    productName: z.string().describe("Nome do produto"),
    features: z.array(z.string()).describe("Ingredientes ou características ex: ['pão brioche','blend 180g','cheddar']"),
  }),
  outputSchema: z.object({
    id: z.string(),
    productName: z.string(),
    description: z.string(),
    createdAt: z.string(),
  }),
  execute: async ({ productName, features }) => {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Crie uma descrição apetitosa e curta (máximo 2 frases) para o produto da hamburgueria ControlZ Burger:
Produto: ${productName}
Ingredientes/características: ${features.join(", ")}
Tom: sensorial, que dá água na boca. Sem exageros.`,
    });
    const content: GeneratedContent = { id: randomUUID(), type: "product_description", prompt: productName, content: text.trim(), createdAt: new Date().toISOString() };
    generatedContents.push(content);
    return { id: content.id, productName: productName, description: text.trim(), createdAt: content.createdAt };
  },
});
