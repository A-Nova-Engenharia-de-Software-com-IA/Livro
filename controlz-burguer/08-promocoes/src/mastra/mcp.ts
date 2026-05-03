import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { MCPServer } from "@mastra/mcp";
import { promocoesAgent } from "./agents/promocoes";

const __filename = fileURLToPath(import.meta.url);
config({ path: resolve(dirname(__filename), "../../.env") });

const server = new MCPServer({
  name: "controlz-promocoes",
  version: "0.1.0",
  tools: {},
  agents: { promocoesAgent },
});

server.startStdio().catch(console.error);
