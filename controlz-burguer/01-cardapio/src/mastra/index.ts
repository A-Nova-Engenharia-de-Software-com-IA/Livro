import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { cardapioAgent } from "./agents/cardapio";

export const mastra = new Mastra({
  agents: { cardapioAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
