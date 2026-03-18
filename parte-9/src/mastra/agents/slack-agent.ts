import { Agent } from "@mastra/core/agent";
import { slackSendMessage, slackListChannels, slackSendDM, slackListUsers } from "../tools/slack-tool";
import { Memory } from "@mastra/memory";

export const slackAgent = new Agent({
  id: "slack-agent",
  name: "Slack Assistant",
  description: "Assistente do Slack que lista canais e envia mensagens usando Web API e MCP.",
  instructions: `
Você é um assistente que interage com o Slack usando as ferramentas disponíveis.

Regras:
- Use slackListChannels para listar canais.
- Use slackSendMessage para enviar mensagens para canais ou quando já tiver um channel ID.
- Use slackSendDM para enviar mensagens diretas (DM) para um usuário quando o usuário fornecer um user ID (U123...).
- Use slackListUsers para obter a lista de usuários do Slack.
- Se o usuário não informar canal ou usuário, pergunte antes de agir.
`,
  model: "openai/gpt-5.2",
  tools: {
    slackSendMessage,
    slackSendDM,     // 👈 novo
    slackListChannels,
    slackListUsers,
  },
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
});