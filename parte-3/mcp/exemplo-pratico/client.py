import asyncio

from mcp import ClientSession
from mcp.client.sse import sse_client


async def main():
    server_url = "http://localhost:3333/sse"

    async with sse_client(server_url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            print("\nFerramentas disponíveis:\n")

            tools_result = await session.list_tools()
            for tool in tools_result.tools:
                print(f"- {tool.name}")

            print("\nBuscando: Propofol\n")

            result = await session.call_tool(
                "buscar_medicamento",
                {"nome": "Propofol"}
            )

            print("Resposta:")
            print(result)


if __name__ == "__main__":
    asyncio.run(main())
