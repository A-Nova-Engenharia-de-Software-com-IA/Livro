"""
Exemplo de Merging (Convergência) com OpenAI

Merging = Reunião de especialistas
Após ramificação (branching), os resultados são combinados em uma conclusão única.

Exemplo: Três análises paralelas de um prontuário são reunidas
para gerar um diagnóstico consolidado.
"""

import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import AsyncOpenAI

# ========================
# CONFIGURAÇÃO
# ========================
root_dir = Path(__file__).parent.parent.parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)
client = AsyncOpenAI()


# ============================================
# FUNÇÃO DE ANÁLISE DE UM RAMO
# ============================================
async def analisar_ramo(texto: str, foco: str, instrucao: str) -> dict:
    """Executa análise de um ramo específico."""
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": instrucao},
            {"role": "user", "content": texto}
        ],
        max_tokens=200
    )
    return {
        "foco": foco,
        "resultado": response.choices[0].message.content
    }


# ============================================
# BRANCHING: DISPARA ANÁLISES EM PARALELO
# ============================================
async def branching(prontuario: str) -> list[dict]:
    """Divide a análise em múltiplos ramos paralelos."""
    
    ramos = [
        ("Sintomas", "Analise APENAS os sintomas. Seja breve."),
        ("Exames", "Analise APENAS os exames laboratoriais. Seja breve."),
        ("Medicamentos", "Analise APENAS os medicamentos em uso. Seja breve."),
    ]
    
    print("[BRANCHING] Disparando 3 análises paralelas...")
    
    tarefas = [
        analisar_ramo(prontuario, foco, instrucao)
        for foco, instrucao in ramos
    ]
    
    resultados = await asyncio.gather(*tarefas)
    print("[BRANCHING] Concluído!\n")
    
    return resultados


# ============================================
# MERGING: CONVERGE OS RESULTADOS
# ============================================
async def merging(resultados: list[dict]) -> str:
    """
    Etapa de MERGING: combina todos os resultados em uma conclusão única.
    
    - Recebe análises de diferentes especialistas
    - Cruza as informações
    - Gera visão unificada e coerente
    """
    print("[MERGING] Convergindo resultados...")
    
    # Formata os resultados para o prompt
    analises_formatadas = "\n\n".join([
        f"=== ANÁLISE DE {r['foco'].upper()} ===\n{r['resultado']}"
        for r in resultados
    ])
    
    # LLM gera síntese unificada
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """Você é um médico experiente que recebe análises de diferentes especialistas.

Sua tarefa:
1. Combine todas as análises em uma conclusão única
2. Cruze as informações (ex: sintomas + exames podem indicar algo)
3. Destaque pontos importantes
4. Forneça uma recomendação clara

Seja objetivo e estruturado."""
            },
            {"role": "user", "content": f"Análises recebidas:\n\n{analises_formatadas}"}
        ],
        max_tokens=400
    )
    
    print("[MERGING] Síntese gerada!\n")
    return response.choices[0].message.content


# ============================================
# PIPELINE COMPLETO: BRANCHING + MERGING
# ============================================
async def pipeline_completo(prontuario: str) -> str:
    """
    Executa o pipeline completo:
    1. BRANCHING: Divide em análises paralelas
    2. MERGING: Converge em conclusão única
    """
    print("\n" + "=" * 60)
    print("PIPELINE: BRANCHING -> MERGING")
    print("=" * 60 + "\n")
    
    # Etapa 1: Branching
    resultados = await branching(prontuario)
    
    # Mostra resultados intermediários
    print("--- Resultados dos Ramos ---")
    for r in resultados:
        print(f"\n[{r['foco']}]: {r['resultado'][:100]}...")
    print()
    
    # Etapa 2: Merging
    conclusao = await merging(resultados)
    
    return conclusao


# ============================================
# DEMONSTRAÇÃO
# ============================================
async def main():
    prontuario = """
    Paciente: João Santos, 58 anos
    
    Sintomas:
    - Fadiga extrema há 3 semanas
    - Palidez notável
    - Falta de ar ao subir escadas
    - Tontura frequente
    
    Exames laboratoriais:
    - Hemoglobina: 8.5 g/dL (muito baixa - normal: 13-17)
    - Ferritina: 5 ng/mL (muito baixa - normal: 30-300)
    - VCM: 68 fL (baixo - normal: 80-100)
    - Vitamina B12: 180 pg/mL (limite inferior)
    
    Medicamentos em uso:
    - AAS 100mg (1x ao dia)
    - Omeprazol 40mg (2x ao dia há 2 anos)
    - Losartana 50mg (1x ao dia)
    """
    
    print("\n" + "=" * 60)
    print("EXEMPLO DE MERGING (CONVERGÊNCIA)")
    print("=" * 60)
    print("\n[ENTRADA] Prontuário recebido para análise completa\n")
    
    # Executa pipeline completo
    conclusao = await pipeline_completo(prontuario)
    
    # Exibe resultado final
    print("=" * 60)
    print("CONCLUSÃO FINAL (APÓS MERGING)")
    print("=" * 60)
    print(f"\n{conclusao}")
    print("\n" + "=" * 60)
    print("Pipeline Branching + Merging concluído!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())

