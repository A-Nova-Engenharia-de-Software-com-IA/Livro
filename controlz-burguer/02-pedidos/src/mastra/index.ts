import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { pedidosAgent } from "./agents/pedidos";

export const mastra = new Mastra({
  agents: { pedidosAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
