import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { generateInstagramPostTool } from "../tools/generateInstagramPost";
import { generatePromoCopyTool } from "../tools/generatePromoCopy";
import { generateProductDescriptionTool } from "../tools/generateProductDescription";
import { generateWeeklyCampaignTool } from "../tools/generateWeeklyCampaign";

export const marketingAgent = new Agent({
  id: "marketing-agent",
  name: "marketingAgent",
  description: "Cria conteúdo de marketing para a ControlZ Burger usando IA.",
  instructions: `Você é o redator criativo da ControlZ Burger.
Crie conteúdo engajante para redes sociais, e-mails e campanhas.
Use um tom jovem, descontraído e apetitoso para falar de hambúrgueres.
Adapte o tom conforme solicitado: divertido, premium, urgente, etc.
Inclua hashtags relevantes e chamadas para ação (CTA) claras.`,
  model: openai("gpt-4o-mini"),
  tools: {
    generateInstagramPost: generateInstagramPostTool,
    generatePromoCopy: generatePromoCopyTool,
    generateProductDescription: generateProductDescriptionTool,
    generateWeeklyCampaign: generateWeeklyCampaignTool,
  },
});
