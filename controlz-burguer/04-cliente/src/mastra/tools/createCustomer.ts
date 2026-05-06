import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { insertCustomer } from "../store";

export const createCustomerTool = createTool({
  id: "createCustomer",
  description: "Cadastra um novo cliente",
  inputSchema: z.object({
    name: z.string().describe("Nome completo do cliente"),
    phone: z.string().describe("Telefone com DDD ex: 11999990001"),
    email: z.string().email().optional().describe("E-mail do cliente"),
    preferences: z.array(z.string()).optional().describe("Preferências alimentares ex: ['sem cebola','vegano']"),
  }),
  outputSchema: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    points: z.number(),
    createdAt: z.string(),
  }),
  execute: async ({ name, phone, email, preferences }) => {
    return insertCustomer({ name, phone, email, preferences });
  },
});
