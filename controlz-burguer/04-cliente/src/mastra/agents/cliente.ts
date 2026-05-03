import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { createCustomerTool } from "../tools/createCustomer";
import { getCustomerTool } from "../tools/getCustomer";
import { listCustomersTool } from "../tools/listCustomers";
import { updatePreferencesTool } from "../tools/updatePreferences";
import { getCustomerHistoryTool } from "../tools/getCustomerHistory";
export const clienteAgent = new Agent({
  id: "cliente-agent",
  name: "clienteAgent",
  description: "Gerencia cadastro e fidelidade dos clientes da ControlZ Burger.",
  instructions: `Você é o CRM da ControlZ Burger.
Cadastre clientes com nome, telefone e preferências alimentares.
Consulte histórico de pedidos para personalizar o atendimento.
Identifique clientes frequentes e sugira promoções personalizadas.
Trate cada cliente pelo nome e seja sempre cordial.`,
  model: openai("gpt-4o-mini"),
  tools: {
    createCustomer: createCustomerTool,
    getCustomer: getCustomerTool,
    listCustomers: listCustomersTool,
    updatePreferences: updatePreferencesTool,
    getCustomerHistory: getCustomerHistoryTool,
  },
});
