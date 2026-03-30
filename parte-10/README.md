# Agentes IA com Mastra + WhatsApp

Projeto de agentes de inteligência artificial construídos com o framework [Mastra](https://mastra.ai/), incluindo um **agente conectado ao WhatsApp** capaz de receber mensagens e responder automaticamente usando IA.

---

## O que este projeto faz

Um **agente orquestrador** recebe mensagens via WhatsApp e delega para agentes especializados:

| Agente | O que faz |
|---|---|
| **Orquestrador** | Recebe mensagens do WhatsApp e decide qual agente acionar |
| **WhatsApp Agent** | Envia mensagens e lista conversas via WhatsApp Web |
| **Weather Agent** | Consulta previsão do tempo de qualquer cidade |
| **Running Agent** | Busca eventos e corridas de rua no Brasil |
| **Supabase Agent** | Consulta e analisa dados do banco via SQL |

---

## Pré-requisitos

- Node.js `>= 22.13.0`
- Conta [OpenAI](https://platform.openai.com/) com chave de API
- WhatsApp instalado no celular (para escanear o QR Code)

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/A-Nova-Engenharia-de-Software-com-IA/Livro.git
cd Livro/parte-10
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas chaves:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
OPENAI_API_KEY=sk-proj-...          # Obrigatório
SUPABASE_PERSONAL_ACCESS_TOKEN=sbp_... # Necessário apenas para o Supabase Agent
```

---

## Rodando o projeto

```bash
npm run dev
```

Ao iniciar, dois eventos importantes acontecem:

**1. QR Code do WhatsApp aparece no terminal:**

```
Escaneie o QR Code abaixo com o WhatsApp:
(WhatsApp > Dispositivos vinculados > Vincular um dispositivo)

[QR CODE AQUI]
```

Abra o WhatsApp no celular > **Dispositivos vinculados** > **Vincular um dispositivo** > escaneie o QR.

**2. Mastra Studio abre em [http://localhost:4111](http://localhost:4111)**

Interface visual para testar e interagir com os agentes diretamente pelo browser.

---

## Como usar o agente do WhatsApp

Após escanear o QR Code e ver a mensagem `WhatsApp pronto.` no terminal:

1. Envie uma mensagem do número autorizado para o número vinculado
2. O **agente orquestrador** recebe a mensagem automaticamente
3. Ele analisa o pedido e aciona o agente certo
4. A resposta é enviada de volta via WhatsApp

**Exemplos de mensagens que funcionam:**

```
"Qual a previsão do tempo em Florianópolis hoje?"
"Me lista as corridas de rua em SC para outubro"
"Manda uma mensagem para 5548999999999 dizendo 'reunião às 15h'"
```

> O número autorizado a enviar comandos é configurado diretamente no arquivo `src/mastra/whatsapp/client.ts` na variável `AUTHORIZED_NUMBER`.

---

## Sessão do WhatsApp

A sessão é salva localmente em `src/mastra/public/.wwebjs_auth/` — você **não precisa escanear o QR Code toda vez**. A sessão persiste entre reinicializações.

Se precisar resetar a sessão (trocar de conta, por exemplo), delete essa pasta:

```bash
rm -rf src/mastra/public/.wwebjs_auth
```

---

## Build para produção

```bash
npm run build
npm start
```

---

## Estrutura do projeto

```
src/mastra/
├── agents/
│   ├── orquest-agent.ts      # Orquestrador principal
│   ├── whatsapp-agent.ts     # Envia mensagens e lista chats
│   ├── weather-agent.ts      # Previsão do tempo
│   ├── running-agent.ts      # Corridas de rua
│   └── supabase-agent.ts     # Consultas SQL no Supabase
├── whatsapp/
│   └── client.ts             # Conexão WhatsApp Web + listener de mensagens
├── tools/                    # Ferramentas reutilizáveis dos agentes
└── index.ts                  # Configuração central do Mastra
```

---

## Saiba mais

- [Documentação do Mastra](https://mastra.ai/docs/)
- [whatsapp-web.js](https://wwebjs.dev/)
