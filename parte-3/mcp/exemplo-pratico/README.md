# Exemplo Prático - MCP Clínico de Anestesia

Este exemplo demonstra como criar um servidor MCP simples que expõe uma ferramenta de busca de medicamentos, e um cliente que consome essa ferramenta.

## Arquitetura

```
┌─────────────────┐         HTTP/SSE            ┌─────────────────┐
│                 │   ◄──────────────────────►  │                 │
│   MCP Client    │                             │   MCP Server    │
│   (client.py)   │   Descoberta + Chamada      │   (server.py)   │
│                 │                             │                 │
└─────────────────┘                             └─────────────────┘
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

O servidor será iniciado em `http://0.0.0.0:3333` usando o transporte SSE (Server-Sent Events).

### 2. Execute o cliente

Em outro terminal:

```bash
python client.py
```

## Saída Esperada

```
Ferramentas disponíveis:

- buscar_medicamento

Buscando: Propofol

Resposta:
{
    "medicamento": "Propofol",
    "classe": "Anestésico geral intravenoso",
    "indicacao": "Indução e manutenção da anestesia",
    "efeitos_colaterais": [
        "Hipotensão",
        "Depressão respiratória",
        "Bradicardia leve"
    ]
}
```

## Componentes

### Server (`server.py`)

- Usa `FastMCP` para criar um servidor MCP compatível
- Expõe a ferramenta `buscar_medicamento` via decorator `@mcp.tool()`
- Roda via transporte SSE (Server-Sent Events) na porta 3333

### Client (`client.py`)

- Conecta ao servidor MCP via SSE usando `sse_client`
- Usa código assíncrono (`asyncio`) para comunicação
- Descobre automaticamente as ferramentas disponíveis (`list_tools`)
- Executa a ferramenta `buscar_medicamento` com parâmetros

## Sobre o Transporte SSE

O MCP suporta dois tipos de transporte:

| Transporte | Descrição                                               |
| ---------- | ------------------------------------------------------- |
| `stdio`    | Comunicação via stdin/stdout (para integração com CLIs) |
| `sse`      | HTTP com Server-Sent Events (para servidores web)       |

O SSE (Server-Sent Events) é um protocolo baseado em HTTP que permite comunicação bidirecional entre cliente e servidor, mantendo uma conexão persistente para receber eventos em tempo real.
