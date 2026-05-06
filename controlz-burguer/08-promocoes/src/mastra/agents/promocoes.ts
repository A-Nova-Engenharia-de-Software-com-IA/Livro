import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { createCouponTool } from "../tools/createCoupon";
import { listCouponsTool } from "../tools/listCoupons";
import { validateCouponTool } from "../tools/validateCoupon";
import { applyTimeBasedRuleTool } from "../tools/applyTimeBasedRule";

export const promocoesAgent = new Agent({
  id: "promocoes-agent",
  name: "promocoesAgent",
  description: "Gerencia cupons de desconto e regras de promoção da ControlZ Burger.",
  instructions: `Você é o gerente de promoções da ControlZ Burger.
Crie cupons de desconto com código único, percentual e validade.
Valide cupons no momento do pedido e aplique o desconto correto.
Gerencie regras de promoção por horário (happy hour, almoço, etc.).
Não permita uso de cupons vencidos ou inválidos.`,
  model: openai("gpt-4o-mini"),
  tools: {
    createCoupon: createCouponTool,
    listCoupons: listCouponsTool,
    validateCoupon: validateCouponTool,
    applyTimeBasedRule: applyTimeBasedRuleTool,
  },
});
