"""
Sistema de Memória de Agente - Exemplo Prático

Este exemplo demonstra a implementação completa de um sistema de memória para agentes de IA,
incluindo:

HIERARQUIA DE MEMÓRIA:
1. Short-term Memory (Conversa Atual) - Mantida em RAM durante a sessão
2. Long-term Memory (Histórico do Cliente) - Persistida em JSON
3. Summary Memory (Resumo Automático) - Compressão de conversas antigas
4. Vector Memory (Semântica) - Busca por similaridade usando embeddings

PROCESSADORES DE MEMÓRIA:
- Compressão e resumo de memórias antigas
- Filtragem e priorização de memórias relevantes
- Poda (pruning) de memórias obsoletas

ESTRATÉGIAS DE CONTROLE:
- Limite de relevância (score mínimo 0.85)
- Limite de volume (máx 30% do contexto)
- Limite temporal (dados < 180 dias)
- Verificação cruzada

Caso de uso: Assistente de atendimento que lembra preferências e histórico do cliente.
"""

import json
import os
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
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
    print("   Crie um arquivo .env na raiz do projeto")

client = OpenAI()

# Caminhos para dados
DB_PATH = Path(__file__).parent / "DB"
MEMORY_PATH = Path(__file__).parent / "data"
MEMORY_PATH.mkdir(exist_ok=True)

# ========================
# CONSTANTES DE CONTROLE
# ========================

# Limites de relevância e confiança
MIN_RELEVANCE_SCORE = 0.85  # Score mínimo para injetar memória
MAX_MEMORY_ITEMS = 8        # Máximo de itens de memória a injetar
MAX_MEMORY_TOKENS = 2000    # Limite de tokens para memória (aprox 30% de 8k)
MAX_MEMORY_AGE_DAYS = 180   # Memórias mais antigas são descartadas/resumidas

# Limites para processamento
SHORT_TERM_LIMIT = 10       # Últimas N mensagens da conversa atual
SUMMARY_THRESHOLD = 5       # Resumir quando tiver mais que N mensagens, 5 foi definido para testes, deve ser ajustado para 20 ou mais


# ========================
# CLASSES DE MEMÓRIA
# ========================

class MemoryItem:
    """Representa um item de memória."""
    
    def __init__(
        self,
        content: str,
        memory_type: str,
        user_id: str,
        timestamp: datetime = None,
        embedding: List[float] = None,
        metadata: Dict = None,
        relevance_score: float = 0.0
    ):
        self.id = str(uuid.uuid4())
        self.content = content
        self.memory_type = memory_type  # short_term, long_term, summary, semantic
        self.user_id = user_id
        self.timestamp = timestamp or datetime.now()
        self.embedding = embedding
        self.metadata = metadata or {}
        self.relevance_score = relevance_score
    
    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "content": self.content,
            "memory_type": self.memory_type,
            "user_id": self.user_id,
            "timestamp": self.timestamp.isoformat(),
            "embedding": self.embedding,
            "metadata": self.metadata,
            "relevance_score": self.relevance_score
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> "MemoryItem":
        item = cls(
            content=data["content"],
            memory_type=data["memory_type"],
            user_id=data["user_id"],
            timestamp=datetime.fromisoformat(data["timestamp"]),
            embedding=data.get("embedding"),
            metadata=data.get("metadata", {}),
            relevance_score=data.get("relevance_score", 0.0)
        )
        item.id = data["id"]
        return item
    
    def age_days(self) -> int:
        """Retorna a idade da memória em dias."""
        return (datetime.now() - self.timestamp).days


class ShortTermMemory:
    """
    Memória de curto prazo - conversa atual.
    Mantida em RAM, limitada às últimas N mensagens.
    """
    
    def __init__(self, user_id: str, limit: int = SHORT_TERM_LIMIT):
        self.user_id = user_id
        self.limit = limit
        self.messages: List[Dict] = []
    
    def add(self, role: str, content: str):
        """Adiciona mensagem à memória de curto prazo."""
        self.messages.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        # Mantém apenas as últimas N mensagens
        if len(self.messages) > self.limit:
            self.messages = self.messages[-self.limit:]
    
    def get_messages(self) -> List[Dict]:
        """Retorna mensagens formatadas para a API."""
        return [{"role": m["role"], "content": m["content"]} for m in self.messages]
    
    def clear(self):
        """Limpa memória de curto prazo."""
        self.messages = []


class LongTermMemory:
    """
    Memória de longo prazo - histórico do cliente.
    Persistida em JSON, inclui dados estruturados.
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.file_path = MEMORY_PATH / f"long_term_{user_id}.json"
        self.data = self._load()
    
    def _load(self) -> Dict:
        """Carrega dados do arquivo."""
        if self.file_path.exists():
            with open(self.file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "user_id": self.user_id,
            "profile": {},
            "interactions": [],
            "preferences": {},
            "facts": []  # Fatos importantes sobre o usuário
        }
    
    def _save(self):
        """Salva dados no arquivo."""
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
    
    def add_fact(self, fact: str, source: str = "conversation"):
        """Adiciona um fato importante sobre o usuário."""
        # Evita duplicatas
        existing = [f["content"].lower() for f in self.data["facts"]]
        if fact.lower() not in existing:
            self.data["facts"].append({
                "content": fact,
                "source": source,
                "timestamp": datetime.now().isoformat()
            })
            self._save()
    
    def update_preferences(self, preferences: Dict):
        """Atualiza preferências do usuário."""
        self.data["preferences"].update(preferences)
        self._save()
    
    def get_facts(self) -> List[str]:
        """Retorna fatos conhecidos sobre o usuário."""
        return [f["content"] for f in self.data["facts"]]
    
    def prune_old_data(self, max_age_days: int = MAX_MEMORY_AGE_DAYS):
        """Remove dados antigos (poda/pruning)."""
        cutoff = datetime.now() - timedelta(days=max_age_days)
        
        # Filtra interações antigas
        self.data["interactions"] = [
            i for i in self.data["interactions"]
            if datetime.fromisoformat(i["timestamp"]) > cutoff
        ]
        self._save()
        return len(self.data["interactions"])


class VectorMemory:
    """
    Memória vetorial - busca semântica.
    Usa embeddings para encontrar memórias relevantes.
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.file_path = MEMORY_PATH / f"vector_{user_id}.json"
        self.memories: List[MemoryItem] = self._load()
    
    def _load(self) -> List[MemoryItem]:
        """Carrega memórias do arquivo."""
        if self.file_path.exists():
            with open(self.file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return [MemoryItem.from_dict(m) for m in data]
        return []
    
    def _save(self):
        """Salva memórias no arquivo."""
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump([m.to_dict() for m in self.memories], f, indent=2, ensure_ascii=False)
    
    def _get_embedding(self, text: str) -> List[float]:
        """Gera embedding para um texto usando OpenAI."""
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calcula similaridade de cosseno entre dois vetores."""
        a = np.array(vec1)
        b = np.array(vec2)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
    
    def add(self, content: str, memory_type: str = "semantic", metadata: Dict = None):
        """Adiciona memória com embedding."""
        embedding = self._get_embedding(content)
        memory = MemoryItem(
            content=content,
            memory_type=memory_type,
            user_id=self.user_id,
            embedding=embedding,
            metadata=metadata
        )
        self.memories.append(memory)
        self._save()
        return memory
    
    def search(
        self, 
        query: str, 
        top_k: int = MAX_MEMORY_ITEMS,
        min_score: float = MIN_RELEVANCE_SCORE,
        max_age_days: int = MAX_MEMORY_AGE_DAYS
    ) -> List[MemoryItem]:
        """
        Busca memórias relevantes por similaridade semântica.
        
        Aplica filtros de:
        - Score mínimo de relevância
        - Idade máxima da memória
        - Limite de itens
        """
        if not self.memories:
            return []
        
        query_embedding = self._get_embedding(query)
        results = []
        
        for memory in self.memories:
            # Filtro temporal
            if memory.age_days() > max_age_days:
                continue
            
            # Calcula similaridade
            if memory.embedding:
                score = self._cosine_similarity(query_embedding, memory.embedding)
                
                # Filtro de relevância
                if score >= min_score:
                    memory.relevance_score = score
                    results.append(memory)
        
        # Ordena por relevância e retorna top_k
        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results[:top_k]
    
    def prune(self, max_age_days: int = MAX_MEMORY_AGE_DAYS):
        """Remove memórias antigas."""
        initial_count = len(self.memories)
        self.memories = [m for m in self.memories if m.age_days() <= max_age_days]
        self._save()
        return initial_count - len(self.memories)


class SummaryMemory:
    """
    Memória de resumo - compressão de conversas antigas.
    Usa LLM para criar resumos quando há muitas mensagens.
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.file_path = MEMORY_PATH / f"summary_{user_id}.json"
        self.summaries = self._load()
    
    def _load(self) -> List[Dict]:
        """Carrega resumos do arquivo."""
        if self.file_path.exists():
            with open(self.file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []
    
    def _save(self):
        """Salva resumos no arquivo."""
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(self.summaries, f, indent=2, ensure_ascii=False)
    
    def create_summary(self, messages: List[Dict], max_tokens: int = 200) -> str:
        """
        Cria um resumo de uma lista de mensagens usando LLM.
        
        Args:
            messages: Lista de mensagens para resumir
            max_tokens: Tamanho máximo do resumo
        
        Returns:
            Resumo comprimido da conversa
        """
        conversation_text = "\n".join([
            f"{m['role'].upper()}: {m['content']}" 
            for m in messages
        ])
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"""Você é um assistente que resume conversas de forma concisa.
Crie um resumo em até {max_tokens} tokens que capture:
- Principais tópicos discutidos
- Decisões tomadas
- Informações importantes sobre o usuário
- Preferências expressas

Formato: Lista de bullet points começando com •"""
                },
                {
                    "role": "user",
                    "content": f"Resuma esta conversa:\n\n{conversation_text}"
                }
            ],
            temperature=0.3,
            max_tokens=max_tokens
        )
        
        return response.choices[0].message.content.strip()
    
    def add_summary(self, summary: str, source: str = "conversation"):
        """Adiciona um resumo ao histórico."""
        self.summaries.append({
            "id": str(uuid.uuid4()),
            "content": summary,
            "source": source,
            "timestamp": datetime.now().isoformat()
        })
        self._save()
    
    def get_recent_summaries(self, limit: int = 5) -> List[str]:
        """Retorna resumos recentes."""
        recent = self.summaries[-limit:]
        return [s["content"] for s in recent]


# ========================
# PROCESSADOR DE MEMÓRIA
# ========================

class MemoryProcessor:
    """
    Processador de memória - gerencia, transforma e otimiza memórias.
    
    Funções principais:
    - Compressão e resumo
    - Filtragem e priorização
    - Poda de memórias obsoletas
    - Integração para injeção no prompt
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.short_term = ShortTermMemory(user_id)
        self.long_term = LongTermMemory(user_id)
        self.vector = VectorMemory(user_id)
        self.summary = SummaryMemory(user_id)
    
    def add_message(self, role: str, content: str):
        """Adiciona mensagem e processa memória."""
        # 1. Adiciona à memória de curto prazo
        self.short_term.add(role, content)
        
        # 2. Adiciona à memória vetorial para busca futura
        if role == "user":
            self.vector.add(
                content=content,
                memory_type="user_message",
                metadata={"role": role}
            )
        
        # 3. Verifica se precisa criar resumo (quando há muitas mensagens)
        if len(self.short_term.messages) >= SUMMARY_THRESHOLD:
            self._compress_short_term()
    
    def _compress_short_term(self):
        """Comprime memória de curto prazo criando um resumo."""
        messages = self.short_term.get_messages()
        summary = self.summary.create_summary(messages)
        self.summary.add_summary(summary, source="short_term_compression")
        
        # Adiciona resumo à memória vetorial
        self.vector.add(
            content=summary,
            memory_type="summary",
            metadata={"compressed_messages": len(messages)}
        )
        
        # Mantém apenas as últimas mensagens
        self.short_term.messages = self.short_term.messages[-5:]
        
        print(f"📦 Memória comprimida: {len(messages)} mensagens → resumo")
    
    def extract_facts(self, message: str):
        """
        Extrai fatos importantes de uma mensagem usando LLM.
        Exemplo: preferências, informações pessoais, etc.
        """
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """Extraia fatos importantes sobre o usuário desta mensagem.
Retorne apenas JSON no formato:
{"fatos": ["fato1", "fato2"], "preferencias": {"chave": "valor"}}
Se não houver fatos relevantes, retorne: {"fatos": [], "preferencias": {}}"""
                },
                {"role": "user", "content": message}
            ],
            temperature=0.1,
            max_tokens=200
        )
        
        try:
            result = response.choices[0].message.content.strip()
            if result.startswith("```"):
                result = result.split("```")[1]
                if result.startswith("json"):
                    result = result[4:]
            
            data = json.loads(result)
            
            for fact in data.get("fatos", []):
                self.long_term.add_fact(fact)
            
            if data.get("preferencias"):
                self.long_term.update_preferences(data["preferencias"])
                
        except (json.JSONDecodeError, IndexError):
            pass
    
    def retrieve_relevant_memories(
        self, 
        query: str,
        include_short_term: bool = True,
        include_summaries: bool = True,
        include_vector: bool = True,
        max_tokens: int = MAX_MEMORY_TOKENS
    ) -> Dict[str, Any]:
        """
        Recupera memórias relevantes para a query atual.
        
        Aplica estratégias de controle:
        - Limite de relevância
        - Limite de volume
        - Priorização
        
        Returns:
            Dict com memórias organizadas por tipo
        """
        result = {
            "short_term": [],
            "vector": [],
            "summaries": [],
            "facts": [],
            "preferences": {},
            "total_items": 0,
            "estimated_tokens": 0
        }
        
        # 1. Memória de curto prazo (sempre incluída)
        if include_short_term:
            result["short_term"] = self.short_term.get_messages()
        
        # 2. Busca semântica
        if include_vector:
            vector_results = self.vector.search(
                query=query,
                top_k=MAX_MEMORY_ITEMS,
                min_score=MIN_RELEVANCE_SCORE
            )
            result["vector"] = [
                {
                    "content": m.content,
                    "score": round(m.relevance_score, 2),
                    "type": m.memory_type,
                    "age_days": m.age_days()
                }
                for m in vector_results
            ]
        
        # 3. Resumos recentes
        if include_summaries:
            result["summaries"] = self.summary.get_recent_summaries(limit=3)
        
        # 4. Fatos e preferências do usuário
        result["facts"] = self.long_term.get_facts()
        result["preferences"] = self.long_term.data.get("preferences", {})
        
        # Calcula totais
        result["total_items"] = (
            len(result["short_term"]) +
            len(result["vector"]) +
            len(result["summaries"]) +
            len(result["facts"])
        )
        
        # Estima tokens (aproximação: 1 token ≈ 4 caracteres)
        total_chars = sum(len(str(v)) for v in result.values())
        result["estimated_tokens"] = total_chars // 4
        
        return result
    
    def format_context_for_prompt(self, memories: Dict[str, Any]) -> str:
        """
        Formata memórias recuperadas para injeção no prompt.
        
        Segue boas práticas:
        - Limite de 20-30% do contexto total
        - Organização clara por tipo
        - Scores de confiança visíveis
        """
        context_parts = []
        
        # Fatos conhecidos
        if memories["facts"]:
            context_parts.append("📌 FATOS SOBRE O USUÁRIO:")
            for fact in memories["facts"]:
                context_parts.append(f"  • {fact}")
        
        # Preferências
        if memories["preferences"]:
            context_parts.append("\n⚙️ PREFERÊNCIAS:")
            for key, value in memories["preferences"].items():
                context_parts.append(f"  • {key}: {value}")
        
        # Resumos de conversas anteriores
        if memories["summaries"]:
            context_parts.append("\n📋 RESUMO DE INTERAÇÕES ANTERIORES:")
            for summary in memories["summaries"]:
                context_parts.append(f"  {summary}")
        
        # Memórias semânticas relevantes
        if memories["vector"]:
            context_parts.append("\n🔍 MEMÓRIAS RELEVANTES (por similaridade):")
            for mem in memories["vector"]:
                context_parts.append(
                    f"  [{mem['score']:.0%} confiança] {mem['content'][:100]}..."
                )
        
        # Informação sobre volume de memória
        context_parts.append(
            f"\n📊 Total: {memories['total_items']} itens | "
            f"~{memories['estimated_tokens']} tokens"
        )
        
        return "\n".join(context_parts)
    
    def prune_all(self, max_age_days: int = MAX_MEMORY_AGE_DAYS):
        """Executa poda em todas as memórias."""
        vector_pruned = self.vector.prune(max_age_days)
        long_term_remaining = self.long_term.prune_old_data(max_age_days)
        
        return {
            "vector_removed": vector_pruned,
            "long_term_remaining": long_term_remaining
        }


# ========================
# AGENTE COM MEMÓRIA
# ========================

class AgentWithMemory:
    """
    Agente de atendimento com sistema completo de memória.
    """
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.memory = MemoryProcessor(user_id)
        self.user_data = self._load_user_data()
    
    def _load_user_data(self) -> Optional[Dict]:
        """Carrega dados do usuário do banco."""
        users_file = DB_PATH / "users.json"
        if users_file.exists():
            with open(users_file, "r", encoding="utf-8") as f:
                users = json.load(f)
                for user in users:
                    if user["user_id"] == self.user_id:
                        return user
        return None
    
    def process_message(self, message: str) -> str:
        """
        Processa mensagem do usuário com contexto de memória.
        """
        print(f"\n{'='*60}")
        print(f"👤 Usuário: {message}")
        print(f"{'='*60}")
        
        # 1. Adiciona mensagem à memória
        self.memory.add_message("user", message)
        
        # 2. Extrai fatos da mensagem e salva na memória de longo prazo (em background)
        self.memory.extract_facts(message)
        
        # 3. Recupera memórias relevantes
        memories = self.memory.retrieve_relevant_memories(message)
        memory_context = self.memory.format_context_for_prompt(memories)
        
        print(f"\n[Memória] Recuperados {memories['total_items']} itens")
        print(f"[Memória] Tokens estimados: {memories['estimated_tokens']}")
        
        # 4. Prepara contexto do sistema
        system_prompt = self._build_system_prompt(memory_context)
        
        # 5. Prepara mensagens para a API
        messages = [
            {"role": "system", "content": system_prompt}
        ] + self.memory.short_term.get_messages()
        
        # 6. Chama a API
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            assistant_response = response.choices[0].message.content.strip()
            
            # 7. Adiciona resposta à memória
            self.memory.add_message("assistant", assistant_response)
            
            print(f"\n🤖 Assistente: {assistant_response}")
            
            return assistant_response
            
        except Exception as e:
            return f"❌ Erro: {str(e)}"
    
    def _build_system_prompt(self, memory_context: str) -> str:
        """Constrói prompt do sistema com contexto de memória."""
        user_info = ""
        if self.user_data:
            prefs = self.user_data.get('preferencias', {})
            contexto = self.user_data.get('contexto', {})
            
            user_info = f"""
DADOS DO USUÁRIO (do banco de dados):
- Nome: {self.user_data.get('nome', 'Desconhecido')}
- Nome de tratamento: {prefs.get('nome_tratamento', '')}
- Tom de comunicação preferido: {prefs.get('tom_comunicacao', 'amigável')}
- Área de interesse: {contexto.get('area_interesse', 'geral')}
- Nível técnico: {contexto.get('nivel_tecnico', 'intermediário')}
- Objetivo principal: {contexto.get('objetivo_principal', '')}
- Notas: {self.user_data.get('notas', '')}
"""
        
        return f"""Você é um assistente virtual inteligente com memória de longo prazo.

{user_info}

{'='*50}
MEMÓRIA DO AGENTE (contexto recuperado):
{'='*50}
{memory_context}
{'='*50}

INSTRUÇÕES:
1. Use a memória para personalizar suas respostas
2. Adapte seu tom de comunicação conforme a preferência do usuário
3. Considere o nível técnico ao explicar conceitos
4. Lembre-se de preferências e fatos sobre o usuário
5. Seja consistente com interações anteriores
6. Se não tiver informação na memória, pergunte ao usuário
7. Chame o usuário pelo nome de tratamento preferido

Responda sempre em português brasileiro de forma natural e empática."""
    
    def get_memory_stats(self) -> Dict:
        """Retorna estatísticas da memória."""
        return {
            "short_term_messages": len(self.memory.short_term.messages),
            "vector_memories": len(self.memory.vector.memories),
            "summaries": len(self.memory.summary.summaries),
            "facts": len(self.memory.long_term.get_facts()),
            "preferences": self.memory.long_term.data.get("preferences", {})
        }


# ========================
# INTERFACE DO USUÁRIO
# ========================

def main():
    """Função principal - interface de interação."""
    print("="*60)
    print("🧠 AGENTE COM SISTEMA DE MEMÓRIA")
    print("="*60)
    print("\nEste agente demonstra diferentes tipos de memória:")
    print("  • Short-term: Conversa atual")
    print("  • Long-term: Histórico persistente")
    print("  • Summary: Resumos automáticos")
    print("  • Vector: Busca semântica")
    print("\nComandos especiais:")
    print("  /stats - Ver estatísticas de memória")
    print("  /clear - Limpar memória de curto prazo")
    print("  /prune - Executar poda de memórias antigas")
    print("  /sair  - Encerrar")
    print("="*60)
    
    # Seleciona usuário
    print("\nUsuários disponíveis: user_001 (Carlos), user_002 (Maria), user_003 (João)")
    user_input = input("ID do usuário (ou Enter para user_001): ").strip()
    
    # Normaliza o input - aceita "001", "1", "user_001" etc.
    if not user_input:
        user_id = "user_001"
    elif user_input.isdigit():
        user_id = f"user_{user_input.zfill(3)}"  # "1" -> "user_001"
    elif not user_input.startswith("user_"):
        user_id = f"user_{user_input}"  # "001" -> "user_001"
    else:
        user_id = user_input
    
    agent = AgentWithMemory(user_id)
    
    print(f"\n✅ Agente inicializado para: {user_id}")
    if agent.user_data:
        print(f"   👤 Nome: {agent.user_data.get('nome')}")
        prefs = agent.user_data.get('preferencias', {})
        print(f"   🗣️ Prefere ser chamado de: {prefs.get('nome_tratamento', agent.user_data.get('nome'))}")
        contexto = agent.user_data.get('contexto', {})
        print(f"   📚 Área de interesse: {contexto.get('area_interesse', 'geral')}")
        print(f"   🎯 Nível técnico: {contexto.get('nivel_tecnico', 'intermediário')}")
    else:
        print(f"   ⚠️  Usuário '{user_id}' não encontrado no banco de dados!")
        print(f"   💡 Usando modo anônimo (sem dados pré-carregados)")
    
    # Loop de interação
    while True:
        try:
            message = input("\n👤 Você: ").strip()
            
            if not message:
                continue
            
            # Comandos especiais
            if message.startswith("/"):
                if message == "/stats":
                    stats = agent.get_memory_stats()
                    print("\n📊 Estatísticas de Memória:")
                    print(f"   Short-term: {stats['short_term_messages']} mensagens")
                    print(f"   Vector: {stats['vector_memories']} memórias")
                    print(f"   Resumos: {stats['summaries']}")
                    print(f"   Fatos: {stats['facts']}")
                    print(f"   Preferências: {stats['preferences']}")
                    continue
                
                elif message == "/clear":
                    agent.memory.short_term.clear()
                    print("🗑️ Memória de curto prazo limpa!")
                    continue
                
                elif message == "/prune":
                    result = agent.memory.prune_all()
                    print(f"✂️ Poda executada: {result}")
                    continue
                
                elif message in ["/sair", "/exit", "/quit"]:
                    print("\n👋 Até logo!")
                    break
            
            # Processa mensagem normal
            agent.process_message(message)
            
        except KeyboardInterrupt:
            print("\n\n👋 Encerrando...")
            break
        except Exception as e:
            print(f"\n❌ Erro: {str(e)}")


if __name__ == "__main__":
    main()

