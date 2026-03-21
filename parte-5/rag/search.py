"""
RAG Pipeline - Sistema de Busca Semântica
Este script demonstra como realizar buscas por similaridade na base vetorial
e usar os resultados para responder perguntas com um LLM (RAG completo).
"""

import os
import sys
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv
from openai import OpenAI

# Carrega variáveis de ambiente da raiz do projeto
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)

# Verifica se a variável de ambiente OPENAI_API_KEY está configurada
if not os.environ.get("OPENAI_API_KEY"):
    print("⚠️  AVISO: OPENAI_API_KEY não configurada!")
    print("   Crie um arquivo .env na raiz do projeto seguindo o exemplo em .env.example")
    print("   Ou configure com: export OPENAI_API_KEY='sua-chave-aqui'\n")

# =============================================================================
# CONFIGURAÇÃO
# =============================================================================

CHROMA_DIR = Path(__file__).parent / "data" / "chroma"

# Cliente OpenAI
client = OpenAI()

# ChromaDB com função de embedding da OpenAI
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key=os.environ.get("OPENAI_API_KEY"),
    model_name="text-embedding-3-large"
)

chroma_client = chromadb.PersistentClient(path=str(CHROMA_DIR))
collection = chroma_client.get_or_create_collection(
    name="medical_rag",
    embedding_function=openai_ef
)


# =============================================================================
# FUNÇÕES DE BUSCA
# =============================================================================

def search_documents(query: str, n_results: int = 3) -> dict:
    """
    Realiza busca por similaridade semântica na base vetorial.
    
    Args:
        query: Pergunta ou texto para buscar
        n_results: Número de resultados a retornar
        
    Returns:
        Dicionário com documentos, metadados e distâncias
    """
    results = collection.query(
        query_texts=[query],
        n_results=n_results,
        include=["documents", "metadatas", "distances"]
    )
    return results


def format_search_results(results: dict) -> str:
    """
    Formata os resultados da busca para exibição ou uso em prompt.
    
    Args:
        results: Resultados retornados pela busca
        
    Returns:
        String formatada com os documentos encontrados
    """
    if not results["documents"] or not results["documents"][0]:
        return "Nenhum documento relevante encontrado."
    
    formatted = []
    for i, (doc, metadata, distance) in enumerate(zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ), 1):
        similarity = 1 - distance  # Converte distância em similaridade
        formatted.append(f"""
📄 Resultado {i} (Similaridade: {similarity:.2%})
   📁 Fonte: {metadata.get('source_file', 'N/A')}
   📖 Página: {metadata.get('page', 'N/A')}
   
   {doc[:500]}{'...' if len(doc) > 500 else ''}
""")
    
    return "\n".join(formatted)


def rag_query(question: str, n_context: int = 3, results: dict = None) -> tuple[str, dict]:
    """
    Pipeline RAG completo: busca documentos relevantes e gera resposta com LLM.
    
    Args:
        question: Pergunta do usuário
        n_context: Número de documentos para contexto
        results: Resultados de busca já realizados (opcional, evita busca duplicada)
        
    Returns:
        Tupla com (resposta do LLM, resultados da busca)
    """
    # 1. Busca documentos relevantes (se não foram passados)
    if results is None:
        results = search_documents(question, n_results=n_context)
    
    if not results["documents"] or not results["documents"][0]:
        return "Não encontrei informações relevantes na base de conhecimento para responder sua pergunta.", results
    
    # 2. Monta contexto com os documentos encontrados
    context_parts = []
    for i, (doc, metadata) in enumerate(zip(
        results["documents"][0],
        results["metadatas"][0]
    ), 1):
        context_parts.append(f"""
[Documento {i}]
Fonte: {metadata.get('source_file', 'N/A')} - Página {metadata.get('page', 'N/A')}
Conteúdo: {doc}
""")
    
    context = "\n---\n".join(context_parts)
    
    # 3. Gera resposta com o LLM
    system_prompt = """Você é um assistente médico especializado que responde perguntas 
baseando-se EXCLUSIVAMENTE nas informações fornecidas no contexto abaixo.

REGRAS IMPORTANTES:
1. Responda APENAS com base nas informações do contexto
2. Se a informação não estiver no contexto, diga que não possui essa informação
3. Cite as fontes (nome do documento e página) ao final da resposta
4. Use linguagem técnica apropriada para profissionais de saúde
5. Seja preciso e objetivo nas respostas

CONTEXTO:
{context}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt.format(context=context)},
            {"role": "user", "content": question}
        ],
        temperature=0.3,
        max_tokens=1000
    )
    
    return response.choices[0].message.content, results


def print_separator(title: str = ""):
    """Imprime separador visual."""
    print("\n" + "=" * 70)
    if title:
        print(f"🔍 {title}")
        print("=" * 70)


# =============================================================================
# EXEMPLOS DE BUSCA
# =============================================================================

def run_search_examples():
    """Executa exemplos de busca semântica na base médica."""
    
    # Verifica se há documentos indexados
    count = collection.count()
    if count == 0:
        print("⚠️ Base vetorial vazia! Execute primeiro: python indexer.py")
        return
    
    print("\n" + "=" * 70)
    print("🏥 EXEMPLOS DE BUSCA SEMÂNTICA - BASE MÉDICA")
    print(f"📊 Total de documentos indexados: {count}")
    print("=" * 70)
    
    # Lista de exemplos de busca
    exemplos_busca = [
        {
            "titulo": "Protocolo de Propofol em Idosos",
            "query": "Como usar propofol em pacientes idosos? Qual a dose recomendada?"
        },
        {
            "titulo": "Medicamentos em Cirurgia Cardíaca", 
            "query": "Quais medicamentos são mais usados durante cirurgia cardíaca?"
        },
        {
            "titulo": "Intercorrências Pós-Cirurgia Cardíaca",
            "query": "Quais são as principais complicações após cirurgias do coração?"
        },
        {
            "titulo": "Tratamento de Sepse",
            "query": "Como tratar choque séptico? Qual o protocolo inicial?"
        },
        {
            "titulo": "Manejo da Dor Pós-Operatória",
            "query": "Como controlar a dor após cirurgias de grande porte?"
        },
        {
            "titulo": "Trombólise em AVC",
            "query": "Quando posso fazer trombólise em paciente com AVC isquêmico?"
        }
    ]
    
    for exemplo in exemplos_busca:
        print_separator(exemplo["titulo"])
        print(f"📝 Pergunta: {exemplo['query']}\n")
        
        # Busca única e gera resposta com RAG
        resposta, results = rag_query(exemplo["query"], n_context=3)
        
        # Mostra documentos encontrados
        print("📚 Documentos Encontrados:")
        print(format_search_results(results))
        
        # Mostra resposta do LLM
        print("\n🤖 Resposta do Assistente (RAG):")
        print("-" * 50)
        print(resposta)
        print("-" * 50)
        
        input("\n⏸️  Pressione ENTER para o próximo exemplo...")


def interactive_mode():
    """Modo interativo: permite ao usuário digitar perguntas livremente."""
    count = collection.count()
    if count == 0:
        print("⚠️ Base vetorial vazia! Execute primeiro: python indexer.py")
        return

    print("\n" + "=" * 70)
    print("🏥 MODO INTERATIVO - BASE MÉDICA")
    print(f"📊 Total de documentos indexados: {count}")
    print("💡 Digite 'sair' ou pressione Ctrl+C para encerrar")
    print("=" * 70)

    while True:
        try:
            print()
            question = input("📝 Sua pergunta: ").strip()
            if not question or question.lower() in ("sair", "exit", "q"):
                print("\n👋 Encerrando modo interativo.")
                break

            resposta, results = rag_query(question, n_context=3)

            print("\n📚 Documentos Encontrados:")
            print(format_search_results(results))

            print("\n🤖 Resposta do Assistente (RAG):")
            print("-" * 50)
            print(resposta)
            print("-" * 50)

        except KeyboardInterrupt:
            print("\n\n👋 Encerrando modo interativo.")
            break


if __name__ == "__main__":
    if "--interactive" in sys.argv:
        interactive_mode()
    else:
        run_search_examples()

