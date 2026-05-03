import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { reviews, type Review } from "../store";
import { randomUUID } from "crypto";

export const submitReviewTool = createTool({
  id: "submitReview",
  description: "Registra uma avaliação de cliente para um pedido (nota de 1 a 10)",
  inputSchema: z.object({
    orderId: z.string().describe("ID do pedido avaliado"),
    customerId: z.string().describe("ID do cliente"),
    rating: z.number().int().min(1).max(10).describe("Nota de 1 a 10"),
    comment: z.string().describe("Comentário livre do cliente"),
  }),
  outputSchema: z.object({
    id: z.string(),
    orderId: z.string(),
    rating: z.number(),
    createdAt: z.string(),
  }),
  execute: async ({ orderId, customerId, rating, comment }) => {
    const review: Review = {
      id: randomUUID(),
      orderId,
      customerId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    reviews.push(review);
    return review;
  },
});
