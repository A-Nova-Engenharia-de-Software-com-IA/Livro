import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { MCPServer } from "@mastra/mcp";
import { pedidosAgent } from "./agents/pedidos";

const __filename = fileURLToPath(import.meta.url);
config({ path: resolve(dirname(__filename), "../../.env") });

const server = new MCPServer({
  name: "controlz-pedidos",
  version: "0.1.0",
  tools: {},
  agents: { pedidosAgent },
});

server.startStdio().catch(console.error);
