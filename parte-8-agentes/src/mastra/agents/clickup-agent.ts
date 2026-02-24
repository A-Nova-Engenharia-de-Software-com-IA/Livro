import { Agent } from "@mastra/core/agent";
import { clickupTimesheetsTool, clickupListUsersTool, clickupCreateTaskForUserTool, clickupAddTimeEntryTool} from "../tools/clickup-timesheets-tool";
import { Memory } from "@mastra/memory";

export const clickupAgent = new Agent({
  id: "clickup-agent",
  name: "ClickUp Timesheets Assistant",
  instructions: `
Você ajuda a responder perguntas sobre apontamento de horas (timesheets) no ClickUp.

Regras:
- Se o usuário não informar datas, peça o intervalo (início e fim).
- Para responder, use a ferramenta clickup-timesheets.
- Para criar tarefas, use a ferramenta clickup-create-task-for-user.
- Para lançar apontamentos de horas, use a ferramenta clickup-add-time-entry.

Exemplos:
- "Quanto o time apontou essa semana?"
- "Quais usuários mais apontaram horas entre dia X e Y?"
`,
  model: "openai/gpt-5.2",
  tools: { clickupTimesheetsTool, clickupListUsersTool, clickupCreateTaskForUserTool, clickupAddTimeEntryTool },
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
});