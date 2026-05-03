import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { relatoriosAgent } from "./agents/relatorios";

export const mastra = new Mastra({
  agents: { relatoriosAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
