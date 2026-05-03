import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { products, type Product } from "../store";
import { randomUUID } from "crypto";

export const createProductTool = createTool({
  id: "createProduct",
  description: "Cria um novo produto no cardápio",
  inputSchema: z.object({
    name: z.string().describe("Nome do produto"),
    price: z.number().positive().describe("Preço em reais"),
    category: z.string().describe("Categoria: lanche, bebida, acompanhamento, sobremesa"),
    variations: z.array(z.string()).optional().describe("Variações disponíveis ex: ['simples','duplo']"),
  }),
  outputSchema: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    category: z.string(),
    createdAt: z.string(),
  }),
  execute: async ({ name, price, category, variations }) => {
    const product: Product = {
      id: randomUUID(),
      name,
      price,
      category,
      variations,
      active: true,
      createdAt: new Date().toISOString(),
    };
    products.set(product.id, product);
    return product;
  },
});
