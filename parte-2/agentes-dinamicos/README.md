# 🤖 Agente Dinâmico Simples

Agente que pergunta seu plano (gratis/pago) e adapta as respostas baseado nisso usando OpenAI.

## Por que Agentes Dinâmicos?

- **Adaptação contínua**: O agente modifica seu comportamento baseado no plano do usuário
- **Personalização**: Aprende se o usuário tem plano gratis ou pago
- **Instruções dinâmicas**: O system prompt muda baseado no plano
- **Integração com LLM**: Usa OpenAI para respostas gerais, mas com instruções dinâmicas

## Estrutura do Projeto

```
agentes-dinamicos/
├── agente_dinamico.py         # Código principal do agente dinâmico
├── requirements.txt           # Dependências Python
└── README.md                  # Este arquivo
```

## Aprendizado Dinâmico

- **Plano do usuário**: Aprende se é gratis ou pago baseado na primeira resposta
- **Instruções dinâmicas**: System prompt muda entre "breve" e "detalhado"
- **Estado persistente**: Mantém o plano durante toda a conversa

## Diagrama de Fluxo

```
┌────────────────────────────────────────────────────────┐
│                    MENSAGEM DO USUÁRIO                 │
└────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────┐
│                      ANÁLISE DO PLANO                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ "gratis"?    │  │ "pago"?      │  │ "outro"?     │  │
│  │ → plano =    │  │ → plano =    │  │ → pergunta   │  │
│  │   "gratis"   │  │   "pago"     │  │   novamente  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────┐
│           ADAPTAÇÃO DINÂMICA DO COMPORTAMENTO          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Plano        │  │ Instrução    │  │ Estilo de    │  │
│  │ Grátis       │  │ Base (LLM)   │  │ Resposta     │  │
│  │              │  │              │  │              │  │
│  │ "breve"      │  │ "Seja breve" │  │ "conciso"    │  │
│  │ "detalhado"  │  │ "Explique"   │  │ "completo"   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────┐
│                   PROCESSAMENTO FINAL                  │
│                    ┌──────────────┐                    │
│                    │ OpenAI?      │                    │
│                    │ → API call   │                    │
│                    │              │                    │
│                    └──────────────┘                    │
└────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────┐
│                 RESPOSTA ADAPTADA AO PLANO             │
└────────────────────────────────────────────────────────┘
```

## Como Executar

### 1. Instale as dependências

```bash
cd parte-2/agentes-dinamicos
pip install -r requirements.txt
```

### 2. Configure a API Key

Crie um arquivo `.env` na raiz do projeto:

```env
OPENAI_API_KEY=sua-chave-openai-aqui
```

### 3. Execute o agente

```bash
# Modo interativo
python agente_dinamico.py
```

## Exemplo Completo de Interação

```
🤖 AGENTE DINÂMICO SIMPLES
=========================

Você: gratis
🤖 Agente: Entendi! Você tem o plano GRÁTIS. Suas respostas serão curtas e diretas.

Você: O que é Python?
🤖 Agente: Python é uma linguagem de programação.

Você: O que é machine learning?
🤖 Agente: Machine learning é uma área da inteligência artificial.

Você: pago
🤖 Agente: Excelente! Você tem o plano PAGO. Suas respostas serão completas e detalhadas.

Você: O que é Python?
🤖 Agente: Python é uma linguagem de programação de alto nível e propósito geral
que enfatiza a legibilidade do código. Criada por Guido van Rossum em 1991,
Python possui uma filosofia de design que prioriza a simplicidade e elegância...

Você: sair
```

## Estratégias de Adaptação

### Aprendizado Baseado no Plano

- **"gratis/free"**: Ativa modo conciso (respostas curtas, máximo 2 frases)
- **"pago/premium"**: Ativa modo detalhado (explicações completas com exemplos)
- **Estado persistente**: Mantém o plano definido durante toda a conversa

### Instruções Dinâmicas para LLM

```python
# Baseado no plano, cria instruções diferentes
if self.plano == "gratis":
    instrucao = "Seja muito breve e direto. Responda em no máximo 2 frases."
else:
    instrucao = "Seja detalhado e completo. Explique com exemplos e contexto."
```

## Conceitos Demonstrados

- ✅ **Agente dinâmico**: Aprende o plano do usuário e adapta comportamento
- ✅ **Instruções dinâmicas**: System prompt muda baseado no plano
- ✅ **Personalização**: Respostas diferentes para planos diferentes
- ✅ **Integração OpenAI**: Usa GPT-4o-mini com contexto adaptado
- ✅ **Estado persistente**: Lembra o plano durante a conversa
