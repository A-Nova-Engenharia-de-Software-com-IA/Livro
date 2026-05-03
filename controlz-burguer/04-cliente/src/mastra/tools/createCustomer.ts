import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { customers, type Customer } from "../store";
import { randomUUID } from "crypto";

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
    const customer: Customer = {
      id: randomUUID(),
      name,
      phone,
      email,
      preferences: preferences ?? [],
      points: 0,
      createdAt: new Date().toISOString(),
    };
    customers.set(customer.id, customer);
    return customer;
  },
});
