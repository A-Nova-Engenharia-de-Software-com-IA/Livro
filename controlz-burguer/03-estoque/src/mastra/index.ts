import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { estoqueAgent } from "./agents/estoque";

export const mastra = new Mastra({
  agents: { estoqueAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
