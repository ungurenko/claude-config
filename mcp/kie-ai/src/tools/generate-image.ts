import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  IMAGE_MODELS,
  ASPECT_RATIOS,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_ASPECT_RATIO,
  QUALITY_OPTIONS,
  RESOLUTION_OPTIONS,
} from "../constants.js";
import { createTask, pollResult } from "../client.js";
import { KieApiError } from "../types.js";
import type { Logger } from "../logger.js";

function buildImageInput(
  model: string,
  prompt: string,
  aspectRatio: string,
  quality?: string,
  resolution?: string,
): Record<string, unknown> {
  const base: Record<string, unknown> = { prompt, aspect_ratio: aspectRatio };

  if (model === "nano-banana-pro") {
    base.resolution = resolution ?? "2K";
  } else if (model === "gpt-image/1.5-text-to-image") {
    base.quality = quality ?? "medium";
  }

  return base;
}

export function registerGenerateImage(server: McpServer, logger: Logger) {
  server.registerTool(
    "generate_image",
    {
      title: "Generate Image",
      description: [
        "Generate an image using Kie.ai models. Returns image URLs.",
        "",
        "Models: nano-banana-pro (default, 2K/4K), gpt-image/1.5-text-to-image (fast, quality options), z-image (cheapest).",
        "",
        "Tips: be specific in prompts, mention style/lighting/composition for better results.",
      ].join("\n"),
      inputSchema: {
        prompt: z.string().describe("Text description of the image to generate"),
        model: z
          .enum(IMAGE_MODELS)
          .default(DEFAULT_IMAGE_MODEL)
          .describe("Image model to use"),
        aspect_ratio: z
          .enum(ASPECT_RATIOS)
          .default(DEFAULT_ASPECT_RATIO)
          .describe("Output image aspect ratio"),
        quality: z
          .enum(QUALITY_OPTIONS)
          .optional()
          .describe("Quality level (only for gpt-image/1.5-text-to-image). Default: medium"),
        resolution: z
          .enum(RESOLUTION_OPTIONS)
          .optional()
          .describe("Resolution (only for nano-banana-pro). Default: 2K"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ prompt, model, aspect_ratio, quality, resolution }, extra) => {
      try {
        logger.info(`Creating task: model=${model}, prompt="${prompt.slice(0, 80)}..."`);

        const input = buildImageInput(model, prompt, aspect_ratio, quality, resolution);
        const taskId = await createTask(model, input, { signal: extra.signal });
        logger.info(`Task created: ${taskId}`);

        const progressToken = extra._meta?.progressToken;

        const urls = await pollResult(taskId, {
          signal: extra.signal,
          logger,
          onProgress: (attempt, total, state) => {
            if (progressToken) {
              extra
                .sendNotification({
                  method: "notifications/progress",
                  params: { progressToken, progress: attempt, total },
                })
                .catch(() => {});
            }
            logger.debug(`Poll ${attempt}/${total}: state=${state}`);
          },
        });

        const result = urls
          .map((url, i) => `Image ${i + 1}: ${url}`)
          .join("\n");

        return {
          content: [
            {
              type: "text" as const,
              text: `Generated ${urls.length} image(s) with ${model}:\n\n${result}`,
            },
          ],
        };
      } catch (error) {
        const msg =
          error instanceof KieApiError
            ? `${error.message}\n\nSuggestion: ${error.suggestion}`
            : error instanceof Error
              ? error.message
              : String(error);
        return {
          content: [{ type: "text" as const, text: `Error: ${msg}` }],
          isError: true,
        };
      }
    },
  );
}
