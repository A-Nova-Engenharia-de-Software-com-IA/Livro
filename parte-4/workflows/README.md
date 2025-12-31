# Workflows com IA

Exemplos práticos de padrões de workflow com LLMs.

## Padrões

| Padrão        | Descrição                            | Fluxo             |
| ------------- | ------------------------------------ | ----------------- |
| **Branching** | Divide em análises paralelas         | A -> [B1, B2, B3] |
| **Chaining**  | Etapas sequenciais dependentes       | A -> B -> C -> D  |
| **Merging**   | Converge resultados em síntese única | [B1, B2, B3] -> C |

## Estrutura

```
workflows/
├── branching/
│   └── branching.py      # Análises paralelas
├── chaining/
│   └── chaining.py       # Etapas sequenciais
├── merging/
│   └── merging.py        # Branching + Merging completo
├── requirements.txt
└── README.md
```

## Setup

```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar .env na raiz do projeto
echo "OPENAI_API_KEY=sua-chave-aqui" > ../../.env
```

## Executar

```bash
# Branching
python branching/branching.py

# Chaining
python chaining/chaining.py

# Merging (pipeline completo)
python merging/merging.py
```

## Resumo dos Padrões

### Branching (Ramificação)

```
         ┌─> Ramo 1
Entrada ─┼─> Ramo 2    (paralelo)
         └─> Ramo 3
```

### Chaining (Encadeamento)

```
Etapa 1 ──> Etapa 2 ──> Etapa 3 ──> Resultado
  │           │           │
  v           v           v
 DB       Resumir     Analisar    (sequencial)
```

### Merging (Convergência)

```
         ┌─> Ramo 1 ─┐
Entrada ─┼─> Ramo 2 ─┼─> Síntese Única
         └─> Ramo 3 ─┘
```
