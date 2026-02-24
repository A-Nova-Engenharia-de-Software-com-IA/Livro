// steps/send-slack-message.ts
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

const SLACK_API_BASE = "https://slack.com/api";

async function slackFetch(path: string, init?: RequestInit) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    throw new Error("Falta SLACK_BOT_TOKEN no .env");
  }

  const res = await fetch(`${SLACK_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({ ok: false, error: "invalid_json" }));
  return { status: res.status, ...data } as any;
}

export const sendSlackMessageStep = createStep({
  id: "send-slack-message",
  inputSchema: z.object({
    entries: z.array(
      z.object({
        user: z.string(),
        durationHours: z.number(),
      })
    ),
    startDate: z.string(),
    endDate: z.string(),
    ok: z.boolean().optional(), // pode vir do step anterior (email)
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

    const CHANNEL_ID = process.env.SLACK_TESTEFOKA_CHANNEL_ID || "#testefoka";

    // Monta o texto com o conteúdo dos entries
    const lines = entries.map(
      (e) => `• ${e.user}: ${e.durationHours.toFixed(2)}h`
    );

    const text =
      `✅ *Relatório do ClickUp*\n` +
      `Período: ${startDate} → ${endDate}\n\n` +
      `*Apontamentos:*\n` +
      (lines.length ? lines.join("\n") : "_Sem dados no período._");

    const res = await slackFetch("/chat.postMessage", {
      method: "POST",
      body: JSON.stringify({
        channel: CHANNEL_ID,
        text,
      }),
    });

    if (!res.ok) {
      throw new Error(`Falha ao enviar mensagem no Slack: ${res.error || "unknown_error"}`);
    }

    // Repassa os dados para próximos steps, se houver
    return {
      entries,
      startDate,
      endDate,
      ok: true,
    };
  },
});