"""
RAG Pipeline - Indexador de Documentos Médicos
Este script transforma documentos médicos (chunks JSON) em uma base vetorial
pronta para consultas semânticas usando ChromaDB e OpenAI Embeddings.
"""

import json
import os
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

TEXT_DIR = Path(__file__).parent / "data" / "texts"  # JSONs por chunk/página
CHROMA_DIR = Path(__file__).parent / "data" / "chroma"  # Banco vetorial
CHROMA_DIR.mkdir(parents=True, exist_ok=True)

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
# FUNÇÕES DE INDEXAÇÃO
# =============================================================================

def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Gera embeddings em lote usando a API da OpenAI.
    
    Args:
        texts: Lista de textos para gerar embeddings
        
    Returns:
        Lista de vetores (embeddings)
    """
    response = client.embeddings.create(
        model="text-embedding-3-large",
        input=texts
    )
    return [d.embedding for d in response.data]


def add_documents_to_chroma():
    """
    Lê todos os documentos JSON da pasta TEXT_DIR e indexa no ChromaDB.
    Os documentos são processados em lotes para otimizar memória.
    """
    docs = list(TEXT_DIR.glob("*.json"))
    print(f"📘 Encontrados {len(docs)} documentos (chunks/páginas).")
    
    if not docs:
        print("⚠️ Nenhum documento encontrado em:", TEXT_DIR)
        return
    
    batch_texts = []
    batch_ids = []
    batch_metadata = []
    total_indexed = 0
    skipped = 0
    
    for doc_file in docs:
        with open(doc_file, encoding="utf-8") as f:
            data = json.load(f)
        
        text = data.get("content", "").strip()
        
        # Ignora textos muito pequenos (baixa qualidade semântica)
        if len(text) < 80:
            skipped += 1
            continue
        
        doc_id = data.get("doc_id")
        
        # Metadados para rastreabilidade
        metadata = {
            "source_file": data.get("source_file", "unknown"),
            "page": data.get("page", 0),
            "chunk_id": data.get("chunk_id", 0),
            "total_pages": data.get("total_pages", 0)
        }
        
        batch_texts.append(text)
        batch_ids.append(doc_id)
        batch_metadata.append(metadata)
        
        # Envia de 50 em 50 para não estourar memória
        if len(batch_texts) >= 50:
            embeddings = embed_texts(batch_texts)
            
            collection.add(
                ids=batch_ids,
                documents=batch_texts,
                embeddings=embeddings,
                metadatas=batch_metadata
            )
            
            total_indexed += len(batch_texts)
            print(f"✅ Lote de {len(batch_texts)} documentos indexado. Total: {total_indexed}")
            batch_texts, batch_ids, batch_metadata = [], [], []
    
    # Último lote
    if batch_texts:
        embeddings = embed_texts(batch_texts)
        
        collection.add(
            ids=batch_ids,
            documents=batch_texts,
            embeddings=embeddings,
            metadatas=batch_metadata
        )
        
        total_indexed += len(batch_texts)
        print(f"✅ Último lote de {len(batch_texts)} documentos indexado.")
    
    print("\n" + "=" * 60)
    print("🎉 INDEXAÇÃO CONCLUÍDA COM SUCESSO!")
    print("=" * 60)
    print(f"📊 Total indexado: {total_indexed} documentos")
    print(f"⏭️  Ignorados (< 80 chars): {skipped} documentos")
    print(f"📁 Base vetorial salva em: {CHROMA_DIR}")
    print("=" * 60)


def get_collection_info():
    """Retorna informações sobre a coleção atual."""
    count = collection.count()
    print(f"\n📊 Informações da Coleção 'medical_rag':")
    print(f"   - Total de documentos: {count}")
    print(f"   - Localização: {CHROMA_DIR}")


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🏥 RAG PIPELINE - INDEXADOR DE DOCUMENTOS MÉDICOS")
    print("=" * 60 + "\n")
    
    add_documents_to_chroma()
    get_collection_info()

