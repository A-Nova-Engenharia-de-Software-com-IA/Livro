# 08 - Promoções

Agente de promoções da ControlZ Burger. Gerencia cupons de desconto, valida códigos no checkout e controla regras de happy hour e promoções por horário.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Cria um cupom CTRL20 com 20% de desconto válido até 2025-12-31"
- "Valida o cupom CTRL10 para um pedido de R$45,00"
- "Cria uma regra de 15% off nos lanches toda quarta das 18h às 20h"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "promocoes": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/08-promocoes",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
