import { Mastra } from "@mastra/core";
import { weatherAgent } from "./agents/weather-agent";
import { clickupAgent } from "./agents/clickup-agent";
import { clickupSlackGeneral } from "./agents/clickup-slack-general";
import { slackAgent } from "./agents/slack-agent";
import { LibSQLStore } from "@mastra/libsql";
import { clickupToCsvWorkflow } from "./workflows/clickup-email-workflow";
import { slackMcpServer } from "./mcp/slack-server";
import { opsOrchestratorAgent } from "./agents/ops-orchestrator-agent";
import { emailAgent } from "./agents/email-agent";
import { searchAgent } from "./agents/search-agent";
import { whatsappAgent } from "./agents/whatsapp-twilio-agent";
import { anestechPreopAgent } from "./agents/anestech-preop-agent";
import { anestechIntentAgent } from "./agents/anestech-intent-agent";
import { anestechPreWebhookRoute, downloadPdfRoute } from "./server/anestech-pre-twilio-route";
import { jiraAgent } from "./agents/jira-agent";


export const mastra: Mastra = new Mastra({
  agents: { weatherAgent, clickupAgent, slackAgent, clickupSlackGeneral, 
    opsOrchestratorAgent, emailAgent, searchAgent, whatsappAgent, anestechPreopAgent, 
    anestechIntentAgent, jiraAgent },
  storage: new LibSQLStore({
    id: "libsql-storage",
    url: "file:./storage.db",
  }),
  workflows: { clickupToCsvWorkflow },
  mcpServers: { slackMcpServer },
  server: {
    apiRoutes: [anestechPreWebhookRoute, downloadPdfRoute],
  },
});
