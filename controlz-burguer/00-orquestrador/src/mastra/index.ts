import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { orquestradorAgent } from "./agents/orquestrador";

export const mastra = new Mastra({
  agents: { orquestradorAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:./mastra.db" }),
});
