---
name: kie-ai
description: Use when integrating with Kie.ai API for image/video/music generation, writing async task-based code with polling, or when user mentions kie, seedream, veo, suno, runway, kling, hailuo, flux
---

# Kie.ai API Reference

## Overview

**Kie.ai** — агрегатор AI-моделей для генерации изображений, видео и музыки. **НЕ OpenAI-совместимый** — асинхронный REST API с polling/webhook.

## Quick Reference

| Parameter | Value |
|-----------|-------|
| **Base URL** | `https://api.kie.ai` |
| **Auth Header** | `Authorization: Bearer API_KEY` |
| **Model Format** | `provider/model` (e.g., `bytedance/seedream`) |
| **Pricing** | 1 credit ≈ $0.005 |

## MCP Tools

| Tool | Description |
|------|-------------|
| `generate_image` | Generate images. Models: `google/imagen4` (default), `bytedance/seedream`, `grok-imagine/text-to-image` |
| `check_credits` | Check remaining credit balance |
| `list_models` | List available models with descriptions and pricing |

## Working Image Models

| Model | Description | Cost |
|-------|-------------|------|
| `google/imagen4` | High quality, photorealistic (default) | ~40 credits |
| `bytedance/seedream` | Fast, versatile | ~20 credits |
| `grok-imagine/text-to-image` | Creative, stylized (uses aspect_ratio) | ~30 credits |

**NOT working:** `flux-2/pro`, `ideogram/v3` — removed from MCP server.

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

// Usage — note: grok-imagine uses aspect_ratio, others use image_size
async function generateImage(prompt: string) {
  const taskId = await createTask('google/imagen4', {
    prompt,
    image_size: 'square_hd',
  });
  return pollResult(taskId);
}
```

## Bash Quick Test

```bash
# Create task
curl -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Authorization: Bearer $KIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"google/imagen4","input":{"prompt":"A cat astronaut"}}'

# Poll result (replace TASK_ID)
curl "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=TASK_ID" \
  -H "Authorization: Bearer $KIE_API_KEY"

# Check credits (returns number!)
curl "https://api.kie.ai/api/v1/chat/credit" \
  -H "Authorization: Bearer $KIE_API_KEY"
```

## Popular Models

**Image:** `google/imagen4`, `bytedance/seedream`, `grok-imagine/text-to-image`

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
| grok-imagine fails | Wrong input format | Use `aspect_ratio` instead of `image_size` |

## Webhook (Alternative to Polling)

```typescript
// In createTask, add callBackUrl:
await createTask('bytedance/seedream', { prompt }, 'https://your-server.com/webhook');

// Your webhook endpoint receives POST:
// { taskId, state, resultJson, ... }
```

## Links

- Market: [kie.ai/market](https://kie.ai/market)
- Pricing: [kie.ai/pricing](https://kie.ai/pricing)
- API Keys: [kie.ai/api-key](https://kie.ai/api-key)
- Logs: [kie.ai/logs](https://kie.ai/logs)
- Docs: [docs.kie.ai](https://docs.kie.ai)
