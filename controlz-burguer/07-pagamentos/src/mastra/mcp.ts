import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { MCPServer } from "@mastra/mcp";
import { pagamentosAgent } from "./agents/pagamentos";

const __filename = fileURLToPath(import.meta.url);
config({ path: resolve(dirname(__filename), "../../.env") });

const server = new MCPServer({
  name: "controlz-pagamentos",
  version: "0.1.0",
  tools: {},
  agents: { pagamentosAgent },
});

server.startStdio().catch(console.error);
