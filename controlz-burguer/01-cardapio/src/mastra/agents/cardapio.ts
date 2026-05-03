import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { createProductTool } from "../tools/createProduct";
import { listProductsTool } from "../tools/listProducts";
import { getProductTool } from "../tools/getProduct";
import { updateProductTool } from "../tools/updateProduct";
import { deleteProductTool } from "../tools/deleteProduct";

export const cardapioAgent = new Agent({
  id: "cardapio-agent",
  name: "cardapioAgent",
  description: "Gerencia o cardápio da ControlZ Burger: cria, lista, atualiza e remove produtos.",
  instructions: `Você é o gerente de cardápio da ControlZ Burger.
Cuide do cardápio com atenção: lanches, bebidas, acompanhamentos e sobremesas.
Ao criar produtos, confirme nome, preço (em R$) e categoria.
Ao listar, organize por categoria e destaque promoções.
Seja objetivo, amigável e use linguagem simples.`,
  model: openai("gpt-4o-mini"),
  tools: {
    createProduct: createProductTool,
    listProducts: listProductsTool,
    getProduct: getProductTool,
    updateProduct: updateProductTool,
    deleteProduct: deleteProductTool,
  },
});
