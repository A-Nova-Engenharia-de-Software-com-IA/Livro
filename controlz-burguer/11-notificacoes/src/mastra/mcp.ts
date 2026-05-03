import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { MCPServer } from "@mastra/mcp";
import { notificacoesAgent } from "./agents/notificacoes";

const __filename = fileURLToPath(import.meta.url);
config({ path: resolve(dirname(__filename), "../../.env") });

const server = new MCPServer({
  name: "controlz-notificacoes",
  version: "0.1.0",
  tools: {},
  agents: { notificacoesAgent },
});

server.startStdio().catch(console.error);
