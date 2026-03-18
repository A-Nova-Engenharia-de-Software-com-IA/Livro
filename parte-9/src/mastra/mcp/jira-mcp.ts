import { MCPClient } from "@mastra/mcp";

export const jiraMcp = new MCPClient({
  servers: {
    jira: {
      command: "npx",
      args: [
        "-y",
        "mcp-remote",
        "https://mcp.atlassian.com/v1/mcp"
      ],
      env: {
        MCP_REMOTE_HEADERS: JSON.stringify({
          Authorization: `Basic ${process.env.JIRA_BASIC}`
        })
      }
    }
  }
});