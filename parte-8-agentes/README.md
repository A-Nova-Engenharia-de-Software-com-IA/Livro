# Atom Agent - Sistema de Agentes IA Integrados

Um sistema completo de agentes inteligentes construído com Mastra, que integra diversas plataformas e ferramentas para automatização e orquestração de tarefas.

## 🤖 Agentes Disponíveis

### 1. **Intent Classifier Agent** (Classificador de Intenção)
- **ID**: `anestech-intent-agent`
- **Descrição**: Classifica as intenções do usuário em um contexto médico (pré-operatórios e agendamentos).
- **Funções**:
  - Listar pacientes de um dia específico
  - Criar pré-operatório a partir de relatos médicos
  - Enviar pré-operatório para sistema AxReg
- **Casos de uso**: "Quais pacientes tenho amanhã?", "Envie o pré-op para o AxReg"

### 2. **Pré-operatório (Áudio → JSON)** (Processador de Pré-op)
- **ID**: `anestech-preop-agent`
- **Descrição**: Converte relatos de áudio transcritos em estruturas JSON padronizadas de pré-operatório.
- **Funções**:
  - Extrair informações clínicas de relatos de texto
  - Organizar dados em formato JSON estruturado
  - Gerar documento padrão de pré-operatório
- **Saída**: Array JSON com perguntas e respostas padronizadas

### 3. **ClickUp Timesheets Assistant** (Assistente de Apontamento de Horas)
- **ID**: `clickup-agent`
- **Descrição**: Gerencia apontamento de horas e tarefas no ClickUp.
- **Funções**:
  - Consultar horas apontadas por período
  - Listar usuários do ClickUp
  - Criar novas tarefas
  - Lançar apontamentos de horas
- **Casos de uso**: "Quanto o time apontou essa semana?", "Lançar 8 horas para João"

### 4. **Email Assistant** (Assistente de Email)
- **ID**: `email-agent`
- **Descrição**: Redige e envia emails via SMTP com confirmação prévia.
- **Funções**:
  - Redigir emails personalizados
  - Enviar com confirmação de destinatário, assunto e conteúdo
  - Suportar anexos em formato String/JSON
- **Casos de uso**: "Envie um email para financeiro@empresa.com com relatório"

### 5. **Search Agent** (Agente de Pesquisa Web)
- **ID**: `search-agent`
- **Descrição**: Realiza buscas na web para obter informações atualizadas.
- **Funções**:
  - Pesquisar tópicos diversos
  - Retornar informações relevantes e atualizadas
- **Casos de uso**: "Pesquise sobre Python 3.12", "Quais são as principais notícias de tecnologia?"

### 6. **Slack Assistant** (Assistente do Slack)
- **ID**: `slack-agent`
- **Descrição**: Interage com Slack para enviar mensagens e gerenciar canais/usuários.
- **Funções**:
  - Listar canais disponíveis
  - Listar usuários do workspace
  - Enviar mensagens em canais
  - Enviar mensagens diretas (DM) para usuários
- **Casos de uso**: "Avise no #geral que temos reunião", "Mande um DM para João"

### 7. **Weather Agent** (Agente do Tempo)
- **ID**: `weather-agent`
- **Descrição**: Fornece informações de clima para localidades específicas.
- **Funções**:
  - Consultar condições climáticas atuais
  - Fornecer detalhes de umidade, vento e precipitação
  - Traduzir localizações automáticamente
- **Casos de uso**: "Como está o tempo em São Paulo?", "Qual é a temperatura em Nova York?"

### 8. **WhatsApp Assistant** (Assistente do WhatsApp)
- **ID**: `whatsapp-agent`
- **Descrição**: Envia mensagens via WhatsApp usando Twilio.
- **Funções**:
  - Enviar mensagens de texto
  - Respeitar a janela de 24h de respostas
- **Casos de uso**: "Envie uma mensagem para +5511999999999 informando sobre a reunião"

### 9. **Operations Orchestrator** (Orquestrador de Operações)
- **ID**: `ops-orchestrator`
- **Descrição**: Agente coordenador que delega tarefas para especialistas em diferentes sistemas.
- **Funções**:
  - Orquestrar fluxos multi-sistema
  - Delegar para Search, ClickUp, Slack, Email e WhatsApp
  - Coordenar pesquisa → coleta de dados → comunicação
- **Casos de uso**: "Pesquise sobre Python 3.12, coloque em uma tarefa no ClickUp e avise no Slack"

### 10. **Operations Assistant** (Assistente Operacional)
- **ID**: `ops-agent` (clickup-slack-general)
- **Descrição**: Integra Slack e ClickUp para comunicação e relatórios operacionais.
- **Funções**:
  - Gerenciar canais e mensagens do Slack
  - Consultar dados de apontamento no ClickUp
  - Criar tarefas e enviar atualizações ao time
- **Casos de uso**: "Veja quanto o time apontou essa semana e avise no Slack"

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn instalado

### Instalação

1. **Clonar o repositório** (se aplicável):
   ```bash
   git clone <seu-repositorio>
   cd parte-8-agentes
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**:
   - Crie um arquivo `.env` na raiz do projeto
   - Configure as chaves necessárias para:
     - OpenAI API
     - Slack
     - ClickUp
     - Twilio (WhatsApp)
     - SMTP (Email)

### Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Isso iniciará o servidor Mastra em modo desenvolvimento, disponibilizando todos os agentes para interação.

### Build para Produção

```bash
npm build
```

---

## 🛠 Tecnologias Utilizadas

- **Mastra**: Framework para construção de agentes IA
- **OpenAI**: Modelos LLM (GPT-5.2)
- **Node.js + TypeScript**: Runtime e tipagem
- **Integrations**:
  - Slack API
  - ClickUp API
  - Twilio (WhatsApp)
  - Nodemailer (SMTP)
  - Weather API
  - MCP (Model Context Protocol)

---

## 📁 Estrutura do Projeto

```
src/mastra/
├── agents/           # Definição de todos os agentes
├── tools/            # Ferramentas reutilizáveis
├── workflows/        # Fluxos de trabalho (workflows)
├── mcp/              # Servidores MCP
└── server/           # Rotas e webhooks (Twilio, etc)
```

---

## 📝 Licença

ISC

---

## 👤 Autor

Rafael Scheidt
