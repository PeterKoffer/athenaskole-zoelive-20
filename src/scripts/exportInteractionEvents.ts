import { supabase } from '@/integrations/supabase/client';
import { InteractionEventType } from '@/types/stealthAssessment';

interface ExportParams {
  userId?: string;
  kcId?: string;
  eventType?: InteractionEventType;
  limit?: number;
}

/**
 * Fetches interaction events from Supabase based on provided filters.
 *
 * @param params - Object containing filter parameters:
 *  - userId?: string - Filter by user ID.
 *  - kcId?: string - Filter by events containing this Knowledge Component ID.
 *  - eventType?: InteractionEventType - Filter by a specific event type.
 *  - limit?: number - Maximum number of events to fetch (defaults to 100).
 * @returns A promise that resolves to an array of interaction events.
 */
export async function fetchInteractionEvents(params: ExportParams = {}) {
  const { userId, kcId, eventType, limit = 100 } = params;

  let query = supabase
    .from('interaction_events')
    .select('timestamp, event_id, user_id, event_type, kc_ids, content_atom_id, source_component_id, event_data')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (kcId) {
    query = query.contains('kc_ids', [kcId]);
  }

  if (eventType) {
    query = query.eq('event_type', eventType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching interaction events:', error);
    throw error;
  }

  return data;
}

// Basic command-line execution example
// Usage: npx bun run src/scripts/exportInteractionEvents.ts [--userId=xxx] [--kcId=yyy] [--eventType=ZZZ] [--limit=N]
// Example: npx bun run src/scripts/exportInteractionEvents.ts --userId=some-user-uuid --kcId=kc_math_g4_add_fractions_likedenom --limit=10
if (typeof process !== 'undefined' && process.argv && process.argv.length > 1 && import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    console.log('Executing Interaction Event Exporter...');
    const args = process.argv.slice(2).reduce((acc, arg) => {
      const [key, value] = arg.split('=');
      if (key && value) {
        if (key.startsWith('--')) {
          acc[key.substring(2)] = value;
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, string>);

    const params: ExportParams = {};
    if (args.userId) params.userId = args.userId;
    if (args.kcId) params.kcId = args.kcId;
    if (args.eventType) params.eventType = args.eventType as InteractionEventType;
    if (args.limit) params.limit = parseInt(args.limit, 10);

    console.log('Fetching with params:', params);

    try {
      const events = await fetchInteractionEvents(params);
      console.log(`Fetched ${events?.length || 0} events:`);
      console.log(JSON.stringify(events, null, 2));
    } catch (e) {
      console.error('Failed to fetch events from command line execution.');
    }
  })();
}
