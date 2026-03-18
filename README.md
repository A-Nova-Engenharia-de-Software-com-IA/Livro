# A Nova Engenharia de Software com IA

> **Autores:** Rafael de Faria Scheidt ("Foka") e Johnatan Ricardo Martins — [softwarewith.io](https://softwarewith.io/)

Este repositório contém os exemplos práticos do livro **"A Nova Engenharia de Software com IA"** — um guia técnico e estratégico sobre como projetar e operar sistemas inteligentes baseados em agentes de IA, desde os fundamentos de prompting até arquiteturas generativas de nível produtivo.

A chegada dos LLMs e da IA orientada por agentes rompeu o padrão tradicional de desenvolvimento de software. Não falamos mais de softwares que apenas executam comandos — mas de sistemas capazes de interpretar intenção, planejar, tomar decisões, usar ferramentas externas e se adaptar em tempo real. O papel do engenheiro muda: menos execução manual e mais arquitetura, governança, integração, observabilidade e qualidade.

Este livro nasce dessa virada e de uma experiência prática em projetos críticos de saúde, tecnologia e transformação digital. Se você é desenvolvedor, gestor, líder técnico, empreendedor ou estrategista, este livro foi escrito para ajudar você a sair da teoria e começar a usar a inteligência artificial como uma força concreta de transformação.

---

## 📚 Conteúdo

### Parte 1: Como Orientar um Modelo de Linguagem (LLM)

- **Uma Breve História das LLMs**
- **Escolhendo um Provedor e um Modelo**
  - Hosted vs open-source
  - Tamanho do modelo: acurácia vs custo/latência
  - Tamanho da janela de contexto e modelos de raciocínio
- **Como Escrever Excelentes Prompts**
  - Técnicas básicas de prompt
  - System prompt e truques de formatação
  - ✅ **[Exemplo: um excelente prompt](./parte-1/prompts/README.md)**

### Parte 2: Construindo um Agente

- **Agentes**
  - Níveis de autonomia e definição de papel
  - ✅ **[Exemplo de Código](./parte-2/agentes/)**
- **Roteamento de Modelos e Saída Estruturada**
  - Estratégias de roteamento e saída estruturada
  - ✅ **[Exemplo de Código](./parte-2/roteamento-de-modelos/)**
- **Chamada de Ferramentas (Tool Calling)**
  - Boas práticas
  - ✅ **[Exemplo de Código](./parte-2/chamada-de-ferramentas/)**
- **Memória do Agente**
  - Hierarquia de memória e processadores
  - Estratégias de controle e recuperação
  - ✅ **[Exemplo de Código](./parte-2/memoria-do-agente/)**
- **Agentes Dinâmicos**
  - Agente estático vs dinâmico, principais tipos e aplicações
  - ✅ **[Exemplo de Código](./parte-2/agentes-dinamicos/)**
- **Middleware de Agente**
  - Guardrails, autenticação e autorização do agente
  - ✅ **[Exemplo de Código](./parte-2/middleware-de-agente/)**

### Parte 3: Ferramentas (Tools) e MCP

- **Ferramentas de Terceiros**
  - Web scraping, uso de computador e integrações de terceiros
  - Boas práticas para integrar ferramentas de terceiros em agentes
- **Model Context Protocol (MCP): Conectando Agentes e Ferramentas**
  - Arquitetura cliente-servidor
  - Componentes principais e ecossistema MCP
    - ✅ **[Componentes Principais](./parte-3/mcp/componentes-principais/)**
  - Quando usar MCP, diferenças entre Tool Calling e MCP
- ✅ **[Exemplo Prático](./parte-3/mcp/exemplo-pratico/)**

### Parte 4: Workflows Baseados em Grafos

- **Workflows**
  - ✅ **[Exemplo de Código](./parte-4/workflows/)**
- **Ramificação, Encadeamento, Convergência e Condições**
  - ✅ **[Ramificação (Branching)](./parte-4/workflows/branching/)**
  - ✅ **[Encadeamento (Chaining)](./parte-4/workflows/chaining/)**
  - ✅ **[Convergência (Merging)](./parte-4/workflows/merging/)**
  - Condições
- **Suspender e Retomar**
  - O que é suspender e continuar, benefícios e quando usar
  - ✅ **[Exemplo de Código](./parte-4/suspender-e-continuar/)**
- **Atualizações em Tempo Real (Streaming)**
  - Streaming em ferramentas e benefícios do streaming
  - ✅ **[Exemplo de Código](./parte-4/streaming/)**
- **Observabilidade e Rastreamento**
  - Observabilidade, tracing, evals e notas finais

### Parte 5: Retrieval-Augmented Generation (RAG)

- **RAG**
  - Como funciona e quando usar
- **Escolhendo um Banco de Dados Vetorial**
  - O cenário atual do mercado e recomendação prática
- **Configurando seu Pipeline RAG**
  - Chunking, Embedding, Upsert, Indexação, Query, Reranking
- **Alternativas ao RAG**
  - RAG orientado a Agentes (Agentic RAG)
  - Reasoning-Augmented Generation (ReAG)
  - Carregamento de Contexto Completo
- ✅ **[Exemplo de Código](./parte-5/rag/)**

### Parte 6: Sistemas Multiagentes

- **Multi-Agente**
  - Papéis diferentes, competências diferentes
  - O paralelo com o mundo corporativo
  - ✅ **[Exemplo de Código](./parte-6/multi-agentes/)**
- **Agente Supervisor**
  - Fluxo de delegação e consolidação de respostas
- **Fluxo de Controle**
- **Fluxo de Trabalho com Ferramentas**
  - Quando uma única chamada não é suficiente
- **Combinando os Padrões**
  - O papel estratégico do agente de planejamento
- **Padrões de Multi-Agente (A2A)**
  - Como o protocolo A2A funciona
  - A2A vs. MCP

### Parte 7: Evals

- **Evals: Como Medir a Qualidade**
- **Avaliação Textual**
  - Precisão e confiabilidade da resposta
  - Uso correto do contexto
  - Avaliação da forma da resposta (Output Quality)
- ✅ **[Exemplo de Código](./parte-7/avaliacao-textual/)**

### Parte 8: Sistemas Generativos

- **A Nova Era de Sistemas Inteligentes**
  - Do software pré-definido ao software generativo
  - A lógica muda: o sistema deixa de ser um produto e se torna um organismo vivo
- **A Importância dos Sistemas Generativos**
  - Startups, empresas de médio e grande porte
  - O insight que pouca gente fala (mas muda tudo): 80% do backlog nunca é entregue
- **Projetando Sistemas Inteligentes**
  - Nada é fixo — tudo é metadado
  - Engines de regras, renderizadores universais, versionamento automático de estrutura
  - O futuro do design de software: sistemas que se moldam ao usuário

### Parte 9: Construindo Agentes — Exemplo Prático

Um sistema completo de agentes inteligentes construído com **[Mastra](https://mastra.ai/)**, integrando diversas plataformas e ferramentas para automatização e orquestração de tarefas reais.

- **Um Framework Para Construção de Agentes com Mastra.AI**
  - Workflows baseados em grafos, human-in-the-loop, gestão de contexto e memória
- **Agentes no Mastra — Ambiente de Desenvolvimento**
  - Mastra Studio: experimentação, observabilidade e rastreabilidade
  - Visualização de workflows, teste isolado de ferramentas
- **Conectando Seu Agente ao Mastra via MCP**
  - Servidor MCP, cliente MCP e agente Mastra integrados

**Agentes disponíveis no exemplo:**

| Agente                        | Descrição                                              |
| ----------------------------- | ------------------------------------------------------ |
| Intent Classifier             | Classifica intenções do usuário em contexto médico     |
| Pré-operatório (Áudio → JSON) | Converte relatos transcritos em JSON estruturado       |
| ClickUp Assistant             | Gerencia apontamentos de horas e tarefas no ClickUp    |
| Email Assistant               | Redige e envia e-mails via SMTP com confirmação prévia |
| Search Agent                  | Realiza buscas na web para informações atualizadas     |
| Slack Assistant               | Envia mensagens e gerencia canais/usuários no Slack    |
| Weather Agent                 | Fornece informações de clima para localidades          |
| WhatsApp Assistant            | Envia mensagens via WhatsApp usando Twilio             |
| Operations Orchestrator       | Orquestra fluxos multi-sistema entre agentes           |
| Operations Assistant          | Integra Slack e ClickUp para relatórios operacionais   |

- ✅ **[Exemplo de Código](./parte-9/)**

---

## 🚀 Começando

Cada pasta contém exemplos práticos e documentação específica sobre os tópicos abordados. Explore as pastas para ver implementações reais dos conceitos apresentados.

### Pré-requisitos

- Python 3.10+ (para exemplos das Partes 1–7)
- Node.js 18+ e npm/pnpm (para a Parte 9 com Mastra)
- Chave de API da OpenAI (`OPENAI_API_KEY`)

### Estrutura do Repositório

```
AI/
├── parte-1/           # Prompting e orientação de LLMs
├── parte-2/           # Agentes, ferramentas, memória e middleware
├── parte-3/           # MCP e ferramentas de terceiros
├── parte-4/           # Workflows, streaming e observabilidade
├── parte-5/           # RAG e pipelines de conhecimento
├── parte-6/           # Sistemas multiagentes
├── parte-7/           # Evals e avaliação de qualidade
└── parte-9/           # Exemplo prático completo com Mastra (Parte 9 do livro)
```

Consulte o `README.md` de cada pasta para instruções detalhadas de execução.

---

## Conclusão

O futuro do desenvolvimento de software não será liderado por quem apenas consome IA — mas por quem **constrói, orquestra e integra agentes inteligentes** com segurança, escala e governança.

Este repositório é o complemento prático desse aprendizado. Cada exemplo foi construído para ser executado, explorado e adaptado à sua realidade. Da escrita de um bom prompt à arquitetura de sistemas generativos capazes de se auto-modificar — cada passo aqui representa uma habilidade concreta para a nova engenharia de software.

Bons estudos e boas construções.

---

## 👤 Autores

**Rafael de Faria Scheidt ("Foka")**

**Johnatan Ricardo Martins**

---

> Saiba mais em [softwarewith.io](https://softwarewith.io/)
