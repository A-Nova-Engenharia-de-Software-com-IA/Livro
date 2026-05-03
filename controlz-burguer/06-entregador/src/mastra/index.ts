import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { entregadorAgent } from "./agents/entregador";

export const mastra = new Mastra({
  agents: { entregadorAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
