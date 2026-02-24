import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

export const fetchClickupTimesheetsStep = createStep({
  id: "fetch-clickup-timesheets",
  inputSchema: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  outputSchema: z.object({
    entries: z.array(
      z.object({
        user: z.string(),
        durationHours: z.number(),
      })
    ),
    startDate: z.string(),
    endDate: z.string(),
  }),

  execute: async ({ inputData, mastra }) => {
    const { startDate, endDate } = inputData;

    const agent = mastra.getAgent("clickupAgent");

    const prompt = `
Retorne os totais de horas de cada usuario do ClickUp entre ${startDate} e ${endDate}.
Responda SOMENTE com JSON válido no formato:

[
  { "user": "Nome", "durationHours": 1.5 }
]
`;

    const response = await agent.generate(prompt);

    let entries: { user: string; durationHours: number }[];

    try {
      // Remove possíveis ```json ``` da resposta
      const jsonText = response.text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      entries = JSON.parse(jsonText);
    } catch (err) {
      throw new Error(
        "Não foi possível converter a resposta do agente em JSON. Resposta:\n" +
          response.text
      );
    }

    return {
      entries,
      startDate,
      endDate,
    };
  },
});