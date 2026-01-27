---
name: polza-ai
description: Use when integrating with Polza.ai API, writing code for AI model calls, configuring OpenAI-compatible clients with Polza.ai base URL, or when user mentions polza
---

# Polza.ai API Reference

## Overview

**Polza.ai** — российский агрегатор AI-моделей с 100% OpenAI-совместимым API. Оплата в рублях, VPN не нужен.

## Quick Reference

| Parameter | Value |
|-----------|-------|
| **Base URL** | `https://api.polza.ai/api/v1` |
| **Auth Header** | `Authorization: Bearer API_KEY` |
| **Model Format** | `provider/model` (e.g., `openai/gpt-4o`) |

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat/completions` | POST | Text generation (chat) |
| `/images/generations` | POST | Image generation |
| `/audio/transcriptions` | POST | Speech-to-Text |
| `/embeddings` | POST | Text embeddings |
| `/models` | GET | List available models |

## Popular Models

**Text:** `openai/gpt-4o`, `openai/gpt-4o-mini`, `anthropic/claude-3.7-sonnet`, `anthropic/claude-opus-4`, `google/gemini-2.5-pro`, `deepseek/deepseek-r1`

**Images:** `bytedance/seedream-4.0`, `openai/gpt-image-1`

**Audio:** `openai/whisper-1`

**Embeddings:** `openai/text-embedding-3-large`

Full list: [polza.ai/models](https://polza.ai/models)

## Code Examples

### Python (openai SDK)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.polza.ai/api/v1",
    api_key="YOUR_API_KEY",
)

response = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### JavaScript (openai SDK)

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'https://api.polza.ai/api/v1',
    apiKey: 'YOUR_API_KEY',
});

const response = await client.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);
```

### Streaming

Add `stream: true` parameter:

```python
stream = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "..."}],
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## Common Mistakes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid API key | Check key at console.polza.ai |
| 404 Model not found | Wrong model ID | Use `provider/model` format |
| Missing base_url | Using default OpenAI URL | Set `base_url="https://api.polza.ai/api/v1"` |

## Links

- Console: [console.polza.ai](https://console.polza.ai)
- Models: [polza.ai/models](https://polza.ai/models)
- Docs: [docs.polza.ai](https://docs.polza.ai)
- Support: t.me/polza_ai_chat
