import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

// Slack tools
import { slackSendMessage, slackListChannels, slackSendDM, slackListUsers } from "../tools/slack-tool";

// ClickUp tool
import { clickupTimesheetsTool, clickupListUsersTool, clickupCreateTaskForUserTool} from "../tools/clickup-timesheets-tool";

export const clickupSlackGeneral = new Agent({
  id: "ops-agent",
  name: "Operations Assistant",
  description: "Agente que integra Slack e ClickUp para comunicação e relatórios.",
  instructions: `
Você é um assistente operacional que integra Slack e ClickUp.

Regras:
- Use slackListChannels para listar canais.
- Use slackSendMessage para enviar mensagens para canais.
- Use slackSendDM para enviar DMs quando houver user ID.
- Use clickupTimesheetsTool para responder perguntas sobre horas no ClickUp.
- Use clickupListUsersTool para obter a lista de usuários do ClickUp.
- Para criar tarefas, use a ferramenta clickup-create-task-for-user.
- Se faltar informação (datas, canal, usuário), pergunte antes de agir.
- Seja objetivo e responda em português.

Exemplos de tarefas:
- "Veja quanto o time apontou essa semana e avise no Slack"
- "Liste meus canais do Slack"
- "Quem mais apontou horas entre X e Y?"
- "Mande um resumo de horas no canal #geral"
`,
  model: "openai/gpt-5.2",
  tools: {
    // Slack
    slackSendMessage,
    slackSendDM,
    slackListChannels,
    slackListUsers,
    // ClickUp
    clickupTimesheetsTool,
    clickupListUsersTool,
    clickupCreateTaskForUserTool,
  },
  memory: new Memory({
    options: { lastMessages: 20 },
  }),
});