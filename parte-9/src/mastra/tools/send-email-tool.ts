import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import nodemailer from "nodemailer";

const attachmentSchema = z.object({
  filename: z.string(),
  content: z.string().describe("Conteúdo em texto (ex: JSON string)"),
  contentType: z.string().optional().describe("ex: application/json"),
});

export const sendEmailTool = createTool({
  id: "send-email",
  description: "Envia um email via SMTP (suporta texto, HTML e anexos).",
  inputSchema: z.object({
    to: z
      .string()
      .describe('Destinatário(s). Pode ser "email@x.com" ou "a@x.com,b@y.com"'),
    subject: z.string().min(1).describe("Assunto do email"),
    text: z.string().optional().describe("Corpo em texto (opcional)"),
    html: z.string().optional().describe("Corpo em HTML (opcional)"),
    attachments: z.array(attachmentSchema).optional().describe("Anexos (opcional)"),
  }),
  outputSchema: z.object({
    output: z.string(),
    ok: z.boolean(),
    messageId: z.string().optional(),
  }),
  execute: async (input) => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user || "no-reply@empresa.com";

    if (!host || !user || !pass) {
      return {
        ok: false,
        output: "Faltam variáveis SMTP no .env. Configure SMTP_HOST, SMTP_USER e SMTP_PASS (e opcionalmente SMTP_PORT/SMTP_FROM).",
      };
    }

    if (!input.text && !input.html) {
      return {
        ok: false,
        output: "Você precisa fornecer pelo menos 'text' ou 'html' para o corpo do email.",
      };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 geralmente é TLS
      auth: { user, pass },
    });

    const mail = {
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    };

    try {
      const info = await transporter.sendMail(mail);

      return {
        ok: true,
        messageId: info.messageId,
        output: `Email enviado com sucesso para ${input.to} (messageId=${info.messageId}).`,
      };
    } catch (err: any) {
      return {
        ok: false,
        output: `Falha ao enviar email: ${err?.message || "unknown_error"}`,
      };
    }
  },
});