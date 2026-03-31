import { Agent } from '@mastra/core/agent'
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { whatsappClient } from '../whatsapp/client'
import { Memory } from '@mastra/memory'

const sendMessageTool = createTool({
  id: 'whatsapp-send-message',
  description: 'Envia uma mensagem de texto via WhatsApp para um número ou grupo.',
  inputSchema: z.object({
    to: z.string().describe(
      'Número de destino no formato internacional sem + (ex: 554899999999) ou ID de grupo (ex: 123456789@g.us). O sufixo @c.us será adicionado automaticamente para números.'
    ),
    message: z.string().describe('Texto da mensagem a ser enviada.'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    messageId: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ to, message }) => {
    try {
      const chatId = to.includes('@') ? to : `${to}@c.us`
      const msg = await whatsappClient.sendMessage(chatId, message)
      return { success: true, messageId: msg.id.id }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },
})

const getChatsListTool = createTool({
  id: 'whatsapp-list-chats',
  description: 'Lista as conversas recentes do WhatsApp com nome e último ID.',
  inputSchema: z.object({
    limit: z.number().optional().default(20).describe('Número máximo de chats a retornar.'),
  }),
  outputSchema: z.object({
    chats: z.array(z.object({
      id: z.string(),
      name: z.string(),
      isGroup: z.boolean(),
      unreadCount: z.number(),
    })),
  }),
  execute: async ({ limit }) => {
    const chats = await whatsappClient.getChats()
    return {
      chats: chats.slice(0, limit).map(c => ({
        id: c.id._serialized,
        name: c.name,
        isGroup: c.isGroup,
        unreadCount: c.unreadCount,
      })),
    }
  },
})

export const whatsappAgent = new Agent({
  id: 'whatsapp-agent',
  name: 'WhatsApp Agent',
  description: 'Agente capaz de enviar mensagens e consultar conversas do WhatsApp.',
  instructions: `
    Você é um agente com acesso ao WhatsApp via WhatsApp Web.

    Suas capacidades:
    - Enviar mensagens de texto para contatos e grupos
    - Listar conversas recentes

    Como você deve agir:
    1. Ao receber um pedido de envio, identifique o número/grupo de destino e o texto da mensagem
    2. Números devem estar no formato internacional sem + (ex: 554899999999)
    3. Para grupos, use o ID completo com sufixo @g.us
    4. Confirme o envio informando se foi bem-sucedido ou reportando o erro
    5. Nunca envie mensagens sem ter clareza sobre o destinatário e o conteúdo

    Importante: o WhatsApp precisa estar autenticado (QR Code escaneado) para que as ferramentas funcionem.`,
  model: 'openai/gpt-5.4',
  tools: { sendMessageTool, getChatsListTool },
  memory: new Memory(),
})
