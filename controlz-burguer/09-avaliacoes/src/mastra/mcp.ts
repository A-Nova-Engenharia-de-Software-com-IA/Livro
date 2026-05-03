import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { MCPServer } from "@mastra/mcp";
import { avaliacoesAgent } from "./agents/avaliacoes";

const __filename = fileURLToPath(import.meta.url);
config({ path: resolve(dirname(__filename), "../../.env") });

const server = new MCPServer({
  name: "controlz-avaliacoes",
  version: "0.1.0",
  tools: {},
  agents: { avaliacoesAgent },
});

server.startStdio().catch(console.error);
