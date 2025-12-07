# Roteamento de Modelos

## O que é?

Roteamento de modelos é uma estratégia que permite usar **múltiplos modelos de IA** em uma mesma aplicação, decidindo em tempo real qual modelo irá responder cada requisição.

## Por que usar?

| Benefício               | Descrição                               |
| ----------------------- | --------------------------------------- |
| 💰 **Redução de custo** | Prompts simples usam modelos baratos    |
| ⚡ **Mais performance** | Modelos menores respondem mais rápido   |
| 🎯 **Assertividade**    | Prompts complexos usam modelos melhores |

## Estratégia deste exemplo: Roteamento por Complexidade

```
   ┌─────────────────────────────────────────────────────────────┐
   │                      PROMPT DO USUÁRIO                      │
   └─────────────────────────────────────────────────────────────┘
                               │
                               ▼
                     ┌───────────────────┐
                     │   CLASSIFICADOR   │
                     │  DE COMPLEXIDADE  │
                     └───────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
      ┌────────────┐     ┌────────────┐     ┌────────────┐
      │  SIMPLES   │     │   MÉDIO    │     │  COMPLEXO  │
      │────────────│     │────────────│     │────────────│
      │ gpt-4o-mini│     │   gpt-4o   │     │   o1-mini  │
      │  $0.15/1M  │     │  $2.50/1M  │     │  $3.00/1M  │
      └────────────┘     └────────────┘     └────────────┘
```

## Como funciona a classificação?

O classificador usa duas técnicas:

1. **Palavras-chave**: Detecta termos que indicam complexidade

   - Simples: "traduza", "liste", "formate"
   - Complexo: "diagnóstico", "analise detalhadamente", "sintomas"

2. **Contagem de tokens**: Se não houver palavra-chave
   - < 20 palavras → Simples
   - 20-100 palavras → Médio
   - > 100 palavras → Complexo

## Como Executar

### Pré-requisitos

- Python 3.10 ou superior
- Conta na OpenAI com API key

### Passo 1: Instalar Dependências

```bash
cd parte-2/roteamento-de-modelos
pip install -r requirements.txt
```

Ou usando Python 3.10 especificamente:

```bash
python3.10 -m pip install -r requirements.txt
```

Execute

```bash
python3.10 router.py
```

## Exemplo de saída

```
==================================================
📊 Complexidade detectada: simples
🤖 Modelo selecionado: gpt-4o-mini
💰 Custo estimado: $0.15/1M tokens
==================================================

✅ Resposta:
Good morning, how are you?
```

## Economia estimada

Se 90% das suas requisições são simples e você usa roteamento:

| Cenário        | Custo por 1M requests |
| -------------- | --------------------- |
| Só gpt-4o      | $2,500                |
| Com roteamento | ~$400                 |
| **Economia**   | **~84%**              |

## Outras estratégias de roteamento

Este exemplo mostra apenas **roteamento por complexidade**, mas existem outras:

- **Por domínio**: Matemática → Modelo X, Código → Modelo Y
- **Por custo do usuário**: Free → modelos baratos, Pro → modelos melhores
- **Fallback**: Tenta modelo barato, se assertividade < 85%, usa modelo maior
