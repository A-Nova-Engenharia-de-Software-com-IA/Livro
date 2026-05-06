import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { updateCustomerPreferences } from "../store";

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
    const customer = await updateCustomerPreferences(id, preferences);
    return {
      success: !!customer,
      customerId: id,
      preferences: customer?.preferences ?? [],
    };
  },
});
