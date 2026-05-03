import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { notificacoesAgent } from "./agents/notificacoes";

export const mastra = new Mastra({
  agents: { notificacoesAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
