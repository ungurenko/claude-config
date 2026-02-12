import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createLogger } from "./logger.js";
import { registerGenerateImage } from "./tools/generate-image.js";
import { registerCheckCredits } from "./tools/check-credits.js";
import { registerListModels } from "./tools/list-models.js";

const server = new McpServer({ name: "kie-ai", version: "2.0.0" });
const logger = createLogger(server);

registerGenerateImage(server, logger);
registerCheckCredits(server, logger);
registerListModels(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("MCP server started (stdio)");
}

function shutdown() {
  logger.info("Shutting down...");
  server.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((err) => {
  console.error("[kie-ai] Fatal:", err);
  process.exit(1);
});
