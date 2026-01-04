from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

# Configuração
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)
client = OpenAI()


# Cores ANSI para terminal
class Cores:
    RESET = "\033[0m"
    CINZA = "\033[90m"
    AMARELO = "\033[93m"
    VERDE = "\033[92m"
    AZUL = "\033[94m"
    CIANO = "\033[96m"
    MAGENTA = "\033[95m"
    NEGRITO = "\033[1m"


class StreamingAgent:
    """
    Agente com streaming em tempo real.
    Mostra o processo de pensamento do modelo (Chain of Thought)
    conforme ele é gerado, token por token.
    """

    def __init__(self):
        # Instrução para mostrar o pensamento (Chain of Thought)
        self.instrucao = """Você é um assistente que mostra seu processo de raciocínio.

IMPORTANTE: Sempre estruture sua resposta assim:

<pensando>
[Aqui você mostra seus passos de raciocínio]
- Passo 1: Analisar a pergunta...
- Passo 2: Considerar aspectos relevantes...
- Passo 3: Formular a resposta...
</pensando>

<resposta>
[Aqui você dá a resposta final, detalhada e completa com exemplos]
</resposta>

Seja detalhado no pensamento E na resposta."""

    def responder(self, mensagem: str):
        """
        Mostra o processo de pensamento do agente em tempo real.
        Usa Chain of Thought para exibir os passos de raciocínio.
        """
        print("\n" + "=" * 60)
        print(f"{Cores.MAGENTA}🧠 AGENTE PENSANDO EM TEMPO REAL{Cores.RESET}")
        print("=" * 60)
        print(f"📝 Pergunta: {mensagem}")
        print("-" * 60)

        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": self.instrucao},
                {"role": "user", "content": mensagem}
            ],
            stream=True,
            stream_options={"include_usage": True}
        )

        resposta_completa = []
        dentro_pensamento = False
        dentro_resposta = False
        buffer = ""

        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content is not None:
                token = chunk.choices[0].delta.content
                resposta_completa.append(token)
                buffer += token

                # Detecta início do bloco de pensamento
                if "<pensando>" in buffer and not dentro_pensamento:
                    dentro_pensamento = True
                    print(f"\n{Cores.AMARELO}💭 PENSANDO...{Cores.RESET}")
                    print(f"{Cores.CINZA}", end="")
                    buffer = buffer.replace("<pensando>", "")

                # Detecta fim do bloco de pensamento
                elif "</pensando>" in buffer and dentro_pensamento:
                    dentro_pensamento = False
                    texto_antes = buffer.split("</pensando>")[0]
                    print(texto_antes, end="", flush=True)
                    print(f"{Cores.RESET}")
                    print(f"\n{Cores.VERDE}✅ Pensamento concluído!{Cores.RESET}")
                    buffer = buffer.split("</pensando>")[-1] if "</pensando>" in buffer else ""

                # Detecta início da resposta
                elif "<resposta>" in buffer and not dentro_resposta:
                    dentro_resposta = True
                    print(f"\n{Cores.AZUL}📢 RESPOSTA:{Cores.RESET}")
                    print(f"{Cores.NEGRITO}", end="")
                    buffer = buffer.replace("<resposta>", "")

                # Detecta fim da resposta
                elif "</resposta>" in buffer and dentro_resposta:
                    dentro_resposta = False
                    texto_antes = buffer.split("</resposta>")[0]
                    print(texto_antes, end="", flush=True)
                    print(f"{Cores.RESET}")
                    buffer = ""

                # Imprime tokens normalmente durante pensamento ou resposta
                elif dentro_pensamento or dentro_resposta:
                    if "<" not in buffer:
                        print(buffer, end="", flush=True)
                        buffer = ""
                    elif len(buffer) > 20:
                        print(buffer, end="", flush=True)
                        buffer = ""

            # Estatísticas no final
            if chunk.usage is not None:
                print("\n" + "-" * 60)
                print(f"{Cores.CIANO}📊 ESTATÍSTICAS:{Cores.RESET}")
                print(f"   • Tokens de entrada: {chunk.usage.prompt_tokens}")
                print(f"   • Tokens de saída: {chunk.usage.completion_tokens}")
                print(f"   • Total: {chunk.usage.total_tokens}")

        print("=" * 60 + "\n")
        return "".join(resposta_completa)


def main():
    """Loop principal do agente."""
    agente = StreamingAgent()

    print("\n" + "=" * 60)
    print(f"{Cores.MAGENTA}🧠 AGENTE COM PENSAMENTO EM TEMPO REAL{Cores.RESET}")
    print("=" * 60)
    print("Faça uma pergunta e veja o agente pensar!")
    print("Digite 'sair' para encerrar.")
    print("=" * 60)

    while True:
        try:
            msg = input(f"\n{Cores.AZUL}💬 Você:{Cores.RESET} ").strip()

            if not msg:
                continue

            if msg.lower() == 'sair':
                print(f"\n{Cores.VERDE}👋 Até logo!{Cores.RESET}")
                break

            agente.responder(msg)

        except KeyboardInterrupt:
            print(f"\n\n{Cores.VERDE}👋 Interrompido pelo usuário. Até logo!{Cores.RESET}")
            break


if __name__ == "__main__":
    main()
