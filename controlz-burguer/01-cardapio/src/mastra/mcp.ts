import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { MCPServer } from "@mastra/mcp";
import { cardapioAgent } from "./agents/cardapio";

const __filename = fileURLToPath(import.meta.url);
config({ path: resolve(dirname(__filename), "../../.env") });

const server = new MCPServer({
  name: "controlz-cardapio",
  version: "0.1.0",
  tools: {},
  agents: { cardapioAgent },
});

server.startStdio().catch(console.error);
