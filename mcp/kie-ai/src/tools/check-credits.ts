import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { checkCredits } from "../client.js";
import { KieApiError } from "../types.js";
import type { Logger } from "../logger.js";

export function registerCheckCredits(server: McpServer, logger: Logger) {
  server.registerTool(
    "check_credits",
    {
      title: "Check Credits",
      description: "Check Kie.ai account credit balance. Returns remaining credits (1 credit ~ $0.005).",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (extra) => {
      try {
        const credits = await checkCredits({ signal: extra.signal });
        logger.info(`Credits checked: ${credits}`);

        return {
          content: [
            {
              type: "text" as const,
              text: [
                `Kie.ai Credits: ${credits}`,
                ``,
                `1 credit ~ $0.005`,
                `Top up: https://kie.ai/pricing`,
              ].join("\n"),
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
