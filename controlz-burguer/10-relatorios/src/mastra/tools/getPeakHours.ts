import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fakeOrders } from "../store";

export const getPeakHoursTool = createTool({
  id: "getPeakHours",
  description: "Retorna a distribuição de pedidos por hora do dia para identificar horários de pico",
  inputSchema: z.object({}),
  outputSchema: z.object({
    distribution: z.array(z.object({
      hour: z.number(),
      label: z.string(),
      orders: z.number(),
      percentage: z.number(),
    })),
    peakHour: z.number(),
    peakLabel: z.string(),
  }),
  execute: async () => {
    const hourCount = new Array(24).fill(0);
    for (const o of fakeOrders) hourCount[o.hour]++;
    const total = fakeOrders.length;
    const distribution = hourCount
      .map((orders, hour) => ({ hour, label: `${hour.toString().padStart(2, "0")}:00`, orders, percentage: parseFloat((orders / total * 100).toFixed(1)) }))
      .filter(h => h.orders > 0);
    const peak = distribution.reduce((max, h) => h.orders > max.orders ? h : max, distribution[0]);
    return { distribution, peakHour: peak?.hour ?? 12, peakLabel: peak?.label ?? "12:00" };
  },
});
