# 03 - Estoque

Agente responsável por controlar o estoque de insumos da ControlZ Burger, gerenciando entradas, saídas e alertas de estoque mínimo.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Mostra todos os insumos com estoque crítico"
- "Adiciona 20 unidades de CARNE-180G ao estoque"
- "Define o estoque mínimo do PAO-BRIOCHE para 20 unidades"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "estoque": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/03-estoque",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
