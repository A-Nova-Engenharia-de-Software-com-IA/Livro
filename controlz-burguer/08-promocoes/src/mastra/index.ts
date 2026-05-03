import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { promocoesAgent } from "./agents/promocoes";

export const mastra = new Mastra({
  agents: { promocoesAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
