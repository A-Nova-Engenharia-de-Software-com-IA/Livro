import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { orquestradorAgent } from "./agents/orquestrador";
import { DB_URL } from "./db-url";

export const mastra = new Mastra({
  agents: { orquestradorAgent },
  storage: new LibSQLStore({ id: "libsql", url: DB_URL }),
});
