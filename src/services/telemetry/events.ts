// src/services/telemetry/events.ts
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/utils/session';

export type TelemetryPayload = Record<string, any>;

export async function logEvent(name: string, payload: TelemetryPayload): Promise<void> {
  const session_id = getSessionId();
  try {
    // Try DB first; fallback to console
    const { error } = await (supabase as any)
      .from('events')
      .insert({ name, payload, session_id });
    if (error) throw error;
  } catch (e) {
    console.info('[NELIE:event]', name, { session_id, ...payload });
  }
}

