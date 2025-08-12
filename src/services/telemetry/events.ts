// src/services/telemetry/events.ts
export type TelemetryPayload = Record<string, any>;

export async function logEvent(name: string, payload: TelemetryPayload): Promise<void> {
  try {
    // Minimal stub: swap console with Supabase insert when ready
    console.info('[NELIE:event]', name, payload);
  } catch (e) {
    console.warn('[NELIE:event] failed', name, e);
  }
}
