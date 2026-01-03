# Suspender e Continuar (Suspend & Resume)

## O que é?

Quando um workflow precisa aguardar uma ação externa (aprovação humana, resposta de API, etc.), não faz sentido manter o processo rodando e consumindo recursos. A solução é **pausar**, **salvar o estado** e **retomar** depois.

```
┌────────────────────────────────────────────────────────────────┐
│                      FLUXO SUSPEND & RESUME                    │
└────────────────────────────────────────────────────────────────┘

ETAPA 1 ──> ETAPA 2 ──> SUSPEND ──────────────> RESUME ──> ETAPA 3 ──> FIM
                           │                       ^
                           v                       │
                      [Salva estado]          [Evento externo]
                      [Libera recursos]       [Ex: aprovação]
```

## Estrutura do Projeto

```
suspender-e-continuar/
├── suspend_resume.py    # Exemplo prático com OpenAI
├── requirements.txt     # Dependências
├── README.md            # Este arquivo
└── states/              # Estados salvos (criado automaticamente)
```

## Como Executar

### Pré-requisitos

- Python
- Conta na OpenAI com API key

### Passo 1: Instalar Dependências

```bash
cd parte-4/suspender-e-continuar
pip install -r requirements.txt
```

### Passo 2: Configurar API Key

Na raiz do projeto (pasta `AI/`), crie um arquivo `.env`:

```bash
OPENAI_API_KEY=sk-sua-chave-aqui
```

### Passo 3: Executar

```bash
# 1. Inicia workflow (LLM decide ação e suspende)
python suspend_resume.py iniciar

# 2. Verifica pendentes
python suspend_resume.py status

# 3. Aprova ou rejeita
python suspend_resume.py aprovar [ID]
python suspend_resume.py rejeitar [ID]
```

## Exemplo de Saída

```
============================================================
WORKFLOW: ANÁLISE DE RECLAMAÇÃO
============================================================

Reclamação:
Pedido #12345 - João Silva
Produto: Notebook Gamer - R$ 4.500,00
Problema: Não recebi o produto. Prazo era 5 dias, já passaram 15.

[ETAPA 1] Agente analisando...
[ETAPA 1] Decisão: REEMBOLSO R$ 4500.00

[ETAPA 2] SUSPENDENDO - Aguarda aprovação humana

============================================================
SUSPENSO: WF-123456
============================================================

Ação pendente: REEMBOLSO R$ 4500.00
Motivo: Cliente não recebeu o produto após 15 dias

Comandos: aprovar | rejeitar
```

## Cenário do Exemplo

| Etapa | Descrição                                                  |
| ----- | ---------------------------------------------------------- |
| 1     | LLM analisa reclamação e decide: "Reembolsar R$ X"         |
| 2     | SUSPEND - Salva estado e aguarda aprovação humana          |
| 3     | RESUME - Se aprovado, executa reembolso e notifica cliente |
