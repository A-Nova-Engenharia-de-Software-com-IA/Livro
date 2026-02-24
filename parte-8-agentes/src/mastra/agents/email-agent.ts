import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { sendEmailTool } from "../tools/send-email-tool";

export const emailAgent = new Agent({
  id: "email-agent",
  name: "Email Assistant",
  description: "Assistente que redige e envia emails via SMTP usando a ferramenta send-email.",
  instructions: `
Você ajuda a redigir e enviar emails.

Regras:
- Antes de enviar, confirme com o usuário:
  1) destinatário (to)
  2) assunto (subject)
  3) conteúdo (resumo do que será enviado)
- Se o usuário não informar o destinatário ou assunto, pergunte.
- Se o usuário pedir anexo (ex.: JSON), gere o conteúdo como string e envie via attachments.
- Use a ferramenta send-email somente após a confirmação do usuário.
- Responda em português e de forma objetiva.

Exemplos:
- "Envie um email para financeiro@empresa.com com o assunto 'Relatório' e diga que o relatório está em anexo."
- "Mande um email para joao@empresa.com pedindo confirmação da reunião."
`,
  model: "openai/gpt-5.2",
  tools: { sendEmailTool },
  memory: new Memory({
    options: { lastMessages: 20 },
  }),
});