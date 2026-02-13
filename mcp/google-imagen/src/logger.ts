import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

type LogLevel = "debug" | "info" | "warning" | "error";

export interface Logger {
  debug(msg: string): void;
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

export function createLogger(server: McpServer): Logger {
  function log(level: LogLevel, msg: string) {
    console.error(`[google-imagen][${level}] ${msg}`);
    server.sendLoggingMessage({ level, data: msg }).catch(() => {});
  }

  return {
    debug: (msg) => log("debug", msg),
    info: (msg) => log("info", msg),
    warn: (msg) => log("warning", msg),
    error: (msg) => log("error", msg),
  };
}
