import { MCPServer } from "@mastra/mcp";
import { slackSendMessage, slackListChannels, slackSendDM } from "../tools/slack-tool";
import { slackAgent } from "../agents/slack-agent";

export const slackMcpServer = new MCPServer({
  id: "slack-mcp-server",
  name: "Slack MCP Server",
  version: "1.0.0",
  description: "Expondo ferramentas do Slack e o agente Slack via MCP.",
  instructions:
    "Use as ferramentas para listar canais, enviar mensagens e interagir com o Slack. Você também pode usar a ferramenta gerada ask_slackAgent para conversar com o agente.",
  tools: { slackSendMessage, slackSendDM, slackListChannels },
  agents: { slackAgent },
});
