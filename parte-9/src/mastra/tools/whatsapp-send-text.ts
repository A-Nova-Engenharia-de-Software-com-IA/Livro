import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import twilio from "twilio";

export const sendWhatsAppTextTool = createTool({
  id: "send-whatsapp-text",
  description: "Envia mensagem WhatsApp em texto livre (dentro da janela de 24h após resposta do usuário).",
  inputSchema: z.object({
    to: z.string().describe("Destino no formato whatsapp:+5511999999999"),
    body: z.string().min(1).describe("Texto da mensagem"),
  }),
  outputSchema: z.object({
    output: z.string(),
    sid: z.string().optional(),
    ok: z.boolean(),
  }),
  execute: async ({ to, body }) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const from = process.env.TWILIO_WHATSAPP_FROM!;

    if (!accountSid || !authToken || !from) {
      return { ok: false, output: "Faltam variáveis de ambiente da Twilio." };
    }

    const client = twilio(accountSid, authToken);

    try {
      const msg = await client.messages.create({
        from,
        to,
        body,
      });

      return {
        ok: true,
        sid: msg.sid,
        output: `Mensagem enviada com sucesso para ${to} (sid=${msg.sid})`,
      };
    } catch (err: any) {
      return {
        ok: false,
        output: `Erro ao enviar mensagem: ${err?.message || "unknown_error"}`,
      };
    }
  },
});