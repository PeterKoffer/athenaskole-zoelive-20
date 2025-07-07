
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
    if (!details.questionId) {
      console.warn('StealthAssessmentService: logQuestionAttempt called without questionId.', details);
    }
    if (!details.knowledgeComponentIds || details.knowledgeComponentIds.length === 0) {
      console.warn('StealthAssessmentService: logQuestionAttempt called without knowledgeComponentIds.', details);
    }
    await this.logEvent({ type: InteractionEventType.QUESTION_ATTEMPT, ...details }, sourceComponentId);
  }

  public async logHintUsage(details: Omit<HintUsageEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    if (!details.hintId) {
      console.warn('StealthAssessmentService: logHintUsage called without hintId.', details);
    }
    // knowledgeComponentIds and questionId are optional for hints, but good to encourage.
    if (!details.knowledgeComponentIds || details.knowledgeComponentIds.length === 0) {
      console.info('StealthAssessmentService: logHintUsage called without knowledgeComponentIds (optional but recommended).', details);
    }
    if (!details.questionId) {
      console.info('StealthAssessmentService: logHintUsage called without questionId (optional but recommended).', details);
    }
    await this.logEvent({ type: InteractionEventType.HINT_USAGE, ...details }, sourceComponentId);
  }

  public async logGameInteraction(details: Omit<GameInteractionEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    if (!details.gameId) {
      console.warn('StealthAssessmentService: logGameInteraction called without gameId.', details);
    }
    if (!details.interactionType) {
      console.warn('StealthAssessmentService: logGameInteraction called without interactionType.', details);
    }
    // KCs are highly recommended for game interactions for learning analytics
    if (!details.knowledgeComponentIds || details.knowledgeComponentIds.length === 0) {
      console.info('StealthAssessmentService: logGameInteraction called without knowledgeComponentIds (optional but recommended for learning analytics).', details);
    }
    await this.logEvent({ type: InteractionEventType.GAME_INTERACTION, ...details }, sourceComponentId);
  }

  public async logTutorQuery(details: Omit<TutorQueryEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    if (!details.queryText) {
      console.warn('StealthAssessmentService: logTutorQuery called without queryText.', details);
    }
    // Context is important for tutor queries
    if (!details.context) {
      console.info('StealthAssessmentService: logTutorQuery called without context (optional but recommended).', details);
    }
    await this.logEvent({ type: InteractionEventType.TUTOR_QUERY, ...details }, sourceComponentId);
  }

  public async logContentView(details: Omit<ContentViewEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void> {
    if (!details.contentAtomId) {
      console.warn('StealthAssessmentService: logContentView called without contentAtomId.', details);
    }
    if (!details.knowledgeComponentIds || details.knowledgeComponentIds.length === 0) {
      console.warn('StealthAssessmentService: logContentView called without knowledgeComponentIds.', details);
    }
    if (!details.contentType) {
      console.warn('StealthAssessmentService: logContentView called without contentType.', details);
    }
    await this.logEvent({ type: InteractionEventType.CONTENT_VIEW, ...details }, sourceComponentId);
  }

  // This specific method `logInteractionEvent` seems to be a direct pass-through to supabaseLogger,
  // It's less about enriching with client-side metadata and more about direct logging.
  // We'll assume callers of this method are providing all necessary fields directly.
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

  // --- Debug/Test methods for in-memory queue ---
  public async getInMemoryEvents(): Promise<InteractionEvent[]> {
    return this.eventQueue.getEvents();
  }

  public async clearInMemoryEvents(): Promise<void> {
    this.eventQueue.clearEvents();
  }
}

const stealthAssessmentService = new StealthAssessmentService();
export default stealthAssessmentService;
