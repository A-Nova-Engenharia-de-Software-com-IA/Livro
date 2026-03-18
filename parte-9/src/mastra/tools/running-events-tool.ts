import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { chromium } from "playwright";

export const runningEventsTool = createTool({
  id: "running-events-tool",

  description: "Busca eventos de corrida no site corridasbr.com.br por estado do Brasil",

  inputSchema: z.object({
    state: z
      .string()
      .describe("Sigla do estado (ex: sc, sp, rs, rj)"),

    month: z
      .string()
      .optional()
      .describe("Mês para filtrar as corridas (ex: março, abril)"),
  }),

  outputSchema: z.object({
    output: z.string(),
  }),

  execute: async ({ state, month }) => {

    const uf = state.toLowerCase();

    const url = `https://www.corridasbr.com.br/${uf}/Calendario.asp`;

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    const events = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tr");

      const data: any[] = [];

      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");

        if (cols.length >= 3) {
          const date = cols[0].innerText.trim();
          const name = cols[1].innerText.trim();
          const city = cols[2].innerText.trim();

          if (date && name && city) {
            data.push({ date, name, city });
          }
        }
      });

      return data;
    });

    await browser.close();

    let filtered = events;

    if (month) {
      const m = month.toLowerCase();
      filtered = events.filter((e) =>
        e.date.toLowerCase().includes(m)
      );
    }

    const text = filtered
      .map((e) => `${e.date} - ${e.name} (${e.city})`)
      .join("\n");

    return {
      output:
        `Corridas encontradas em ${state.toUpperCase()}:\n\n` +
        (text || "Nenhuma corrida encontrada."),
    };
  },
});