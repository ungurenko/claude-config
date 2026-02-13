import { z } from "zod";

// ── Zod-схемы валидации ответов Gemini API ──────────────────────────────────

const InlineDataSchema = z.object({
  mimeType: z.string(),
  data: z.string(), // base64
});

const PartSchema = z.object({
  text: z.string().optional(),
  inlineData: InlineDataSchema.optional(),
});

const ContentSchema = z.object({
  parts: z.array(PartSchema),
  role: z.string().optional(),
});

const CandidateSchema = z.object({
  content: ContentSchema,
  finishReason: z.string().optional(),
});

export const GeminiResponseSchema = z.object({
  candidates: z.array(CandidateSchema).optional(),
  error: z
    .object({
      code: z.number(),
      message: z.string(),
      status: z.string().optional(),
    })
    .optional(),
});

export type GeminiResponse = z.infer<typeof GeminiResponseSchema>;

// ── Кастомная ошибка ────────────────────────────────────────────────────────

export class GeminiApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public suggestion: string,
  ) {
    super(message);
    this.name = "GeminiApiError";
  }
}
