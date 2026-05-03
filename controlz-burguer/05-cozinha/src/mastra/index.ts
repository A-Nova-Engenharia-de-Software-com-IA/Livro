import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { cozinhaAgent } from "./agents/cozinha";

export const mastra = new Mastra({
  agents: { cozinhaAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
