# Tool Calling (Chamada de Ferramentas)

## O que é Tool Calling?

Tool Calling é a capacidade de um LLM (Large Language Model) **executar ações no mundo real** em vez de apenas gerar texto. O modelo interpreta a intenção do usuário e, quando precisa fazer algo concreto, retorna um JSON indicando qual ferramenta chamar e com quais parâmetros.

```
┌────────────────────────────────────────────────────────────────┐
│                      FLUXO DE TOOL CALLING                     │
└────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌──────────┐         ┌──────────────┐
    │ Usuário  │────────▶│   LLM    │────────▶│  Ferramenta  │
    │          │         │ (Gerente)│         │ (Assistente) │
    └──────────┘         └──────────┘         └──────────────┘
         │                    │                              │
         │  "Qual o preço     │  JSON:                       │
         │   do produto       │  {                           │
         │   P001?"           │   "tool": "buscar_produto",  │
         │                    │   "args": {"id":"P001"}      │
         │                    │  }                           │
         │                    │                              │
         │                    │◀─────────────────────────────│
         │                    │  Resultado:                  │
         │                    │  {"preco": 4500.00}          │
         │                    │                              │
         │◀───────────────────│                              │
         │  "O produto P001   │                              │
         │   custa R$ 4500"   │                              │
         │                    │                              │
```

## Analogia

Pense no LLM como um **gerente inteligente** que delega tarefas para **assistentes especializados** (as ferramentas):

- 📊 Precisa de dados? → Chama a ferramenta de banco de dados
- 📧 Precisa enviar email? → Chama a ferramenta de email
- 💰 Precisa calcular? → Chama a ferramenta de cálculo

O gerente não faz tudo sozinho, ele **delega** para quem sabe fazer melhor!

## Boas Práticas

### 1. Nomenclatura das Ferramentas

Use **imperativo + verbo forte + objeto**:

| ✅ Bom               | ❌ Ruim        |
| -------------------- | -------------- |
| `criar_fatura`       | `ferramenta1`  |
| `enviar_whatsapp`    | `ajuda`        |
| `cancelar_inscricao` | `processar`    |
| `buscar_produto`     | `funcao_dados` |

### 2. Descrições Claras

Defina bem a descrição da ferramenta E dos parâmetros:

```python
{
    "name": "buscar_produto",
    "description": "Busca informações detalhadas de um produto pelo seu ID. Retorna nome, preço e quantidade em estoque.",
    "parameters": {
        "produto_id": {
            "type": "string",
            "description": "ID único do produto. Exemplo: 'P001', 'P002'"
        }
    }
}
```

### 3. Use Enum para Opções Fixas

```python
"status": {
    "type": "string",
    "enum": ["pendente", "aprovado", "cancelado"],
    "description": "Status do pedido"
}
```

### 4. Ative o Strict Mode

Força o modelo a seguir o contrato definido:

```python
{
    "type": "function",
    "function": {
        "name": "buscar_produto",
        "strict": True,  # ← Importante!
        ...
    }
}
```

### 5. Parallel Tool Calling

Quando possível, chame múltiplas ferramentas em paralelo:

```
Usuário: "Tenho exames prontos? E qual a agenda do médico?"

LLM retorna duas chamadas simultâneas:
  1. buscar_exames_resultado()
  2. consultar_agenda_medico()
```

### 6. Valide no Backend

Mesmo com strict mode, **sempre valide os parâmetros no backend**:

```python
if nome_ferramenta not in FUNCOES_DISPONIVEIS:
    resultado = {"erro": f"Ferramenta '{nome_ferramenta}' não encontrada"}
```

## Como Rodar o Exemplo

```bash
# 1. Instale as dependências
pip install -r requirements.txt ou python3.10 -m pip install -r requirements.txt

# 2. Configure sua API key
export OPENAI_API_KEY="sua-chave-aqui"

# 3. Execute o exemplo
python tool_calling.py
```

## Estrutura do Exemplo

```
chamada-de-ferramentas/
├── tool_calling.py    # Exemplo prático completo
├── requirements.txt   # Dependências
└── README.md          # Esta documentação
```

## Ferramentas do Exemplo

| Ferramenta          | Descrição                               |
| ------------------- | --------------------------------------- |
| `buscar_produto`    | Busca informações de um produto pelo ID |
| `calcular_desconto` | Calcula preço final após desconto       |
| `verificar_estoque` | Verifica disponibilidade em estoque     |

## Saída Esperada

```
============================================================
Usuário: Qual o preço do produto P001?
============================================================

[Tool Calling] Modelo solicitou 1 ferramenta(s):
  - buscar_produto({'produto_id': 'P001'})
    Resultado: {'sucesso': True, 'produto': {'nome': 'Notebook Dell', 'preco': 4500.0, 'estoque': 15}}

[Resposta Final]
O produto P001 (Notebook Dell) custa R$ 4.500,00 e temos 15 unidades em estoque.
```

## Resumo

| Conceito          | Benefício                   |
| ----------------- | --------------------------- |
| Tool Calling      | LLM executa ações reais     |
| Strict Mode       | Garante contrato JSON       |
| Parallel Calling  | Múltiplas ações simultâneas |
| Validação Backend | Segurança adicional         |

**O objetivo das ferramentas é transformar o LLM em um executor confiável, seguro e barato!** 🚀
