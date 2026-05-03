import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { marketingAgent } from "./agents/marketing";

export const mastra = new Mastra({
  agents: { marketingAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
