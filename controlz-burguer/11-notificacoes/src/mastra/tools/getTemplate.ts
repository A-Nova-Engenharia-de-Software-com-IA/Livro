import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { templates } from "../store";

export const getTemplateTool = createTool({
  id: "getTemplate",
  description: "Retorna o template de mensagem para um evento específico do pedido",
  inputSchema: z.object({
    event: z.enum(["pedido_recebido", "pedido_pronto", "entregue", "cancelado", "promocao"])
      .describe("Tipo de evento"),
  }),
  outputSchema: z.object({
    event: z.string(),
    subject: z.string().optional(),
    body: z.string(),
    variables: z.array(z.string()).describe("Variáveis disponíveis para substituição ex: {nome}"),
  }),
  execute: async ({ event }) => {
    const template = templates[event];
    if (!template) return { event: event, body: "", variables: [] };
    const variables = [...(template.body.match(/\{[^}]+\}/g) ?? [])];
    return { event: event, subject: template.subject, body: template.body, variables };
  },
});
