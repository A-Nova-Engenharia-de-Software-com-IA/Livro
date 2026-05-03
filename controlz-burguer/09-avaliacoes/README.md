# 09 - Avalia��ões

Agente de satisfação da ControlZ Burger. Coleta avaliações de clientes, analisa sentimento com LLM e calcula o NPS (Net Promoter Score).

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Registra uma avaliação nota 9 do cliente abc123 para o pedido #456: 'Hambúrguer delicioso, chegou quente!'"
- "Analisa o sentimento do comentário: 'Demorou muito e chegou frio'"
- "Qual é o NPS atual da ControlZ Burger?"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "avaliacoes": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/09-avaliacoes",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
