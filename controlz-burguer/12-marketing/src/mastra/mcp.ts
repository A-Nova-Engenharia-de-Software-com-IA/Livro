import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { MCPServer } from "@mastra/mcp";
import { marketingAgent } from "./agents/marketing";

const __filename = fileURLToPath(import.meta.url);
config({ path: resolve(dirname(__filename), "../../.env") });

const server = new MCPServer({
  name: "controlz-marketing",
  version: "0.1.0",
  tools: {},
  agents: { marketingAgent },
});

server.startStdio().catch(console.error);
