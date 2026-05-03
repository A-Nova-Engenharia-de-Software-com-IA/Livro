import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { avaliacoesAgent } from "./agents/avaliacoes";

export const mastra = new Mastra({
  agents: { avaliacoesAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
