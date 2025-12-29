from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="mcp-clinico-anestesia",
    host="0.0.0.0",
    port=3333
)

@mcp.tool()
def buscar_medicamento(nome: str) -> dict:

    nome = nome.lower()

    if nome == "propofol":
        return {
            "medicamento": "Propofol",
            "classe": "Anestésico geral intravenoso",
            "indicacao": "Indução e manutenção da anestesia",
            "efeitos_colaterais": [
                "Hipotensão",
                "Depressão respiratória",
                "Bradicardia leve"
            ]
        }

    return {"erro": "Medicamento não encontrado"}


if __name__ == "__main__":
    mcp.run(transport="sse")

