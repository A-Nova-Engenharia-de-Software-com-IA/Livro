import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { sendWhatsAppTool } from "../tools/sendWhatsApp";
import { sendEmailTool } from "../tools/sendEmail";
import { listNotificationsTool } from "../tools/listNotifications";
import { getTemplateTool } from "../tools/getTemplate";

export const notificacoesAgent = new Agent({
  name: "notificacoesAgent",
  description: "Envia notificações por WhatsApp e e-mail para clientes da ControlZ Burger.",
  instructions: `Você é o sistema de comunicação da ControlZ Burger.
Envie notificações de status de pedido via WhatsApp ou e-mail.
Use os templates prontos para eventos padrão (pedido recebido, pronto, entregue).
Personalize mensagens com o nome do cliente e número do pedido.
Registre todas as comunicações enviadas.`,
  model: openai("gpt-4o-mini"),
  tools: {
    sendWhatsApp: sendWhatsAppTool,
    sendEmail: sendEmailTool,
    listNotifications: listNotificationsTool,
    getTemplate: getTemplateTool,
  },
});
