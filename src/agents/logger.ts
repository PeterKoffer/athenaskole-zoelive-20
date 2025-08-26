export type LogLevel = "info" | "warn" | "error";

export async function logEvent(args: {
  sessionId: string;
  agent: "content" | "qa" | "image" | "simulator" | string;
  level: LogLevel;
  message: string;
  meta?: unknown;
}) {
  // In Edge Functions (Deno), process.env is not defined.
  // Gate by Deno.env if available.
  const env =
    typeof Deno !== "undefined" && "env" in Deno
      ? Deno.env.get("NODE_ENV")
      : undefined;

  if (env !== "production") {
    // eslint-disable-next-line no-console
    console.log("[AGENT]", JSON.stringify(args));
  }
}
