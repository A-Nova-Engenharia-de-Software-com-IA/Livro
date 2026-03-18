import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import nodemailer from "nodemailer";

export const sendJsonEmailStep = createStep({
  id: "send-json-email",
  inputSchema: z.object({
    entries: z.array(
      z.object({
        user: z.string(),
        durationHours: z.number(),
      })
    ),
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
    ok: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    const { entries, startDate, endDate } = inputData;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const jsonBody = JSON.stringify(
      { startDate, endDate, entries },
      null,
      2
    );

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "no-reply@empresa.com",
      to: process.env.REPORT_EMAIL_TO || "destinatario@empresa.com",
      subject: `Timesheets ClickUp (${startDate} → ${endDate})`,
      text: `Segue o JSON dos apontamentos:\n\n${jsonBody}`,
      attachments: [
        {
          filename: "timesheets.json",
          content: jsonBody,
          contentType: "application/json",
        },
      ],
    });

    return {
      entries,
      startDate,
      endDate,
      ok: true,
    };
  },
});