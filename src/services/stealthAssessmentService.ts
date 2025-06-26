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
} from '@/types/stealthAssessment';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return user.id;
  }
  console.warn('StealthAssessmentService: No authenticated user found. Using mockUser123 for now.');
  return 'mockUser123';
};

const getCurrentSessionId = (): string | undefined => {
  return 'mockSession456';
}

class StealthAssessmentService implements IStealthAssessmentService {
  private isInitialized = false;
  private eventQueue: InteractionEvent[] = [];
  private flushInterval: number = 5000;
  private flushTimerId?: NodeJS.Timeout;
  private isFlushing = false;

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
    return {
      sessionId: getCurrentSessionId(),
      sourceComponentId,
    };
  }

  public async logEvent(
    eventData: Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>,
    sourceComponentId?: string
  ): Promise<void> {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('StealthAssessmentService: No user ID found. Event not logged.');
      return;
    }

    const fullEvent: InteractionEvent = {
      eventId: uuidv4(),
      timestamp: Date.now(),
      userId,
      sessionId: getCurrentSessionId(),
      sourceComponentId,
      ...eventData,
    } as InteractionEvent;

    this.eventQueue.push(fullEvent);
    console.log('StealthAssessmentService: Event logged to queue:', fullEvent.type, fullEvent.eventId);

    if (this.eventQueue.length >= 10) {
      await this.flushEventQueue();
    }
  }

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

      const { data, error } = await supabase
        .from('interaction_events')
        .insert(recordsToInsert);

      if (error) {
        console.error('StealthAssessmentService: Supabase error flushing event queue:', error);
        this.eventQueue.unshift(...eventsToFlush);
      } else {
        console.log(`StealthAssessmentService: Successfully flushed ${eventsToFlush.length} events to Supabase.`);
      }
    } catch (error) {
      console.error('StealthAssessmentService: Exception during event queue flush:', error);
      this.eventQueue.unshift(...eventsToFlush);
    } finally {
      this.isFlushing = false;
    }
  }

  public destroy(): void {
    if (this.flushTimerId) {
      clearInterval(this.flushTimerId);
    }
    this.flushEventQueue().catch(err => console.error("Error on final flush:", err));
    this.isInitialized = false;
    console.log('StealthAssessmentService: Destroyed.');
  }
}

const stealthAssessmentService = new StealthAssessmentService();
export default stealthAssessmentService;
