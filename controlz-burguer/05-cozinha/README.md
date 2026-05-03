# 05 - Cozinha

Agente que gerencia a fila de produção da cozinha da ControlZ Burger. Controla pedidos em preparo, tempo médio e carga atual da cozinha.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Manda o pedido #123 pra fila da cozinha com 2 X-Burgers e 1 Batata Frita"
- "Qual a fila atual da cozinha?"
- "Qual é a carga da cozinha agora?"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "cozinha": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/05-cozinha",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
