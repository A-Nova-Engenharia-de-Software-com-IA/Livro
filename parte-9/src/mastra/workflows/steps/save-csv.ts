// steps/save-csv.ts
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

export const saveCsvStep = createStep({
  id: "save-csv",
  inputSchema: z.object({
    entries: z.array(
      z.object({
        user: z.string(),
        durationHours: z.number(),
      })
    ),
    startDate: z.string(),
    endDate: z.string(),
    ok: z.boolean(), // vem do step de email
  }),
  outputSchema: z.object({
    filePath: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { entries, startDate, endDate } = inputData;

    const header = "user,durationHours";
    const rows = entries.map(
      (e) => `${e.user},${e.durationHours}`
    );

    const csv = [header, ...rows].join("\n");

    const fileName = `clickup_${startDate}_${endDate}.csv`.replace(/[:]/g, "-");
    const filePath = path.resolve("./exports", fileName);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, csv, "utf-8");

    return { filePath };
  },
});