import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fakeOrders } from "../store";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const generateExecutiveSummaryTool = createTool({
  id: "generateExecutiveSummary",
  description: "Gera um resumo executivo dos KPIs do período usando LLM",
  inputSchema: z.object({
    periodDays: z.number().int().positive().default(30).describe("Período de análise em dias"),
  }),
  outputSchema: z.object({
    summary: z.string(),
    kpis: z.object({
      revenue: z.number(),
      orders: z.number(),
      avgTicket: z.number(),
      topProduct: z.string(),
    }),
  }),
  execute: async ({ periodDays }) => {
    const filtered = fakeOrders.filter(o => o.dayOffset <= periodDays);
    const revenue = parseFloat(filtered.reduce((s, o) => s + o.total, 0).toFixed(2));
    const orders = filtered.length;
    const avgTicket = orders > 0 ? parseFloat((revenue / orders).toFixed(2)) : 0;

    const productCount = new Map<string, number>();
    for (const o of filtered) productCount.set(o.product, (productCount.get(o.product) ?? 0) + o.qty);
    const topProduct = [...productCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

    const { text: summary } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Escreva um resumo executivo conciso (2-3 frases) para a diretoria da ControlZ Burger com os seguintes KPIs dos últimos ${periodDays} dias:
- Faturamento: R$ ${revenue}
- Total de pedidos: ${orders}
- Ticket médio: R$ ${avgTicket}
- Produto mais vendido: ${topProduct}
Tom profissional e objetivo.`,
    });

    return { summary, kpis: { revenue, orders, avgTicket, topProduct } };
  },
});
