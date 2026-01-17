"""
Sistema Multi-Agente: Equipe de Desenvolvimento de Software

Este exemplo demonstra um sistema multi-agente que simula uma equipe de desenvolvimento:
1. Agente Gerente - Coordena a equipe e define a estratégia
2. Agente Planejador - Cria o plano técnico e arquitetura
3. Agente Desenvolvedor - Escreve o código
4. Agente Revisor - Revisa o código e sugere melhorias

Cada agente tem:
- Um papel específico (system prompt diferente)
- Uma responsabilidade bem definida
- Colaboração com os outros agentes

Caso de uso real: Automação de desenvolvimento de software, code review automatizado,
geração de código com validação em múltiplas etapas.
"""

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

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

# ========================
# PROMPTS DOS AGENTES
# ========================

PROMPT_GERENTE = """Você é o Gerente de Projeto de uma equipe de desenvolvimento de software.

Seu papel é:
1. Analisar o pedido do cliente/usuário
2. Definir a estratégia geral de implementação
3. Identificar os requisitos principais
4. Delegar tarefas para a equipe

Ao receber uma solicitação, você deve:
- Entender exatamente o que o usuário precisa
- Listar os requisitos funcionais principais
- Definir prioridades
- Criar um briefing claro para o Planejador

Responda de forma estruturada e objetiva.
Formato esperado:
## Análise do Pedido
[Sua análise]

## Requisitos Identificados
- Requisito 1
- Requisito 2
...

## Briefing para o Planejador
[Instruções claras para o próximo agente]
"""

PROMPT_PLANEJADOR = """Você é o Arquiteto/Planejador de Software da equipe.

Seu papel é:
1. Receber o briefing do Gerente
2. Definir a arquitetura técnica
3. Escolher as tecnologias adequadas
4. Criar o plano de implementação detalhado

Ao receber o briefing, você deve:
- Analisar os requisitos técnicos
- Definir a estrutura do código (funções, classes, módulos)
- Especificar os algoritmos/lógica necessários
- Criar um plano passo-a-passo para o Desenvolvedor

Responda de forma estruturada e técnica.
Formato esperado:
## Arquitetura Proposta
[Descrição da arquitetura]

## Estrutura do Código
[Classes/Funções necessárias]

## Plano de Implementação
1. Passo 1
2. Passo 2
...

## Especificações para o Desenvolvedor
[Detalhes técnicos para implementação]
"""

PROMPT_DESENVOLVEDOR = """Você é o Desenvolvedor Sênior da equipe.

Seu papel é:
1. Receber o plano técnico do Planejador
2. Implementar o código seguindo as especificações
3. Escrever código limpo, documentado e funcional
4. Seguir boas práticas de programação

Ao receber o plano, você deve:
- Implementar cada função/classe especificada
- Adicionar docstrings e comentários relevantes
- Seguir padrões PEP 8 (para Python)
- Incluir tratamento de erros básico

Responda APENAS com o código implementado.
Use markdown para formatar o código.
Adicione comentários explicativos quando necessário.
"""

PROMPT_REVISOR = """Você é o Revisor de Código (Code Reviewer) da equipe.

Seu papel é:
1. Analisar o código do Desenvolvedor
2. Identificar bugs, problemas ou melhorias
3. Verificar boas práticas e padrões
4. Sugerir melhorias específicas

Ao receber o código, você deve avaliar:
- Funcionalidade: O código faz o que deveria?
- Qualidade: Segue boas práticas?
- Legibilidade: É fácil de entender?
- Performance: Há otimizações óbvias?
- Segurança: Há vulnerabilidades?

Responda de forma estruturada.
Formato esperado:
## Avaliação Geral
⭐ Nota: X/10
[Resumo da avaliação]

## Pontos Positivos
- Ponto 1
- Ponto 2
...

## Problemas Encontrados
- Problema 1: [descrição] → Solução: [sugestão]
- Problema 2: [descrição] → Solução: [sugestão]
...

## Código Corrigido (se necessário)
[Código com as correções aplicadas]

## Veredicto Final
✅ APROVADO / ⚠️ APROVADO COM RESSALVAS / ❌ REPROVADO
"""


# ========================
# CLASSE DO AGENTE
# ========================


@dataclass
class Agente:
    """
    Representa um agente individual no sistema multi-agente.

    Attributes:
        nome: Nome identificador do agente
        papel: Descrição curta do papel (ex: "Gerente", "Desenvolvedor")
        prompt_sistema: O system prompt que define o comportamento do agente
        modelo: Modelo da OpenAI a ser usado
        temperatura: Controla a criatividade das respostas
        memoria: Histórico de mensagens do agente
    """

    nome: str
    papel: str
    prompt_sistema: str
    modelo: str = "gpt-4o-mini"
    temperatura: float = 0.7
    memoria: List[Dict[str, str]] = field(default_factory=list)

    def processar(self, mensagem: str, contexto: Optional[str] = None) -> str:
        """
        Processa uma mensagem e retorna a resposta do agente.

        Args:
            mensagem: A mensagem/tarefa a ser processada
            contexto: Contexto adicional (ex: saída de outro agente)

        Returns:
            Resposta do agente
        """
        # Prepara a mensagem do usuário
        conteudo_usuario = mensagem
        if contexto:
            conteudo_usuario = f"{contexto}\n\n---\n\nTarefa atual:\n{mensagem}"

        # Adiciona à memória
        self.memoria.append({"role": "user", "content": conteudo_usuario})

        # Monta as mensagens para a API
        mensagens = [{"role": "system", "content": self.prompt_sistema}] + self.memoria[
            -6:
        ]  # Últimas 6 mensagens para contexto

        try:
            response = client.chat.completions.create(
                model=self.modelo,
                messages=mensagens,
                temperature=self.temperatura,
                max_tokens=2000,
            )

            resposta = response.choices[0].message.content

            # Salva resposta na memória
            self.memoria.append({"role": "assistant", "content": resposta})

            return resposta

        except Exception as e:
            return f"❌ Erro ao processar: {str(e)}"


# ========================
# SISTEMA MULTI-AGENTE
# ========================


class EquipeDesenvolvimento:
    """
    Orquestra uma equipe de agentes para desenvolvimento de software.

    Esta classe implementa o padrão de sistema multi-agente onde:
    - Cada agente tem uma função específica
    - Os agentes colaboram em sequência (pipeline)
    - A saída de um agente alimenta o próximo

    Fluxo: Gerente → Planejador → Desenvolvedor → Revisor
    """

    def __init__(self):
        """Inicializa a equipe com todos os agentes."""
        self.gerente = Agente(
            nome="Gerente",
            papel="Coordenador de Projeto",
            prompt_sistema=PROMPT_GERENTE,
            temperatura=0.5,
        )

        self.planejador = Agente(
            nome="Planejador",
            papel="Arquiteto de Software",
            prompt_sistema=PROMPT_PLANEJADOR,
            temperatura=0.6,
        )

        self.desenvolvedor = Agente(
            nome="Desenvolvedor",
            papel="Desenvolvedor Sênior",
            prompt_sistema=PROMPT_DESENVOLVEDOR,
            temperatura=0.3,  # Menos criativo, mais preciso
        )

        self.revisor = Agente(
            nome="Revisor",
            papel="Code Reviewer",
            prompt_sistema=PROMPT_REVISOR,
            temperatura=0.4,
        )

    def _imprimir_etapa(self, agente: Agente, titulo: str):
        """Imprime cabeçalho de uma etapa."""
        print(f"\n{'='*60}")
        print(f"🤖 {agente.nome.upper()} - {agente.papel}")
        print(f"   {titulo}")
        print(f"{'='*60}\n")

    def executar_projeto(self, solicitacao: str) -> Dict:
        """
        Executa o pipeline completo de desenvolvimento.

        Args:
            solicitacao: Descrição do que o usuário quer desenvolver

        Returns:
            Dicionário com os resultados de cada etapa
        """
        resultados = {
            "solicitacao_original": solicitacao,
            "analise_gerente": "",
            "plano_tecnico": "",
            "codigo": "",
            "revisao": "",
        }

        print("\n" + "🚀" * 20)
        print("INICIANDO PROJETO DE DESENVOLVIMENTO")
        print("🚀" * 20)
        print(f"\n📋 Solicitação: {solicitacao}\n")

        # ========================================
        # ETAPA 1: Gerente analisa o pedido
        # ========================================
        self._imprimir_etapa(self.gerente, "Analisando solicitação...")

        analise = self.gerente.processar(
            f"Analise a seguinte solicitação de desenvolvimento:\n\n{solicitacao}"
        )
        resultados["analise_gerente"] = analise
        print(analise)

        # ========================================
        # ETAPA 2: Planejador cria o plano técnico
        # ========================================
        self._imprimir_etapa(self.planejador, "Criando plano técnico...")

        plano = self.planejador.processar(
            "Crie o plano técnico de implementação baseado na análise do Gerente.",
            contexto=f"Análise do Gerente:\n{analise}",
        )
        resultados["plano_tecnico"] = plano
        print(plano)

        # ========================================
        # ETAPA 3: Desenvolvedor implementa o código
        # ========================================
        self._imprimir_etapa(self.desenvolvedor, "Implementando código...")

        codigo = self.desenvolvedor.processar(
            "Implemente o código seguindo o plano técnico.",
            contexto=f"Plano Técnico:\n{plano}",
        )
        resultados["codigo"] = codigo
        print(codigo)

        # ========================================
        # ETAPA 4: Revisor avalia o código
        # ========================================
        self._imprimir_etapa(self.revisor, "Revisando código...")

        revisao = self.revisor.processar(
            "Revise o código implementado e forneça feedback.",
            contexto=f"Solicitação original: {solicitacao}\n\nCódigo implementado:\n{codigo}",
        )
        resultados["revisao"] = revisao
        print(revisao)

        # ========================================
        # RESUMO FINAL
        # ========================================
        print("\n" + "✅" * 20)
        print("PROJETO CONCLUÍDO!")
        print("✅" * 20)
        print("\n📊 Resumo das etapas executadas:")
        print("   1. ✅ Gerente analisou a solicitação")
        print("   2. ✅ Planejador criou o plano técnico")
        print("   3. ✅ Desenvolvedor implementou o código")
        print("   4. ✅ Revisor avaliou e forneceu feedback")

        return resultados


# ========================
# MAIN
# ========================

if __name__ == "__main__":
    print("\n" + "🤖" * 20)
    print("SISTEMA MULTI-AGENTE: EQUIPE DE DESENVOLVIMENTO")
    print("🤖" * 20)
    print("\n📚 DEMONSTRAÇÃO: Criando uma calculadora simples")
    print("=" * 60)

    equipe = EquipeDesenvolvimento()

    solicitacao = """
    Crie uma calculadora em Python que:
    - Suporte operações básicas (soma, subtração, multiplicação, divisão)
    - Tenha uma interface de linha de comando simples
    - Trate divisão por zero
    - Permita o usuário fazer múltiplos cálculos até digitar 'sair'
    """

    equipe.executar_projeto(solicitacao)
