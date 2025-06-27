
// src/services/stealthAssessment/StealthAssessmentService.ts

import {
  InteractionEvent,
  InteractionEventType,
  QuestionAttemptEvent,
  HintUsageEvent,
  GameInteractionEvent,
  TutorQueryEvent,
  ContentViewEvent,
  IStealthAssessmentService,
} from '@/types/stealthAssessment';

import { getCurrentUserId } from './userUtils';
import { createFullEvent } from './eventMetadataGenerator';
import { EventQueue } from './eventQueue';
import { SupabaseEventLogger } from './supabaseEventLogger';

class StealthAssessmentService implements IStealthAssessmentService {
  private isInitialized = false;
  private eventQueue: EventQueue;
  private supabaseLogger: SupabaseEventLogger;

  constructor() {
    this.eventQueue = new EventQueue();
    this.supabaseLogger = new SupabaseEventLogger();
    this.init();
  }

  private init(): void {
    if (this.isInitialized) return;
    console.log('StealthAssessmentService: Initializing refactored service...');
    this.isInitialized = true;
    console.log('StealthAssessmentService: Refactored service initialized and ready.');
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

    const fullEvent = await createFullEvent(eventData, userId, sourceComponentId);
    console.log(`StealthAssessmentService: Logging event for user ${userId}:`, fullEvent.type, fullEvent.eventId);

    await this.eventQueue.addEvent(fullEvent);
  }

  // Convenience methods for specific event types
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

  public async logInteractionEvent(event: {
    event_type: InteractionEventType;
    user_id: string;
    event_data: any;
    kc_ids?: string[];
    content_atom_id?: string;
    is_correct?: boolean;
  }): Promise<void> {
    await this.supabaseLogger.logInteractionEvent(event);
  }

  public destroy(): void {
    this.eventQueue.destroy();
    this.isInitialized = false;
    console.log('StealthAssessmentService: Refactored service destroyed.');
  }
}

const stealthAssessmentService = new StealthAssessmentService();
export default stealthAssessmentService;
