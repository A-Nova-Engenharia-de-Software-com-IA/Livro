import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { pagamentosAgent } from "./agents/pagamentos";

export const mastra = new Mastra({
  agents: { pagamentosAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
