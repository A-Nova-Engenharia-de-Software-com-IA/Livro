import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { timeRules, type TimeBasedRule } from "../store";
import { randomUUID } from "crypto";

export const applyTimeBasedRuleTool = createTool({
  id: "applyTimeBasedRule",
  description: "Cria ou consulta regras de desconto por horário (happy hour, promoção do almoço, etc.)",
  inputSchema: z.object({
    rule: z.string().describe("Descrição da regra ex: '20% off às quartas das 19h às 22h'"),
    action: z.enum(["create", "list", "check"]).default("create"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    rules: z.array(z.object({ id: z.string(), description: z.string(), rule: z.string() })),
    activeNow: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ rule, action }) => {
    if (action === "create") {
      const r: TimeBasedRule = { id: randomUUID(), description: rule, rule, createdAt: new Date().toISOString() };
      timeRules.push(r);
      return { success: true, rules: timeRules, activeNow: false, message: `Regra criada: "${rule}"` };
    }
    if (action === "list") {
      return { success: true, rules: timeRules, activeNow: false, message: `${timeRules.length} regra(s) cadastrada(s)` };
    }
    const hour = new Date().getHours();
    const activeNow = timeRules.length > 0 && ((hour >= 19 && hour < 22) || (hour >= 11 && hour < 14));
    return { success: true, rules: timeRules, activeNow, message: activeNow ? "Há promoção ativa agora!" : "Nenhuma promoção ativa no momento" };
  },
});
