import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { generateImage } from "../client.js";
import { GeminiApiError } from "../types.js";
import { MAX_INLINE_SIZE } from "../constants.js";
import type { Logger } from "../logger.js";

export function registerGenerateImage(server: McpServer, logger: Logger) {
  server.registerTool(
    "generate_image_google",
    {
      title: "Generate Image (Google Gemini)",
      description: [
        "Generate an image using Google Gemini model. Returns the image inline (base64) and saves to disk.",
        "",
        "Tips: be specific in prompts, mention style/lighting/composition. Prompt in English for best results.",
        "Aspect ratio and resolution can be specified in the prompt text (e.g. 'wide landscape 16:9').",
        "Cost: ~$0.13 per image. Rate limit: 10 req/min.",
      ].join("\n"),
      inputSchema: {
        prompt: z
          .string()
          .describe("Text description of the image to generate (English recommended)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ prompt }, extra) => {
      try {
        logger.info(`Generating image: "${prompt.slice(0, 80)}..."`);

        const result = await generateImage(prompt, {
          signal: extra.signal,
          logger,
        });

        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [];

        // Если картинка помещается в лимит MCP — отправить inline
        if (result.sizeBytes <= MAX_INLINE_SIZE) {
          content.push({
            type: "image" as const,
            data: result.base64,
            mimeType: result.mimeType,
          });
        }

        content.push({
          type: "text" as const,
          text: [
            `Image generated successfully.`,
            `File: ${result.filepath}`,
            `Size: ${(result.sizeBytes / 1024).toFixed(0)}KB`,
            result.sizeBytes > MAX_INLINE_SIZE
              ? `(Image too large for inline display — use the file path)`
              : "",
          ]
            .filter(Boolean)
            .join("\n"),
        });

        return { content };
      } catch (error) {
        const msg =
          error instanceof GeminiApiError
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
