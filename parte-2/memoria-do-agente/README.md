# 🧠 Sistema de Memória de Agente

Este exemplo demonstra a implementação completa de um sistema de memória para agentes de IA, seguindo as melhores práticas para gerenciamento de contexto em longo prazo.

## Por que Memória é Importante?

- **Personalização e continuidade**: Um agente que lembra interações anteriores aumenta a satisfação do usuário
- **Eficiência computacional**: Evita recomputar dados, reduzindo custos de API
- **Raciocínio de longo prazo**: Essencial para tarefas que precisam de histórico (análise médica, planejamento financeiro)

## Hierarquia de Memória Implementada

| Tipo           | O que Guarda                   | Onde Fica          | Quando Usar                   |
| -------------- | ------------------------------ | ------------------ | ----------------------------- |
| **Short-term** | Conversa atual                 | RAM (lista Python) | Sempre - contexto imediato    |
| **Long-term**  | Histórico, fatos, preferências | JSON persistido    | Dados estruturados do usuário |
| **Summary**    | Resumo de conversas antigas    | JSON + embedding   | Quando há muitas mensagens    |
| **Vector**     | Memórias semânticas            | JSON + embeddings  | Busca por similaridade        |

## Estrutura do Projeto

```
memória-do-agente/
├── memory_agent.py                  # Código principal com todas as classes
├── requirements.txt                 # Dependências Python
├── README.md                        # Este arquivo
├── mensagens_teste_user_001.md      # Roteiro de teste para gerar memórias
├── DB/
│   └── users.json                   # Dados simulados de usuários
└── data/                            # Criado automaticamente
    ├── long_term_*.json             # Memória de longo prazo por usuário
    ├── vector_*.json                # Memória vetorial por usuário
    └── summary_*.json               # Resumos por usuário
```

> 💡 **Dados de exemplo:** Os arquivos em `data/` já contêm memórias pré-geradas para `user_001`. Essas memórias foram criadas usando o roteiro de mensagens em `mensagens_teste_user_001.md`.

## Componentes Principais

### 1. Classes de Memória

```python
# Memória de curto prazo - conversa atual
class ShortTermMemory:
    - add(role, content)        # Adiciona mensagem
    - get_messages()            # Retorna mensagens
    - clear()                   # Limpa memória

# Memória de longo prazo - dados persistentes
class LongTermMemory:
    - add_fact()                # Adiciona fato sobre usuário
    - update_preferences()      # Atualiza preferências
    - prune_old_data()          # Remove dados antigos

# Memória vetorial - busca semântica
class VectorMemory:
    - add(content)             # Adiciona com embedding
    - search(query)            # Busca por similaridade
    - prune()                  # Remove memórias antigas

# Memória de resumo - compressão
class SummaryMemory:
    - create_summary()         # Cria resumo via LLM
    - add_summary()            # Salva resumo
    - get_recent_summaries()   # Retorna resumos recentes
```

### 2. Processador de Memória

```python
class MemoryProcessor:
    """Gerencia, transforma e otimiza memórias."""

    - add_message()                    # Adiciona e processa
    - extract_facts()                  # Extrai fatos via LLM
    - retrieve_relevant_memories()     # Recupera memórias relevantes
    - format_context_for_prompt()      # Formata para injeção
    - prune_all()                      # Poda todas as memórias
```

### 3. Agente com Memória

```python
class AgentWithMemory:
    """Agente completo com sistema de memória."""

    - process_message()    # Processa com contexto de memória
    - get_memory_stats()   # Estatísticas de memória
```

## Estratégias de Controle Implementadas

### Limites Configuráveis

```python
MIN_RELEVANCE_SCORE = 0.85  # Score mínimo para injetar memória
MAX_MEMORY_ITEMS = 8        # Máximo de itens a injetar
MAX_MEMORY_TOKENS = 2000    # Limite de tokens (~30% do contexto)
MAX_MEMORY_AGE_DAYS = 180   # Idade máxima das memórias
```

### Processamento Automático

- **Compressão**: Quando há mais de N mensagens, cria resumo automático (`SUMMARY_THRESHOLD = 5` neste exemplo para facilitar testes — ajuste para 20+ em produção)
- **Filtragem**: Só injeta memórias com score ≥ 0.85
- **Poda**: Remove memórias com mais de 180 dias
- **Priorização**: Ordena por relevância semântica

## Como Executar

### 1. Instale as dependências

```bash
cd parte-2/memória-do-agente
pip install -r requirements.txt
```

### 2. Configure a API Key

Crie um arquivo `.env` na raiz do projeto:

```env
OPENAI_API_KEY=sua-chave-aqui
```

### 3. Execute o agente

```bash
python memory_agent.py
```

### 4. Comandos disponíveis

| Comando  | Descrição                         |
| -------- | --------------------------------- |
| `/stats` | Ver estatísticas de memória       |
| `/clear` | Limpar memória de curto prazo     |
| `/prune` | Executar poda de memórias antigas |
| `/sair`  | Encerrar                          |

## Exemplo de Interação

```
🧠 AGENTE COM SISTEMA DE MEMÓRIA
============================================================

Usuários disponíveis: user_001, user_002, user_003
ID do usuário (ou Enter para user_001): user_001

✅ Agente inicializado para: user_001
   Nome: Carlos Silva
   Área de interesse: tecnologia
   Nível técnico: avançado

👤 Você: Oi! Me ajuda a entender como funciona async/await em Python?

[Memória] Recuperados 2 itens
[Memória] Tokens estimados: 180

🤖 Assistente: E aí, Carlos! Como você já tem experiência com Python,
vou direto ao ponto: async/await é syntactic sugar para trabalhar
com coroutines...

👤 Você: Prefiro que me chame de Carlão

[Memória] Recuperados 4 itens
[Memória] Tokens estimados: 250

🤖 Assistente: Fechado, Carlão! Vou lembrar disso.
Quer que eu continue explicando sobre async/await?

👤 Você: /stats

📊 Estatísticas de Memória:
   Short-term: 4 mensagens
   Vector: 2 memórias
   Resumos: 0
   Fatos: 1
   Preferências: {'nome_tratamento': 'Carlão'}
```

## Boas Práticas Implementadas

1. **Dados estruturados**: Inclui `user_id`, `type`, `timestamp` em todas as memórias
2. **Poda automática**: Memórias > 180 dias são removidas ou resumidas
3. **Limite de injeção**: Máximo ~30% do contexto total
4. **Scores de confiança**: Cada memória recuperada tem seu score visível
5. **Verificação de relevância**: Score mínimo de 0.85 para injeção

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                    MENSAGEM DO USUÁRIO                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  PROCESSADOR DE MEMÓRIA                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Short-term   │  │  Long-term   │  │   Vector     │       │
│  │ (conversa)   │  │ (histórico)  │  │ (semântica)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  Filtros: score ≥ 0.85 | idade ≤ 180 dias | max 8 itens     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              CONTEXTO FORMATADO (~30% do total)             │
│  📌 Fatos | ⚙️ Preferências | 📋 Resumos | 🔍 Relevantes     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      LLM (gpt-4o-mini)                      │
│            System Prompt + Memória + Mensagem               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    RESPOSTA PERSONALIZADA                   │
└─────────────────────────────────────────────────────────────┘
```

## Desafios e Soluções

| Desafio            | Solução Implementada              |
| ------------------ | --------------------------------- |
| Explosão de tokens | Compressão automática via resumos |
| Latência em buscas | Cache de embeddings em arquivo    |
| Alucinações        | Score mínimo de relevância (0.85) |
| Dados obsoletos    | Poda automática (180 dias)        |

## Referências

- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Best Practices for Memory in AI Agents](https://www.anthropic.com/)
- [LangChain Memory](https://python.langchain.com/docs/modules/memory/)
