# 🤖 Agente Dinâmico Simples

> **Exemplo introdutório** — demonstra o conceito central de agentes dinâmicos: adaptar o comportamento em runtime sem alterar o código. Para aplicações reais, expanda com ferramentas dinâmicas, memória persistente e múltiplos contextos.

Agente que pergunta seu plano (gratis/pago) e adapta as respostas baseado nisso usando OpenAI.

## Por que Agentes Dinâmicos?

- **Adaptação em runtime**: O agente modifica seu comportamento baseado no plano do usuário a cada chamada
- **Personalização**: Detecta o plano do usuário e mantém esse contexto durante a sessão
- **Instruções dinâmicas**: O system prompt muda baseado no plano
- **Histórico de conversa**: Mantém o contexto de toda a sessão atual em memória (RAM)
- **Integração com LLM**: Usa OpenAI com histórico acumulado para respostas coerentes

## Estrutura do Projeto

```
agentes-dinamicos/
├── agente_dinamico.py         # Código principal do agente dinâmico
├── requirements.txt           # Dependências Python
└── README.md                  # Este arquivo
```

## Aprendizado Dinâmico

- **Plano do usuário**: Detecta se é gratis ou pago baseado na primeira resposta e mantém durante a sessão
- **Instruções dinâmicas**: System prompt muda entre "breve" e "detalhado" a cada chamada
- **Estado em sessão**: O plano e o histórico ficam em RAM — não persistem entre execuções do processo

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
│                    │ OpenAI API   │                    │
│                    │ system +     │                    │
│                    │ histórico    │                    │
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

- ✅ **Agente dinâmico**: Detecta o plano do usuário e adapta o comportamento em runtime
- ✅ **Instruções dinâmicas**: System prompt muda a cada chamada baseado no plano
- ✅ **Personalização**: Respostas diferentes para planos diferentes
- ✅ **Histórico de conversa**: Acumula o contexto da sessão para respostas coerentes
- ✅ **Integração OpenAI**: Usa GPT-4o-mini com system prompt + histórico
- ✅ **Tratamento de erro**: try/except na chamada de API — falhas não quebram o loop
