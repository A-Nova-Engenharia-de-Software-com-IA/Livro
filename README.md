# Princípios de Construção de Agentes de IA

Este repositório contém exemplos práticos e projetos relacionados aos princípios fundamentais para construir agentes de inteligência artificial, baseados no livro de referência sobre o tema.

## 📚 Conteúdo

### Parte 1: Como Orientar um Modelo de Linguagem (LLM)

- **Uma Breve História das LLMs**
- **Escolhendo um Provedor e um Modelo**
- **Como Escrever Bons Prompts**
  - **[Exemplo: um ótimo prompt](./parte-1/prompts/README.md)**

### Parte 2: Construindo um Agente

- **Agentes**
  - ✅ **[Exemplo de Código](./parte-2/agentes/)**
- **Roteamento de Modelos e Saída Estruturada**
  - ✅ **[Exemplo de Código](./parte-2/roteamento-de-modelos/)**
- **Uso de Ferramentas (Tool Calling)**
  - ✅ **[Exemplo de código](./parte-2/chamada-de-ferramentas/)**
- **Memória do Agente**
  - ✅ **[Exemplo de código](./parte-2/memoria-do-agente/)**
- **Agentes Dinâmicos**
  - ✅ **[Exemplo de código](./parte-2/agentes-dinamicos/)**
- **Middleware de Agente**
  - Guardrails
  - Autenticação e autorização do agente
  - ✅ **[Exemplo de código](./parte-2/middleware-de-agente/)**

### Parte 3: Ferramentas (Tools) e MCP

- **Principais Ferramentas de Terceiros**
  - Web scraping & uso de computador
  - Integrações de terceiros
- **Model Context Protocol (MCP): Conectando Agentes e Ferramentas**
  - O que é MCP
  - Primitivas do MCP
  - O ecossistema MCP
  - Quando usar MCP
  - Construindo um Servidor e Cliente MCP
  - O futuro do MCP
  - ✅ **[Exemplo de código](./parte-3/mcp/)**

### Parte 4: Workflow Baseados em Grafos

- **Workflows**
- **Ramificação, Encadeamento, Mesclagem e Condições**
  - Ramificação
  - Encadeamento (Chaining)
  - Mesclagem (Merging)
  - Condições
  - Boas práticas e notas
  - ✅ **[Exemplo de código](./parte-4/workflows/)**
- **Suspender e Retomar**
  - ✅ **[Exemplo de código](./parte-4/suspender-e-continuar/)**
- **Atualizações via Streaming**
  - Como fazer streaming dentro de funções
  - Por que streaming importa
  - Como construir
  - ✅ **[Exemplo de código](./parte-4/streaming/)**
- **Observabilidade e Tracing**
  - Observabilidade
  - Tracing
  - Evals
  - Notas finais sobre observabilidade e tracing

### Parte 5: Retrieval-Augmented Generation (RAG)

- **RAG**
- **Escolhendo um Banco de Vetores**
- **Configurando seu Pipeline RAG**
  - Chunking
  - Embedding
  - Upsert
  - Indexação
  - Query
  - Reranking
  - Exemplo de Código
- **Alternativas ao RAG**
  - RAG com Agentes (Agentic RAG)
  - Geração Aumentada por Raciocínio (ReAG)
  - Carregamento de Contexto Completo
- ✅ **[Exemplo de código](./parte-5/rag/)**

### Parte 6: Sistemas Multiagentes

- **Multi-Agente**
  - ✅ **[Exemplo de código](./parte-6/multi-agentes/)**
- **Supervisor de Agentes**
- **Fluxo de Controle**
- **Workflows como Ferramentas**
- **Combinando os Padrões**
- **Padrões de Multi-Agente**
  - Como o A2A funciona
  - A2A vs. MCP

### Parte 7: Evals

- **Evals**
- **Evals Textuais**
  - Acurácia e confiabilidade
  - Entendimento de contexto
  - Saída
  - Exemplo de Código
- ✅ **[Exemplo de código](./parte-7/avaliacao-textual/)**

## 🚀 Começando

Cada pasta contém exemplos práticos e documentação específica sobre os tópicos abordados. Explore as pastas para ver implementações reais dos conceitos apresentados.


### PARTE 8: AGENTES (PARTE-8-AGENTES)
Resumo: Esta parte reúne exemplos práticos de agentes (processos capazes de tomar decisões e chamar ferramentas) usados em projetos reais. Os exemplos demonstram como orquestrar chamadas a APIs, integrar com Slack/ClickUp, enviar emails e compor workflows usando o MCP e pequenas ferramentas locais.

Arquivos chave:

clickup-agent.ts — agente que consulta e processa dados do ClickUp.
clickup-slack-general.ts — conecta ClickUp com Slack.
email-agent.ts — agente para envio de relatórios por email.
ops-orchestrator-agent.ts — orquestrador de operações entre agentes.
search-agent.ts — agente de busca e indexação.
slack-agent.ts — integração e envio de mensagens no Slack.
weather-agent.ts — consulta APIs de clima.
Ferramentas de exemplo (callers):

call-clickup-agent.ts
call-email-agent.ts
call-search-agent.ts
call-slack-agent.ts
Workflows relacionados:

clickup-email-workflow.ts
steps — passos reutilizáveis (fetch, save, enviar email/slack).
Como executar (rápido):

Instale dependências: pnpm install ou npm install.
Ajuste as variáveis de ambiente em .env.
Execute um exemplo de ferramenta (ex.: chamar o agente ClickUp):
pnpm tsx src/mastra/tools/call-clickup-agent.ts (ou npx ts-node-esm src/mastra/tools/call-clickup-agent.ts).
Variáveis de ambiente importantes: configure o arquivo .env com as chaves necessárias antes de executar:

OPENAI_API_KEY
CLICKUP_API_KEY, CLICKUP_TEAM_ID, CLICKUP_LIST_ID
SLACK_BOT_TOKEN, SLACK_WORKSPACE_ID, SLACK_CHANNEL_ID
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, REPORT_EMAIL_TO