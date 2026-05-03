import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { submitReviewTool } from "../tools/submitReview";
import { listReviewsTool } from "../tools/listReviews";
import { analyzeSentimentTool } from "../tools/analyzeSentiment";
import { getNPSTool } from "../tools/getNPS";

export const avaliacoesAgent = new Agent({
  name: "avaliacoesAgent",
  description: "Coleta avaliações, analisa sentimento e calcula NPS da ControlZ Burger.",
  instructions: `Você é o analista de satisfação da ControlZ Burger.
Registre avaliações dos clientes após cada pedido entregue.
Analise o sentimento dos comentários: positivo, neutro ou negativo.
Calcule o NPS (Net Promoter Score) e identifique tendências.
Apresente insights acionáveis para melhorar a experiência do cliente.`,
  model: openai("gpt-4o-mini"),
  tools: {
    submitReview: submitReviewTool,
    listReviews: listReviewsTool,
    analyzeSentiment: analyzeSentimentTool,
    getNPS: getNPSTool,
  },
});
