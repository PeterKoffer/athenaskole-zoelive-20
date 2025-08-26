// src/agents/logger.ts
export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function getEnv(name: string): string | undefined {
  try {
    // Deno (Edge Functions)
    // @ts-ignore
    if (typeof Deno !== "undefined" && Deno?.env?.get) return Deno.env.get(name);
  } catch {}
  try {
    // Node (vite/dev)
    if (typeof process !== "undefined" && (process as any)?.env) return (process as any).env[name];
  } catch {}
  return undefined;
}

const envLevel = (getEnv("LOG_LEVEL") as LogLevel) || "info";
const threshold = LEVELS[envLevel] ?? LEVELS.info;

export async function logEvent(args: {
  sessionId: string;
  agent: "content" | "qa" | "image" | "simulator" | string;
  level: LogLevel;
  message: string;
  meta?: unknown;
}) {
  const lvl = LEVELS[args.level] ?? LEVELS.info;
  if (lvl < threshold) return;

  // Console i dev/miljøer uden central log
  if (typeof console !== "undefined") {
    console.log("[AGENT]", JSON.stringify(args));
  }

  // (Optional) Her kan du senere tilføje Supabase insert til en logs-tabel
  // afhængigt af om du ønsker centraliseret logging i prod.
}
