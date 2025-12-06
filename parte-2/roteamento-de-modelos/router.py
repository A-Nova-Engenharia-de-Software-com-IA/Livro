"""
Exemplo de Roteamento de Modelos com OpenAI

Este exemplo demonstra como rotear requisições para diferentes modelos
baseado na complexidade do prompt, otimizando custo e performance.

Modelos utilizados:
- gpt-4o-mini: prompts simples (tradução, formatação, perguntas diretas)
- gpt-4o: prompts médios (explicações, análises, resumos)
- o1-mini: prompts complexos (raciocínio, diagnósticos, problemas matemáticos)
"""

import os
from enum import Enum
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

# ========================
# CONFIGURAÇÃO
# ========================
# Carrega variáveis de ambiente do arquivo .env na raiz do projeto
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)
client = OpenAI()

# ============================================
# DEFINIÇÃO DE COMPLEXIDADE E MODELOS
# ============================================
class Complexidade(str, Enum):
    SIMPLES = "simples"
    MEDIO = "medio"
    COMPLEXO = "complexo"


# Mapeamento de complexidade para modelo
MODELO_POR_COMPLEXIDADE = {
    Complexidade.SIMPLES: "gpt-4o-mini",
    Complexidade.MEDIO: "gpt-4o",
    Complexidade.COMPLEXO: "o1-mini",
}

# Custo aproximado por 1M tokens de input (USD)
CUSTO_POR_MODELO = {
    "gpt-4o-mini": 0.15,
    "gpt-4o": 2.50,
    "o1-mini": 3.00,
}

# ============================================
# PALAVRAS-CHAVE PARA CLASSIFICAÇÃO
# ============================================

# Palavras que indicam prompts simples
PALAVRAS_SIMPLES = {
    "traduza", "traduzir", "tradução",
    "formate", "formatar",
    "liste", "listar",
    "converta", "converter",
    "corrija", "corrigir",
    "resuma brevemente",
    "qual é", "o que é",
    "defina",
}

# Palavras que indicam prompts médios
PALAVRAS_MEDIAS = {
    "explique", "explicar", "explicação",
    "como funciona", "como funcionam",
    "descreva", "descrever",
    "resuma", "resumir", "resumo",
    "compare", "comparar",
    "quais são", "quais os",
    "por que", "porque",
    "qual a diferença",
    "me fale sobre", "fale sobre",
    "o que significa",
}

# Palavras que indicam prompts complexos
PALAVRAS_COMPLEXAS = {
    "diagnóstico", "diagnosticar",
    "analise detalhadamente", "análise profunda",
    "raciocine", "raciocínio",
    "demonstre matematicamente", "prove",
    "arquitetura", "projeto completo",
    "compare e contraste detalhadamente",
    "sintomas", "histórico médico",
    "estratégia", "planejamento estratégico",
    "debug", "debugar", "encontre o bug",
    "otimize", "refatore",
}

# ============================================
# CLASSIFICADOR DE COMPLEXIDADE
# ============================================
def classificar_complexidade(prompt: str) -> Complexidade:
    """
    Classifica a complexidade do prompt baseado em:
    1. Contagem de tokens (aproximada por palavras)
    2. Presença de palavras-chave
    """
    prompt_lower = prompt.lower()
    num_palavras = len(prompt.split())
    
    # Verifica palavras-chave complexas (prioridade máxima)
    for palavra in PALAVRAS_COMPLEXAS:
        if palavra in prompt_lower:
            return Complexidade.COMPLEXO
    
    # Verifica palavras-chave médias
    for palavra in PALAVRAS_MEDIAS:
        if palavra in prompt_lower:
            return Complexidade.MEDIO
    
    # Verifica palavras-chave simples
    for palavra in PALAVRAS_SIMPLES:
        if palavra in prompt_lower:
            return Complexidade.SIMPLES
    
    # Fallback baseado no tamanho
    if num_palavras < 15:
        return Complexidade.SIMPLES
    elif num_palavras < 80:
        return Complexidade.MEDIO
    else:
        return Complexidade.COMPLEXO

def selecionar_modelo(complexidade: Complexidade) -> str:
    """Retorna o modelo apropriado para a complexidade."""
    return MODELO_POR_COMPLEXIDADE[complexidade]

# ============================================
# SAÍDA ESTRUTURADA
# ============================================
class RespostaRoteada(BaseModel):
    """Estrutura da resposta do modelo."""
    resposta: str
    modelo_utilizado: str
    complexidade_detectada: str
    custo_estimado_1m_tokens: float


# ============================================
# FUNÇÃO PRINCIPAL DE ROTEAMENTO
# ============================================
def rotear_e_responder(prompt: str, forcar_modelo: str = None) -> RespostaRoteada:
    """
    Roteia o prompt para o modelo apropriado e retorna resposta estruturada.
    
    Args:
        prompt: O prompt do usuário
        forcar_modelo: Opcional - força uso de um modelo específico
    
    Returns:
        RespostaRoteada com a resposta e metadados
    """
    # Classificar complexidade
    complexidade = classificar_complexidade(prompt)
    
    # Selecionar modelo (ou usar o forçado)
    modelo = forcar_modelo or selecionar_modelo(complexidade)
    
    print(f"\n{'='*50}")
    print(f"📊 Complexidade detectada: {complexidade.value}")
    print(f"🤖 Modelo selecionado: {modelo}")
    print(f"💰 Custo estimado: ${CUSTO_POR_MODELO.get(modelo, 'N/A')}/1M tokens")
    print(f"{'='*50}\n")
    
    # Chamar o modelo
    response = client.chat.completions.create(
        model=modelo,
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_completion_tokens=1024,
    )
    
    resposta_texto = response.choices[0].message.content
    
    return RespostaRoteada(
        resposta=resposta_texto,
        modelo_utilizado=modelo,
        complexidade_detectada=complexidade.value,
        custo_estimado_1m_tokens=CUSTO_POR_MODELO.get(modelo, 0)
    )


# ============================================
# DEMONSTRAÇÃO
# ============================================
if __name__ == "__main__":
    # Exemplos de prompts com diferentes complexidades
    exemplos = [
        # Prompt simples
        "Traduza para inglês: Bom dia, como vai você?",
        
        # Prompt médio
        "Explique como funciona o protocolo HTTP e quais são os principais métodos de requisição.",
        
        # Prompt complexo
        "Analise detalhadamente os sintomas: dor de cabeça persistente há 3 dias, sensibilidade à luz, náusea ocasional e histórico de enxaqueca na família. Quais são as possíveis causas e quando devo procurar um médico?",
    ]
    
    print("\n" + "="*60)
    print("🚀 DEMONSTRAÇÃO DE ROTEAMENTO DE MODELOS")
    print("="*60)
    
    for i, prompt in enumerate(exemplos, 1):
        print(f"\n\n{'─'*60}")
        print(f"📝 EXEMPLO {i}")
        print(f"{'─'*60}")
        print(f"Prompt: {prompt}")
        
        try:
            resultado = rotear_e_responder(prompt)
            print(f"\n✅ Resposta:\n{resultado.resposta[:500]}{'...' if len(resultado.resposta) > 500 else ''}")
        except Exception as e:
            print(f"\n❌ Erro: {e}")
    
    print("\n\n" + "="*60)
    print("✨ Demonstração concluída!")
    print("="*60)

