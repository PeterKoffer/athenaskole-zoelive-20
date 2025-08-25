export type LogLevel = "info" | "warn" | "error";

export async function logEvent(args: {
  sessionId: string;
  agent: "content" | "qa" | "image" | "simulator" | string;
  level: LogLevel;
  message: string;
  meta?: unknown;
}) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[AGENT]", JSON.stringify(args));
  }
}
