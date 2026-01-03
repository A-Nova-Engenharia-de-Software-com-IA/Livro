"""
Suspend & Resume - Aprovação de Reembolso

Fluxo:
    1. iniciar  -> LLM decide "Reembolsar R$ X" -> SUSPEND
    2. aprovar  -> RESUME -> Executa reembolso
    3. rejeitar -> RESUME -> Cancela

Comandos:
    python suspend_resume.py iniciar
    python suspend_resume.py status
    python suspend_resume.py aprovar [ID]
    python suspend_resume.py rejeitar [ID]
"""

import json
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

# Configuração
root_dir = Path(__file__).parent.parent.parent
load_dotenv(root_dir / ".env")
client = OpenAI()

STORAGE_DIR = Path(__file__).parent / "states"
STORAGE_DIR.mkdir(exist_ok=True)

RECLAMACAO = """
Pedido #12345 - João Silva
Produto: Notebook Gamer - R$ 4.500,00
Problema: Não recebi o produto. Prazo era 5 dias, já passaram 15.
"""


class DecisaoAgente(BaseModel):
    acao: str
    valor: float
    justificativa: str


# Persistência
def salvar_estado(workflow_id: str, estado: dict) -> None:
    with open(STORAGE_DIR / f"{workflow_id}.json", "w") as f:
        json.dump(estado, f, indent=2, ensure_ascii=False)


def listar_suspensos() -> list[dict]:
    suspensos = []
    for filepath in STORAGE_DIR.glob("*.json"):
        estado = json.loads(filepath.read_text())
        if estado.get("status") == "suspenso":
            suspensos.append(estado)
    return suspensos


def deletar_estado(workflow_id: str) -> None:
    filepath = STORAGE_DIR / f"{workflow_id}.json"
    if filepath.exists():
        filepath.unlink()


# LLM
def analisar_reclamacao() -> DecisaoAgente:
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """Você é um agente de suporte. Analise a reclamação e decida:
- Se o cliente não recebeu o produto, recomende REEMBOLSO do valor total.
- Justifique brevemente sua decisão."""
            },
            {"role": "user", "content": RECLAMACAO}
        ],
        response_format=DecisaoAgente
    )
    return response.choices[0].message.parsed


def gerar_mensagem_cliente(aprovado: bool, estado: dict) -> str:
    if aprovado:
        contexto = f"""
        Pedido: {estado['pedido']}
        Ação: Reembolso APROVADO
        Valor: R$ {estado['decisao']['valor']:.2f}
        Transação: {estado['resultado']['transacao_id']}
        """
        instrucao = "Gere uma mensagem curta informando que o reembolso foi aprovado e processado. Informe o prazo de 5 dias úteis."
    else:
        contexto = f"""
        Pedido: {estado['pedido']}
        Ação: Reembolso NEGADO
        """
        instrucao = "Gere uma mensagem curta informando que o reembolso não foi aprovado. Sugira entrar em contato para mais informações."

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"""Você é um atendente de suporte.
{instrucao}
Seja breve e profissional. Não faça perguntas."""
            },
            {"role": "user", "content": contexto}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content


# Comandos
def cmd_iniciar() -> None:
    workflow_id = f"WF-{datetime.now().strftime('%H%M%S')}"

    print(f"\n{'='*60}\nWORKFLOW: ANÁLISE DE RECLAMAÇÃO\n{'='*60}")
    print(f"\nReclamação:{RECLAMACAO}")

    print("\n[ETAPA 1] Agente analisando...")
    decisao = analisar_reclamacao()
    print(f"[ETAPA 1] Decisão: {decisao.acao.upper()} R$ {decisao.valor:.2f}")

    print("\n[ETAPA 2] SUSPENDENDO - Aguarda aprovação humana")

    estado = {
        "workflow_id": workflow_id,
        "pedido": "#12345",
        "status": "suspenso",
        "suspenso_em": datetime.now().isoformat(),
        "decisao": {"acao": decisao.acao, "valor": decisao.valor, "justificativa": decisao.justificativa}
    }
    salvar_estado(workflow_id, estado)

    print(f"\n{'='*60}\nSUSPENSO: {workflow_id}\n{'='*60}")
    print(f"\nAção pendente: {decisao.acao.upper()} R$ {decisao.valor:.2f}")
    print(f"Motivo: {decisao.justificativa}")
    print("\nComandos: aprovar | rejeitar")


def cmd_status() -> None:
    suspensos = listar_suspensos()
    print(f"\n{'='*60}\nPENDENTES\n{'='*60}")

    if not suspensos:
        print("\nNenhum workflow pendente.")
        return

    for wf in suspensos:
        print(f"\n[{wf['workflow_id']}] {wf['decisao']['acao'].upper()} R$ {wf['decisao']['valor']:.2f}")


def cmd_retomar(aprovado: bool, workflow_id: str = None) -> None:
    suspensos = listar_suspensos()

    if not suspensos:
        print("\nNenhum workflow pendente.")
        return

    if workflow_id is None:
        if len(suspensos) == 1:
            estado = suspensos[0]
            workflow_id = estado["workflow_id"]
        else:
            print("\nMúltiplos pendentes. Especifique o ID:")
            for wf in suspensos:
                print(f"  - {wf['workflow_id']}")
            return
    else:
        estado = next((wf for wf in suspensos if wf["workflow_id"] == workflow_id), None)
        if not estado:
            print(f"\nWorkflow '{workflow_id}' não encontrado.")
            return

    print(f"\n{'='*60}\nRETOMANDO: {workflow_id}\n{'='*60}")
    print(f"\n[RESUME] Ação: {estado['decisao']['acao'].upper()} R$ {estado['decisao']['valor']:.2f}")

    if aprovado:
        print("\n[ETAPA 3] Executando reembolso...")
        print("[RESUME] APROVADO!")
        estado["resultado"] = {
            "transacao_id": f"TXN-{datetime.now().strftime('%H%M%S')}",
            "valor": estado["decisao"]["valor"]
        }
        print(f"[ETAPA 3] Reembolso processado: {estado['resultado']['transacao_id']}")

        mensagem = gerar_mensagem_cliente(True, estado)
        print(f"\n{'='*60}\nMENSAGEM AO CLIENTE:\n{'-'*60}\n{mensagem}\n{'='*60}")
    else:
        print("\n[ETAPA 3] Executando cancelamento...")
        print("[RESUME] CANCELADO!")
        estado["resultado"] = {
            "transacao_id": f"TXN-{datetime.now().strftime('%H%M%S')}",
            "valor": estado["decisao"]["valor"]
        }
        print(f"[ETAPA 3] Cancelamento processado: {estado['resultado']['transacao_id']}")
        mensagem = gerar_mensagem_cliente(False, estado)
        print(f"\n{'='*60}\nMENSAGEM AO CLIENTE:\n{'-'*60}\n{mensagem}\n{'='*60}")

    deletar_estado(workflow_id)
    print("\nPara novo workflow: python suspend_resume.py iniciar")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    cmd = sys.argv[1].lower()
    wf_id = sys.argv[2] if len(sys.argv) > 2 else None

    if cmd == "iniciar":
        cmd_iniciar()
    elif cmd == "status":
        cmd_status()
    elif cmd == "aprovar":
        cmd_retomar(True, wf_id)
    elif cmd == "rejeitar":
        cmd_retomar(False, wf_id)
    else:
        print(__doc__)
