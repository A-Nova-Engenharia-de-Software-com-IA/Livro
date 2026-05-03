import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { customers } from "../store";

export const updatePreferencesTool = createTool({
  id: "updatePreferences",
  description: "Atualiza preferências alimentares de um cliente",
  inputSchema: z.object({
    id: z.string().describe("ID do cliente"),
    preferences: z.array(z.string()).describe("Lista de preferências ex: ['sem glúten','sem lactose']"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    customerId: z.string(),
    preferences: z.array(z.string()),
  }),
  execute: async ({ id, preferences }) => {
    const customer = customers.get(id);
    if (!customer) return { success: false, customerId: id, preferences: [] };
    customers.set(id, { ...customer, preferences });
    return { success: true, customerId: id, preferences };
  },
});
