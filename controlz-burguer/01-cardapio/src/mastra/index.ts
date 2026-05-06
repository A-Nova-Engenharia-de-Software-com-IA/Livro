import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { cardapioAgent } from "./agents/cardapio";

export const mastra = new Mastra({
  agents: { cardapioAgent },
  storage: new LibSQLStore({ id: "libsql", url: "file:/Users/rafaelscheidt/foka/projects/personal/flutter-aula/estudos/Livro/controlz-burguer/database/mastra.db" }),
});
