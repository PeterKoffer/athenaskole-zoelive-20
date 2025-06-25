// src/services/stealthAssessmentService.ts

import {
  InteractionEvent,
  InteractionEventType,
  BaseInteractionEvent,
  QuestionAttemptEvent,
  HintUsageEvent,
  GameInteractionEvent,
  TutorQueryEvent,
  ContentViewEvent,
  IStealthAssessmentService,
  // Import other specific event types as needed
} from '@/types/stealthAssessment';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client

// Placeholder for user context - in a real app, this would come from an auth service
// For now, we'll mock it.
// TODO: Replace with actual user ID from Supabase auth context (e.g., supabase.auth.getUser())
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return user.id;
  }
  console.warn('StealthAssessmentService: No authenticated user found. Using mockUser123 for now.');
  return 'mockUser123'; // Fallback to mock if no user, or handle error
};

const getCurrentSessionId = (): string | undefined => {
  // TODO: Implement actual session ID management if needed, or get from context
  return 'mockSession456'; // Placeholder
}

class StealthAssessmentService implements IStealthAssessmentService {
  private isInitialized = false;
  private eventQueue: InteractionEvent[] = [];
  private flushInterval: number = 5000; // Flush queue every 5 seconds
  private flushTimerId?: NodeJS.Timeout;
  private isFlushing = false; // To prevent concurrent flushes

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isInitialized) return;
    console.log('StealthAssessmentService: Initializing...');
    this.flushTimerId = setInterval(() => this.flushEventQueue(), this.flushInterval);
    this.isInitialized = true;
    console.log('StealthAssessmentService: Initialized.');
  }

  private generateEventMetadata(sourceComponentId?: string): Omit<BaseInteractionEvent, 'userId' | 'timestamp' | 'eventId'> {
    // eventId and timestamp will be generated per event to ensure uniqueness if batched
    return {
      sessionId: getCurrentSessionId(),
      sourceComponentId,
    };
  }

  public async logEvent(
    eventData: Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, // Adjusted Omit
    sourceComponentId?: string
  ): Promise<void> {
    const userId = await getCurrentUserId(); // Now async
    if (!userId) {
      console.warn('StealthAssessmentService: No user ID found. Event not logged.');
      return;
    }

    const fullEvent: InteractionEvent = {
      eventId: uuidv4(), // Generate unique ID for each event
      timestamp: Date.now(), // Current timestamp for each event
      userId,
      sessionId: getCurrentSessionId(), // Add sessionId here
      sourceComponentId, // Add sourceComponentId here
      ...eventData,
    } as InteractionEvent; // Type assertion might still be needed

    this.eventQueue.push(fullEvent);
    console.log('StealthAssessmentService: Event logged to queue:', fullEvent.type, fullEvent.eventId);

    if (this.eventQueue.length >= 10) { // Trigger immediate flush if queue is large
      await this.flushEventQueue();
    }
  }

  // Specific helper methods
  public async logQuestionAttempt(details: Omit<QuestionAttemptEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.QUESTION_ATTEMPT, ...details }, sourceComponentId);
  }

  public async logHintUsage(details: Omit<HintUsageEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.HINT_USAGE, ...details }, sourceComponentId);
  }

  public async logGameInteraction(details: Omit<GameInteractionEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.GAME_INTERACTION, ...details }, sourceComponentId);
  }

  public async logTutorQuery(details: Omit<TutorQueryEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.TUTOR_QUERY, ...details }, sourceComponentId);
  }

  public async logContentView(details: Omit<ContentViewEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.CONTENT_VIEW, ...details }, sourceComponentId);
  }


  private async flushEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0 || this.isFlushing) {
      return;
    }
    this.isFlushing = true;

    const eventsToFlush = [...this.eventQueue];
    this.eventQueue = [];

    console.log(`StealthAssessmentService: Flushing ${eventsToFlush.length} events...`);

    try {
      const recordsToInsert = eventsToFlush.map(event => ({
        event_id: event.eventId,
        user_id: event.userId,
        session_id: event.sessionId,
        timestamp: new Date(event.timestamp).toISOString(), // Ensure ISO string for timestamptz
        event_type: event.type,
        source_component_id: event.sourceComponentId,
        event_data: event, // Store the whole event object in event_data JSONB
        // Denormalized fields for easier querying (extract from event object)
        question_id: (event as QuestionAttemptEvent).questionId || undefined,
        kc_ids: (event as QuestionAttemptEvent | GameInteractionEvent | ContentViewEvent).knowledgeComponentIds || undefined,
        is_correct: (event as QuestionAttemptEvent).isCorrect, // Might be undefined if not QuestionAttemptEvent
        game_id: (event as GameInteractionEvent).gameId || undefined,
        content_atom_id: (event as ContentViewEvent).contentAtomId || undefined,
      }));

      const { data, error } = await supabase
        .from('interaction_events')
        .insert(recordsToInsert);

      if (error) {
        console.error('StealthAssessmentService: Supabase error flushing event queue:', error);
        // Re-queue events on failure
        this.eventQueue.unshift(...eventsToFlush);
      } else {
        console.log(`StealthAssessmentService: Successfully flushed ${eventsToFlush.length} events to Supabase.`);
      }
    } catch (error) {
      console.error('StealthAssessmentService: Exception during event queue flush:', error);
      this.eventQueue.unshift(...eventsToFlush); // Re-queue on exception
    } finally {
      this.isFlushing = false;
    }
  }

  public destroy(): void {
    if (this.flushTimerId) {
      clearInterval(this.flushTimerId);
    }
    // Attempt a final flush, but don't wait indefinitely if it's a browser context closing
    this.flushEventQueue().catch(err => console.error("Error on final flush:", err));
    this.isInitialized = false;
    console.log('StealthAssessmentService: Destroyed.');
  }
}

// Export a singleton instance of the service
const stealthAssessmentService = new StealthAssessmentService();
export default stealthAssessmentService;
