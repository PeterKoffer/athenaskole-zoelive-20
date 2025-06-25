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

// Placeholder for user context - in a real app, this would come from an auth service
// For now, we'll mock it.
const getCurrentUserId = (): string => {
  // TODO: Replace with actual user ID from auth context
  return 'mockUser123';
};
const getCurrentSessionId = (): string | undefined => {
  // TODO: Replace with actual session ID from session context
  return 'mockSession456';
}

class StealthAssessmentService implements IStealthAssessmentService {
  private isInitialized = false;
  private eventQueue: InteractionEvent[] = [];
  private flushInterval: number = 5000; // Flush queue every 5 seconds
  private flushTimerId?: NodeJS.Timeout;

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isInitialized) return;
    console.log('StealthAssessmentService: Initializing...');
    // In a real scenario, this might connect to a WebSocket or initialize API clients
    // For now, we'll set up a mock queue flusher
    this.flushTimerId = setInterval(() => this.flushEventQueue(), this.flushInterval);
    this.isInitialized = true;
    console.log('StealthAssessmentService: Initialized.');
  }

  private generateEventMetadata(sourceComponentId?: string): Omit<BaseInteractionEvent, 'userId'> {
    return {
      eventId: uuidv4(),
      timestamp: Date.now(),
      sessionId: getCurrentSessionId(),
      sourceComponentId,
    };
  }

  public async logEvent(
    eventData: Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId'>,
    sourceComponentId?: string
  ): Promise<void> {
    const userId = getCurrentUserId();
    if (!userId) {
      console.warn('StealthAssessmentService: No user ID found. Event not logged.');
      return;
    }

    const fullEvent: InteractionEvent = {
      ...this.generateEventMetadata(sourceComponentId),
      userId,
      ...eventData,
    } as InteractionEvent; // Type assertion needed due to Omit complexity

    this.eventQueue.push(fullEvent);
    console.log('StealthAssessmentService: Event logged to queue:', fullEvent);

    // Optional: Immediate flush if queue size exceeds a threshold
    if (this.eventQueue.length >= 10) {
      await this.flushEventQueue();
    }
  }

  // Specific helper methods
  public async logQuestionAttempt(details: Omit<QuestionAttemptEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.QUESTION_ATTEMPT, ...details }, sourceComponentId);
  }

  public async logHintUsage(details: Omit<HintUsageEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.HINT_USAGE, ...details }, sourceComponentId);
  }

  public async logGameInteraction(details: Omit<GameInteractionEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.GAME_INTERACTION, ...details }, sourceComponentId);
  }

  public async logTutorQuery(details: Omit<TutorQueryEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.TUTOR_QUERY, ...details }, sourceComponentId);
  }

  public async logContentView(details: Omit<ContentViewEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId'>, sourceComponentId?: string): Promise<void> {
    await this.logEvent({ type: InteractionEventType.CONTENT_VIEW, ...details }, sourceComponentId);
  }

  // TODO: Add other specific helper methods from IStealthAssessmentService as needed

  private async flushEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    const eventsToFlush = [...this.eventQueue];
    this.eventQueue = [];

    console.log(`StealthAssessmentService: Flushing ${eventsToFlush.length} events...`);

    try {
      // In a real implementation, this would send events to a backend (e.g., Supabase)
      // For now, we just log them as "sent"
      // Example: await supabase.from('interaction_events').insert(eventsToFlush);
      console.log('StealthAssessmentService: Events successfully "sent" to backend (mocked):', eventsToFlush);
    } catch (error) {
      console.error('StealthAssessmentService: Error flushing event queue:', error);
      // Handle error, e.g., re-queue events, implement retry logic
      this.eventQueue.unshift(...eventsToFlush); // Add back to front for retry
    }
  }

  public destroy(): void {
    if (this.flushTimerId) {
      clearInterval(this.flushTimerId);
    }
    this.flushEventQueue(); // Final flush before destroying
    this.isInitialized = false;
    console.log('StealthAssessmentService: Destroyed.');
  }
}

// Export a singleton instance of the service
const stealthAssessmentService = new StealthAssessmentService();
export default stealthAssessmentService;

// Example Usage (typically in a component):
// import stealthAssessmentService from '@/services/stealthAssessmentService';
//
// // In some component method or useEffect:
// stealthAssessmentService.logQuestionAttempt({
//   questionId: 'q1',
//   knowledgeComponentIds: ['kc_add_fractions'],
//   answerGiven: '3/4',
//   isCorrect: true,
//   attemptsMade: 1,
//   timeTakenMs: 15000
// }, 'MyQuestionComponent_Instance1');
//
// stealthAssessmentService.logGameInteraction({
//   gameId: 'fraction_pizza_game',
//   knowledgeComponentIds: ['kc_visual_fractions'],
//   interactionType: 'SLICE_PLACED',
//   interactionValue: { slice: '1/4', target: '2/4_pizza' },
//   scoreChange: 10
// }, 'PizzaGameComponent_Main');

// Remember to handle service destruction if used in a context that can be unmounted,
// e.g., in a React context provider's cleanup effect.
// For a global singleton like this, it might be destroyed when the app closes,
// but that's harder to manage in a frontend JS environment.
// For now, we assume it lives as long as the app.
