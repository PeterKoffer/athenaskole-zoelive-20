// src/services/telemetry/events.ts
import { supabase } from '@/integrations/supabase/client';

export type TelemetryPayload = Record<string, any>;

export async function logEvent(name: string, payload: TelemetryPayload): Promise<void> {
  try {
    // Try DB first; fallback to console
    const { error } = await (supabase as any).from('events').insert({ name, payload });
    if (error) throw error;
  } catch (e) {
    console.info('[NELIE:event]', name, payload);
  }
}
