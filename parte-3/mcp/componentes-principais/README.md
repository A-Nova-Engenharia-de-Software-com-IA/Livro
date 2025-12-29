# Principais Componentes do MCP

Este exemplo demonstra todos os componentes principais do Model Context Protocol (MCP): **Tools**, **Resources**, **Prompts** e **Notifications**.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         MCP Server                              │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   TOOLS     │  │  RESOURCES  │  │   PROMPTS   │              │
│  │             │  │             │  │             │              │
│  │ search_     │  │ file://     │  │ code_review │              │
│  │ emails      │  │ report.txt  │  │ _prompt     │              │
│  │             │  │             │  │             │              │
│  │ update_     │  │             │  │ data_       │              │
│  │ report      │  │             │  │ analysis_   │              │
│  │             │  │             │  │ prompt      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP/SSE
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MCP Client                              │
│                                                                 │
│  • list_tools()      → Descobre ferramentas                     │
│  • call_tool()       → Executa ferramentas                      │
│  • list_resources()  → Descobre recursos                        │
│  • read_resource()   → Lê recursos                              │
│  • list_prompts()    → Descobre prompts                         │
│  • get_prompt()      → Obtém template de prompt                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Componentes

### 1. Tools (Ferramentas)

Funções executáveis expostas pelo server, com schemas JSON padronizados.

```python
@mcp.tool()
def search_emails(query: str, max_results: int = 10) -> dict:
    """Busca e-mails no Gmail."""
    # código real que usa Gmail API
    results = gmail_api.search(query, max_results)
    return {"emails": results}
```

**Uso no Client:**

```python
tools_result = await session.list_tools()  # descobre automaticamente
result = await session.call_tool(
    "search_emails",
    {"query": "from:cliente subject:reembolso", "max_results": 5}
)
```

### 2. Resources (Recursos)

Dados ou arquivos acessíveis para leitura e escrita.

```python
@mcp.resource("file://report.txt")
def get_report() -> str:
    """Lê o conteúdo do arquivo report.txt."""
    return open(path, "r").read()
```

**Uso no Client:**

```python
resources_result = await session.list_resources()
content = await session.read_resource("file://report.txt")
```

### 3. Prompts (Templates)

Templates de prompts dinâmicos para guiar o comportamento do agente.

```python
@mcp.prompt()
def code_review_prompt() -> str:
    """Template de prompt para code review."""
    return """
    Você é um engenheiro sênior. Revise o código focando em:
    - Segurança
    - Performance
    - Legibilidade
    Código: {code}
    """
```

**Uso no Client:**

```python
prompts_result = await session.list_prompts()
template = await session.get_prompt("code_review_prompt")
# template.messages[0].content.text contém o texto do prompt
```

### 4. Notifications (Notificações)

Comunicação bidirecional em tempo real (não implementado neste exemplo básico).

```python
# Server: Quando um evento acontece
await client.notify(
    "new_email_received",
    {"email_id": "12345", "subject": "Re: Reembolso"}
)

# Client: Escuta notificações
async for notification in client.notifications():
    if notification.type == "new_email_received":
        print(f"Novo e-mail: {notification.data['subject']}")
```

## Instalação

```bash
pip install -r requirements.txt
```

## Executando

### 1. Inicie o servidor MCP

```bash
python server.py
```

O servidor será iniciado em `http://0.0.0.0:3334` usando o transporte SSE (Server-Sent Events).

### 2. Execute o cliente

Em outro terminal:

```bash
python client.py
```

## Estrutura de Arquivos

```
componentes-principais/
├── server.py          # Servidor MCP com todos os componentes
├── client.py          # Cliente que consome os componentes
├── data/
│   └── report.txt     # Arquivo de recurso para demonstração
├── requirements.txt
└── README.md
```

## Saída Esperada

```
============================================================
TOOLS - Ferramentas disponíveis
============================================================
- search_emails: Busca e-mails no Gmail (mock).
- update_report: Atualiza o conteúdo do arquivo report.txt.

>> Executando: search_emails
Resultado: {'emails': [{'id': '001', 'from': 'cliente@exemplo.com', ...}]}

============================================================
RESOURCES - Recursos disponíveis
============================================================
- file://report.txt: report.txt

>> Lendo recurso: file://report.txt
Conteúdo atual: conteúdo - 2024-12-29

>> Atualizando recurso via tool update_report
Resultado: {'success': True, 'message': 'Arquivo atualizado', ...}

============================================================
PROMPTS - Templates disponíveis
============================================================
- code_review_prompt: Template de prompt para code review.
- data_analysis_prompt: Template de prompt para análise de dados.

>> Obtendo template: code_review_prompt
Template: ...
```
