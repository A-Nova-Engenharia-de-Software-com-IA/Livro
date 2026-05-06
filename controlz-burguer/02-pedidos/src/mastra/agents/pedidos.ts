import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { LibSQLStore } from "@mastra/libsql";
import { createOrderTool } from "../tools/createOrder";
import { listOrdersTool } from "../tools/listOrders";
import { getOrderTool } from "../tools/getOrder";
import { updateOrderStatusTool } from "../tools/updateOrderStatus";
import { Memory } from "@mastra/memory";
import { DB_URL } from "../store";

export const pedidosAgent = new Agent({
  id: "pedidos-agent",
  name: "pedidosAgent",
  description: "Gerencia pedidos da ControlZ Burger: criação, acompanhamento e atualização de status.",
  instructions: `Você é o responsável pelos pedidos da ControlZ Burger.
Registre novos pedidos com os itens, cliente e forma de pagamento.
Atualize o status conforme o pedido avança: novo → em_preparo → pronto → em_entrega → entregue.
Informe o cliente sobre o andamento com clareza.
Em caso de cancelamento, confirme antes de alterar o status.`,
  model: openai("gpt-4o-mini"),
  tools: {
    createOrder: createOrderTool,
    listOrders: listOrdersTool,
    getOrder: getOrderTool,
    updateOrderStatus: updateOrderStatusTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({ id: "libsql", url: DB_URL }),
  }),
});
