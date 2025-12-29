import asyncio
import os
from datetime import datetime

from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="mcp-componentes",
    host="0.0.0.0",
    port=3334
)

# =============================================================================
# TOOLS - Funções executáveis expostas pelo server
# =============================================================================

@mcp.tool()
def search_emails(query: str, max_results: int = 10) -> dict:
    """Busca e-mails no Gmail (mock)."""
    
    # Simulação de busca - em produção usaria Gmail API
    mock_emails = [
        {
            "id": "001",
            "from": "cliente@exemplo.com",
            "subject": "Re: Reembolso",
            "preview": "Olá, gostaria de solicitar o reembolso..."
        },
        {
            "id": "002",
            "from": "suporte@empresa.com",
            "subject": "Ticket #123 atualizado",
            "preview": "Seu ticket foi atualizado com sucesso..."
        },
        {
            "id": "003",
            "from": "financeiro@exemplo.com",
            "subject": "Nota fiscal disponível",
            "preview": "A nota fiscal do mês está disponível..."
        }
    ]
    
    # Filtra por query (simulação simples)
    results = [
        email for email in mock_emails 
        if query.lower() in email["subject"].lower() or query.lower() in email["from"].lower()
    ][:max_results]
    
    return {"emails": results, "total": len(results)}


# =============================================================================
# RESOURCES - Dados ou arquivos acessíveis para leitura/escrita
# =============================================================================

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


@mcp.resource("file://report.txt")
def get_report() -> str:
    """Lê o conteúdo do arquivo report.txt."""
    file_path = os.path.join(DATA_DIR, "report.txt")
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


@mcp.tool()
def update_report(content: str) -> dict:
    """Atualiza o conteúdo do arquivo report.txt."""
    file_path = os.path.join(DATA_DIR, "report.txt")
    
    # Adiciona data dinâmica ao conteúdo
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    final_content = f"{content} - {timestamp}"
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(final_content)
    
    return {"success": True, "message": "Arquivo atualizado", "content": final_content}


# =============================================================================
# PROMPTS - Templates de prompts dinâmicos
# =============================================================================

@mcp.prompt()
def code_review_prompt() -> str:
    """Template de prompt para code review."""
    return """
Você é um engenheiro sênior. Revise o código fornecido focando em:
- Segurança
- Performance
- Legibilidade
Responda apenas com comentários acionáveis.
Código: {code}
"""


@mcp.prompt()
def data_analysis_prompt() -> str:
    """Template de prompt para análise de dados."""
    return """
Você é um analista de dados experiente. Analise os dados fornecidos focando em:
- Tendências principais
- Anomalias
- Insights acionáveis
Dados: {data}
"""


if __name__ == "__main__":
    print("Iniciando servidor MCP com todos os componentes...")
    print("Host: 0.0.0.0")
    print("Port: 3334")
    print("\nComponentes disponíveis:")
    print("- Tools: search_emails, update_report")
    print("- Resources: file://report.txt")
    print("- Prompts: code_review_prompt, data_analysis_prompt")
    mcp.run(transport="sse")

