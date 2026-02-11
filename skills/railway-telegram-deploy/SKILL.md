---
name: railway-telegram-deploy
description: Use when deploying Telegram bots to Railway, updating existing Railway bot deployments, switching bots between polling and webhook modes, or troubleshooting Railway bot issues. Triggers on "деплой бота на railway", "deploy telegram bot", "развернуть бота на railway", "обнови бота на railway"
---

# Railway Telegram Deploy

## Triggers
- "деплой бота на railway", "развернуть бота на railway"
- "deploy telegram bot", "deploy bot to railway"
- Любое упоминание railway + telegram bot / деплой бота

## Quick Reference

| Parameter | Value |
|-----------|-------|
| **Platform** | [Railway](https://railway.com) |
| **Builder** | Nixpacks (auto-detect) |
| **Pricing** | $5/mo Hobby plan (required for bots — no sleep) |
| **Restart** | `restartPolicyType: ON_FAILURE`, `restartPolicyMaxRetries: 10` |
| **MCP Tools** | `check-railway-status`, `list-projects`, `create-project-and-link`, `deploy`, `set-variables`, `get-logs`, `generate-domain`, `list-deployments` |

---

## Stack Detection

### Language Detection

| File | Language |
|------|----------|
| `requirements.txt` / `pyproject.toml` / `Pipfile` | Python |
| `package.json` | Node.js |
| `Dockerfile` | Docker (fallback) |

### Framework Detection — Python

| Dependency | Framework | Notes |
|------------|-----------|-------|
| `aiogram` | aiogram | async, most popular RU |
| `python-telegram-bot` | python-telegram-bot | callback-based |
| `telebot` / `pyTelegramBotAPI` | pyTelegramBotAPI | simple sync/async |
| `pyrogram` | Pyrogram | MTProto, needs session |

### Framework Detection — Node.js

| Dependency | Framework | Notes |
|------------|-----------|-------|
| `telegraf` | Telegraf | most popular |
| `grammy` | grammY | modern, TypeScript |
| `node-telegram-bot-api` | node-telegram-bot-api | minimal |

### Mode Detection

| Pattern in Code | Mode |
|----------------|------|
| `start_polling`, `run_polling`, `polling=True`, `infinity_polling` | **Polling** |
| `set_webhook`, `start_webhook`, `webhook_url`, `app.run` + webhook | **Webhook** |
| No match / unclear | **Polling** (default, safer) |

### Health Check Detection
Поиск в коде: `/health`, `/ping`, `healthcheck`, `health_check` endpoint.
- Найден -> включить `healthcheckPath` в railway.json
- Не найден -> предложить добавить (рекомендовано, не обязательно для polling)

---

## Configuration Templates (railway.json)

### Python Polling — Minimal

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python bot.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Python Polling — With Health Check

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python bot.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

**Health check server code (aiohttp, add to bot.py):**
```python
from aiohttp import web
import asyncio

async def health_handler(request):
    return web.Response(text="OK")

async def start_health_server():
    app = web.Application()
    app.router.add_get("/health", health_handler)
    runner = web.AppRunner(app)
    await runner.setup()
    port = int(os.environ.get("PORT", 8080))
    site = web.TCPSite(runner, "0.0.0.0", port)
    await site.start()
```

### Python Webhook — aiogram

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python bot.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

**Webhook setup code (aiogram 3.x):**
```python
from aiohttp import web
from aiogram import Bot, Dispatcher
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application

WEBHOOK_PATH = f"/webhook/{BOT_TOKEN}"
BASE_URL = os.environ.get("RAILWAY_PUBLIC_DOMAIN", "")

async def on_startup(bot: Bot):
    await bot.set_webhook(f"https://{BASE_URL}{WEBHOOK_PATH}")

def main():
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()
    dp.startup.register(on_startup)

    app = web.Application()
    webhook_handler = SimpleRequestHandler(dispatcher=dp, bot=bot)
    webhook_handler.register(app, path=WEBHOOK_PATH)
    setup_application(app, dp, bot=bot)

    port = int(os.environ.get("PORT", 8080))
    web.run_app(app, host="0.0.0.0", port=port)
```

### Python Webhook — python-telegram-bot

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python bot.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

**Webhook setup code (python-telegram-bot v20+):**
```python
from telegram.ext import ApplicationBuilder

PORT = int(os.environ.get("PORT", 8080))
DOMAIN = os.environ.get("RAILWAY_PUBLIC_DOMAIN", "")

app = ApplicationBuilder().token(BOT_TOKEN).build()
# ... add handlers ...

app.run_webhook(
    listen="0.0.0.0",
    port=PORT,
    webhook_url=f"https://{DOMAIN}/webhook",
    url_path="/webhook",
)
```

### Node.js Webhook — Telegraf

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node bot.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

**Webhook setup code (Telegraf + Express):**
```javascript
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 8080;
const DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN;

app.use(bot.webhookCallback('/webhook'));
app.get('/health', (req, res) => res.send('OK'));

bot.telegram.setWebhook(`https://${DOMAIN}/webhook`);
app.listen(PORT, () => console.log(`Webhook listening on port ${PORT}`));
```

### Node.js Polling — Minimal

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node bot.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Pre-Deploy Checklist

### Required (ALL bots)
- [ ] `BOT_TOKEN` environment variable (NOT hardcoded)
- [ ] Entry point file exists (bot.py / bot.js / main.py)
- [ ] Dependencies file: requirements.txt / package.json
- [ ] `.gitignore` includes: `.env`, `__pycache__`, `node_modules`, `*.session` (Pyrogram)
- [ ] `restartPolicyType: ON_FAILURE` in railway.json

### Polling-specific
- [ ] Graceful shutdown: handle SIGTERM/SIGINT
- [ ] Delete webhook on start: `await bot.delete_webhook()` (prevent conflicts)
- [ ] Health check: optional but recommended

### Webhook-specific
- [ ] Listen on `PORT` from env (Railway assigns dynamically)
- [ ] Use `RAILWAY_PUBLIC_DOMAIN` for webhook URL (auto-set by Railway after domain generation)
- [ ] Set webhook on startup
- [ ] `healthcheckPath` in railway.json
- [ ] Domain generated via `generate-domain` MCP tool

### Database
- [ ] Use `DATABASE_URL` from env (Railway auto-injects for Railway DBs)
- [ ] Run migrations at deploy or startup
- [ ] **NEVER use SQLite** — Railway has ephemeral filesystem, data will be lost on redeploy
- [ ] Use Railway PostgreSQL/MySQL/Redis add-ons or external DB

---

## Workflow

**IMPORTANT:** Use Railway MCP tools (`mcp__railway__*`) for all Railway operations. Do NOT use shell commands for Railway CLI.

### Step 1: Check Railway CLI & Auth

```
Tool: mcp__railway__check-railway-status
```

- **OK:** CLI installed + logged in -> proceed
- **Not installed:** Tell user to install: `npm install -g @railway/cli`
- **Not logged in:** Tell user: `railway login`

### Step 2: Analyze Project

Use Read, Grep, Glob tools to determine:

1. **Language:** Check for requirements.txt / package.json / pyproject.toml
2. **Framework:** Read dependency file, match against Framework Detection tables above
3. **Mode:** Grep for polling/webhook patterns in source files
4. **Entry point:** Find main bot file (bot.py, main.py, bot.js, index.js, src/bot.*)
5. **Env vars needed:** Grep for `os.environ`, `os.getenv`, `process.env` patterns
6. **Health check:** Grep for `/health`, `/ping` endpoints
7. **Database:** Grep for database/SQLAlchemy/mongoose/prisma usage

Present findings to user:
```
Stack detected:
- Language: Python 3.x
- Framework: aiogram 3.x
- Mode: polling
- Entry point: bot.py
- Env vars: BOT_TOKEN, DATABASE_URL
- Health check: not found
- Database: PostgreSQL (SQLAlchemy)
```

### Step 3: Create or Link Project

```
# List existing projects:
Tool: mcp__railway__list-projects

# If project exists -> link service:
Tool: mcp__railway__link-service
  serviceName: "bot-service-name"

# If new project:
Tool: mcp__railway__create-project-and-link
  projectName: "my-telegram-bot"
  workspacePath: "/path/to/bot"
```

Ask user: create new or link existing?

### Step 4: Generate railway.json

Based on Step 2 analysis, select appropriate template from Configuration Templates section.

Write `railway.json` to project root using the Write tool.

Adjust:
- `startCommand` to match actual entry point
- `healthcheckPath` if health endpoint exists
- `healthcheckTimeout` (default 30, increase if bot has heavy startup)

### Step 5: Set Environment Variables

```
# Check existing vars:
Tool: mcp__railway__list-variables
  workspacePath: "/path/to/bot"

# Set variables:
Tool: mcp__railway__set-variables
  workspacePath: "/path/to/bot"
  variables: ["BOT_TOKEN=<ask user>", "OTHER_VAR=value"]
```

**CRITICAL:** Ask user for secret values (BOT_TOKEN, API keys). Never guess or skip.

Common variables for Telegram bots:
| Variable | Required | Source |
|----------|----------|--------|
| `BOT_TOKEN` | Yes | @BotFather |
| `DATABASE_URL` | If DB used | Railway add-on auto-injects |
| `REDIS_URL` | If Redis used | Railway add-on auto-injects |
| `ADMIN_ID` / `ADMIN_IDS` | Common | User's Telegram ID |
| `LOG_LEVEL` | Optional | `INFO` / `DEBUG` |

### Step 6: Deploy

```
Tool: mcp__railway__deploy
  workspacePath: "/path/to/bot"
```

Wait for deployment to start. Build typically takes 1-3 minutes.

### Step 7: Generate Domain (Webhook only)

Only for webhook mode:

```
Tool: mcp__railway__generate-domain
  workspacePath: "/path/to/bot"
```

After domain is generated, Railway automatically sets `RAILWAY_PUBLIC_DOMAIN` env var.

If bot uses `RAILWAY_PUBLIC_DOMAIN` in code, it will pick it up on next deploy.
If first deploy — may need to redeploy after domain generation.

### Step 8: Check Logs

```
# Build logs:
Tool: mcp__railway__get-logs
  workspacePath: "/path/to/bot"
  logType: "build"

# Deploy logs:
Tool: mcp__railway__get-logs
  workspacePath: "/path/to/bot"
  logType: "deploy"
```

**Check for:**
- Build errors (missing dependencies, syntax errors)
- Runtime errors (token not set, import errors)
- Successful startup message ("Bot started", "Polling started", "Webhook set")

### Step 9: Verify Deployment

```
Tool: mcp__railway__list-deployments
  workspacePath: "/path/to/bot"
  json: true
  limit: 1
```

Expected: status = `SUCCESS` or `ACTIVE`.

Tell user to test by sending `/start` to the bot in Telegram.

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| **Build failed: no requirements.txt** | Missing deps file | `pip freeze > requirements.txt` |
| **Build failed: incompatible versions** | Dependency conflicts | Pin versions, test locally with `pip install -r requirements.txt` in clean venv |
| **Crash loop (restarts endlessly)** | Unhandled exception at startup | Check deploy logs (`get-logs` logType: deploy), fix the error |
| **Bot doesn't respond** | Token not set or wrong | Verify `BOT_TOKEN` in `list-variables`, check it matches @BotFather |
| **409 Conflict (polling)** | Another instance polling | Delete webhook: `bot.delete_webhook()` on startup. Ensure only 1 replica |
| **Health check timeout** | No health endpoint / wrong path | Add health endpoint or remove `healthcheckPath` from railway.json |
| **Webhook not working** | No domain / wrong URL | Run `generate-domain`, check `RAILWAY_PUBLIC_DOMAIN` is set |
| **Webhook 401/403** | Secret token mismatch | Verify `secret_token` parameter matches in set_webhook and handler |
| **SQLite: database is locked** | Ephemeral FS, data lost on redeploy | Migrate to PostgreSQL (Railway add-on) |
| **Pyrogram session error** | `.session` file not persisted | Use `StringSession` or external DB for session storage |
| **Memory limit exceeded** | Bot uses too much RAM | Optimize code, upgrade plan, check for memory leaks |
| **Module not found** | Missing from requirements.txt | Add the module, redeploy |
| **Port already in use** | Hardcoded port conflicts | Use `PORT` from env: `int(os.environ.get("PORT", 8080))` |
| **Deploy stuck** | Large dependencies / slow build | Check build logs, add `.dockerignore` to exclude unnecessary files |

### Quick Debug Flow

1. `get-logs` (build) -> check if build succeeded
2. `get-logs` (deploy) -> check runtime errors
3. `list-variables` -> verify all env vars are set
4. `list-deployments` -> check deployment status
5. If crash loop -> read deploy logs for stack trace, fix, redeploy

---

## Usage Examples

### Example 1: New Bot Deploy

**User:** "Задеплой моего бота на Railway" (from bot project directory)

**Workflow:**
1. `check-railway-status` -> OK
2. Analyze: Python, aiogram 3.x, polling, `bot.py`, needs BOT_TOKEN
3. User chooses: create new project "my-aiogram-bot"
4. Generate `railway.json` (Python polling template)
5. Ask user for BOT_TOKEN -> `set-variables`
6. `deploy`
7. `get-logs` (build) -> success
8. `get-logs` (deploy) -> "Bot started polling"
9. `list-deployments` -> SUCCESS
10. "Bot deployed! Send /start to @YourBot to test"

### Example 2: Update Existing Bot

**User:** "Обнови бота на Railway" (from bot project directory)

**Workflow:**
1. `check-railway-status` -> OK
2. `list-projects` -> find existing project
3. `link-service` to existing service
4. Check if `railway.json` exists and is up-to-date
5. `deploy` (redeploy with latest code)
6. `get-logs` -> verify success
7. `list-deployments` -> confirm ACTIVE

### Example 3: Switch from Polling to Webhook

**User:** "Переведи бота на вебхуки"

**Workflow:**
1. Analyze current setup (polling)
2. Modify bot code: add webhook setup, remove polling
3. Add aiohttp/express dependency
4. Update `railway.json`: add `healthcheckPath`
5. `generate-domain` -> get RAILWAY_PUBLIC_DOMAIN
6. `set-variables` -> ensure RAILWAY_PUBLIC_DOMAIN is available
7. `deploy`
8. `get-logs` -> verify "Webhook set to https://..."
9. Test bot responds
