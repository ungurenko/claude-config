export const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
export const GEMINI_MODEL = "gemini-2.0-flash-preview-image-generation";

export const FETCH_TIMEOUT_MS = 90_000; // генерация может занять 30-60 сек
export const RATE_LIMIT_MAX = 10;
export const RATE_LIMIT_WINDOW_MS = 60_000; // 10 запросов/минуту

export const IMAGE_DIR = "/tmp/claude-images";
export const MAX_INLINE_SIZE = 700 * 1024; // 700KB — лимит MCP ~1MB
