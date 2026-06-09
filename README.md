# Adalat AI Chatbot — Complete Setup Guide

React + TypeScript legal chat UI backed by **n8n** and **Groq**. Adalat AI answers questions about Pakistani law (Constitution, PPC, CrPC).

This guide covers **everything from a fresh Windows/Mac/Linux machine**: installing Node.js, setting up n8n, configuring Groq, importing the workflow, and running the React frontend.

---

## Table of contents

1. [What you are building](#what-you-are-building)
2. [Prerequisites checklist](#prerequisites-checklist)
3. [Part 1 — Install Node.js](#part-1--install-nodejs)
4. [Part 2 — Install and run n8n](#part-2--install-and-run-n8n)
5. [Part 3 — First-time n8n setup](#part-3--first-time-n8n-setup)
6. [Part 4 — Get a Groq API key](#part-4--get-a-groq-api-key)
7. [Part 5 — Import the Adalat AI workflow](#part-5--import-the-adalat-ai-workflow)
8. [Part 6 — Connect Groq credentials in n8n](#part-6--connect-groq-credentials-in-n8n)
9. [Part 7 — Activate the workflow and verify webhook](#part-7--activate-the-workflow-and-verify-webhook)
10. [Part 8 — Configure and run the React app](#part-8--configure-and-run-the-react-app)
11. [Part 9 — Production build (optional)](#part-9--production-build-optional)
12. [Daily development workflow](#daily-development-workflow)
13. [Troubleshooting](#troubleshooting)
14. [Project structure](#project-structure)

---

## What you are building

```
┌─────────────────────────────────────────────────────────────┐
│  Browser  →  React app (localhost:5173)                     │
│                    │                                        │
│                    ▼  Vite proxy /api/n8n/...               │
│              n8n webhook (localhost:5678)                   │
│                    │                                        │
│                    ▼  AI Agent + memory                     │
│              Groq LLM (cloud API)                           │
│                    │                                        │
│                    ▼  JSON reply                            │
│              Back to chat UI                                │
└─────────────────────────────────────────────────────────────┘
```

You will run **two terminals**:

| Terminal | Command | URL |
|----------|---------|-----|
| 1 | `n8n start` | http://localhost:5678 (workflow editor) |
| 2 | `npm run dev` | http://localhost:5173 (chat UI) |

---

## Prerequisites checklist

Before you start, you need:

- [ ] **Node.js 18 or newer** (includes `npm`)
- [ ] **Internet connection** (for Groq API and npm packages)
- [ ] **Groq account** (free tier is enough)
- [ ] This project folder on your machine

Estimated time: **15–25 minutes** on first setup.

---

## Part 1 — Install Node.js

### Windows

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** installer (recommended)
3. Run the installer → accept defaults → finish
4. Open **PowerShell** or **Command Prompt** and verify:

```bash
node -v
npm -v
```

You should see version numbers (e.g. `v20.x.x` and `10.x.x`).

### macOS

```bash
# Option A: official installer from nodejs.org (same as Windows)

# Option B: Homebrew
brew install node
node -v
npm -v
```

### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

---

## Part 2 — Install and run n8n

n8n is the automation platform that runs the AI agent behind this chatbot.

### Install n8n globally

Open a terminal and run (one time per machine):

```bash
npm install -g n8n
```

Verify installation:

```bash
n8n --version
```

### Start n8n

```bash
n8n start
```

Wait until you see output like:

```
Initializing n8n process
n8n ready on ::, port 5678
Editor is now accessible via:
http://localhost:5678
```

**Keep this terminal open** — closing it stops n8n.

Open your browser and go to: **http://localhost:5678**

### Common n8n startup messages (safe to ignore)

| Message | Meaning |
|---------|---------|
| `Python 3 is missing` | Python task runner not needed for this project |
| `Error tracking disabled` | Normal for local installs |
| `timeout ... community nodes` | Network timeout fetching extra nodes; not required |

### Where n8n stores data

n8n saves workflows, credentials, and settings locally:

| OS | Default folder |
|----|----------------|
| Windows | `C:\Users\<YourName>\.n8n\` |
| macOS / Linux | `~/.n8n/` |

You do **not** need to edit these files manually.

### Optional: run n8n on a fixed port

Default port is `5678`. To use another port:

```bash
# Windows PowerShell
$env:N8N_PORT=5678; n8n start

# macOS / Linux
N8N_PORT=5678 n8n start
```

---

## Part 3 — First-time n8n setup

The first time you open http://localhost:5678, n8n asks you to create an **owner account**. This is **local only** — it protects your n8n editor on your machine.

1. Open **http://localhost:5678**
2. Fill in:
   - **Email** — any email (used locally, not sent anywhere)
   - **First name / Last name**
   - **Password** — choose a strong password
3. Click **Next** / **Get started**
4. Skip optional steps (survey, templates) if you want — they are not required
5. You should land on the n8n **Overview** or **Workflows** screen

You only do this once. Next time you run `n8n start`, you log in with the same password.

---

## Part 4 — Get a Groq API key

The workflow uses **Groq** as the language model provider.

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in (Google/GitHub login works)
3. Open **API Keys** in the left sidebar
4. Click **Create API Key**
5. Copy the key — it looks like `gsk_...`
6. Store it somewhere safe — you will paste it into n8n in the next steps

> Groq has a free tier with rate limits. For local development and testing, that is usually enough.

---

## Part 5 — Import the Adalat AI workflow

The workflow file is included in this repo.

### Steps

1. Make sure n8n is running (`n8n start`) and you are logged in at http://localhost:5678
2. In the left sidebar, click **Workflows**
3. Click the **⋮** menu (top right) or **Add workflow** dropdown → **Import from File**
   - Alternative: from the workflow list page, use **Import from File** button
4. Browse to this project folder and select:

```
Adalat AI Chatbot/n8n/adalat-ai-workflow.json
```

5. The workflow **"Adalat AI Chatbot"** opens in the editor

### What the workflow contains

| Node | Role |
|------|------|
| **Webhook** | Receives `chatInput` + `sessionId` from the React app |
| **Normalize Input** | Reads POST body or GET query parameters |
| **Adalat AI Agent** | Legal AI assistant with Pakistani law system prompt |
| **Window Buffer Memory** | Remembers conversation per `sessionId` |
| **Groq Chat Model** | Calls Groq LLM (`openai/gpt-oss-120b`) |

The webhook URL path (important for the frontend):

```
/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37
```

Full URL when n8n is running locally:

```
http://localhost:5678/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37
```

More workflow notes: [`n8n/README.md`](n8n/README.md)

---

## Part 6 — Connect Groq credentials in n8n

After import, the **Groq Chat Model** node may show a red warning — the imported credential ID does not exist on your machine yet. Fix it:

1. In the workflow canvas, click the **Groq Chat Model** node
2. In the node panel on the right, find **Credential to connect with**
3. Click the dropdown → **Create New Credential** (or **+ New**)
4. Credential type: **Groq API**
5. Paste your Groq API key (`gsk_...`) into the **API Key** field
6. Name it e.g. `Groq Adalat AI`
7. Click **Save** on the credential dialog
8. Confirm the node now shows your credential (no red error)

### Verify other nodes (quick check)

Click each node — none should show red errors:

- **Webhook** — HTTP Method: `POST`, Response: **When Last Node Finishes**
- **Normalize Input** — maps `chatInput` and `sessionId`
- **Adalat AI Agent** — Prompt type: **auto**
- **Window Buffer Memory** — Session ID from `$json.sessionId`

---

## Part 7 — Activate the workflow and verify webhook

The webhook only works when the workflow is **saved** and **active**.

### Save and activate

1. Click **Save** (top right)
2. Toggle the **Inactive / Active** switch to **Active** (should turn green/on)
3. n8n registers the webhook only after activation

If activation fails, open **Executions** or check the node for errors (usually missing Groq credential).

### Test with curl (recommended)

Open a **new** terminal (keep n8n running in the first one).

**Windows (cmd or PowerShell):**

```bash
curl.exe -X POST "http://localhost:5678/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37" ^
  -H "Content-Type: application/json" ^
  -d "{\"chatInput\":\"What is bail in Pakistan?\",\"sessionId\":\"test-1\"}"
```

**macOS / Linux:**

```bash
curl -X POST "http://localhost:5678/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37" \
  -H "Content-Type: application/json" \
  -d '{"chatInput":"What is bail in Pakistan?","sessionId":"test-1"}'
```

**Expected:** JSON response with an `output` field containing the AI answer (may take a few seconds).

**If you see an error:**

| Error | Fix |
|-------|-----|
| `webhook ... is not registered` | Workflow not **Active** — toggle Active and Save again |
| `Authorization failed` / Groq error | Re-check Groq API key in credentials |
| Connection refused | Run `n8n start` |

### Test inside n8n (alternative)

1. Open the **Webhook** node
2. Click **Listen for test event** or use **Test workflow**
3. Send a test POST from curl or the **Test URL** shown in the node
4. Check **Executions** (left sidebar) for success/failure details

---

## Part 8 — Configure and run the React app

### Get the project

```bash
cd "d:\Adalat AI Chatbot"
```

(Use your actual path if different.)

### Create `.env`

In the project root (same folder as `package.json`), create or edit `.env`:

```env
VITE_WEBHOOK_PATH=/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37
```

**Important:**

| Correct | Wrong |
|---------|-------|
| `/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37` | `http://localhost:5678/webhook/...` |
| Path only | `/webhook/adalat-ai-api` (different webhook) |

The dev server adds the host via Vite proxy. If `.env` is missing, the app uses the same default path.

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Open **http://localhost:5173**

### Use the chat

1. Type a legal question (English, Urdu, or Pashto)
2. Press Send
3. The app sends:

```json
{
  "chatInput": "your question",
  "sessionId": "auto-generated-browser-id"
}
```

4. The reply appears in the chat with markdown formatting

**Requirement:** n8n must still be running with the workflow **Active**.

---

## Part 9 — Production build (optional)

```bash
npm run build
npm run preview
```

Preview serves the built app at **http://localhost:4173** (default).

In production mode the frontend calls `http://localhost:5678` directly (no Vite proxy). For deployment, point the app at your hosted n8n URL or adjust `src/api/chatApi.ts`.

---

## Daily development workflow

Every time you work on the project:

```bash
# Terminal 1 — backend
n8n start
# → open http://localhost:5678 and confirm "Adalat AI Chatbot" is Active

# Terminal 2 — frontend
cd "d:\Adalat AI Chatbot"
npm run dev
# → open http://localhost:5173
```

Stop either service with `Ctrl+C` in its terminal.

---

## Troubleshooting

### n8n

| Problem | Solution |
|---------|----------|
| `n8n: command not found` | Re-run `npm install -g n8n`, restart terminal |
| Port 5678 already in use | Stop other n8n instance or set `N8N_PORT=5679` |
| Forgot n8n password | Reset via n8n docs or delete `~/.n8n` folder (loses all workflows) |
| Workflow won't activate | Fix red nodes — usually Groq credential missing |
| Webhook not registered | **Save** workflow, toggle **Active** off then on |
| Slow first reply | Normal — Groq cold start + agent processing |

### Groq

| Problem | Solution |
|---------|----------|
| Authorization failed | Create new Groq API key at console.groq.com |
| Rate limit exceeded | Wait a minute or upgrade Groq plan |
| Model not found | In **Groq Chat Model** node, pick an available model |

### React app

| Problem | Solution |
|---------|----------|
| Could not reach Adalat AI | Is `n8n start` running? Is workflow Active? |
| Wrong webhook / 404 | Fix `.env` to path-only `/webhook/ce2b1a2f-...`, restart `npm run dev` |
| CORS errors | Always use `npm run dev`, not opening HTML files directly |
| Empty reply | Check n8n **Executions** tab for the failed run |

### Check n8n execution logs

1. Go to http://localhost:5678
2. Click **Executions** in the sidebar
3. Open the latest run for **Adalat AI Chatbot**
4. Red nodes show the exact error message

---

## Project structure

```
Adalat AI Chatbot/
├── src/
│   ├── api/chatApi.ts          # Sends messages to n8n webhook
│   ├── components/             # Chat UI components
│   └── constants/systemPrompt.ts  # Mirror of n8n agent prompt
├── n8n/
│   ├── adalat-ai-workflow.json # Import this into n8n
│   └── README.md               # Workflow technical notes
├── .env                        # VITE_WEBHOOK_PATH (you create this)
├── package.json
├── vite.config.ts              # Proxies /api/n8n → localhost:5678
└── README.md                   # This file
```

---

## Legal disclaimer

Adalat AI provides **informational** legal guidance only. It is not a substitute for advice from a licensed advocate. Always consult a qualified lawyer for case-specific matters.
