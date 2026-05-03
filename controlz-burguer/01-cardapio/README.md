# 01 - Cardápio

Agente responsável por gerenciar o cardápio da ControlZ Burger. Permite criar, listar, atualizar e remover produtos com categorias e variações.

## Como rodar

```bash
npm install
cp .env.example .env  # adicione sua OPENAI_API_KEY
npm run dev
```

## Exemplos de prompt

- "Liste todos os lanches do cardápio"
- "Adiciona um X-Duplo Bacon por R$34,90 na categoria lanche com variações simples e duplo"
- "Atualiza o preço da Batata Frita para R$14,90"

## Conectar no Claude Code

Adicione ao seu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cardapio": {
      "command": "npx",
      "args": ["tsx", "src/mastra/mcp.ts"],
      "cwd": "/caminho/para/01-cardapio",
      "env": { "OPENAI_API_KEY": "sk-..." }
    }
  }
}
```
