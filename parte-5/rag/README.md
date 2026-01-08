# 🏥 RAG Pipeline - Base de Conhecimento Médico

Este projeto demonstra a implementação de um pipeline completo de **RAG (Retrieval-Augmented Generation)** na área da saúde, utilizando:

- **Python** - Linguagem de programação
- **OpenAI** - Para geração de embeddings e respostas (GPT-4o-mini)
- **ChromaDB** - Banco de dados vetorial persistente

## 📋 Índice

- [Arquitetura](#-arquitetura)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Base de Dados](#-base-de-dados)
- [Exemplos de Busca](#-exemplos-de-busca)

## 🏗️ Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Documentos    │────▶│    Indexador     │────▶│    ChromaDB     │
│    (JSONs)      │     │  (embeddings)    │     │ (base vetorial) │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    Resposta     │◀────│      LLM         │◀────│  Busca Semântica│
│   Contextual    │     │  (GPT-4o-mini)   │     │    (query)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Fluxo do Pipeline

1. **Indexação**: Documentos médicos são convertidos em embeddings e armazenados no ChromaDB
2. **Busca**: Pergunta do usuário é convertida em embedding e busca-se por similaridade
3. **Geração**: Documentos relevantes são passados ao LLM que gera a resposta contextualizada

## 📁 Estrutura do Projeto

```
parte-5/rag/
├── data/
│   ├── texts/           # Documentos médicos (chunks JSON)
│   │   ├── doc_001.json
│   │   ├── doc_002.json
│   │   └── ...
│   └── chroma/          # Base vetorial persistente (gerada)
├── indexer.py           # Script de indexação
├── search.py            # Sistema de busca e RAG
├── requirements.txt     # Dependências
└── README.md           # Esta documentação
```

## 🚀 Instalação

```bash
# Navegue até a pasta do projeto
cd parte-5/rag

# Crie e ative um ambiente virtual (opcional, mas recomendado)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate   # Windows

# Instale as dependências
pip install -r requirements.txt
```

## ⚙️ Configuração

### Chave da API OpenAI

Você precisa de uma chave da API da OpenAI. Configure de uma das seguintes formas:

**Opção 1: Variável de ambiente**

```bash
export OPENAI_API_KEY="sua-chave-aqui"
```

**Opção 2: Arquivo .env**
Crie um arquivo `.env` na pasta do projeto:

```
OPENAI_API_KEY=sua-chave-aqui
```

## 📖 Uso

### 1. Indexar os Documentos

Primeiro, execute o indexador para criar a base vetorial:

```bash
python indexer.py
```

Saída esperada:

```
==============================================================
🏥 RAG PIPELINE - INDEXADOR DE DOCUMENTOS MÉDICOS
==============================================================

📘 Encontrados 20 documentos (chunks/páginas).
✅ Último lote de 20 documentos indexado.

==============================================================
🎉 INDEXAÇÃO CONCLUÍDA COM SUCESSO!
==============================================================
📊 Total indexado: 20 documentos
⏭️  Ignorados (< 80 chars): 0 documentos
📁 Base vetorial salva em: data/chroma
==============================================================
```

### 2. Executar Buscas

**Modo Exemplos (automático):**

```bash
python search.py
```

**Modo Interativo:**

```bash
python search.py --interactive
```

## 📚 Base de Dados

A base de dados inclui 20 documentos médicos de diferentes especialidades:

| Área              | Documentos | Conteúdo                               |
| ----------------- | ---------- | -------------------------------------- |
| 🫀 Cardiologia    | 4          | IAM, cirurgia cardíaca, anticoagulação |
| 💊 Anestesiologia | 2          | Propofol, sedação em idosos            |
| 🏥 UTI            | 2          | Sedação, ventilação mecânica (SDRA)    |
| 🦠 Infectologia   | 2          | PAV, sepse e choque séptico            |
| 💉 Dor            | 2          | Escada analgésica, pós-operatório      |
| 🧠 Neurologia     | 2          | AVC isquêmico, trombólise              |
| 👶 Pediatria      | 1          | Bronquiolite viral                     |
| 🤰 Obstetrícia    | 1          | Pré-eclâmpsia e eclâmpsia              |
| 🩺 Nefrologia     | 1          | Lesão renal aguda                      |
| 🔬 Oncologia      | 1          | Neutropenia febril                     |
| 💊 Endocrinologia | 1          | Manejo de hiperglicemia                |
| 🩸 Hematologia    | 1          | Anticoagulação (Warfarina vs DOACs)    |

## 🔍 Exemplos de Busca

### Exemplo 1: Propofol em Idosos

```python
query = "Como usar propofol em pacientes idosos?"
```

> Retorna informações sobre ajuste de dose, precauções e monitorização

### Exemplo 2: Medicamentos em Cirurgia Cardíaca

```python
query = "Quais medicamentos são usados durante cirurgia cardíaca?"
```

> Retorna: Heparina, Protamina, Cardioplegia, Vasopressores, Inotrópicos

### Exemplo 3: Tratamento de Sepse

```python
query = "Como tratar choque séptico?"
```

> Retorna o bundle da primeira hora com medicamentos e metas

### Exemplo 4: Trombólise em AVC

```python
query = "Critérios para trombólise no AVC isquêmico"
```

> Retorna indicações, contraindicações e protocolo de Alteplase

### Exemplo 5: Manejo da Dor

```python
query = "Como controlar dor pós-operatória em cirurgias grandes?"
```

> Retorna técnicas de analgesia multimodal, peridural, TAP block, PCA

### Exemplo 6: Emergência Cardíaca

```python
query = "O que fazer quando paciente chega com infarto?"
```

> Retorna protocolo de atendimento inicial do IAM

## 🎯 Vantagens da Arquitetura

### Para Gerentes de TI

1. **Independência de Fornecedor**: ChromaDB pode ser substituído por:

   - pgvector (PostgreSQL)
   - Pinecone
   - Weaviate
   - Qdrant

2. **Escalabilidade**: Processamento em lotes permite milhões de documentos

3. **Custo Controlado**: Embeddings são gerados uma vez e reutilizados

4. **Auditoria**: Metadados permitem rastrear origem das informações

### Para Desenvolvedores

1. **Código Modular**: Separação clara entre indexação e busca

2. **Tipagem**: Type hints para melhor manutenção

3. **Configurável**: Fácil ajuste de parâmetros

4. **Extensível**: Adicionar novos documentos é simples

## ⚠️ Aviso Legal

Este é um projeto **educacional** e de demonstração. As informações médicas contidas são baseadas em protocolos reais, mas:

- **NÃO** substitui consulta médica profissional
- **NÃO** deve ser usado para decisões clínicas reais
- Os protocolos podem estar desatualizados
