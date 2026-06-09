# Adalat AI — n8n workflow setup

## Import the fixed workflow

1. Open n8n → **Workflows** → **Import from File**
2. Select `n8n/adalat-ai-workflow.json`
3. Open the **Groq Chat Model** node → confirm your Groq API credential (fix if you see "Authorization failed")
4. **Save** and toggle the workflow **Active**

## What was fixed

| Issue | Fix |
|--------|-----|
| `Unused Respond to Webhook node` | Removed **Respond to Webhook**; Webhook uses **When Last Node Finishes** (`lastNode`) and returns the Agent output directly |
| GET-only webhook / missing `chatInput` | Added **Normalize Input** (Set) node: reads `chatInput` and `sessionId` from POST body **or** GET query |
| Conversation memory | **Window Buffer Memory** uses `sessionId` from the request |
| Agent input | **Prompt type: auto** so the agent reads `chatInput` from the previous node |

## Webhook URL

```
POST http://localhost:5678/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37
```

Body (JSON):

```json
{
  "chatInput": "How do I apply for bail in Pakistan?",
  "sessionId": "any-unique-id-per-browser"
}
```

GET also works (for testing):

```
GET http://localhost:5678/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37?chatInput=...&sessionId=...
```

## Test in terminal

```bash
curl.exe -X POST "http://localhost:5678/webhook/ce2b1a2f-d747-4909-a1f5-0bdb73a47c37" ^
  -H "Content-Type: application/json" ^
  -d "{\"chatInput\":\"What is bail in Pakistan?\",\"sessionId\":\"test-1\"}"
```

Expected: JSON containing an `output` field with the AI reply (not an error about Respond to Webhook).

## React app

The frontend sends **POST** with `chatInput` and `sessionId` via the Vite proxy (`/api/n8n/webhook/...`).

After importing, restart `npm run dev` and send a message from the welcome page.

## System prompt (language + tables)

The agent system message requires:
- **Same language as the question** (Pashto ≠ Urdu)
- **Markdown tables** for structured legal data

Source of truth in the repo: `src/constants/systemPrompt.ts` (keep in sync when editing the n8n node).
