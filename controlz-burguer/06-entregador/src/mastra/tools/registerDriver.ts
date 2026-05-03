import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { drivers, type Driver } from "../store";
import { randomUUID } from "crypto";

export const registerDriverTool = createTool({
  id: "registerDriver",
  description: "Cadastra um novo entregador",
  inputSchema: z.object({
    name: z.string().describe("Nome do entregador"),
    phone: z.string().describe("Telefone com DDD"),
    vehicle: z.string().describe("Veículo ex: Honda CG 160, Bicicleta"),
  }),
  outputSchema: z.object({
    id: z.string(),
    name: z.string(),
    vehicle: z.string(),
    available: z.boolean(),
    createdAt: z.string(),
  }),
  execute: async ({ name, phone, vehicle }) => {
    const driver: Driver = {
      id: randomUUID(),
      name,
      phone,
      vehicle,
      available: true,
      createdAt: new Date().toISOString(),
    };
    drivers.set(driver.id, driver);
    return driver;
  },
});
