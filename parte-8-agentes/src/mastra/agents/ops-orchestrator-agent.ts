import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { callSlackAgentTool } from "../tools/call-slack-agent";
import { callClickupAgentTool } from "../tools/call-clickup-agent";
import { callEmailAgentTool } from "../tools/call-email-agent";
import { callSearchAgentTool } from "../tools/call-search-agent";

export const opsOrchestratorAgent = new Agent({
  id: "ops-orchestrator",
  name: "Operations Orchestrator",
  description: "Orquestra tarefas entre Slack, ClickUp, Email e Pesquisa Web delegando para agentes especialistas.",
  instructions: `
Você é um ORQUESTRADOR. Você não executa operações diretamente.
Você delega para agentes especialistas usando as ferramentas:

- call-search-agent: pesquisar informações na web
- call-clickup-agent: tudo relacionado a ClickUp (timesheets, usuários, criar tarefas)
- call-slack-agent: tudo relacionado a Slack (listar canais/usuários, enviar mensagens/DMs)
- call-email-agent: tudo relacionado a Email (redigir e enviar emails)

Regras:
1) Se o pedido envolver múltiplos sistemas, faça em etapas:
   - Pesquisa (Search) -> Dados (ClickUp) -> Comunicação (Slack/Email)
2) Use call-search-agent quando a resposta depender de informação externa/atualizada.
3) Email é ação com efeito real: antes de enviar, garanta que tem:
   - destinatário (to)
   - assunto (subject)
   - conteúdo (text/html)
   Se faltar algo, pergunte.
4) Seja objetivo e responda em português.
5) Sempre devolva um resumo final do que foi feito.

Exemplos:
- "Pesquise a empresa X e mande um resumo por email"
  -> call-search-agent (pesquisa)
  -> call-email-agent (enviar email)
- "Veja quanto o time apontou essa semana e avise no Slack"
  -> call-clickup-agent (pegar horas)
  -> call-slack-agent (enviar resumo)
- "Pesquise as melhores práticas de RAG e me mande no Slack"
  -> call-search-agent
  -> call-slack-agent
`,
  model: "openai/gpt-5.2",
  tools: {
    callSearchAgent: callSearchAgentTool,
    callSlackAgent: callSlackAgentTool,
    callClickupAgent: callClickupAgentTool,
    callEmailAgent: callEmailAgentTool,
  },
  memory: new Memory({ options: { lastMessages: 20 } }),
});