import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { notifications, type Notification } from "../store";
import { randomUUID } from "crypto";

export const sendEmailTool = createTool({
  id: "sendEmail",
  description: "Envia e-mail para um destinatário (mock: registra no log e salva no DB)",
  inputSchema: z.object({
    to: z.string().email().describe("E-mail do destinatário"),
    subject: z.string().describe("Assunto do e-mail"),
    body: z.string().describe("Corpo do e-mail"),
  }),
  outputSchema: z.object({
    id: z.string(),
    to: z.string(),
    subject: z.string(),
    channel: z.string(),
    sentAt: z.string(),
    // TODO: integrar com provedor de e-mail (SendGrid, AWS SES, Resend, etc.)
  }),
  execute: async ({ to, subject, body }) => {
    // Mock: apenas loga e salva
    console.log(`[EMAIL] Para: ${to} | Assunto: ${subject}`);
    const notif: Notification = { id: randomUUID(), to: to, channel: "email", subject: subject, message: body, sentAt: new Date().toISOString() };
    notifications.push(notif);
    return { ...notif, subject: subject };
  },
});
