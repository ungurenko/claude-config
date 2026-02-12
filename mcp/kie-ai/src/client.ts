import {
  KIE_API,
  FETCH_TIMEOUT_MS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  POLL_INTERVAL_MS,
  POLL_MAX_ATTEMPTS,
} from "./constants.js";
import {
  KieTaskResponseSchema,
  KieRecordResponseSchema,
  KieCreditResponseSchema,
  ImageResultSchema,
  KieApiError,
} from "./types.js";
import type { Logger } from "./logger.js";

// ── Auth ────────────────────────────────────────────────────────────────────

export function getApiKey(): string {
  const key = process.env.KIE_API_KEY;
  if (!key) {
    throw new KieApiError(
      "KIE_API_KEY not set",
      401,
      "Get your key at https://kie.ai/api-key and set KIE_API_KEY env variable",
    );
  }
  return key;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
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

  // Compose signals: external signal + timeout
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

function httpError(status: number, body: string): KieApiError {
  const suggestions: Record<number, string> = {
    401: "Check your KIE_API_KEY at https://kie.ai/api-key",
    402: "Insufficient credits — top up at https://kie.ai/pricing",
    422: "Invalid parameters — check model name and input format",
    429: "Rate limited — wait a few seconds and retry",
  };
  return new KieApiError(
    `Kie API error ${status}: ${body}`,
    status,
    suggestions[status] ?? "Check https://docs.kie.ai for details",
  );
}

// ── API methods ─────────────────────────────────────────────────────────────

export async function createTask(
  model: string,
  input: Record<string, unknown>,
  options?: { signal?: AbortSignal },
): Promise<string> {
  const res = await fetchWithTimeout(`${KIE_API}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ model, input }),
    signal: options?.signal,
  });

  if (!res.ok) {
    throw httpError(res.status, await res.text());
  }

  const json = await res.json();
  const data = KieTaskResponseSchema.parse(json);
  if (data.code !== 200) {
    throw new KieApiError(
      `Kie API: ${data.msg} (code ${data.code})`,
      data.code,
      "Check your request parameters",
    );
  }
  return data.data.taskId;
}

export async function pollResult(
  taskId: string,
  options?: {
    signal?: AbortSignal;
    onProgress?: (attempt: number, total: number, state: string) => void;
    logger?: Logger;
  },
): Promise<string[]> {
  const maxAttempts = POLL_MAX_ATTEMPTS;

  for (let i = 0; i < maxAttempts; i++) {
    options?.signal?.throwIfAborted();

    const res = await fetchWithTimeout(
      `${KIE_API}/api/v1/jobs/recordInfo?taskId=${taskId}`,
      {
        headers: { Authorization: `Bearer ${getApiKey()}` },
        signal: options?.signal,
      },
    );

    if (!res.ok) {
      throw httpError(res.status, await res.text());
    }

    const json = await res.json();
    const data = KieRecordResponseSchema.parse(json);
    const { state, resultJson, failMsg } = data.data;

    options?.onProgress?.(i + 1, maxAttempts, state);

    if (state === "success") {
      if (!resultJson) throw new KieApiError("API returned success but no resultJson", 500, "Try again");
      const parsed = ImageResultSchema.parse(JSON.parse(resultJson));
      return parsed.resultUrls;
    }
    if (state === "fail") {
      throw new KieApiError(
        `Generation failed: ${failMsg ?? "unknown error"}`,
        500,
        "Try a different prompt or model",
      );
    }

    options?.logger?.debug(
      `Poll ${i + 1}/${maxAttempts}: state=${state}, taskId=${taskId}`,
    );

    // Cancellable sleep
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, POLL_INTERVAL_MS);
      options?.signal?.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(options.signal!.reason);
        },
        { once: true },
      );
    });
  }

  throw new KieApiError(
    `Timeout after ${(maxAttempts * POLL_INTERVAL_MS) / 1000}s waiting for task ${taskId}`,
    408,
    "Try again — generation may take longer for complex prompts",
  );
}

export async function checkCredits(options?: {
  signal?: AbortSignal;
}): Promise<number> {
  const res = await fetchWithTimeout(`${KIE_API}/api/v1/chat/credit`, {
    headers: { Authorization: `Bearer ${getApiKey()}` },
    signal: options?.signal,
  });

  if (!res.ok) {
    throw httpError(res.status, await res.text());
  }

  const json = await res.json();
  const data = KieCreditResponseSchema.parse(json);
  if (data.code !== 200) {
    throw new KieApiError(
      `Kie API: ${data.msg} (code ${data.code})`,
      data.code,
      "Check your API key",
    );
  }
  return data.data;
}
