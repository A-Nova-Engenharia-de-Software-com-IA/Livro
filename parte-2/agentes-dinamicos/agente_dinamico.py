import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

# Configuração
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)
client = OpenAI()


class AgenteDinamico:
    def __init__(self):
        self.plano = None  # "gratis" ou "pago"
        self.historico = []  # histórico da conversa atual (somente em RAM)

    def perguntar_plano(self):
        return "Qual seu plano? (grátis/pago)"

    def definir_plano(self, resposta):
        resposta = resposta.lower().strip()
        if "gratis" in resposta or "grátis" in resposta:
            self.plano = "gratis"
            return "Entendi! Você tem o plano GRÁTIS. Suas respostas serão curtas e diretas."
        elif "pago" in resposta or "premium" in resposta:
            self.plano = "pago"
            return "Excelente! Você tem o plano PAGO. Suas respostas serão completas e detalhadas."
        else:
            return self.perguntar_plano()

    def responder(self, mensagem):
        # Se ainda não sabe o plano, pergunta primeiro
        if self.plano is None:
            return self.definir_plano(mensagem)

        # Cria instrução baseada no plano
        if self.plano == "gratis":
            instrucao = "Seja muito breve e direto. Responda em no máximo 2 frases."
        else:
            instrucao = "Seja detalhado e completo. Explique com exemplos e contexto."

        # Adiciona a mensagem do usuário ao histórico
        self.historico.append({"role": "user", "content": mensagem})

        # Monta o contexto: system prompt + histórico completo
        messages = [{"role": "system", "content": instrucao}] + self.historico

        try:
            resposta = client.chat.completions.create(
                model="gpt-4o-mini", messages=messages
            )
            conteudo = resposta.choices[0].message.content
        except Exception as e:
            self.historico.pop()  # remove a mensagem que falhou
            return f"Erro ao chamar a API: {e}"

        # Adiciona a resposta do agente ao histórico
        self.historico.append({"role": "assistant", "content": conteudo})

        return conteudo


if __name__ == "__main__":
    agente = AgenteDinamico()

    print("🤖 AGENTE DINÂMICO SIMPLES")
    print("=========================")

    while True:
        msg = input("Você: ").strip()
        if msg.lower() == "sair":
            break

        resposta = agente.responder(msg)
        print(f"🤖 Agente: {resposta}")
        print()
