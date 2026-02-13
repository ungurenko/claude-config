import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import {
  GEMINI_API_BASE,
  GEMINI_MODEL,
  FETCH_TIMEOUT_MS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  IMAGE_DIR,
} from "./constants.js";
import { GeminiResponseSchema, GeminiApiError } from "./types.js";
import type { Logger } from "./logger.js";

// ── Auth ────────────────────────────────────────────────────────────────────

export function getApiKey(): string {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new GeminiApiError(
      "GOOGLE_API_KEY not set",
      401,
      "Set GOOGLE_API_KEY env variable with your Google AI Studio key",
    );
  }
  return key;
}

// ── Rate Limiter ────────────────────────────────────────────────────────────

class RateLimiter {
  private timestamps: number[] = [];

  async acquire(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS,
    );
    if (this.timestamps.length >= RATE_LIMIT_MAX) {
      const oldest = this.timestamps[0]!;
      const waitMs = RATE_LIMIT_WINDOW_MS - (now - oldest) + 100;
      await new Promise((r) => setTimeout(r, waitMs));
    }
    this.timestamps.push(Date.now());
  }
}

const rateLimiter = new RateLimiter();

// ── Fetch with timeout ──────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { signal?: AbortSignal } = {},
): Promise<Response> {
  await rateLimiter.acquire();

  const timeoutController = new AbortController();
  const timeout = setTimeout(
    () => timeoutController.abort(),
    FETCH_TIMEOUT_MS,
  );

  const signals = [timeoutController.signal];
  if (options.signal) signals.push(options.signal);
  const composedSignal = AbortSignal.any(signals);

  try {
    return await fetch(url, { ...options, signal: composedSignal });
  } finally {
    clearTimeout(timeout);
  }
}

// ── Actionable error from HTTP status ───────────────────────────────────────

function httpError(status: number, body: string): GeminiApiError {
  const suggestions: Record<number, string> = {
    400: "Invalid request — check your prompt (it may violate content policy)",
    401: "Invalid API key — check GOOGLE_API_KEY",
    403: "API key doesn't have access to this model — enable Gemini API in Google AI Studio",
    429: "Rate limited — wait a minute and retry (free tier: 10 req/min)",
    500: "Google server error — try again in a few seconds",
  };
  return new GeminiApiError(
    `Gemini API error ${status}: ${body.slice(0, 300)}`,
    status,
    suggestions[status] ?? "Check https://ai.google.dev/docs for details",
  );
}

// ── Save image to disk ──────────────────────────────────────────────────────

async function saveImage(base64Data: string, mimeType: string): Promise<string> {
  await mkdir(IMAGE_DIR, { recursive: true });

  const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const filepath = `${IMAGE_DIR}/${filename}`;

  await writeFile(filepath, Buffer.from(base64Data, "base64"));
  return filepath;
}

// ── Generate image ──────────────────────────────────────────────────────────

export interface GenerateResult {
  base64: string;
  mimeType: string;
  filepath: string;
  sizeBytes: number;
}

export async function generateImage(
  prompt: string,
  options?: { signal?: AbortSignal; logger?: Logger },
): Promise<GenerateResult> {
  const apiKey = getApiKey();
  const url = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  options?.logger?.info(`Sending request to Gemini (model: ${GEMINI_MODEL})`);

  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    }),
    signal: options?.signal,
  });

  if (!res.ok) {
    throw httpError(res.status, await res.text());
  }

  const json = await res.json();
  const data = GeminiResponseSchema.parse(json);

  if (data.error) {
    throw new GeminiApiError(
      `Gemini API: ${data.error.message} (code ${data.error.code})`,
      data.error.code,
      "Check your request parameters",
    );
  }

  if (!data.candidates || data.candidates.length === 0) {
    throw new GeminiApiError(
      "No candidates in response — image may have been blocked by safety filters",
      400,
      "Try a different prompt that doesn't violate content policy",
    );
  }

  const parts = data.candidates[0]!.content.parts;
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart?.inlineData) {
    const textPart = parts.find((p) => p.text);
    throw new GeminiApiError(
      `No image in response${textPart?.text ? `: ${textPart.text.slice(0, 200)}` : ""}`,
      400,
      "Model returned text instead of image — try a more specific visual prompt",
    );
  }

  const { data: base64, mimeType } = imagePart.inlineData;
  const sizeBytes = Buffer.byteLength(base64, "base64");
  const filepath = await saveImage(base64, mimeType);

  options?.logger?.info(`Image saved: ${filepath} (${(sizeBytes / 1024).toFixed(0)}KB)`);

  return { base64, mimeType, filepath, sizeBytes };
}
