import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { chargePixTool } from "../tools/chargePix";
import { chargeCardTool } from "../tools/chargeCard";
import { listTransactionsTool } from "../tools/listTransactions";
import { refundTool } from "../tools/refund";

export const pagamentosAgent = new Agent({
  name: "pagamentosAgent",
  description: "Processa pagamentos e estornos da ControlZ Burger (Pix e cartão).",
  instructions: `Você é o operador de pagamentos da ControlZ Burger.
Processe pagamentos via Pix (QR Code) ou cartão de crédito/débito.
Em caso de falha no cartão, sugira tentar novamente ou usar Pix.
Para estornos, confirme o valor e o motivo antes de processar.
Mantenha um registro claro de todas as transações.`,
  model: openai("gpt-4o-mini"),
  tools: {
    chargePix: chargePixTool,
    chargeCard: chargeCardTool,
    listTransactions: listTransactionsTool,
    refund: refundTool,
  },
});
