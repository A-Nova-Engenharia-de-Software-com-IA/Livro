import asyncio

from mcp import ClientSession
from mcp.client.sse import sse_client


async def main():
    async with sse_client("http://localhost:3334/sse") as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()

            # =====================================================================
            # TOOLS - Descoberta e execução de ferramentas
            # =====================================================================
            
            print("=" * 60)
            print("TOOLS - Ferramentas disponíveis")
            print("=" * 60)
            
            tools_result = await session.list_tools()
            for tool in tools_result.tools:
                print(f"- {tool.name}: {tool.description}")
            
            print("\n>> Executando: search_emails")
            result = await session.call_tool(
                "search_emails",
                {"query": "reembolso", "max_results": 5}
            )
            print(f"Resultado: {result}")
            
            # =====================================================================
            # RESOURCES - Leitura e manipulação de recursos
            # =====================================================================
            
            print("\n" + "=" * 60)
            print("RESOURCES - Recursos disponíveis")
            print("=" * 60)
            
            resources_result = await session.list_resources()
            for resource in resources_result.resources:
                print(f"- {resource.uri}: {resource.name}")
            
            print("\n>> Lendo recurso: file://report.txt")
            content = await session.read_resource("file://report.txt")
            print(f"Conteúdo atual: {content}")
            
            print("\n>> Atualizando recurso via tool update_report")
            result = await session.call_tool(
                "update_report",
                {"content": "novo conteúdo atualizado"}
            )
            print(f"Resultado: {result}")
            
            print("\n>> Lendo recurso novamente após atualização")
            content = await session.read_resource("file://report.txt")
            print(f"Novo conteúdo: {content}")
            
            # =====================================================================
            # PROMPTS - Templates dinâmicos
            # =====================================================================
            
            print("\n" + "=" * 60)
            print("PROMPTS - Templates disponíveis")
            print("=" * 60)
            
            prompts_result = await session.list_prompts()
            for prompt in prompts_result.prompts:
                print(f"- {prompt.name}: {prompt.description}")
            
            print("\n>> Obtendo template: code_review_prompt")
            template = await session.get_prompt("code_review_prompt")
            print(f"Template: {template}")
            
            # Exemplo de uso do template
            code_exemplo = "def soma(a, b): return a + b"
            if hasattr(template, 'messages') and template.messages:
                prompt_text = template.messages[0].content.text
                prompt_final = prompt_text.replace("{code}", code_exemplo)
                print(f"\nPrompt final formatado:\n{prompt_final}")


if __name__ == "__main__":
    asyncio.run(main())
