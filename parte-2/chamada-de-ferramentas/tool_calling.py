"""
Exemplo prático de Tool Calling (Chamada de Ferramentas)

Este exemplo demonstra como:
1. Definir ferramentas com schemas claros
2. Deixar o modelo decidir qual ferramenta usar
3. Executar a ferramenta e retornar o resultado ao modelo
4. Gerar a resposta final em linguagem natural
"""
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

# ========================
# CONFIGURAÇÃO
# ========================
# Carrega variáveis de ambiente do arquivo .env na raiz do projeto
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)

# Verifica se a variável de ambiente OPENAI_API_KEY está configurada
if not os.environ.get("OPENAI_API_KEY"):
    print("⚠️  AVISO: OPENAI_API_KEY não configurada!")
    print("   Crie um arquivo .env na raiz do projeto seguindo o exemplo em .env.example")
    print("   Ou configure com: export OPENAI_API_KEY='sua-chave-aqui'\n")

client = OpenAI()

# =============================================================================
# PASSO 1: Definir as ferramentas (funções) disponíveis
# =============================================================================

# Simulação de banco de dados de produtos
PRODUTOS_DB = {
    "P001": {"nome": "Notebook Dell", "preco": 4500.00, "estoque": 15},
    "P002": {"nome": "Mouse Logitech", "preco": 150.00, "estoque": 50},
    "P003": {"nome": "Teclado Mecânico", "preco": 350.00, "estoque": 0},
    "P004": {"nome": "Monitor 27 polegadas", "preco": 1800.00, "estoque": 8},
}

def buscar_produto(produto_id: str) -> dict:
    """Busca informações de um produto pelo ID."""
    if produto_id in PRODUTOS_DB:
        return {"sucesso": True, "produto": PRODUTOS_DB[produto_id]}
    return {"sucesso": False, "erro": f"Produto {produto_id} não encontrado"}


def calcular_desconto(preco: float, percentual_desconto: float) -> dict:
    """Calcula o preço final após aplicar um desconto."""
    desconto = preco * (percentual_desconto / 100)
    preco_final = preco - desconto
    return {
        "preco_original": preco,
        "percentual_desconto": percentual_desconto,
        "valor_desconto": round(desconto, 2),
        "preco_final": round(preco_final, 2),
    }


def verificar_estoque(produto_id: str) -> dict:
    """Verifica a disponibilidade de estoque de um produto."""
    if produto_id in PRODUTOS_DB:
        produto = PRODUTOS_DB[produto_id]
        disponivel = produto["estoque"] > 0
        return {
            "produto_id": produto_id,
            "nome": produto["nome"],
            "quantidade_estoque": produto["estoque"],
            "disponivel": disponivel,
            "status": "em_estoque" if disponivel else "esgotado",
        }
    return {"sucesso": False, "erro": f"Produto {produto_id} não encontrado"}


# =============================================================================
# PASSO 2: Definir o schema das ferramentas para o modelo
# =============================================================================

# Seguindo boas práticas:
# - Nome no imperativo (verbo forte + objeto)
# - Descrição clara da ferramenta e parâmetros
# - Uso de enum para opções fixas
# - Strict mode ativado

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "buscar_produto",
            "description": "Busca informações detalhadas de um produto pelo seu ID. Retorna nome, preço e quantidade em estoque.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "produto_id": {
                        "type": "string",
                        "description": "ID único do produto. Exemplo: 'P001', 'P002'",
                    }
                },
                "required": ["produto_id"],
                "additionalProperties": False,
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calcular_desconto",
            "description": "Calcula o preço final de um produto após aplicar um percentual de desconto.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "preco": {
                        "type": "number",
                        "description": "Preço original do produto em reais. Exemplo: 100.00",
                    },
                    "percentual_desconto": {
                        "type": "number",
                        "description": "Percentual de desconto a ser aplicado (0-100). Exemplo: 15 para 15%",
                    },
                },
                "required": ["preco", "percentual_desconto"],
                "additionalProperties": False,
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "verificar_estoque",
            "description": "Verifica se um produto está disponível em estoque e retorna a quantidade disponível.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "produto_id": {
                        "type": "string",
                        "description": "ID único do produto. Exemplo: 'P001', 'P002'",
                    }
                },
                "required": ["produto_id"],
                "additionalProperties": False,
            },
        },
    },
]

# Mapeamento de nome da ferramenta para função Python
FUNCOES_DISPONIVEIS = {
    "buscar_produto": buscar_produto,
    "calcular_desconto": calcular_desconto,
    "verificar_estoque": verificar_estoque,
}


# =============================================================================
# PASSO 3: Função principal que orquestra o fluxo de tool calling
# =============================================================================


def processar_mensagem(mensagem_usuario: str) -> str:
    """
    Processa a mensagem do usuário utilizando tool calling.
    
    Fluxo:
    1. Envia mensagem + ferramentas para o modelo
    2. Modelo decide se precisa chamar alguma ferramenta
    3. Se sim, executa a ferramenta e retorna o resultado
    4. Modelo gera resposta final em linguagem natural
    """
    print(f"\n{'='*60}")
    print(f"Usuário: {mensagem_usuario}")
    print(f"{'='*60}")

    messages = [
        {
            "role": "system",
            "content": """Você é um assistente de e-commerce prestativo.
Você tem acesso a ferramentas para buscar produtos, calcular descontos e verificar estoque.
Sempre use as ferramentas disponíveis para obter informações precisas.
Responda sempre em português brasileiro de forma clara e objetiva.""",
        },
        {"role": "user", "content": mensagem_usuario},
    ]

    # Primeira chamada: modelo decide se precisa usar ferramentas
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=TOOLS,
        tool_choice="auto",  # Modelo decide automaticamente
    )

    response_message = response.choices[0].message

    # Verifica se o modelo quer chamar ferramentas
    if response_message.tool_calls:
        print(f"\n[Tool Calling] Modelo solicitou {len(response_message.tool_calls)} ferramenta(s):")
        
        # Adiciona a resposta do assistente ao histórico
        messages.append(response_message)

        # Executa cada ferramenta solicitada (suporta parallel tool calling!)
        for tool_call in response_message.tool_calls:
            nome_ferramenta = tool_call.function.name
            argumentos = json.loads(tool_call.function.arguments)

            print(f"  - {nome_ferramenta}({argumentos})")

            # Valida se a ferramenta existe (validação no backend)
            if nome_ferramenta not in FUNCOES_DISPONIVEIS:
                resultado = {"erro": f"Ferramenta '{nome_ferramenta}' não encontrada"}
            else:
                # Executa a ferramenta
                funcao = FUNCOES_DISPONIVEIS[nome_ferramenta]
                resultado = funcao(**argumentos)

            print(f"    Resultado: {resultado}")

            # Adiciona o resultado da ferramenta ao histórico
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(resultado, ensure_ascii=False),
                }
            )

        # Segunda chamada: modelo gera resposta final com os resultados
        response_final = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
        )

        resposta = response_final.choices[0].message.content
    else:
        # Modelo respondeu diretamente sem usar ferramentas
        resposta = response_message.content

    print(f"\n[Resposta Final]")
    print(resposta)
    
    return resposta


# =============================================================================
# PASSO 4: Exemplos de uso
# =============================================================================

if __name__ == "__main__":
    # Exemplo 1: Busca simples de produto
    processar_mensagem("Qual o preço do produto P001?")

    # Exemplo 2: Verificação de estoque
    processar_mensagem("O produto P003 está disponível em estoque?")

    # Exemplo 3: Cálculo de desconto
    processar_mensagem("Se eu aplicar 20% de desconto em um produto de R$ 500, quanto fica?")

    # Exemplo 4: Parallel Tool Calling - múltiplas ferramentas ao mesmo tempo!
    processar_mensagem("Quero saber o preço do P002 e se o P004 tem em estoque")

    # Exemplo 5: Combinação de ferramentas
    processar_mensagem("Busque o produto P001 e calcule quanto ficaria com 15% de desconto")
