---
name: kie-ai
description: Use when integrating with Kie.ai API for image/video/music generation, writing async task-based code with polling, or when user mentions kie, seedream, veo, suno, runway, kling, hailuo, flux, nano-banana, gpt-image, z-image
---

# Kie.ai API Reference

## Overview

**Kie.ai** — агрегатор AI-моделей для генерации изображений, видео и музыки. **НЕ OpenAI-совместимый** — асинхронный REST API с polling/webhook.

## Quick Reference

| Parameter | Value |
|-----------|-------|
| **Base URL** | `https://api.kie.ai` |
| **Auth Header** | `Authorization: Bearer API_KEY` |
| **Model Format** | `provider/model` (e.g., `gpt-image/1.5-text-to-image`) |
| **Pricing** | 1 credit ≈ $0.005 |

## MCP Tools

| Tool | Description |
|------|-------------|
| `generate_image` | Generate images. Models: `nano-banana-pro` (default), `gpt-image/1.5-text-to-image`, `z-image` |
| `check_credits` | Check remaining credit balance |
| `list_models` | List available models with descriptions and pricing |

## Working Image Models

| Model | Description | Cost | Extra params |
|-------|-------------|------|--------------|
| `nano-banana-pro` | High quality, 2K/4K resolution (default) | 18-24 credits | `resolution`: 2K/4K |
| `gpt-image/1.5-text-to-image` | Fast, affordable with quality options | ~10 credits | `quality`: medium/high |
| `z-image` | Cheapest, simple and fast | ~5 credits | — |

All models use `aspect_ratio` parameter: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `3:2`, `2:3`.

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/jobs/createTask` | POST | Create generation task |
| `/api/v1/jobs/recordInfo?taskId=X` | GET | Query task status |
| `/api/v1/chat/credit` | GET | Check credits (returns number, not object!) |
| `/api/v1/common/download-url` | POST | Get temp download URL |

## Async Workflow

```
createTask → taskId → poll recordInfo → state: success → parse resultJson
```

**Task States:** `waiting` → `queuing` → `generating` → `success` | `fail`

## Code Example (TypeScript)

```typescript
interface KieTaskResponse {
  code: number;
  msg: string;
  data: { taskId: string };
}

interface KieRecordResponse {
  code: number;
  data: {
    taskId: string;
    state: 'waiting' | 'queuing' | 'generating' | 'success' | 'fail';
    resultJson: string; // JSON string: {"resultUrls": ["..."]}
    failMsg: string;
  };
}

const KIE_API = 'https://api.kie.ai';
const API_KEY = process.env.KIE_API_KEY!;

async function createTask(model: string, input: Record<string, unknown>, callBackUrl?: string) {
  const res = await fetch(`${KIE_API}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, input, callBackUrl }),
  });
  const data: KieTaskResponse = await res.json();
  if (data.code !== 200) throw new Error(data.msg);
  return data.data.taskId;
}

async function pollResult(taskId: string, maxAttempts = 60, intervalMs = 5000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${KIE_API}/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
    });
    const { data }: KieRecordResponse = await res.json();

    if (data.state === 'success') {
      return JSON.parse(data.resultJson).resultUrls as string[];
    }
    if (data.state === 'fail') {
      throw new Error(data.failMsg);
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error('Timeout');
}

// Usage — all models use aspect_ratio
async function generateImage(prompt: string) {
  // nano-banana-pro with 4K resolution
  const taskId = await createTask('nano-banana-pro', {
    prompt,
    aspect_ratio: '16:9',
    resolution: '4K',
  });
  return pollResult(taskId);
}
```

## Bash Quick Test

```bash
# Create task (nano-banana-pro with 2K)
curl -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Authorization: Bearer $KIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"nano-banana-pro","input":{"prompt":"A cat astronaut","aspect_ratio":"1:1","resolution":"2K"}}'

# Create task (gpt-image with high quality)
curl -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Authorization: Bearer $KIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-image/1.5-text-to-image","input":{"prompt":"A cat astronaut","aspect_ratio":"1:1","quality":"high"}}'

# Create task (z-image, cheapest)
curl -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Authorization: Bearer $KIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"z-image","input":{"prompt":"A cat astronaut","aspect_ratio":"1:1"}}'

# Poll result (replace TASK_ID)
curl "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=TASK_ID" \
  -H "Authorization: Bearer $KIE_API_KEY"

# Check credits (returns number!)
curl "https://api.kie.ai/api/v1/chat/credit" \
  -H "Authorization: Bearer $KIE_API_KEY"
```

## Popular Models

**Image:** `nano-banana-pro`, `gpt-image/1.5-text-to-image`, `z-image`

**Video:** `kling/v2-1-pro`, `sora2/pro`, `hailuo/2-3-pro`, `wan/2-2-turbo`, `bytedance/v1-pro`

**Audio:** `elevenlabs/text-to-speech`, `suno/v4`

Full list: [kie.ai/market](https://kie.ai/market)

## Common Mistakes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid API key | Check key at kie.ai/api-key |
| 402 Insufficient Credits | No credits | Top up at kie.ai |
| 200 but no result | Didn't poll | Use `recordInfo` endpoint |
| `resultJson` is string | Forgot JSON.parse | `JSON.parse(data.resultJson)` |
| Timeout | Long generation | Increase maxAttempts or use webhook |
| 429 Rate Limited | >20 req/10s | Add delay between requests |
| credits = undefined | data is number, not object | `data` field is the credit count directly |

## Webhook (Alternative to Polling)

```typescript
// In createTask, add callBackUrl:
await createTask('nano-banana-pro', { prompt, aspect_ratio: '1:1', resolution: '2K' }, 'https://your-server.com/webhook');

// Your webhook endpoint receives POST:
// { taskId, state, resultJson, ... }
```

## Links

- Market: [kie.ai/market](https://kie.ai/market)
- Pricing: [kie.ai/pricing](https://kie.ai/pricing)
- API Keys: [kie.ai/api-key](https://kie.ai/api-key)
- Logs: [kie.ai/logs](https://kie.ai/logs)
- Docs: [docs.kie.ai](https://docs.kie.ai)
