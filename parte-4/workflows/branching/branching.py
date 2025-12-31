"""
Exemplo de Branching (Ramificação) com OpenAI

Branching = Dividir para conquistar
Uma entrada complexa é dividida em múltiplas análises paralelas especializadas.

Exemplo: Um prontuário médico é analisado simultaneamente por 3 "especialistas":
- Um analisa sintomas
- Outro analisa exames
- Outro analisa medicamentos
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
    """
    Executa análise de um ramo específico.
    Cada ramo tem um foco único e instruções especializadas.
    """
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
    """
    Divide a análise em múltiplos ramos paralelos.
    Cada ramo analisa um aspecto específico do prontuário.
    """
    
    # Define os ramos: (foco, instrução)
    ramos = [
        (
            "Sintomas",
            "Você é especialista em sintomatologia. Analise APENAS os sintomas descritos. Seja breve e objetivo."
        ),
        (
            "Exames",
            "Você é especialista em exames laboratoriais. Analise APENAS os resultados de exames. Seja breve e objetivo."
        ),
        (
            "Medicamentos",
            "Você é especialista em farmacologia. Analise APENAS os medicamentos em uso. Seja breve e objetivo."
        ),
    ]
    
    print("\n[BRANCHING] Disparando análises paralelas...")
    print(f"[BRANCHING] {len(ramos)} ramos serão executados simultaneamente\n")
    
    # Cria todas as tarefas
    tarefas = [
        analisar_ramo(prontuario, foco, instrucao)
        for foco, instrucao in ramos
    ]
    
    # Executa TODAS em paralelo
    resultados = await asyncio.gather(*tarefas)
    
    print("[BRANCHING] Todas as análises concluídas!\n")
    return resultados


# ============================================
# DEMONSTRAÇÃO
# ============================================
async def main():
    prontuario = """
    Paciente: Maria Silva, 45 anos
    
    Sintomas relatados:
    - Dor de cabeça frequente há 2 semanas
    - Fadiga constante
    - Tontura ao levantar
    
    Exames recentes:
    - Hemoglobina: 10.5 g/dL (baixa)
    - Ferritina: 8 ng/mL (baixa)
    - Glicose: 95 mg/dL (normal)
    - Pressão: 100/60 mmHg
    
    Medicamentos em uso:
    - Omeprazol 20mg (1x ao dia)
    - Dipirona 500mg (quando necessário)
    """
    
    print("=" * 60)
    print("EXEMPLO DE BRANCHING (RAMIFICAÇÃO)")
    print("=" * 60)
    print("\n[ENTRADA] Prontuário médico recebido")
    
    # Executa branching
    resultados = await branching(prontuario)
    
    # Exibe resultados de cada ramo
    print("=" * 60)
    print("RESULTADOS DOS RAMOS")
    print("=" * 60)
    
    for r in resultados:
        print(f"\n--- {r['foco'].upper()} ---")
        print(r["resultado"])
    
    print("\n" + "=" * 60)
    print("Branching concluído!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())

