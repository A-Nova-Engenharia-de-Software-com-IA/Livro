import { createTool } from "@mastra/core/tools";
import { z } from "zod";

function toMs(dateIso: string) {
  return new Date(dateIso).getTime();
}

export const clickupTimesheetsTool = createTool({
  id: "clickup-timesheets",
  description:
    "Busca apontamentos de horas (time entries) no ClickUp para um usuário específico em um intervalo.",

  inputSchema: z.object({
    assigneeName: z
      .string()
      .describe("Nome ou parte do nome do usuário no ClickUp"),

    startDate: z
      .string()
      .describe("Data ISO início, ex: 2026-02-10T00:00:00Z"),

    endDate: z
      .string()
      .describe("Data ISO fim, ex: 2026-02-16T23:59:59Z"),
  }),

  outputSchema: z.object({
    output: z.string(),
  }),

  execute: async (input) => {

    const { assigneeName, startDate, endDate } = input;

    console.log(
      `Executando clickup-timesheets user=${assigneeName} startDate=${startDate} endDate=${endDate}`
    );

    const token = process.env.CLICKUP_API_KEY;
    const teamId = process.env.CLICKUP_TEAM_ID;

    if (!token || !teamId) {
      return {
        output:
          "Faltam variáveis de ambiente. Configure CLICKUP_API_KEY e CLICKUP_TEAM_ID no .env.",
      };
    }

    // resolve usuário
    const users = await clickupListTeamUsers(teamId);
    const matches = findUserMatches(users, assigneeName);

    if (matches.length === 0) {
      return {
        output: `Não encontrei nenhum usuário que combine com "${assigneeName}".`,
      };
    }

    if (matches.length > 1) {
      const options = matches.slice(0, 10);
      return {
        output:
          `Mais de um usuário encontrado para "${assigneeName}". Seja mais específico:\n` +
          options.map((u) => `- ${u.name} (${u.id})`).join("\n"),
      };
    }

    const assignee = matches[0];

    const startMs = toMs(startDate);
    const endMs = toMs(endDate);

    let page = 0;
    const limit = 100;
    const MAX_PAGES = 50;
    let allEntries: any[] = [];

    while (page < MAX_PAGES) {

      const url =
        `https://api.clickup.com/api/v2/team/${teamId}/time_entries` +
        `?start_date=${startMs}` +
        `&end_date=${endMs}` +
        `&assignee=${assignee.id}` +
        `&page=${page}` +
        `&limit=${limit}` +
        `&include_task_tags=true` +
        `&include_location_names=true`;

      console.log(`Buscando ClickUp time entries: ${url}`);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        return {
          output: `Erro ao buscar time entries no ClickUp (page=${page}): HTTP ${res.status} - ${text}`,
        };
      }

      const data = await res.json();
      const entries = data.data ?? data.time_entries ?? [];

      console.log(`Página ${page}: ${entries.length} registros`);

      if (!entries.length) break;

      allEntries.push(...entries);

      if (entries.length < limit) break;

      page++;
    }

    type Acc = Record<string, number>;

    const byTask: Acc = {};
    const taskNames: Record<string, string> = {};

    for (const e of allEntries) {

      const taskId = String(e.task?.id ?? e.task_id ?? "unknown_task");
      const taskName = e.task?.name ?? "Tarefa desconhecida";

      if (!taskNames[taskId]) {
        taskNames[taskId] = taskName;
      }

      const durationMs = Number(e.duration ?? 0);

      byTask[taskId] = (byTask[taskId] ?? 0) + durationMs;
    }

    const msToHours = (ms: number) =>
      (ms / 1000 / 60 / 60).toFixed(2);

    const taskLines = Object.entries(byTask)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([taskId, ms]) => {
        const name = taskNames[taskId] ?? taskId;
        return `- ${name} (${taskId}): ${msToHours(ms)}h`;
      })
      .join("\n");

    return {
      output:
        `Apontamentos de ${assignee.name}\n` +
        `Período: ${startDate} → ${endDate}\n` +
        `Total de registros: ${allEntries.length}\n\n` +
        `Top tarefas (até 20):\n${taskLines || "- (sem dados)"}`,
    };
  },
});

const CLICKUP_API_BASE = "https://api.clickup.com/api/v2";

async function clickupFetch(path: string, init?: RequestInit) {
  const token = process.env.CLICKUP_API_KEY;

  if (!token) {
    return { ok: false, status: 0, error: "Falta CLICKUP_API_KEY no .env" } as any;
  }

  const res = await fetch(`${CLICKUP_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: token,
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({ ok: false, err: "invalid_json" }));

  return { status: res.status, ...data } as any;
}

/* restante do seu script permanece igual */

/**
 * Tool: Listar usuários/membros do time/workspace no ClickUp
 * Retorna nome + id (id é o "código" que você usa em URLs/filtros)
 */
export const clickupListUsersTool = createTool({
  id: "clickup-list-users",
  description:
    "Lista usuários/membros do ClickUp (nome e id do usuário, para cruzar com timesheets).",
  inputSchema: z.object({
    teamId: z
      .string()
      .optional()
      .describe(
        "ID do Team/Workspace no ClickUp (opcional; se vazio, usa CLICKUP_TEAM_ID do .env)"
      ),
  }),
  outputSchema: z.object({
    output: z.string(),
    users: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      )
      .optional(),
  }),
  execute: async (input) => {
    const teamId = input.teamId || process.env.CLICKUP_TEAM_ID;
    if (!teamId) {
      return {
        output: "Falta teamId (ou configure CLICKUP_TEAM_ID no .env).",
      };
    }

    // Endpoint comum: /team/{team_id} -> retorna { team: { members: [...] } } ou { members: [...] }
    const res = await clickupFetch(`/team/${teamId}`);

    if (!res || res.status >= 400 || res.err || res.error) {
      return {
        output: `Falha ao listar usuários: HTTP ${res?.status ?? "?"} - ${res?.error || res?.err || "unknown_error"}`,
      };
    }

    // Tenta achar members em formatos comuns
    const members =
      res.team?.members ||
      res.members ||
      [];

    if (!Array.isArray(members) || members.length === 0) {
      return { output: "Nenhum usuário encontrado (members vazio)." };
    }

    // ClickUp costuma trazer member.user.{id, username, email...}
    const users = members
      .map((m: any) => {
        const u = m.user || m;
        const id = String(u.id ?? "");
        const name = String(u.username || u.name || u.email || "(sem nome)");
        return id ? { id, name } : null;
      })
      .filter(Boolean) as Array<{ id: string; name: string }>;

    const lines = users.map((u) => `- ${u.name} (${u.id})`).join("\n");

    return {
      output: lines || "Nenhum usuário válido encontrado.",
      users,
    };
  },
});

//criar task

type ClickUpUser = { id: number; name: string };

// Busca membros do time e normaliza (id + nome)
async function clickupListTeamUsers(teamId: string): Promise<ClickUpUser[]> {
  const res = await clickupFetch(`/team/${teamId}`);

  if (!res || res.status >= 400 || (res as any).err || (res as any).error) {
    const detail = (res as any)?.error || (res as any)?.err || (res as any)?.message || "unknown_error";
    throw new Error(`Falha ao listar usuários do ClickUp: HTTP ${res?.status ?? "?"} - ${detail}`);
  }

  const members: any[] = (res as any).team?.members ?? (res as any).members ?? [];
  if (!Array.isArray(members) || members.length === 0) return [];

  return members
    .map((m: any) => {
      const u = m.user || m;
      const id = Number(u?.id);
      const name = String(u?.username || u?.name || u?.email || "").trim();
      if (!Number.isFinite(id) || !name) return null;
      return { id, name } satisfies ClickUpUser;
    })
    .filter((x: ClickUpUser | null): x is ClickUpUser => x !== null);
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

// Match simples e bem útil: exato > prefixo > contém
function findUserMatches(users: ClickUpUser[], query: string): ClickUpUser[] {
  const q = normalize(query);
  if (!q) return [];

  const scored = users
    .map((u) => {
      const n = normalize(u.name);
      let score = 0;
      if (n === q) score = 100;
      else if (n.startsWith(q)) score = 80;
      else if (n.includes(q)) score = 60;
      return { u, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.u);
}

function autoTitleFromDescription(desc: string) {
  const oneLine = desc.replace(/\s+/g, " ").trim();
  return oneLine.length <= 60 ? oneLine : `${oneLine.slice(0, 57)}...`;
}

/**
 * Tool: criar task atribuindo por nome do usuário
 * POST /list/{list_id}/task com assignees: [userId]
 */
export const clickupCreateTaskForUserTool = createTool({
  id: "clickup-create-task-for-user",
  description:
    "Cria uma tarefa no ClickUp atribuindo dinamicamente ao usuário pelo nome (busca membros do team).",
  inputSchema: z.object({
    assigneeName: z.string().min(2).describe("Nome (ou parte do nome) do usuário no ClickUp"),
    description: z.string().min(3).describe("Descrição detalhada da tarefa"),
    title: z.string().optional().describe("Título da tarefa (opcional; se vazio, gera do começo da descrição)"),
    listId: z.string().optional().describe("List ID (opcional; se vazio, usa CLICKUP_LIST_ID do .env)"),
    teamId: z.string().optional().describe("Team/Workspace ID (opcional; se vazio, usa CLICKUP_TEAM_ID do .env)"),
    priority: z.number().int().min(1).max(4).optional().describe("Prioridade 1 (urgente) a 4 (baixa)"),
    dueDate: z.string().optional().describe("Prazo em ISO (ex: 2026-02-23T18:00:00-03:00)"),
    tags: z.array(z.string()).optional().describe("Tags (opcional)"),
  }),
  outputSchema: z.object({
    output: z.string(),
    taskId: z.string().optional(),
    url: z.string().optional(),
    matches: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
  }),
  execute: async (input) => {
    const token = process.env.CLICKUP_API_KEY;
    if (!token) return { output: "Falta CLICKUP_API_KEY no .env." };

    const teamId = input.teamId || process.env.CLICKUP_TEAM_ID;
    if (!teamId) return { output: "Falta teamId (ou configure CLICKUP_TEAM_ID no .env)." };

    const listId = input.listId || process.env.CLICKUP_LIST_ID;
    if (!listId) return { output: "Falta listId (ou configure CLICKUP_LIST_ID no .env)." };

    // 1) resolve usuário por nome
    const users = await clickupListTeamUsers(teamId);
    const matches = findUserMatches(users, input.assigneeName);

    if (matches.length === 0) {
      return {
        output: `Não encontrei nenhum usuário que combine com "${input.assigneeName}". Use um nome mais específico.`,
      };
    }

    if (matches.length > 1) {
      // evita atribuir errado — devolve opções
      const top = matches.slice(0, 10);
      return {
        output:
          `Encontrei mais de um usuário parecido com "${input.assigneeName}". ` +
          `Escolha um nome mais específico. Opções:\n` +
          top.map((u) => `- ${u.name} (${u.id})`).join("\n"),
        matches: top.map((u) => ({ id: u.id, name: u.name })),
      };
    }

    const assignee = matches[0];

    // 2) cria task
    const title = (input.title && input.title.trim()) ? input.title.trim() : autoTitleFromDescription(input.description);

    const due_date = input.dueDate ? new Date(input.dueDate).getTime() : undefined;

    const body: any = {
      name: title,
      description: input.description,
      assignees: [assignee.id],
    };

    if (Number.isFinite(due_date)) body.due_date = due_date;
    if (input.priority) body.priority = input.priority;
    if (input.tags?.length) body.tags = input.tags;

    const res = await clickupFetch(`/list/${listId}/task`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res || res.status >= 400 || (res as any).err || (res as any).error) {
      const detail = (res as any)?.error || (res as any)?.err || (res as any)?.message || "unknown_error";
      return { output: `Falha ao criar tarefa: HTTP ${res?.status ?? "?"} - ${detail}` };
    }

    const taskId = String((res as any).id || "");
    const url = (res as any).url ? String((res as any).url) : undefined;

    return {
      output: `Tarefa criada para ${assignee.name} (${assignee.id})${taskId ? ` — id=${taskId}` : ""}${url ? `\n${url}` : ""}`,
      taskId: taskId || undefined,
      url,
    };
  },
});

/**
 * Tool: Lançar apontamento de horas (time entry) em uma tarefa
 */
// Reutiliza suas helpers existentes:
// - clickupFetch
// - clickupListTeamUsers
// - findUserMatches

function extractTaskId(taskOrUrl: string): string {
  const s = taskOrUrl.trim();
  // aceita link tipo https://app.clickup.com/t/86afn0gaz
  const m = s.match(/clickup\.com\/t\/([A-Za-z0-9_-]+)/i);
  if (m?.[1]) return m[1];
  // senão assume que já é o ID
  return s;
}

function parsePtBrDate(dateStr: string): number {
  // Espera DD/MM/YYYY
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return NaN;
  const [_, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), 9, 0, 0); // 09:00 local por padrão
  return d.getTime();
}

export const clickupAddTimeEntryTool = createTool({
  id: "clickup-add-time-entry",
  description:
    "Lança um apontamento de horas (time entry) no ClickUp para uma tarefa (aceita link ou ID), por data e por nome do usuário.",
  inputSchema: z.object({
    task: z.string().min(3).describe("Link ou ID da tarefa no ClickUp (ex: https://app.clickup.com/t/86afn0gaz)"),
    hours: z.number().positive().describe("Quantidade de horas (ex: 1.5 para 1h30)"),
    date: z.string().describe("Data no formato DD/MM/YYYY (ex: 23/02/2026)"),
    assigneeName: z.string().min(2).describe("Nome (ou parte do nome) do usuário no ClickUp"),
    description: z.string().optional().describe("Descrição do apontamento (opcional)"),
    teamId: z
      .string()
      .optional()
      .describe("Team/Workspace ID (opcional; se vazio, usa CLICKUP_TEAM_ID do .env)"),
  }),
  outputSchema: z.object({
    output: z.string(),
    timeEntryId: z.string().optional(),
  }),
  execute: async (input) => {
    const teamId = input.teamId || process.env.CLICKUP_TEAM_ID;
    if (!teamId) {
      return { output: "Falta teamId (ou configure CLICKUP_TEAM_ID no .env)." };
    }

    // 1) Extrai e valida task
    const taskId = extractTaskId(input.task);
    if (!taskId) {
      return { output: "Não consegui extrair o ID da task a partir do valor informado." };
    }

    // Valida se a task existe / é acessível
    const check = await clickupFetch(`/task/${taskId}`);
    if (!check || check.status >= 400 || (check as any).err || (check as any).error) {
      return { output: `Não encontrei a tarefa ${taskId}. Verifique o link/ID da task.` };
    }

    // 2) Resolve usuário por nome
    const users = await clickupListTeamUsers(teamId);
    const matches = findUserMatches(users, input.assigneeName);

    if (matches.length === 0) {
      return {
        output: `Não encontrei nenhum usuário que combine com "${input.assigneeName}". Use um nome mais específico.`,
      };
    }

    if (matches.length > 1) {
      const top = matches.slice(0, 10);
      return {
        output:
          `Encontrei mais de um usuário parecido com "${input.assigneeName}". ` +
          `Seja mais específico. Opções:\n` +
          top.map((u) => `- ${u.name} (${u.id})`).join("\n"),
      };
    }

    const assignee = matches[0];

    // 3) Converte data (DD/MM/YYYY) para timestamp
    const startMs = parsePtBrDate(input.date);
    if (!Number.isFinite(startMs)) {
      return { output: "Data inválida. Use o formato DD/MM/YYYY, ex: 23/02/2026." };
    }

    // 4) Converte horas para ms
    const durationMs = Math.round(input.hours * 60 * 60 * 1000);

    const body: any = {
      tid: taskId,
      start: startMs,
      duration: durationMs,
      description: input.description || `Apontamento ${input.hours}h via assistente (${assignee.name})`,
      assignee: assignee.id,
    };

    // 5) Cria o time entry
    const res = await clickupFetch(`/team/${teamId}/time_entries`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res || res.status >= 400 || (res as any).err || (res as any).error) {
      const detail = (res as any)?.error || (res as any)?.err || (res as any)?.message || "unknown_error";
      return { output: `Falha ao lançar horas: HTTP ${res?.status ?? "?"} - ${detail}` };
    }

    const timeEntryId = String((res as any).id || "");

    return {
      output:
        `Apontamento criado com sucesso!\n` +
        `Task: ${taskId}\n` +
        `Usuário: ${assignee.name}\n` +
        `Data: ${input.date}\n` +
        `Tempo: ${input.hours}h`,
      timeEntryId: timeEntryId || undefined,
    };
  },
});

export const clickupListProjectsTool = createTool({
  id: "clickup-list-projects",
  description:
    "Lista os projetos (lists) existentes nos spaces do ClickUp.",

  inputSchema: z.object({}),

  outputSchema: z.object({
    output: z.string(),
    projects: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          space: z.string(),
          folder: z.string().optional(),
        })
      )
      .optional(),
  }),

  execute: async () => {

    const teamId = process.env.CLICKUP_TEAM_ID;

    if (!teamId) {
      return {
        output: "Falta CLICKUP_TEAM_ID no .env",
      };
    }

    const spacesRes = await clickupFetch(`/team/${teamId}/space`);

    const spaces = spacesRes?.spaces ?? [];

    const projects: any[] = [];

    for (const space of spaces) {

      // folders
      const foldersRes = await clickupFetch(`/space/${space.id}/folder`);

      const folders = foldersRes?.folders ?? [];

      for (const folder of folders) {

        const listsRes = await clickupFetch(`/folder/${folder.id}/list`);

        const lists = listsRes?.lists ?? [];

        for (const list of lists) {
          projects.push({
            id: String(list.id),      // ← IMPORTANTE
            name: list.name,
            space: space.name,
            folder: folder.name,
          });
        }
      }

      // lists diretas no space (sem folder)
      const listsRes = await clickupFetch(`/space/${space.id}/list`);

      const lists = listsRes?.lists ?? [];

      for (const list of lists) {
        projects.push({
          id: String(list.id),      // ← IMPORTANTE
          name: list.name,
          space: space.name,
        });
      }
    }

    const lines = projects
      .map((p) =>
        `- ${p.name} (${p.id}) — space: ${p.space}${p.folder ? ` / folder: ${p.folder}` : ""}`
      )
      .join("\n");

    return {
      output: lines,
      projects,
    };
  },
});

export const clickupProjectHoursTool = createTool({
  id: "clickup-project-hours",
  description:
    "Calcula o total de horas trabalhadas por projeto (ClickUp list) usando os apontamentos de tempo.",

  inputSchema: z.object({
    startDate: z.string().describe("Data inicial ISO"),
    endDate: z.string().describe("Data final ISO"),
  }),

  outputSchema: z.object({
    output: z.string(),
  }),

  execute: async (input) => {

    const { startDate, endDate } = input;

    const teamId = process.env.CLICKUP_TEAM_ID;
    const token = process.env.CLICKUP_API_KEY;

    if (!teamId || !token) {
      return {
        output: "Faltam variáveis CLICKUP_TEAM_ID ou CLICKUP_API_KEY no .env",
      };
    }

    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();

    let page = 0;
    const limit = 100;
    const MAX_PAGES = 50;

    const entries: any[] = [];

    while (page < MAX_PAGES) {

      const url =
        `https://api.clickup.com/api/v2/team/${teamId}/time_entries` +
        `?start_date=${startMs}` +
        `&end_date=${endMs}` +
        `&page=${page}` +
        `&limit=${limit}` +
        `&include_task_tags=true`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        return {
          output: `Erro ClickUp API: ${res.status} ${text}`,
        };
      }

      const data = await res.json();
      const pageEntries = data.data ?? data.time_entries ?? [];

      if (!pageEntries.length) break;

      entries.push(...pageEntries);

      if (pageEntries.length < limit) break;

      page++;
    }

    const projectHours: Record<string, number> = {};
    const projectNames: Record<string, string> = {};

    for (const e of entries) {

      const listId = String(e.task?.list?.id ?? "unknown_project");
      const listName = e.task?.list?.name ?? "Projeto desconhecido";

      const duration = Number(e.duration ?? 0);

      if (!projectNames[listId]) {
        projectNames[listId] = listName;
      }

      projectHours[listId] = (projectHours[listId] ?? 0) + duration;
    }

    const msToHours = (ms: number) =>
      (ms / 1000 / 60 / 60).toFixed(2);

    const lines = Object.entries(projectHours)
      .sort((a, b) => b[1] - a[1])
      .map(([id, ms]) => {
        const name = projectNames[id] ?? id;
        return `- ${name}: ${msToHours(ms)}h`;
      })
      .join("\n");

    return {
      output:
        `Horas por projeto (${startDate} → ${endDate})\n\n` +
        `${lines || "Nenhum apontamento encontrado."}`,
    };
  },
});