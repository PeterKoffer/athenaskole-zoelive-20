
// src/services/stealthAssessment/supabaseEventLogger.ts

import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { InteractionEventType, InteractionEvent, QuestionAttemptEvent, GameInteractionEvent, ContentViewEvent } from '@/types/stealthAssessment';
import { getCurrentSessionId } from './userUtils';

export class SupabaseEventLogger {
  async logInteractionEvent(event: {
    event_type: InteractionEventType;
    user_id: string;
    event_data: any;
    kc_ids?: string[];
    content_atom_id?: string;
    is_correct?: boolean;
  }): Promise<void> {
    console.log('SupabaseEventLogger: Logging interaction event:', event.event_type, 'for user:', event.user_id);
    
    try {
      const recordToInsert = {
        event_id: uuidv4(),
        user_id: event.user_id,
        session_id: getCurrentSessionId(),
        timestamp: new Date().toISOString(),
        event_type: event.event_type,
        event_data: event.event_data,
        kc_ids: event.kc_ids,
        content_atom_id: event.content_atom_id,
        is_correct: event.is_correct,
      };

      console.log('SupabaseEventLogger: Inserting record to interaction_events:', recordToInsert);

      const { data, error } = await supabase
        .from('interaction_events')
        .insert(recordToInsert);

      if (error) {
        console.error('SupabaseEventLogger: Supabase error logging interaction event:', error);
        throw error;
      } else {
        console.log('SupabaseEventLogger: Successfully logged interaction event for user:', event.user_id);
      }
    } catch (error) {
      console.error('SupabaseEventLogger: Exception during interaction event logging:', error);
      throw error;
    }
  }

  async flushEventBatch(events: InteractionEvent[]): Promise<void> {
    if (events.length === 0) return;

    console.log(`SupabaseEventLogger: Flushing ${events.length} events to Supabase...`);

    try {
      const recordsToInsert = events.map(event => ({
        event_id: event.eventId,
        user_id: event.userId,
        session_id: event.sessionId || undefined,
        timestamp: new Date(event.timestamp).toISOString(),
        event_type: event.type,
        source_component_id: event.sourceComponentId || undefined,
        event_data: event as any,
        question_id: (event as QuestionAttemptEvent).questionId || undefined,
        kc_ids: (event as QuestionAttemptEvent | GameInteractionEvent | ContentViewEvent).knowledgeComponentIds || undefined,
        is_correct: 'isCorrect' in event ? (event as QuestionAttemptEvent).isCorrect : undefined,
        game_id: (event as GameInteractionEvent).gameId || undefined,
        content_atom_id: (event as ContentViewEvent).contentAtomId || undefined,
      }));

      console.log(`SupabaseEventLogger: Attempting to insert ${recordsToInsert.length} records to interaction_events table`);

      const { data, error } = await supabase
        .from('interaction_events')
        .insert(recordsToInsert);

      if (error) {
        console.error('SupabaseEventLogger: Supabase error flushing event queue:', error);
        throw error;
      } else {
        console.log(`SupabaseEventLogger: Successfully flushed ${events.length} events to Supabase interaction_events table.`);
      }
    } catch (error) {
      console.error('SupabaseEventLogger: Exception during event queue flush:', error);
      throw error;
    }
  }
}
