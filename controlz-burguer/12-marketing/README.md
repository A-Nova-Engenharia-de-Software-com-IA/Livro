# 12 - Marketing

Agente criativo da ControlZ Burger. Gera posts para Instagram, copies promocionais, descrições de produtos e campanhas semanais completas usando LLM.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Cria um post pro Instagram promovendo o X-Bacon com tom divertido"
- "Gera uma campanha semanal com tema 'volta às aulas'"
- "Escreve uma descrição apetitosa para o X-Duplo com blend 180g, queijo cheddar e pão brioche"

## Conectar no Claude Code

```json
{
  "mcpServers": {
    "marketing": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/12-marketing",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
