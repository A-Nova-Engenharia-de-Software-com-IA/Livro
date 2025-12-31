"""
Exemplo de Chaining (Encadeamento) com OpenAI

Chaining = Linha de montagem
Cada etapa termina, passa o resultado para a próxima, que passa para a próxima.
Cada etapa só começa quando a anterior termina.

Exemplo:
1. Buscar dados do paciente (DB/API)
2. Resumir os dados (LLM)
3. Gerar análise clínica (LLM)
4. Retornar resultado final
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

# ========================
# CONFIGURAÇÃO
# ========================
root_dir = Path(__file__).parent.parent.parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)
client = OpenAI()


# ============================================
# SIMULAÇÃO DE BANCO DE DADOS
# ============================================
BANCO_PACIENTES = {
    "P001": {
        "nome": "Maria Silva",
        "idade": 45,
        "prontuario": """
            Histórico: Hipertensão controlada há 5 anos.
            Sintomas atuais: Dor de cabeça frequente, fadiga, tontura ao levantar.
            Exames recentes: Hemoglobina 10.5 g/dL, Ferritina 8 ng/mL, Glicose 95 mg/dL.
            Medicamentos: Losartana 50mg, Omeprazol 20mg.
            Última consulta: há 3 meses.
        """
    }
}


# ============================================
# ETAPA 1: BUSCAR DADOS
# ============================================
def etapa_buscar_dados(paciente_id: str) -> str:
    """
    Etapa 1: Busca dados do paciente no banco.
    Simula uma consulta a DB/API.
    """
    print("[ETAPA 1] Buscando dados do paciente...")
    
    paciente = BANCO_PACIENTES.get(paciente_id)
    if not paciente:
        raise ValueError(f"Paciente {paciente_id} não encontrado")
    
    dados = f"""
    Nome: {paciente['nome']}
    Idade: {paciente['idade']} anos
    {paciente['prontuario']}
    """
    
    print("[ETAPA 1] Dados obtidos com sucesso!")
    return dados


# ============================================
# ETAPA 2: RESUMIR DADOS
# ============================================
def etapa_resumir(dados_paciente: str) -> str:
    """
    Etapa 2: Usa LLM para resumir os dados do paciente.
    RECEBE: saída da Etapa 1
    """
    print("[ETAPA 2] Resumindo dados com LLM...")
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """Resuma os dados do paciente de forma estruturada:
                - Perfil (nome, idade)
                - Sintomas principais
                - Exames alterados
                - Medicamentos em uso
                
                Seja conciso."""
            },
            {"role": "user", "content": dados_paciente}
        ],
        max_tokens=200
    )
    
    resumo = response.choices[0].message.content
    print("[ETAPA 2] Resumo gerado!")
    return resumo


# ============================================
# ETAPA 3: GERAR ANÁLISE CLÍNICA
# ============================================
def etapa_analisar(resumo: str) -> str:
    """
    Etapa 3: Usa LLM para gerar análise clínica baseada no resumo.
    RECEBE: saída da Etapa 2
    """
    print("[ETAPA 3] Gerando análise clínica com LLM...")
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """Você é um médico experiente.
                Com base no resumo do paciente, forneça:
                1. Possível diagnóstico
                2. Pontos de atenção
                3. Recomendações
                
                Seja objetivo."""
            },
            {"role": "user", "content": resumo}
        ],
        max_tokens=300
    )
    
    analise = response.choices[0].message.content
    print("[ETAPA 3] Análise gerada!")
    return analise


# ============================================
# PIPELINE DE CHAINING
# ============================================
def chaining_pipeline(paciente_id: str) -> dict:
    """
    Pipeline de encadeamento completo.
    
    Etapa 1 -> Etapa 2 -> Etapa 3 -> Resultado
    
    Cada etapa usa a saída da anterior como entrada.
    """
    print("\n" + "=" * 50)
    print("INICIANDO PIPELINE DE CHAINING")
    print("=" * 50 + "\n")
    
    # Etapa 1: Buscar dados (DB)
    dados = etapa_buscar_dados(paciente_id)
    
    # Etapa 2: Resumir dados (LLM) <- usa saída da Etapa 1
    resumo = etapa_resumir(dados)
    
    # Etapa 3: Analisar (LLM) <- usa saída da Etapa 2
    analise = etapa_analisar(resumo)
    
    print("\n" + "=" * 50)
    print("PIPELINE CONCLUÍDO")
    print("=" * 50)
    
    return {
        "dados_brutos": dados,
        "resumo": resumo,
        "analise": analise
    }


# ============================================
# DEMONSTRAÇÃO
# ============================================
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("EXEMPLO DE CHAINING (ENCADEAMENTO)")
    print("=" * 60)
    
    # Executa pipeline
    resultado = chaining_pipeline("P001")
    
    # Exibe cada etapa
    print("\n" + "-" * 60)
    print("RESULTADO DA ETAPA 2 (RESUMO):")
    print("-" * 60)
    print(resultado["resumo"])
    
    print("\n" + "-" * 60)
    print("RESULTADO DA ETAPA 3 (ANÁLISE FINAL):")
    print("-" * 60)
    print(resultado["analise"])
    
    print("\n" + "=" * 60)
    print("Chaining concluído!")
    print("=" * 60)

