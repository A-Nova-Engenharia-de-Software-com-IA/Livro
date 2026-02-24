// workflows/clickup-to-csv-workflow.ts
import { createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { fetchClickupTimesheetsStep } from "./steps/fetch-clickup-timesheets";
import { saveCsvStep } from "./steps/save-csv";
import { sendJsonEmailStep } from "./steps/send-json-email";
import { sendSlackMessageStep } from "./steps/send-slack-message";

export const clickupToCsvWorkflow = createWorkflow({
  id: "clickup-to-csv-workflow",
  inputSchema: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  outputSchema: z.object({
    filePath: z.string(),
  }),
})
.then(fetchClickupTimesheetsStep) // { entries, startDate, endDate }
.then(sendJsonEmailStep)          // { entries, startDate, endDate, ok }
.then(sendSlackMessageStep)       // ✅ usa entries
.then(saveCsvStep)                // { filePath }
.commit();