import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { jiraMcp } from "../mcp/jira-mcp";

export const jiraAgent = new Agent({
  id: "jira-agent",
  name: "Jira Assistant",
  description:
    "Assistente que busca, cria e atualiza issues no Jira via MCP (Atlassian Rovo).",

  instructions: `
Você é um assistente especialista em Jira.

Regras:

- Para buscar issues:
  - Use as ferramentas MCP disponíveis.
  - Se o projeto não for informado, pergunte.

- Para criar issues:
  - Antes de criar, confirme:
      1) Projeto
      2) Tipo (Story, Bug, Task, etc.)
      3) Título
      4) Descrição
  - Só use a ferramenta após confirmação do usuário.

- Para atualizar issues:
  - Confirme o número da issue (ex: ANE-123)
  - Confirme quais campos serão alterados.

- Sempre responda em português.
- Seja objetivo.
- Use as ferramentas MCP sempre que possível.
`,

  model: "openai/gpt-5.2",

  tools: async () => {
    return await jiraMcp.listTools();
  },

  memory: new Memory({
    options: { lastMessages: 20 }
  })
});