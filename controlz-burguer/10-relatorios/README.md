# 10 - Relatórios

Agente de analytics da ControlZ Burger. Gera relatórios de vendas, produtos mais vendidos, horários de pico e resumos executivos usando LLM. Vem com 50 pedidos fake pré-carregados.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Quais os 5 produtos mais vendidos nos últimos 30 dias?"
- "Qual foi o faturamento da última semana?"
- "Gera um resumo executivo dos últimos 30 dias para a diretoria"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "relatorios": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/10-relatorios",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
