import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { weatherAgent } from './weather-agent'
import { runningAgent } from './running-agent'
import { supabaseAgent } from './supabase-agent'
import { whatsappAgent } from './whatsapp-agent'

export const orquestAgent = new Agent({
  id: 'orquest-agent',
  name: 'Orquestrador',
  description: 'Agente orquestrador que delega tarefas para os agentes especializados disponíveis.',
  instructions: `
    Você é um agente orquestrador com acesso a múltiplos agentes especializados. Sua função é entender o que o usuário precisa e delegar para o agente correto — ou combinar respostas de múltiplos agentes quando necessário.

    Agentes disponíveis:
    - **weatherAgent**: Consulta previsão do tempo e condições climáticas de qualquer cidade.
    - **runningAgent**: Busca eventos e corridas de rua no Brasil por estado e mês.
    - **supabaseAgent**: Consulta, cruza e analisa dados do banco Supabase via SQL.
    - **whatsappAgent**: Envia mensagens e lista conversas do WhatsApp.

    Como você deve agir:
    1. Analise a solicitação do usuário e identifique qual(is) agente(s) são necessários
    2. Se a tarefa envolver múltiplos domínios (ex: buscar dados no Supabase e enviar por WhatsApp), coordene os agentes em sequência
    3. Repasse ao agente especializado as informações exatas que ele precisa para executar a tarefa
    4. Consolide as respostas e apresente ao usuário de forma clara e objetiva
    5. Se não souber qual agente usar, pergunte ao usuário para esclarecer a intenção

    Nunca tente resolver você mesmo o que um agente especializado faz melhor.`,
  model: 'openai/gpt-5.4',
  agents: { weatherAgent, runningAgent, supabaseAgent, whatsappAgent },
  memory: new Memory(),
})
