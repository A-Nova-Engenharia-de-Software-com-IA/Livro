# 02 - Pedidos

Agente responsável por criar e acompanhar pedidos da ControlZ Burger, desde o recebimento até a entrega, gerenciando o fluxo de status.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Cria um pedido para o cliente abc123 com 2 X-Burgers a R$25,90 cada, pagamento via pix"
- "Lista todos os pedidos com status 'novo'"
- "Atualiza o pedido xyz para status em_preparo"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "pedidos": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/02-pedidos",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
