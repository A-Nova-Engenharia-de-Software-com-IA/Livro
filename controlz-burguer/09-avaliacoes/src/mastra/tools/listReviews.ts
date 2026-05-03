import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { reviews } from "../store";

export const listReviewsTool = createTool({
  id: "listReviews",
  description: "Lista avaliações, opcionalmente filtrando por nota ou pedido",
  inputSchema: z.object({
    minRating: z.number().int().min(1).max(10).optional().describe("Nota mínima"),
    orderId: z.string().optional().describe("Filtrar por pedido"),
  }),
  outputSchema: z.object({
    reviews: z.array(z.object({
      id: z.string(),
      orderId: z.string(),
      customerId: z.string(),
      rating: z.number(),
      comment: z.string(),
      sentiment: z.string().optional(),
      createdAt: z.string(),
    })),
    total: z.number(),
    averageRating: z.number(),
  }),
  execute: async ({ minRating, orderId }) => {
    let list = [...reviews];
    if (minRating) list = list.filter(r => r.rating >= minRating);
    if (orderId) list = list.filter(r => r.orderId === orderId);
    const avg = list.length ? parseFloat((list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1)) : 0;
    return { reviews: list, total: list.length, averageRating: avg };
  },
});
