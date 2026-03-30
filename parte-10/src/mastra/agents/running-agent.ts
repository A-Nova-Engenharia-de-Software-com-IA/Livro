import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { runningEventsTool } from "../tools/running-events-tool";

export const runningAgent = new Agent({
  id: "running-events-agent",

  name: "Running Events Assistant",

  instructions: `
Você ajuda usuários a encontrar corridas de rua.

Regras:

- Sempre use a ferramenta running-events-tool para buscar as corridas.
- Liste os eventos encontrados.
- Se o usuário pedir um mês específico, filtre os resultados.
- Mostre data, nome da corrida e cidade.

Exemplos de perguntas:

- "Quais corridas tem em março?"
- "Liste corridas em abril"
- "Quais corridas tem em Santa Catarina?"
`,

  model: "openai/gpt-5.2",

  tools: {
    runningEventsTool
  },

  memory: new Memory({
    options: {
      lastMessages: 20
    }
  })
});