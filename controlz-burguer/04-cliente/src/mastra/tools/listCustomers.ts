import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getAllCustomers } from "../store";

export const listCustomersTool = createTool({
  id: "listCustomers",
  description: "Lista clientes, opcionalmente buscando por nome ou telefone",
  inputSchema: z.object({
    search: z.string().optional().describe("Busca por nome ou telefone"),
  }),
  outputSchema: z.object({
    customers: z.array(z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string(),
      points: z.number(),
    })),
    total: z.number(),
  }),
  execute: async ({ search }) => {
    const list = await getAllCustomers(search);
    return { customers: list, total: list.length };
  },
});
