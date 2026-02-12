import { z } from "zod";

// ── Zod-схемы валидации ответов Kie.ai API ──────────────────────────────────

export const KieTaskResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.object({ taskId: z.string() }),
});

export const KieRecordResponseSchema = z.object({
  code: z.number(),
  data: z.object({
    taskId: z.string(),
    state: z.enum(["waiting", "queuing", "generating", "success", "fail"]),
    resultJson: z.string(),
    failMsg: z.string(),
  }),
});

// data — число (остаток кредитов), не объект!
export const KieCreditResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.number(),
});

export const ImageResultSchema = z.object({
  resultUrls: z.array(z.string()),
});

// ── Типы ────────────────────────────────────────────────────────────────────

export type KieTaskResponse = z.infer<typeof KieTaskResponseSchema>;
export type KieRecordResponse = z.infer<typeof KieRecordResponseSchema>;
export type KieCreditResponse = z.infer<typeof KieCreditResponseSchema>;
export type ImageResult = z.infer<typeof ImageResultSchema>;

// ── Кастомная ошибка ────────────────────────────────────────────────────────

export class KieApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public suggestion: string,
  ) {
    super(message);
    this.name = "KieApiError";
  }
}
