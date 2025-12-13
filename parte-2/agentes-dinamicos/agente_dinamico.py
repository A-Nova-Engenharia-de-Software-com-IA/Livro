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

    def perguntar_plano(self):
        return "Qual seu plano? (gratis/pago)"

    def definir_plano(self, resposta):
        resposta = resposta.lower().strip()
        if "gratis" in resposta or "free" in resposta:
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

        # Usa OpenAI
        resposta = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": instrucao},
                {"role": "user", "content": mensagem}
            ]
        )

        return resposta.choices[0].message.content

if __name__ == "__main__":
    agente = AgenteDinamico()

    print("🤖 AGENTE DINÂMICO SIMPLES")
    print("=========================")

    while True:
        msg = input("Você: ").strip()
        if msg.lower() == 'sair':
            break

        resposta = agente.responder(msg)
        print(f"🤖 Agente: {resposta}")
        print()