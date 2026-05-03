import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { registerDriverTool } from "../tools/registerDriver";
import { listDriversTool } from "../tools/listDrivers";
import { assignDriverTool } from "../tools/assignDriver";
import { calculateRouteTool } from "../tools/calculateRoute";
import { updateDeliveryStatusTool } from "../tools/updateDeliveryStatus";

export const entregadorAgent = new Agent({
  name: "entregadorAgent",
  description: "Gerencia entregadores e rotas de entrega da ControlZ Burger.",
  instructions: `Você é o dispatcher de entregas da ControlZ Burger.
Atribua entregadores disponíveis para pedidos prontos de forma rápida.
Calcule rotas e estime o tempo de entrega para o cliente.
Monitore o status das entregas em andamento.
Em caso de problema na entrega, comunique imediatamente ao atendimento.`,
  model: openai("gpt-4o-mini"),
  tools: {
    registerDriver: registerDriverTool,
    listDrivers: listDriversTool,
    assignDriver: assignDriverTool,
    calculateRoute: calculateRouteTool,
    updateDeliveryStatus: updateDeliveryStatusTool,
  },
});
