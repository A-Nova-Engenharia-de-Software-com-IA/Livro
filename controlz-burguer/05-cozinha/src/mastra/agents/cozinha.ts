import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { addToQueueTool } from "../tools/addToQueue";
import { getQueueTool } from "../tools/getQueue";
import { markItemReadyTool } from "../tools/markItemReady";
import { getAverageTimeTool } from "../tools/getAverageTime";
import { getCurrentLoadTool } from "../tools/getCurrentLoad";

export const cozinhaAgent = new Agent({
  name: "cozinhaAgent",
  description: "Gerencia a fila de produção da cozinha da ControlZ Burger.",
  instructions: `Você é o gerente de cozinha da ControlZ Burger.
Organize a fila de pedidos de forma eficiente para minimizar o tempo de espera.
Marque itens como prontos assim que forem preparados.
Monitore a carga atual da cozinha e avise quando estiver sobrecarregada.
Priorize pedidos mais antigos quando houver muitos na fila.`,
  model: openai("gpt-4o-mini"),
  tools: {
    addToQueue: addToQueueTool,
    getQueue: getQueueTool,
    markItemReady: markItemReadyTool,
    getAverageTime: getAverageTimeTool,
    getCurrentLoad: getCurrentLoadTool,
  },
});
