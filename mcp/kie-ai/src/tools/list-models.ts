import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { IMAGE_MODELS, IMAGE_MODEL_INFO } from "../constants.js";

export function registerListModels(server: McpServer) {
  server.registerTool(
    "list_models",
    {
      title: "List Models",
      description: "List available Kie.ai models with descriptions and pricing.",
      inputSchema: {
        type: z
          .enum(["image", "all"])
          .default("all")
          .describe("Filter by model type"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      // На данный момент поддерживаются только image-модели
      const lines = IMAGE_MODELS.map((id) => {
        const info = IMAGE_MODEL_INFO[id];
        return `- **${id}**: ${info.description} (${info.cost})`;
      });

      return {
        content: [
          {
            type: "text" as const,
            text: [
              "Available Image Models:",
              "",
              ...lines,
              "",
              `Default: nano-banana-pro`,
            ].join("\n"),
          },
        ],
      };
    },
  );
}
