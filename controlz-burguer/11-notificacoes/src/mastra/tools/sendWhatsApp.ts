import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { notifications, type Notification } from "../store";
import { randomUUID } from "crypto";

export const sendWhatsAppTool = createTool({
  id: "sendWhatsApp",
  description: "Envia mensagem de WhatsApp para um número (mock: registra no log e salva no DB)",
  inputSchema: z.object({
    to: z.string().describe("Número com DDD ex: 11999990001"),
    message: z.string().describe("Texto da mensagem"),
  }),
  outputSchema: z.object({
    id: z.string(),
    to: z.string(),
    channel: z.string(),
    sentAt: z.string(),
    // TODO: integrar com WhatsApp Business API (Twilio, Z-API, Evolution API, etc.)
  }),
  execute: async ({ to, message }) => {
    // Mock: apenas loga e salva
    console.log(`[WHATSAPP] Para: ${to} | Msg: ${message}`);
    const notif: Notification = { id: randomUUID(), to: to, channel: "whatsapp", message: message, sentAt: new Date().toISOString() };
    notifications.push(notif);
    return notif;
  },
});
