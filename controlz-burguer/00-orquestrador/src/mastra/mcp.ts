import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { MCPServer } from "@mastra/mcp";
import { orquestradorAgent } from "./agents/orquestrador";
import "./index"; // instancia o Mastra e propaga o storage para o Memory do agente

const __filename = fileURLToPath(import.meta.url);
config({ path: resolve(dirname(__filename), "../../.env") });

const server = new MCPServer({
  name: "controlz-orquestrador",
  version: "0.1.0",
  tools: {},
  agents: { orquestradorAgent },
});

server.startStdio().catch(console.error);
