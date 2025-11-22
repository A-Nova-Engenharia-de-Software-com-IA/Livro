# 🏥 Agente de Atendimento para Clínica Médica

Este é um exemplo de agente AI desenvolvido para demonstrar como criar um assistente virtual para clínicas médicas usando Python e OpenAI.

## 📋 Funcionalidades

O agente é capaz de:

- ✅ **Identificar pacientes** através de nome e CPF
- ✅ **Buscar dados do paciente** no banco de dados
- ✅ **Agendar consultas** (novas consultas e retornos)
- ✅ **Consultar exames** e seus resultados
- ✅ **Mostrar agenda disponível** dos médicos
- ✅ **Manter conversação natural** usando OpenAI GPT

## 🗂️ Estrutura do Projeto

```
AI/                       # Raiz do projeto
├── .env.example          # Exemplo de arquivo de configuração (copiar para .env)
├── .env                  # Arquivo de configuração com API key (não commitado)
└── Agent/
    └── chatbot/
        ├── agent.py              # Código principal do agente
        ├── requirements.txt       # Dependências do projeto
        ├── README.md             # Este arquivo
        └── DB/                   # Banco de dados em JSON
            ├── medicos.json      # Dados dos médicos e suas agendas
            ├── pacientes.json    # Dados dos pacientes
            └── exames.json       # Dados dos exames dos pacientes
```

## 🚀 Como Executar

### Pré-requisitos

- Python 3.10 ou superior
- Conta na OpenAI com API key

### Passo 1: Instalar Dependências

```bash
cd Agent/chatbot
pip install -r requirements.txt
```

Ou usando Python 3.10 especificamente:

```bash
python3.10 -m pip install -r requirements.txt
```

### Passo 2: Configurar API Key da OpenAI

**Opção 1 - Arquivo .env (recomendado para desenvolvimento):**

1. Na raiz do projeto (pasta `AI/`), copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione sua chave da OpenAI:
   ```bash
   OPENAI_API_KEY=sk-sua-chave-aqui
   ```

O arquivo `.env` está no `.gitignore` e não será commitado no repositório.

**Opção 2 - Variável de ambiente do sistema:**

```bash
export OPENAI_API_KEY="sua-chave-aqui"
```

**Nota:** A variável de ambiente do sistema tem precedência sobre o arquivo `.env`.

### Passo 3: Executar o Agente

```bash
python3.10 agent.py
```

## 💬 Como Usar

### 1. Iniciar Conversa

Ao executar o agente, você verá uma mensagem de boas-vindas. O agente pedirá seu nome e CPF para identificação.

### 2. Identificar-se

Forneça seu nome e CPF. Exemplos:
- "Meu nome é João da Silva, CPF 123.456.789-00"
- "João Silva, 12345678900"
- "Sou a Maria Santos, CPF 234.567.890-11"

### 3. Solicitar Serviços

Após a identificação, você pode:

- **Agendar consulta**: "Quero agendar uma consulta"
- **Agendar retorno**: "Preciso de um retorno"
- **Consultar exames**: "Quais são meus exames?"
- **Ver resultados**: "Mostre os resultados dos meus exames"
- **Ver agenda**: "Quais horários estão disponíveis?"

### 4. Encerrar

Digite `sair`, `exit` ou `quit` para encerrar o atendimento.

## 📊 Dados de Exemplo

O projeto inclui dados mock para demonstração:

### Pacientes Cadastrados

- **João da Silva** - CPF: 123.456.789-00
- **Maria Santos** - CPF: 234.567.890-11
- **Pedro Oliveira** - CPF: 345.678.901-22
- **Ana Costa** - CPF: 456.789.012-33
- **Carlos Mendes** - CPF: 567.890.123-44
- **Juliana Ferreira** - CPF: 678.901.234-55

### Médicos Disponíveis

- **Dr. Carlos Silva** - Cardiologia
- **Dra. Ana Paula Santos** - Dermatologia
- **Dr. Roberto Mendes** - Ortopedia
- **Dra. Mariana Costa** - Pediatria
- **Dr. Fernando Oliveira** - Clínica Geral

## 🔧 Arquitetura do Agente

### Classe `AgenteClinica`

A classe principal que gerencia toda a lógica do agente:

- **`carregar_dados()`**: Carrega dados dos arquivos JSON
- **`buscar_paciente_por_cpf()`**: Busca paciente pelo CPF
- **`buscar_paciente_por_nome_cpf()`**: Busca paciente por nome e CPF
- **`obter_exames_paciente()`**: Retorna exames de um paciente
- **`processar_mensagem()`**: Processa mensagem usando OpenAI
- **`identificar_paciente()`**: Identifica paciente a partir da mensagem

### Banco de Dados (JSON)

Os dados são armazenados em arquivos JSON na pasta `DB/`:

- **medicos.json**: Lista de médicos com suas especialidades e agendas
- **pacientes.json**: Dados dos pacientes e histórico de consultas
- **exames.json**: Exames solicitados e seus resultados

## 🎯 Casos de Uso

Este agente pode ser adaptado para:

- Atendimento automatizado em clínicas
- Sistema de agendamento online
- Consulta de exames e resultados
- Assistente virtual para telemedicina
- Integração com sistemas de gestão hospitalar

## 🔒 Segurança e Privacidade

⚠️ **IMPORTANTE**: Este é um exemplo educacional. Em produção, você deve:

- Implementar autenticação adequada
- Criptografar dados sensíveis
- Usar HTTPS para comunicação
- Implementar logs de auditoria
- Seguir LGPD para proteção de dados

## 📝 Personalização

Para personalizar o agente:

1. **Adicionar mais dados**: Edite os arquivos JSON em `DB/`
2. **Modificar comportamento**: Ajuste o prompt do sistema em `_preparar_contexto_sistema()`
3. **Adicionar funcionalidades**: Estenda a classe `AgenteClinica`

## 🐛 Solução de Problemas

### Erro: "OPENAI_API_KEY não configurada"

1. Certifique-se de que criou o arquivo `.env` na raiz do projeto (pasta `AI/`)
2. Verifique se o arquivo `.env` contém a linha: `OPENAI_API_KEY=sk-sua-chave-aqui`
3. Ou configure a variável de ambiente do sistema: `export OPENAI_API_KEY="sua-chave-aqui"`

### Erro ao carregar dados

Verifique se os arquivos JSON estão na pasta `DB/` e têm formato válido.

### Erro de conexão com OpenAI

Verifique sua conexão com a internet e se sua API key é válida.

## 📚 Exemplo de Conversa

```
👤 Você: Olá, meu nome é João da Silva, CPF 123.456.789-00

🤖 Assistente: ✅ Olá, João da Silva! Identifiquei você no sistema.
   Como posso ajudá-lo hoje? (consulta, retorno, exame)

👤 Você: Quero agendar uma consulta

🤖 Assistente: Claro! Vejo que seu médico responsável é o Dr. Carlos Silva 
   (Cardiologia). Aqui estão os horários disponíveis para novas consultas:

📅 Agenda disponível - Dr. Carlos Silva (Cardiologia):
  • 2024-12-20: 09:00, 10:00, 14:00, 15:00
  • 2024-12-21: 09:00, 11:00, 14:00, 16:00
  • 2024-12-23: 08:00, 10:00, 13:00, 15:00

👤 Você: Quais são meus exames?

🤖 Assistente: Aqui estão seus exames:

📋 Seus exames:

✅ Hemograma Completo
   Data de solicitação: 2024-11-15
   Data do resultado: 2024-11-18
   Médico: Dr. Carlos Silva

✅ Eletrocardiograma
   Data de solicitação: 2024-11-15
   Data do resultado: 2024-11-18
   Médico: Dr. Carlos Silva
```

## 📄 Licença

Este é um exemplo educacional. Sinta-se livre para usar e modificar conforme necessário.

## 👨‍💻 Autor

Exemplo criado para demonstração de agentes AI em Python.

