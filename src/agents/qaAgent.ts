import { logEvent } from "./logger.ts";

export type QAResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fixed?: T };

export async function validateJson<T>(
  sessionId: string,
  _agent: string,
  data: T
): Promise<QAResult<T>> {
  // Stub – her kunne du validere mod et JSON-schema
  await logEvent({
    sessionId,
    agent: "qa",
    level: "info",
    message: "Validated JSON",
  });
  return { ok: true, data };
}
