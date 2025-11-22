"""
Agente de Atendimento para Clínica Médica

Este exemplo demonstra um agente AI que:
1. Recebe identificação do paciente (nome e CPF)
2. Busca dados do paciente no banco de dados
3. Identifica a necessidade do paciente (exame, consulta, retorno)
4. Fornece informações sobre agenda disponível
5. Mostra resultados de exames quando solicitado
6. Mantém conversação natural usando OpenAI

Caso de uso real: Atendimento automatizado em clínicas, agendamento de consultas,
consulta de exames, etc.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from openai import OpenAI

# ========================
# CONFIGURAÇÃO
# ========================
# Load environment variables from .env file in the root directory
root_dir = Path(__file__).parent.parent
env_path = root_dir / ".env"
load_dotenv(env_path)

# Also check for OPENAI_API_KEY in environment (takes precedence)
if not os.environ.get("OPENAI_API_KEY"):
    print("⚠️  AVISO: OPENAI_API_KEY não configurada!")
    print("   Crie um arquivo .env na raiz do projeto seguindo o exemplo em .env.example")
    print("   Ou configure com: export OPENAI_API_KEY='sua-chave-aqui'\n")

client = OpenAI()

# Caminho para os arquivos de banco de dados
DB_PATH = os.path.join(os.path.dirname(__file__), "DB")

class AgenteClinica:
    """
    Agente especializado em atendimento de clínica médica.
    """
    
    def __init__(self):
        self.medicos = []
        self.pacientes = []
        self.exames = []
        self.paciente_atual = None
        self.historico_conversa = []
        self.carregar_dados()
    
    # Carregar dados
    def carregar_dados(self):
        """Carrega dados dos arquivos JSON."""
        try:
            with open(os.path.join(DB_PATH, "medicos.json"), "r", encoding="utf-8") as f:
                self.medicos = json.load(f)
            
            with open(os.path.join(DB_PATH, "pacientes.json"), "r", encoding="utf-8") as f:
                self.pacientes = json.load(f)
            
            with open(os.path.join(DB_PATH, "exames.json"), "r", encoding="utf-8") as f:
                self.exames = json.load(f)
            
            print("✅ Dados carregados com sucesso!")
        except Exception as e:
            print(f"❌ Erro ao carregar dados: {str(e)}")
        
    # Identificar paciente
    def identificar_paciente(self, mensagem: str) -> bool:
        """
        Tenta identificar o paciente a partir da mensagem.
        Retorna True se identificou com sucesso.
        """
        # Tenta extrair nome e CPF
        dados = self.extrair_nome_cpf(mensagem)
        
        if dados:
            paciente = self.buscar_paciente_por_nome_cpf(dados["nome"], dados["cpf"])
            if paciente:
                self.paciente_atual = paciente
                return True
        
        # Se já temos paciente identificado, não precisa fazer nada
        if self.paciente_atual:
            return True
        
        return False

    def extrair_nome_cpf(self, mensagem: str) -> Optional[Dict[str, str]]:
        """
        Tenta extrair nome e CPF da mensagem do usuário.
        Usa IA para identificar essas informações.
        """
        prompt = f"""Extraia o nome e CPF da seguinte mensagem. 
        Retorne APENAS um JSON no formato: {{"nome": "Nome Completo", "cpf": "123.456.789-00"}}
        Se não encontrar nome ou CPF, use null para o campo ausente.
        
        Mensagem: {mensagem}
        
        JSON:"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Você extrai informações estruturadas de texto. Retorne apenas JSON válido."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=100
            )
            
            resposta = response.choices[0].message.content.strip()
            # Remove markdown code blocks se houver
            if resposta.startswith("```"):
                resposta = resposta.split("```")[1]
                if resposta.startswith("json"):
                    resposta = resposta[4:]
            
            dados = json.loads(resposta)
            
            if dados.get("nome") and dados.get("cpf"):
                return dados
            
        except Exception as e:
            pass
        
        return None

    def buscar_paciente_por_nome_cpf(self, nome: str, cpf: str) -> Optional[Dict]:
        """
        Busca paciente por nome e CPF.
        
        Args:
            nome: Nome do paciente
            cpf: CPF do paciente
        
        Returns:
            Dados do paciente ou None se não encontrado
        """
        paciente = self.buscar_paciente_por_cpf(cpf)

        if paciente:
            # Compara nomes (case-insensitive, sem acentos)
            nome_paciente = paciente["nome"].lower().strip()
            nome_busca = nome.lower().strip()
            
            if nome_paciente == nome_busca:
                return paciente
        
        return None
    
    def buscar_paciente_por_cpf(self, cpf: str) -> Optional[Dict]:
        """
        Busca paciente pelo CPF (aceita com ou sem formatação).
        
        Args:
            cpf: CPF do paciente (com ou sem formatação)
        
        Returns:
            Dados do paciente ou None se não encontrado
        """
        # Remove formatação do CPF
        cpf_limpo = cpf.replace(".", "").replace("-", "").replace(" ", "")
        
        for paciente in self.pacientes:
            cpf_paciente_limpo = paciente["cpf"].replace(".", "").replace("-", "").replace(" ", "")
            if cpf_limpo == cpf_paciente_limpo:
                return paciente
        
        return None
    
    # Exames
    def obter_exames_paciente(self, paciente_id: int) -> List[Dict]:
        """Retorna todos os exames de um paciente."""
        return [exame for exame in self.exames if exame["paciente_id"] == paciente_id]
    
    def obter_informacoes_exames(self) -> str:
        """Retorna informações dos exames do paciente."""
        if not self.paciente_atual:
            return "Por favor, identifique-se primeiro com seu nome e CPF."
        
        exames = self.obter_exames_paciente(self.paciente_atual["id"])
        return self.formatar_exames_paciente(exames)
    
    def formatar_exames_paciente(self, exames: List[Dict]) -> str:
        """Formata lista de exames para exibição."""
        if not exames:
            return "Nenhum exame encontrado."
        
        texto = "\n📋 Seus exames:\n"
        for exame in exames:
            status_emoji = "✅" if exame["status"] == "disponivel" else "⏳"
            texto += f"\n{status_emoji} {exame['tipo_exame']}\n"
            texto += f"   Data de solicitação: {exame['data_solicitacao']}\n"
            
            if exame["status"] == "disponivel":
                texto += f"   Data do resultado: {exame['data_resultado']}\n"
                texto += f"   Médico: {exame['medico_solicitante']}\n"
            else:
                texto += f"   Status: {exame['status']}\n"
        
        return texto

    def obter_medico_por_id(self, medico_id: int) -> Optional[Dict]:
        """Retorna dados do médico pelo ID."""
        for medico in self.medicos:
            if medico["id"] == medico_id:
                return medico
        return None
    
    # Processar mensagem
    def processar_mensagem(self, mensagem: str) -> str:
        """
        Processa mensagem do usuário usando IA e retorna resposta.
        
        Args:
            mensagem: Mensagem do usuário
        
        Returns:
            Resposta do agente
        """
        # Adiciona mensagem ao histórico
        self.historico_conversa.append({"role": "user", "content": mensagem})
        
        # Prepara contexto do sistema
        contexto_sistema = self._preparar_contexto_sistema()
        
        # Prepara mensagens para a API
        mensagens = [
            {"role": "system", "content": contexto_sistema}
        ] + self.historico_conversa[-10:]  # Últimas 10 mensagens para contexto
        
        try:
            # Usa temperatura mais baixa quando paciente já identificado para ser mais consistente
            temp = 0.3 if self.paciente_atual else 0.7
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=mensagens,
                temperature=temp,
                max_tokens=500
            )
            
            resposta = response.choices[0].message.content.strip()
            
            # Adiciona resposta ao histórico
            self.historico_conversa.append({"role": "assistant", "content": resposta})
            
            return resposta
            
        except Exception as e:
            return f"❌ Erro ao processar mensagem: {str(e)}"
    
    # Preparar contexto do sistema
    def _preparar_contexto_sistema(self) -> str:
        """Prepara contexto do sistema para a IA."""
        contexto = """Você é um assistente virtual de uma clínica médica. Seu papel é:
1. Receber nome e CPF do paciente
2. Buscar informações do paciente no banco de dados
3. Identificar o que o paciente precisa (exame, consulta nova, retorno)
4. Fornecer informações relevantes de forma clara e amigável

Seja sempre educado, profissional e prestativo. Use emojis quando apropriado para tornar a conversa mais amigável.

IMPORTANTE: 
- Sempre trabalhe com data e horário atual do sistema.
- Se o paciente ainda não forneceu nome e CPF, peça essas informações primeiro.
- NUNCA revele se um CPF específico existe ou não no sistema sem validação completa de nome E CPF juntos.
- Se paciente não estiver na base, fale que não foi encontrado no sistema, e pergunte se é novo paciente, e faça cadastro e comece processo de atendimento para nova consulta.
- Se CPF e nome não correspondem, responda apenas: "Os dados informados não correspondem a um paciente cadastrado no sistema. Por favor, verifique o nome completo e o CPF e tente novamente."
- Se há informações de "PACIENTE ATUAL IDENTIFICADO" no contexto abaixo, o paciente JÁ está identificado e você NÃO deve pedir nome e CPF novamente. Prossiga diretamente com o atendimento.
- NUNCA invente horários ou datas que não estejam listados abaixo. Use APENAS os horários fornecidos no contexto.
- Quando mencionar horários disponíveis, use EXATAMENTE os horários listados abaixo, sem modificar ou inventar.
- Se após identificar o paciente e tiver exame pronto, e horários disponíveis para retorno, seja proativo em informar e sugerir retorno mostrando agenda do médico responsável.
- Quando paciente pedir resultado de exame, já verifique se está pronto e mostre horários disponíveis para retorno, caso esteja pronto logo pergunta se deseja agendar retorno, verifique data do resultado com data atual para saver se está pronto para agendar retorno.
- Quando paciente pedir para agendar nova consulta, e não informar especialidade, mostre as especialidades e os médicos disponíveis.
- Quando tiver agendamentos confirmados, mostre todos os agendamentos confirmados com data e horário, independente se é retorno ou nova consulta, se fiz agendamentos separados, na confirmação, faça um resumo dos agendamentos confirmados.
- Agenda do médico só mostra no contexto do paciente atual identificado, especialidade/médico escolhido, e quando for necessário pedir dia e horário para agendar consulta."""

        if self.paciente_atual:
            contexto += f"\n\n{'='*60}\n"
            contexto += f"PACIENTE ATUAL IDENTIFICADO - NÃO SOLICITAR DADOS NOVAMENTE\n"
            contexto += f"{'='*60}\n"
            contexto += f"Nome: {self.paciente_atual['nome']}\n"
            contexto += f"CPF: {self.paciente_atual['cpf']}\n"
            contexto += f"Data de nascimento: {self.paciente_atual['data_nascimento']}\n"
            contexto += f"Telefone: {self.paciente_atual['telefone']}\n"
            contexto += f"\n⚠️ IMPORTANTE: Este paciente JÁ está completamente identificado.\n"
            contexto += f"Prossiga diretamente com o atendimento da solicitação dele.\n"
            contexto += f"NÃO pergunte nome ou CPF novamente!\n"
            contexto += f"{'='*60}\n"
            
            # Adiciona informações sobre exames
            exames = self.obter_exames_paciente(self.paciente_atual["id"])
            if exames:
                contexto += f"\nEXAMES DO PACIENTE:\n"
                for exame in exames:
                    contexto += f"- {exame['tipo_exame']} ({exame['status']}) - {exame['data_solicitacao']}\n"
            
            # Adiciona informações sobre médico responsável com agenda completa
            medico = self.obter_medico_por_id(self.paciente_atual.get("medico_responsavel_id"))
            if medico:
                contexto += f"\nMÉDICO RESPONSÁVEL:\n"
                contexto += f"{medico['nome']} - {medico['especialidade']}\n"
                contexto += f"CRM: {medico['crm']}\n"
                contexto += f"\nAGENDA DO MÉDICO RESPONSÁVEL:\n"
                
                # Adiciona agenda de novas consultas
                novas_consultas = medico.get("agenda", {}).get("novas_consultas", [])
                if novas_consultas:
                    contexto += "Novas Consultas:\n"
                    for slot in novas_consultas:
                        contexto += f"  - {slot['data']}: {', '.join(slot['horarios'])}\n"
                
                # Adiciona agenda de retornos
                retornos = medico.get("agenda", {}).get("retornos", [])
                if retornos:
                    contexto += "Retornos:\n"
                    for slot in retornos:
                        contexto += f"  - {slot['data']}: {', '.join(slot['horarios'])}\n"
        
        # Adiciona informações sobre médicos disponíveis com suas agendas completas
        contexto += "\n\nMÉDICOS DISPONÍVEIS COM SUAS AGENDAS:\n"
        for medico in self.medicos:
            contexto += f"\n{medico['nome']} ({medico['especialidade']}) - CRM: {medico['crm']}\n"
            
            # Adiciona agenda de novas consultas
            novas_consultas = medico.get("agenda", {}).get("novas_consultas", [])
            if novas_consultas:
                contexto += "  Novas Consultas:\n"
                for slot in novas_consultas:
                    contexto += f"    - {slot['data']}: {', '.join(slot['horarios'])}\n"
            
            # Adiciona agenda de retornos
            retornos = medico.get("agenda", {}).get("retornos", [])
            if retornos:
                contexto += "  Retornos:\n"
                for slot in retornos:
                    contexto += f"    - {slot['data']}: {', '.join(slot['horarios'])}\n"
        
        return contexto

# ========================
# INTERFACE DO USUÁRIO
# ========================
def main():
    """
    Função principal - interface de interação com o agente.
    """
    print("="*60)
    print("🏥 AGENTE DE ATENDIMENTO - CLÍNICA MÉDICA")
    print("="*60)
    print("\nOlá! Sou o assistente virtual da clínica.")
    print("Posso ajudá-lo com:")
    print("  • Agendamento de consultas")
    print("  • Agendamento de retornos")
    print("  • Consulta de exames")
    print("  • Informações sobre médicos e especialidades")
    print("\nPara começar, preciso do seu nome e CPF.")
    print("="*60 + "\n")
    
    agente = AgenteClinica()
    
    # Loop de interação
    while True:
        try:
            mensagem = input("👤 Você: ").strip()

            if not mensagem:
                continue
            
            if mensagem.lower() in ['sair', 'exit', 'quit', 'tchau']:
                print("\n👋 Obrigado por usar nosso atendimento! Até logo!\n")
                break
            
            # Tenta identificar paciente se ainda não identificado
            if not agente.paciente_atual:
                print('buscando paciente...')
                if agente.identificar_paciente(mensagem):
                    print(f"\n✅ Olá, {agente.paciente_atual['nome']}! Identifiquei você no sistema.")
                    print("   Como posso ajudá-lo hoje? (consulta, retorno, exame)\n")
                    # Limpa histórico de conversa para evitar confusão após identificação
                    agente.historico_conversa = []
                else:
                    # Processa normalmente - a IA vai pedir nome e CPF
                    resposta = agente.processar_mensagem(mensagem)
                    print(f"\n🤖 Assistente: {resposta}\n")
            else:
                # Paciente já identificado - processa mensagem normalmente
                resposta = agente.processar_mensagem(mensagem)
                
                # Sempre adiciona horários reais da base quando o usuário pergunta sobre consultas/agenda
                mensagem_lower = mensagem.lower()
                resposta_lower = resposta.lower()
                
                # Adiciona informações de exames se solicitado
                if any(palavra in mensagem_lower for palavra in ["exame", "resultado", "exames"]):
                    info_exames = agente.obter_informacoes_exames()
                    if info_exames not in resposta:
                        resposta += "\n" + info_exames
                
                print(f"\n🤖 Assistente: {resposta}\n")
            
        except KeyboardInterrupt:
            print("\n\n👋 Encerrando...")
            break
        except Exception as e:
            print(f"\n❌ Erro: {str(e)}\n")


if __name__ == "__main__":
    main()

