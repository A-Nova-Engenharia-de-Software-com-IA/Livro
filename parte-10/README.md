# AI Agents with Mastra + WhatsApp

AI agents built with the [Mastra](https://mastra.ai/) framework, including a **WhatsApp-connected agent** that receives messages and replies automatically using AI.

---

## What this project does

An **orchestrator agent** receives messages via WhatsApp and delegates to specialized agents:

| Agent | What it does |
|---|---|
| **Orchestrator** | Receives WhatsApp messages and decides which agent to trigger |
| **WhatsApp Agent** | Sends messages and lists conversations via WhatsApp Web |
| **Weather Agent** | Fetches weather forecast for any city |
| **Running Agent** | Searches for running events and races in Brazil |
| **Supabase Agent** | Queries and analyzes database data via SQL |

---

## Prerequisites

- Node.js `>= 22.13.0`
- [OpenAI](https://platform.openai.com/) account with an API key
- WhatsApp installed on your phone (to scan the QR Code)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/A-Nova-Engenharia-de-Software-com-IA/Livro.git
cd Livro/parte-10
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
OPENAI_API_KEY=sk-proj-...            # Required
SUPABASE_PERSONAL_ACCESS_TOKEN=sbp_... # Required only for the Supabase Agent
```

---

## Running the project

```bash
npm run dev
```

On startup, two important events happen:

**1. WhatsApp QR Code appears in the terminal:**

```
Scan the QR Code below with WhatsApp:
(WhatsApp > Linked Devices > Link a Device)

[QR CODE HERE]
```

Open WhatsApp on your phone > **Linked Devices** > **Link a Device** > scan the QR.

**2. Mastra Studio opens at [http://localhost:4111](http://localhost:4111)**

Visual interface to test and interact with agents directly in the browser.

---

## How to use the WhatsApp agent

After scanning the QR Code and seeing `WhatsApp pronto.` in the terminal:

1. Send a message from the authorized number to the linked number
2. The **orchestrator agent** receives the message automatically
3. It analyzes the request and triggers the right agent
4. The response is sent back via WhatsApp

**Example messages:**

```
"What's the weather forecast in Florianópolis today?"
"List running races in SC for October"
"Send a message to 5548999999999 saying 'meeting at 3pm'"
```

> **Authorized number setup:** By default, only one specific number can send commands to the agent. Edit the `AUTHORIZED_NUMBER` variable in `src/mastra/whatsapp/client.ts` with your number in the format `554899999999@lid` (country code + area code + number, no spaces, followed by `@lid`):
>
> ```ts
> // src/mastra/whatsapp/client.ts
> const AUTHORIZED_NUMBER = '554899999999@lid' // replace with your number
> ```
>
> **To accept messages from any number** (useful for testing), comment out these two lines in the same file:
>
> ```ts
> // const AUTHORIZED_NUMBER = '554899999999@lid'
>
> whatsappClient.on('message', async (message) => {
>   console.log(`[WhatsApp] Mensagem de ${message.from}: ${message.body}`)
>   // if (message.from !== AUTHORIZED_NUMBER) return  // <-- comment this line out
> ```

---

## WhatsApp session

The session is saved locally at `src/mastra/public/.wwebjs_auth/` — you **do not need to scan the QR Code every time**. The session persists across restarts.

To reset the session (e.g., to switch accounts), delete that folder:

```bash
rm -rf src/mastra/public/.wwebjs_auth
```

---

## Production build

```bash
npm run build
npm start
```

---

## Project structure

```
src/mastra/
├── agents/
│   ├── orquest-agent.ts      # Main orchestrator
│   ├── whatsapp-agent.ts     # Sends messages and lists chats
│   ├── weather-agent.ts      # Weather forecast
│   ├── running-agent.ts      # Running races
│   └── supabase-agent.ts     # SQL queries on Supabase
├── whatsapp/
│   └── client.ts             # WhatsApp Web connection + message listener
├── tools/                    # Reusable agent tools
└── index.ts                  # Central Mastra configuration
```

---

## Learn more

- [Mastra Documentation](https://mastra.ai/docs/)
- [whatsapp-web.js](https://wwebjs.dev/)
