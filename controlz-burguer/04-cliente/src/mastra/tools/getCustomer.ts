import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { customers } from "../store";

export const getCustomerTool = createTool({
  id: "getCustomer",
  description: "Busca um cliente pelo ID",
  inputSchema: z.object({
    id: z.string().describe("ID do cliente"),
  }),
  outputSchema: z.object({
    customer: z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string(),
      email: z.string().optional(),
      preferences: z.array(z.string()),
      points: z.number(),
    }).nullable(),
    found: z.boolean(),
  }),
  execute: async ({ id }) => {
    const customer = customers.get(id) ?? null;
    return { customer, found: !!customer };
  },
});
