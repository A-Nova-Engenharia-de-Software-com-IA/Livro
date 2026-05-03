# ControlZ Burger — Monorepo de Microserviços com Mastra.ai

Projeto hands-on da palestra **Ctrl+Z**: 12 microserviços independentes que juntos formam uma hamburgueria fictícia operada por linguagem natural via Claude Code + MCP.

Cada projeto é um agente Mastra com TypeScript, expõe suas tools via servidor MCP stdio e pode ser conectado ao Claude Code em segundos.

---

## Os 12 Microserviços

| # | Projeto | Agente | Responsabilidade |
|---|---------|--------|-----------------|
| 01 | `01-cardapio` | `cardapioAgent` | CRUD do cardápio (produtos, preços, categorias) |
| 02 | `02-pedidos` | `pedidosAgent` | Criação e acompanhamento de pedidos |
| 03 | `03-estoque` | `estoqueAgent` | Controle de insumos e alertas de estoque mínimo |
| 04 | `04-cliente` | `clienteAgent` | Cadastro de clientes e preferências (CRM) |
| 05 | `05-cozinha` | `cozinhaAgent` | Fila de produção e carga da cozinha |
| 06 | `06-entregador` | `entregadorAgent` | Atribuição de motoboys e rastreio de entrega |
| 07 | `07-pagamentos` | `pagamentosAgent` | Pix e cartão (mock) + estornos |
| 08 | `08-promocoes` | `promocoesAgent` | Cupons, happy hour e regras de desconto |
| 09 | `09-avaliacoes` | `avaliacoesAgent` | Reviews, sentimento com LLM e NPS |
| 10 | `10-relatorios` | `relatoriosAgent` | Analytics de vendas e resumo executivo com LLM |
| 11 | `11-notificacoes` | `notificacoesAgent` | WhatsApp e e-mail (mock) com templates |
| 12 | `12-marketing` | `marketingAgent` | Posts, copies e campanhas gerados por LLM |

---

## Pré-requisitos

- Node.js 20+
- Uma `OPENAI_API_KEY` válida

---

## Como rodar um projeto

```bash
cd 01-cardapio
npm install
cp .env.example .env   # cole sua OPENAI_API_KEY
npm run dev            # abre o playground Mastra no navegador
```

Para subir o servidor MCP (modo stdio):

```bash
npm run mcp
```

---

## Conectar TODOS os 12 servidores MCP no Claude Code

Edite o arquivo `~/.claude.json` (ou `claude_desktop_config.json` dependendo da versão) e adicione o bloco abaixo, **substituindo `/CAMINHO/PARA` pelo caminho absoluto desta pasta**:

```json
{
  "mcpServers": {
    "controlz-cardapio": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/01-cardapio",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-pedidos": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/02-pedidos",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-estoque": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/03-estoque",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-cliente": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/04-cliente",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-cozinha": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/05-cozinha",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-entregador": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/06-entregador",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-pagamentos": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/07-pagamentos",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-promocoes": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/08-promocoes",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-avaliacoes": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/09-avaliacoes",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-relatorios": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/10-relatorios",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-notificacoes": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/11-notificacoes",
      "env": { "OPENAI_API_KEY": "sk-..." }
    },
    "controlz-marketing": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/CAMINHO/PARA/12-marketing",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```

> **Dica:** gere o caminho absoluto rodando `pwd` dentro de qualquer uma das pastas.

---

## Prompts de orquestração multi-agente

Após conectar todos os MCPs, experimente no Claude Code:

**Fluxo completo de pedido:**
> "Cadastra o cliente João Silva no telefone 11999990001. Cria um pedido pra ele com 1 X-Bacon (R$29,90) e 1 Coca-Cola (R$7,00). Cobra no Pix. Manda o pedido pra cozinha. Avisa o João no WhatsApp que o pedido foi recebido."

**Análise do negócio:**
> "Gera um relatório dos últimos 30 dias: faturamento, top 5 produtos e NPS. Depois escreve um resumo executivo."

**Operação de marketing:**
> "Cria um cupom FOME20 de 20% off válido até o fim do mês e gera um post pro Instagram anunciando ele."

**Gestão de estoque:**
> "Lista os insumos com estoque crítico e sugere o que precisa ser reposto."

---

## Stack

- **Runtime:** Node.js 20+, TypeScript estrito
- **Framework:** [Mastra.ai](https://mastra.ai) (`@mastra/core`, `@mastra/mcp`, `@mastra/libsql`)
- **LLM:** OpenAI GPT-4o-mini via `@ai-sdk/openai`
- **Persistência:** LibSQL local (`mastra.db`) por projeto
- **Validação:** Zod em todas as tools

---

## Estrutura de cada projeto

```
0X-nome/
├── src/mastra/
│   ├── index.ts          # instância Mastra + LibSQLStore
│   ├── store.ts          # estado em memória (demo)
│   ├── mcp.ts            # servidor MCP stdio
│   ├── agents/<nome>.ts  # agente principal
│   └── tools/*.ts        # 3 a 5 tools com Zod
├── package.json
├── tsconfig.json
└── .env.example
```
