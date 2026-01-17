# 🤖 Sistema Multi-Agente: Equipe de Desenvolvimento de Software

Este é um exemplo prático de **sistema multi-agente** que simula uma equipe de desenvolvimento de software utilizando Python e OpenAI. Cada agente tem uma função específica e colabora com os outros para completar tarefas complexas.

## 📋 O que são Sistemas Multi-Agentes?

Um sistema multi-agente é como uma equipe especializada dentro de uma empresa. Cada "agente" (uma instância de IA) tem:

- **Um papel bem definido** - responsabilidades específicas
- **Um prompt de sistema único** - regras e comportamentos próprios
- **Uma memória própria** - histórico de interações
- **Colaboração coordenada** - trabalha com outros agentes

### Analogia com o Mundo Corporativo

```
┌─────────────────────────────────────────────────────────────────┐
│                    EQUIPE DE DESENVOLVIMENTO                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   👔 GERENTE          →   📐 PLANEJADOR                          │
│   • Analisa pedidos       • Define arquitetura                  │
│   • Define requisitos     • Escolhe tecnologias                 │
│   • Coordena equipe       • Cria plano técnico                  │
│                                                                 │
│           ↓                        ↓                            │
│                                                                 │
│   💻 DESENVOLVEDOR    ←   🔍 REVISOR                             │
│   • Escreve código        • Analisa qualidade                   │
│   • Implementa plano      • Identifica bugs                     │
│   • Segue padrões         • Sugere melhorias                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Funcionalidades

- ✅ **4 agentes especializados** com papéis distintos
- ✅ **Pipeline de colaboração** - cada agente passa sua saída para o próximo
- ✅ **Memória por agente** - cada um mantém seu contexto
- ✅ **Demonstração prática** - cria uma calculadora automaticamente

## 🗂️ Estrutura do Projeto

```
AI/                           # Raiz do projeto
├── .env                      # Arquivo com API key (criar manualmente)
└── parte-6/
    └── multi-agentes/
        ├── multi_agents.py   # Código principal do sistema
        ├── requirements.txt  # Dependências do projeto
        └── README.md         # Esta documentação
```

## 🏗️ Arquitetura do Sistema

### Fluxo do Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   GERENTE    │────▶│  PLANEJADOR  │────▶│DESENVOLVEDOR │────▶│   REVISOR    │
│              │     │              │     │              │     │              │
│ • Analisa    │     │ • Arquitetura│     │ • Código     │     │ • Avaliação  │
│ • Requisitos │     │ • Plano      │     │ • Implementa │     │ • Feedback   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │                    │
       ▼                    ▼                    ▼                    ▼
   Briefing            Especificações        Código              Veredicto
```

## 🚀 Como Executar

### Pré-requisitos

- Python
- Conta na OpenAI com API key

### Passo 1: Instalar Dependências

```bash
cd parte-6/multi-agentes
pip install -r requirements.txt
```

### Passo 2: Configurar API Key da OpenAI

**Opção 1 - Arquivo .env (recomendado):**

Na raiz do projeto (pasta `AI/`), crie um arquivo `.env`:

```bash
OPENAI_API_KEY=sk-sua-chave-aqui
```

**Opção 2 - Variável de ambiente:**

```bash
export OPENAI_API_KEY="sua-chave-aqui"
```

### Passo 3: Executar

```bash
python multi_agents.py
```

O sistema vai criar automaticamente uma calculadora simples, passando por todos os 4 agentes.

## 🔧 Personalização

### Modificar a Solicitação

Edite a variável `solicitacao` no final do arquivo:

```python
solicitacao = """
Crie um sistema de login em Python que:
- Valide usuário e senha
- Tenha 3 tentativas máximas
- Bloqueie após falhas
"""

equipe.executar_projeto(solicitacao)
```

### Adicionar Novo Agente

```python
PROMPT_TESTER = """Você é o Testador de Software da equipe.
...
"""

self.tester = Agente(
    nome="Tester",
    papel="QA Engineer",
    prompt_sistema=PROMPT_TESTER,
    temperatura=0.5,
)
```

### Ajustar Parâmetros

```python
self.desenvolvedor = Agente(
    nome="Desenvolvedor",
    papel="Desenvolvedor Sênior",
    prompt_sistema=PROMPT_DESENVOLVEDOR,
    modelo="gpt-4o",        # Usar modelo mais avançado
    temperatura=0.2          # Menor = mais determinístico
)
```

## 🎯 Casos de Uso Reais

Este padrão de sistema multi-agente pode ser aplicado em:

- **Desenvolvimento de Software** - Geração e revisão de código
- **Atendimento ao Cliente** - Triagem e especialistas por área
- **Análise de Dados** - Coleta, processamento e relatórios
- **Criação de Conteúdo** - Pesquisa, escrita e revisão

## 📊 Comparação: Agente Único vs Multi-Agente

| Aspecto        | Agente Único | Multi-Agente              |
| -------------- | ------------ | ------------------------- |
| Complexidade   | Simples      | Maior                     |
| Especialização | Generalista  | Especialista por função   |
| Qualidade      | Boa          | Melhor (revisão cruzada)  |
| Escalabilidade | Limitada     | Alta                      |
| Custo          | Menor        | Maior (mais chamadas API) |

## 📚 Conceitos Demonstrados

1. **Divisão de responsabilidades** - Cada agente faz uma coisa bem
2. **Pipeline de processamento** - Fluxo sequencial de trabalho
3. **Memória por agente** - Contexto isolado
4. **Prompts especializados** - Comportamento definido por instruções
5. **Orquestração** - Coordenação centralizada
