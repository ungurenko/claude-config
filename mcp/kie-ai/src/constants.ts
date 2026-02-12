export const KIE_API = "https://api.kie.ai";

export const IMAGE_MODELS = [
  "nano-banana-pro",
  "gpt-image/1.5-text-to-image",
  "z-image",
] as const;

export type ImageModel = (typeof IMAGE_MODELS)[number];

export const IMAGE_MODEL_INFO: Record<ImageModel, { description: string; cost: string }> = {
  "nano-banana-pro": {
    description: "Nano Banana Pro — high quality with 2K/4K resolution support",
    cost: "18-24 credits (2K/4K)",
  },
  "gpt-image/1.5-text-to-image": {
    description: "GPT Image 1.5 — fast, affordable with quality options",
    cost: "~10 credits",
  },
  "z-image": {
    description: "Z-Image — cheapest, simple and fast",
    cost: "~5 credits",
  },
};

export const ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "3:2",
  "2:3",
] as const;

export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export const DEFAULT_IMAGE_MODEL: ImageModel = "nano-banana-pro";
export const DEFAULT_ASPECT_RATIO: AspectRatio = "1:1";

export const QUALITY_OPTIONS = ["medium", "high"] as const;
export type Quality = (typeof QUALITY_OPTIONS)[number];

export const RESOLUTION_OPTIONS = ["2K", "4K"] as const;
export type Resolution = (typeof RESOLUTION_OPTIONS)[number];

export const POLL_INTERVAL_MS = 5000;
export const POLL_MAX_ATTEMPTS = 24; // 2 min timeout
export const FETCH_TIMEOUT_MS = 30_000;
export const RATE_LIMIT_MAX = 18; // запас от лимита 20/10s
export const RATE_LIMIT_WINDOW_MS = 10_000;
