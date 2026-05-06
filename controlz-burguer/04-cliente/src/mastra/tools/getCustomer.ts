import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getCustomerById } from "../store";

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
    const raw = await getCustomerById(id);
    const customer = raw ? { ...raw, preferences: raw.preferences ?? [] } : null;
    return { customer, found: !!customer };
  },
});
