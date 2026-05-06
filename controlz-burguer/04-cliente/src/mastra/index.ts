import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { clienteAgent } from "./agents/cliente";

export const mastra = new Mastra({
  agents: { clienteAgent },
    storage: new LibSQLStore({ id: "libsql", url: "file:/Users/rafaelscheidt/foka/projects/personal/flutter-aula/estudos/Livro/controlz-burguer/database/mastra.db" }),
});
