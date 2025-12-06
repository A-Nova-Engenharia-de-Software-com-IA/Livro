# Princípios de Construção de Agentes de IA

Este repositório contém exemplos práticos e projetos relacionados aos princípios fundamentais para construir agentes de inteligência artificial, baseados no livro de referência sobre o tema.

## 📚 Conteúdo

### Parte 1: Como Orientar um Modelo de Linguagem (LLM)

- **Uma Breve História das LLMs**
- **Escolhendo um Provedor e um Modelo**
  - Hosted vs open-source
  - Tamanho do modelo: acurácia vs custo/latência
  - Tamanho da janela de contexto
  - Modelos de raciocínio
  - Provedores e modelos (maio de 2025)
- **Como Escrever Bons Prompts**
  - Dê mais exemplos ao LLM
  - A abordagem de "cristal semente"
  - Use o system prompt
  - Truques estranhos de formatação
  - **[Exemplo: um ótimo prompt](./parte-1/prompts/)**

### Parte 2: Construindo um Agente

- **Agentes**
  - Níveis de Autonomia
  - ✅ **[Exemplo de Código](./parte-2/agentes/)**
- **Roteamento de Modelos e Saída Estruturada**
  - Saída estruturada
  - ✅ **[Exemplo de Código](./parte-2/roteamento-de-modelos/)**
- **Uso de Ferramentas (Tool Calling)**
  - Como projetar suas ferramentas: o passo mais importante
  - Exemplo real: o agente de recomendação de livros da Alana
- **Memória do Agente**
  - Memória de trabalho
  - Memória hierárquica
  - Processadores de memória
  - TokenLimiter
  - ToolCallFilter
- **Agentes Dinâmicos**
  - O que são agentes dinâmicos?
  - Exemplo: criando um agente dinâmico
  - Middleware de agente
- **Middleware de Agente**
  - Guardrails
  - Autenticação e autorização do agente

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

### Parte 4: Workflow Baseados em Grafos

- **Workflows**
- **Ramificação, Encadeamento, Mesclagem e Condições**
  - Ramificação
  - Encadeamento (Chaining)
  - Mesclagem (Merging)
  - Condições
  - Boas práticas e notas
- **Suspender e Retomar**
- **Atualizações via Streaming**
  - Como fazer streaming dentro de funções
  - Por que streaming importa
  - Como construir
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

### Parte 6: Sistemas Multiagentes

- **Multi-Agente**
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
- **Outros Tipos de Evals**
  - Evals de Classificação ou Rotulagem
  - Evals de Uso de Ferramentas por Agentes
  - Evals de Engenharia de Prompt
  - Testes A/B
  - Revisão de dados por humanos

### Parte 8: Desenvolvimento & Deployment

- **Desenvolvimento Local**
  - Construindo um frontend web agentivo
  - Construindo um backend de agentes
- **Deployment**
  - Desafios de deployment
  - Uso de plataformas gerenciadas

### Parte 9: Outros Assuntos

- **Multimodal**
  - Geração de Imagens
  - Casos de uso
  - Voz
  - Vídeo
- **Geração de Código**
- **O Que Vem a Seguir**

## 🚀 Começando

Cada pasta contém exemplos práticos e documentação específica sobre os tópicos abordados. Explore as pastas para ver implementações reais dos conceitos apresentados.
