# 06 - Entregador

Agente de logística da ControlZ Burger. Cadastra entregadores, atribui motoboys a pedidos prontos, calcula rotas (mock) e rastreia entregas.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Atribui um entregador para o pedido #123, endereço Rua das Flores 100"
- "Calcula rota da ControlZ Burger para Avenida Paulista 1000"
- "Lista os entregadores disponíveis agora"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "entregador": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/06-entregador",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
