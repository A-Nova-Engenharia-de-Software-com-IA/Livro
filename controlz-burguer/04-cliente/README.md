# 04 - Cliente

Agente de CRM da ControlZ Burger. Gerencia cadastro de clientes, preferências alimentares e histórico de pedidos para personalizar o atendimento.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Cadastra o cliente João Silva, telefone 11999990001, sem glúten e sem cebola"
- "Busca clientes pelo nome 'Maria'"
- "Atualiza as preferências do cliente abc123 para vegano"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "cliente": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/04-cliente",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
