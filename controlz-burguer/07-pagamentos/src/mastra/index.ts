import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { pagamentosAgent } from "./agents/pagamentos";

export const mastra = new Mastra({
  agents: { pagamentosAgent },
    storage: new LibSQLStore({ id: "libsql", url: "file:/Users/rafaelscheidt/foka/projects/personal/flutter-aula/estudos/Livro/controlz-burguer/database/mastra.db" }),
});
