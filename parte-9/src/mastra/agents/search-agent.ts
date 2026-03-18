import { openai } from '@ai-sdk/openai'
import { Agent } from '@mastra/core/agent'
import { Memory } from "@mastra/memory";

export const searchAgent = new Agent({
  id: 'search-agent',
  name: 'Search Agent',
  instructions: 'Você é um agente de pesquisa na web por temas que for perguntado. Use a ferramenta de webSearch para obter informações atualizadas e relevantes. Responda em português.',
  model: 'openai/gpt-5.2',
  tools: {
    webSearch: openai.tools.webSearch(),
  },
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
})