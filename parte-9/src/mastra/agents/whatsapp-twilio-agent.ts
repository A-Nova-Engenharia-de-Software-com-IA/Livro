import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { sendWhatsAppTextTool } from "../tools/whatsapp-send-text";

export const whatsappAgent = new Agent({
  id: "whatsapp-agent",
  name: "WhatsApp Assistant",
  description: "Agente que envia mensagens via WhatsApp usando Twilio.",
  instructions: `
Você envia mensagens via WhatsApp (Twilio).

Regras:
- Para enviar mensagem use a ferramenta send-whatsapp-text.
- O número deve estar no formato whatsapp:+55...
- Se faltar telefone ou texto, pergunte antes.
- Confirme que o usuário já respondeu (janela de 24h) ou avise que pode falhar fora da janela.
`,
  model: "openai/gpt-5.2",
  tools: {
    sendWhatsAppText: sendWhatsAppTextTool,
  },
  memory: new Memory({ options: { lastMessages: 20 } }),
});