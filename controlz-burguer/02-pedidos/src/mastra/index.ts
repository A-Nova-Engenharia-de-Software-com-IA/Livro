import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { pedidosAgent } from "./agents/pedidos";

export const mastra = new Mastra({
  agents: { pedidosAgent },
    storage: new LibSQLStore({ id: "libsql", url: "file:/Users/rafaelscheidt/foka/projects/personal/flutter-aula/estudos/Livro/controlz-burguer/database/mastra.db" }),
});
