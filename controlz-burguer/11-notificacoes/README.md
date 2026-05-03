# 11 - Notificações

Agente de comunicação da ControlZ Burger. Envia mensagens via WhatsApp e e-mail (mock), com templates prontos para cada evento do pedido.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Manda WhatsApp para 11999990001: 'Seu pedido #123 está pronto!'"
- "Qual é o template para o evento pedido_recebido?"
- "Lista todas as notificações enviadas hoje para o número 11999990001"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "notificacoes": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/11-notificacoes",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
