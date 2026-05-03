import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { addStockTool } from "../tools/addStock";
import { decreaseStockTool } from "../tools/decreaseStock";
import { getStockTool } from "../tools/getStock";
import { listStockTool } from "../tools/listStock";
import { setMinThresholdTool } from "../tools/setMinThreshold";
export const estoqueAgent = new Agent({
  id: "estoque-agent",
  name: "estoqueAgent",
  description: "Controla o estoque de insumos da ControlZ Burger: entradas, saídas e alertas de estoque baixo.",
  instructions: `Você é o controlador de estoque da ControlZ Burger.
Monitore os insumos: carne, pão, queijo, batata, bebidas e embalagens.
Alerte quando algum item estiver abaixo do estoque mínimo.
Registre entradas (compras) e saídas (uso na produção) com precisão.
Sugira reposição quando o estoque estiver crítico.`,
  model: openai("gpt-4o-mini"),
  tools: {
    addStock: addStockTool,
    decreaseStock: decreaseStockTool,
    getStock: getStockTool,
    listStock: listStockTool,
    setMinThreshold: setMinThresholdTool,
  },
});
