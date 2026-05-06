import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { cardapioTool } from "../tools/cardapio";
import { pedidosTool } from "../tools/pedidos";
import { estoqueTool } from "../tools/estoque";
import { clienteTool } from "../tools/cliente";
import { cozinhaTool } from "../tools/cozinha";
import { entregadorTool } from "../tools/entregador";
import { pagamentosTool } from "../tools/pagamentos";
import { promocoesTool } from "../tools/promocoes";
import { avaliacoesTool } from "../tools/avaliacoes";
import { relatoriosTool } from "../tools/relatorios";
import { notificacoesTool } from "../tools/notificacoes";
import { marketingTool } from "../tools/marketing";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { DB_URL } from "../db-url";

export const orquestradorAgent = new Agent({
  id: "orquestrador-agent",
  name: "orquestradorAgent",
  description: "Orquestra todos os sistemas da ControlZ Burger: cardápio, pedidos, estoque, clientes, cozinha, entregas, pagamentos, promoções, avaliações, relatórios, notificações e marketing.",
  instructions: `Você é o gerente geral da ControlZ Burger e tem acesso a todos os sistemas do restaurante.

Você pode:
- Gerenciar o cardápio (criar, listar, atualizar produtos)
- Criar e acompanhar pedidos
- Controlar o estoque de insumos
- Cadastrar e consultar clientes
- Monitorar a cozinha e filas de preparo
- Gerenciar entregas e entregadores
- Processar e consultar pagamentos
- Criar e gerenciar promoções
- Analisar avaliações dos clientes
- Gerar relatórios de desempenho
- Enviar notificações
- Criar campanhas de marketing

Ao receber uma solicitação, identifique quais sistemas precisam ser acionados e coordene as chamadas na ordem correta.
Seja proativo: se um pedido for criado, verifique o estoque e notifique a cozinha automaticamente.
Responda sempre em português, de forma clara e organizada.`,
  model: openai("gpt-4o-mini"),
  tools: {
    cardapio: cardapioTool,
    pedidos: pedidosTool,
    estoque: estoqueTool,
    cliente: clienteTool,
    cozinha: cozinhaTool,
    entregador: entregadorTool,
    pagamentos: pagamentosTool,
    promocoes: promocoesTool,
    avaliacoes: avaliacoesTool,
    relatorios: relatoriosTool,
    notificacoes: notificacoesTool,
    marketing: marketingTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({ id: "libsql", url: DB_URL }),
  }),
});
