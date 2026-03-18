import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const SLACK_API_BASE = "https://slack.com/api";

async function slackFetch(path: string, init?: RequestInit) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    return {
      ok: false,
      error: "Falta SLACK_BOT_TOKEN no .env",
      status: 0,
    } as any;
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

// 👉 Abre (ou obtém) a conversa de DM com um usuário
async function openDmWithUser(userId: string): Promise<string> {
  const res = await slackFetch("/conversations.open", {
    method: "POST",
    body: JSON.stringify({ users: userId }),
  });

  if (!res.ok || !res.channel?.id) {
    throw new Error(`Falha ao abrir DM com ${userId}: ${res.error || "unknown_error"}`);
  }

  return res.channel.id as string; // Ex: D1234567890
}

// =====================
// Tool: Enviar mensagem em canal ou DM (por channel id)
// =====================
export const slackSendMessage = createTool({
  id: "slack-send-message",
  description: "Envia mensagem para um canal ou DM (via channel ID)",
  inputSchema: z.object({
    channel: z.string().describe("ID do canal ou DM (ex.: C123..., D123...)"),
    text: z.string().describe("Texto da mensagem"),
    thread_ts: z.string().optional().describe("Timestamp da thread (opcional)"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async (input) => {
    const { channel, text, thread_ts } = input;

    const res = await slackFetch("/chat.postMessage", {
      method: "POST",
      body: JSON.stringify({ channel, text, thread_ts }),
    });

    if (!res.ok) {
      return {
        output: `Falha ao enviar mensagem: HTTP ${res.status} - ${res.error || "unknown_error"}`,
      };
    }

    return {
      output: `Mensagem enviada para ${channel} (ts=${res.ts || res.message?.ts || "?"})`,
    };
  },
});

// =====================
// Tool: Enviar DM para um usuário (por user ID)
// =====================
export const slackSendDM = createTool({
  id: "slack-send-dm",
  description: "Envia mensagem direta (DM) para um usuário do Slack",
  inputSchema: z.object({
    user: z.string().describe("ID do usuário (ex.: U12345678)"),
    text: z.string().describe("Texto da mensagem"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async (input) => {
    const { user, text } = input;

    // 1) Abre ou obtém o canal de DM
    const dmChannelId = await openDmWithUser(user);

    // 2) Envia a mensagem
    const res = await slackFetch("/chat.postMessage", {
      method: "POST",
      body: JSON.stringify({ channel: dmChannelId, text }),
    });

    if (!res.ok) {
      return {
        output: `Falha ao enviar DM: HTTP ${res.status} - ${res.error || "unknown_error"}`,
      };
    }

    return {
      output: `DM enviada para usuário ${user} (canal ${dmChannelId}, ts=${res.ts || "?"})`,
    };
  },
});

// =====================
// Tool: Listar canais
// =====================
export const slackListChannels = createTool({
  id: "slack-list-channels",
  description: "Lista canais visíveis ao token (públicos/privados)",
  inputSchema: z.object({
    types: z
      .string()
      .default("public_channel,private_channel")
      .describe("Tipos de canais: public_channel,private_channel"),
    limit: z.number().int().min(1).max(1000).default(200).describe("Limite por página"),
    cursor: z.string().optional().describe("Cursor para paginação"),
  }),
  outputSchema: z.object({ output: z.string() }),
  execute: async (input) => {
    const params = new URLSearchParams();
    params.set("types", input.types || "public_channel,private_channel");
    params.set("limit", String(input.limit ?? 200));
    if (input.cursor) params.set("cursor", input.cursor);

    const res = await slackFetch(`/conversations.list?${params.toString()}`);
    if (!res.ok) {
      const extras = [res.error, res.needed ? `needed=${res.needed}` : "", res.provided ? `provided=${res.provided}` : ""]
        .filter(Boolean)
        .join(" ");
      return { output: `Falha ao listar canais: HTTP ${res.status} - ${extras || "unknown_error"}` };
    }

    const items = (res.channels || [])
      .map((c: any) => `- ${c.name || "(sem nome)"} (${c.id})`)
      .join("\n");

    const next = res.response_metadata?.next_cursor
      ? `\nPróximo cursor: ${res.response_metadata.next_cursor}`
      : "";

    return { output: items || "Nenhum canal encontrado." + next };
  },
});

export const slackListUsers = createTool({
  id: "slack-list-users",
  description: "Lista usuários do Slack (nome e user ID), com paginação.",
  inputSchema: z.object({
    limit: z.number().int().min(1).max(200).default(200).describe("Limite por página (máx 200)"),
    cursor: z.string().optional().describe("Cursor de paginação (opcional)"),
    includeBots: z.boolean().default(false).describe("Incluir bots na lista"),
  }),
  outputSchema: z.object({
    output: z.string(),
    users: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().optional(),
        })
      )
      .optional(),
    next_cursor: z.string().optional(),
  }),
  execute: async (input) => {
    try {
      const { users, nextCursor } = await listSlackUsers({
        limit: input.limit,
        cursor: input.cursor,
        includeBots: input.includeBots,
      });

      type SlackUser = { id: string; name: string; email?: string };

      const lines = users
        .map((u: SlackUser) => `- ${u.name} (${u.id})${u.email ? ` <${u.email}>` : ""}`)
        .join("\n");

      return {
        output: (lines || "Nenhum usuário encontrado.") + (nextCursor ? `\nPróximo cursor: ${nextCursor}` : ""),
        users,
        next_cursor: nextCursor,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido ao listar usuários.";
      return { output: msg };
    }
  },
});

async function listSlackUsers(params?: {
  limit?: number;
  cursor?: string;
  includeBots?: boolean;
}) {
  const limit = params?.limit ?? 200;
  const cursor = params?.cursor;
  const includeBots = params?.includeBots ?? false;

  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  if (cursor) qs.set("cursor", cursor);

  const res = await slackFetch(`/users.list?${qs.toString()}`);

  if (!res.ok) {
    const extras = [
      res.error,
      res.needed ? `needed=${res.needed}` : "",
      res.provided ? `provided=${res.provided}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    throw new Error(`Falha ao listar usuários: HTTP ${res.status} - ${extras || "unknown_error"}`);
  }

  const members = Array.isArray(res.members) ? res.members : [];

  // Filtra usuários "reais" por padrão (sem deleted, sem bots, sem slackbot)
  const filtered = members.filter((u: any) => {
    if (!u) return false;
    if (u.deleted) return false;
    if (u.id === "USLACKBOT") return false;
    if (!includeBots && (u.is_bot || u.is_app_user)) return false;
    return true;
  });

  const users = filtered.map((u: any) => ({
    id: String(u.id),
    name: String(u.real_name || u.profile?.real_name || u.name || "(sem nome)"),
    email: u.profile?.email ? String(u.profile.email) : undefined,
  }));

  const nextCursor =
    res.response_metadata?.next_cursor && String(res.response_metadata.next_cursor).trim()
      ? String(res.response_metadata.next_cursor).trim()
      : undefined;

  return { users, nextCursor };
}