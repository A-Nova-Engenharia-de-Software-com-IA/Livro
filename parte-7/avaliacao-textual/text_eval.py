"""
Avaliação Textual de Agentes de IA

Este exemplo demonstra como implementar avaliações automáticas para:
1. Precisão (Accuracy) - A resposta está correta?
2. Fidelidade (Faithfulness) - A resposta é fiel ao contexto fornecido?
3. Alucinação (Hallucination) - A resposta inventou informações?

Essas métricas são essenciais para agentes que operam em:
- Saúde, jurídico, financeiro
- RAG e sistemas baseados em documentos
- Auditoria e governança
"""

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

# ========================
# CONFIGURAÇÃO
# ========================
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)

if not os.environ.get("OPENAI_API_KEY"):
    print("⚠️  AVISO: OPENAI_API_KEY não configurada!")
    print(
        "   Crie um arquivo .env na raiz do projeto seguindo o exemplo em .env.example"
    )
    print("   Ou configure com: export OPENAI_API_KEY='sua-chave-aqui'\n")

client = OpenAI()


# =============================================================================
# AVALIADORES (EVALS)
# =============================================================================


def evaluate_accuracy(source: str, output: str) -> dict:
    """
    Avalia a PRECISÃO da resposta.

    Verifica se as informações principais da resposta estão corretas
    em relação ao texto-fonte.

    Returns:
        dict com score (0-1) e explicação
    """
    prompt = f"""Você é um avaliador rigoroso de precisão textual.

TEXTO-FONTE (verdade):
{source}

RESPOSTA DO AGENTE:
{output}

TAREFA:
Avalie se a resposta do agente está PRECISA em relação ao texto-fonte.
Verifique cada informação factual (datas, nomes, números, descrições).

Responda APENAS em JSON com o formato:
{{
    "score": <float entre 0 e 1>,
    "corretas": ["lista de informações corretas"],
    "incorretas": ["lista de informações incorretas ou imprecisas"],
    "explicacao": "breve explicação da avaliação"
}}

Score: 1.0 = totalmente preciso, 0.0 = totalmente impreciso"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)


def evaluate_faithfulness(source: str, output: str) -> dict:
    """
    Avalia a FIDELIDADE da resposta ao texto-fonte.

    Verifica se o agente representou corretamente as informações
    sem distorcer ou alterar o significado original.

    Returns:
        dict com score (0-1) e explicação
    """
    prompt = f"""Você é um avaliador rigoroso de fidelidade textual.

TEXTO-FONTE (original):
{source}

RESPOSTA DO AGENTE:
{output}

TAREFA:
Avalie se a resposta do agente é FIEL ao texto-fonte.
Fidelidade significa:
- Não distorcer informações
- Não alterar o significado original
- Manter a interpretação correta dos fatos

Responda APENAS em JSON com o formato:
{{
    "score": <float entre 0 e 1>,
    "fiel": ["informações representadas fielmente"],
    "distorcido": ["informações distorcidas ou mal interpretadas"],
    "explicacao": "breve explicação da avaliação"
}}

Score: 1.0 = totalmente fiel, 0.0 = totalmente infiel"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)


def evaluate_hallucination(source: str, output: str) -> dict:
    """
    Avalia ALUCINAÇÕES na resposta.

    Detecta se o agente inventou informações que não existem
    no texto-fonte fornecido.

    Returns:
        dict com score (0-1) e lista de alucinações
    """
    prompt = f"""Você é um detector de alucinações em IA.

TEXTO-FONTE (única verdade):
{source}

RESPOSTA DO AGENTE:
{output}

TAREFA:
Identifique ALUCINAÇÕES na resposta do agente.
Alucinação = informação que NÃO está presente no texto-fonte.

Responda APENAS em JSON com o formato:
{{
    "score": <float entre 0 e 1>,
    "alucinacoes": ["lista de informações inventadas"],
    "fundamentado": ["informações que estão no texto-fonte"],
    "explicacao": "breve explicação da avaliação"
}}

Score: 1.0 = sem alucinações, 0.0 = totalmente alucinado"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)


def run_all_evals(source: str, output: str) -> dict:
    """
    Executa todas as avaliações e retorna um relatório consolidado.

    Args:
        source: Texto-fonte (verdade)
        output: Resposta gerada pelo agente

    Returns:
        dict com scores de todas as métricas
    """
    print("\n📊 Executando avaliações...\n")

    accuracy = evaluate_accuracy(source, output)
    faithfulness = evaluate_faithfulness(source, output)
    hallucination = evaluate_hallucination(source, output)

    return {
        "accuracy": accuracy,
        "faithfulness": faithfulness,
        "hallucination": hallucination,
    }


def print_eval_report(results: dict):
    """Imprime um relatório formatado das avaliações."""
    print("\n" + "=" * 70)
    print("📋 RELATÓRIO DE AVALIAÇÃO TEXTUAL")
    print("=" * 70)

    # Precisão
    acc = results["accuracy"]
    print(f"\n🎯 PRECISÃO (Accuracy): {acc['score']:.2f}")
    print(f"   {acc['explicacao']}")
    if acc.get("incorretas"):
        print(f"   ❌ Incorretas: {acc['incorretas']}")

    # Fidelidade
    faith = results["faithfulness"]
    print(f"\n📖 FIDELIDADE (Faithfulness): {faith['score']:.2f}")
    print(f"   {faith['explicacao']}")
    if faith.get("distorcido"):
        print(f"   ⚠️  Distorcido: {faith['distorcido']}")

    # Alucinação
    hall = results["hallucination"]
    print(f"\n🔮 ALUCINAÇÃO (Hallucination): {hall['score']:.2f}")
    print(f"   {hall['explicacao']}")
    if hall.get("alucinacoes"):
        print(f"   🚨 Alucinações: {hall['alucinacoes']}")

    # Score médio
    avg_score = (acc["score"] + faith["score"] + hall["score"]) / 3
    print("\n" + "-" * 70)
    print(f"📈 SCORE MÉDIO: {avg_score:.2f}")

    if avg_score >= 0.8:
        print("   ✅ Resposta de alta qualidade")
    elif avg_score >= 0.5:
        print("   ⚠️  Resposta com problemas moderados")
    else:
        print("   ❌ Resposta com problemas graves - requer revisão")

    print("=" * 70)


# =============================================================================
# EXEMPLOS DE USO
# =============================================================================

if __name__ == "__main__":
    # Texto-fonte (a verdade)
    source_text = """
    A Company é uma empresa brasileira especializada em tecnologias para saúde,
    incluindo sistemas de prontuário, captura de dados, integrações hospitalares e gestão clínica.
    Fundada em 2016, atende hospitais em todo o país com foco em segurança do paciente.
    """

    # Resposta do agente com erros (simulando problemas típicos)
    agent_output_ruim = """
    A Company é uma empresa norte-americana fundada em 2014 que desenvolve
    equipamentos médicos e softwares para cirurgias neurológicas.
    """

    # Resposta do agente correta
    agent_output_bom = """
    A Company é uma empresa brasileira de tecnologia para saúde, fundada em 2016.
    Oferece sistemas de prontuário eletrônico, integrações hospitalares e gestão clínica,
    atendendo hospitais em todo o Brasil com foco na segurança do paciente.
    """

    print("\n" + "=" * 70)
    print("🧪 EXEMPLO 1: Resposta com ERROS (alucinações e imprecisões)")
    print("=" * 70)

    print("\n📄 TEXTO-FONTE:")
    print(source_text.strip())

    print("\n🤖 RESPOSTA DO AGENTE:")
    print(agent_output_ruim.strip())

    results_ruim = run_all_evals(source_text, agent_output_ruim)
    print_eval_report(results_ruim)

    input("\n⏸️  Pressione ENTER para ver o próximo exemplo...")

    print("\n" + "=" * 70)
    print("🧪 EXEMPLO 2: Resposta CORRETA")
    print("=" * 70)

    print("\n📄 TEXTO-FONTE:")
    print(source_text.strip())

    print("\n🤖 RESPOSTA DO AGENTE:")
    print(agent_output_bom.strip())

    results_bom = run_all_evals(source_text, agent_output_bom)
    print_eval_report(results_bom)

    print("\n✅ Avaliação concluída!")
