import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { notifications } from "../store";

export const listNotificationsTool = createTool({
  id: "listNotifications",
  description: "Lista notificações enviadas, opcionalmente filtrando por destinatário ou canal",
  inputSchema: z.object({
    to: z.string().optional().describe("Filtrar por destinatário"),
    channel: z.enum(["whatsapp", "email"]).optional().describe("Filtrar por canal"),
  }),
  outputSchema: z.object({
    notifications: z.array(z.object({
      id: z.string(),
      to: z.string(),
      channel: z.string(),
      subject: z.string().optional(),
      message: z.string(),
      sentAt: z.string(),
    })),
    total: z.number(),
  }),
  execute: async ({ to, channel }) => {
    let list = [...notifications];
    if (to) list = list.filter(n => n.to === to);
    if (channel) list = list.filter(n => n.channel === channel);
    return { notifications: list, total: list.length };
  },
});
