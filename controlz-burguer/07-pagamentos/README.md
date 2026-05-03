# 07 - Pagamentos

Agente de pagamentos da ControlZ Burger. Processa cobranças via Pix (QR Code mock) e cartão (90% aprovação mock), além de gerenciar estornos.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Cobra R$55,80 via Pix para o pedido #123"
- "Processa pagamento de R$39,90 no cartão 1234 crédito para o pedido #456"
- "Lista todas as transações aprovadas de hoje"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "pagamentos": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/07-pagamentos",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
