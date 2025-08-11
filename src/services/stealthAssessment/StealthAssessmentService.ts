
import { 
  IStealthAssessmentService, 
  InteractionEvent, 
  InteractionEventType,
  QuestionAttemptEvent,
  HintUsageEvent,
  GameInteractionEvent,
  TutorQueryEvent,
  ContentViewEvent
} from '@/types/stealthAssessment';

class StealthAssessmentService implements IStealthAssessmentService {
  private userId: string = 'test-user-123'; // Mock user ID for testing
  private sessionId: string = `session-${Date.now()}`;
  private eventQueue: InteractionEvent[] = [];
  private maxQueueSize: number = 1000;

  async logEvent(
    eventData: Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
    const fullEvent = {
      ...eventData,
      eventId: `event-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      sourceComponentId: sourceComponentId || 'unknown'
    } as InteractionEvent;

    // Add to queue
    this.eventQueue.push(fullEvent);
    
    // Maintain queue size limit
    if (this.eventQueue.length > this.maxQueueSize) {
      this.eventQueue.shift();
    }

    console.log('🎯 Stealth Assessment Event Logged:', eventData.type);
    console.log('📊 Event Details:', fullEvent);
    
    // In a real implementation, this would send data to a backend
    // For now, we'll just log to console for testing
  }

  // Legacy method for backward compatibility
  async logInteractionEvent(eventData: any): Promise<void> {
    console.log('⚠️ Using legacy logInteractionEvent method');
    await this.logEvent(eventData);
  }
// @ts-nocheck

  async logQuestionAttempt(
    details: Omit<QuestionAttemptEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
    console.log('📝 Question Attempt:', {
      questionId: details.questionId,
      isCorrect: details.isCorrect,
      timeTaken: details.timeTakenMs,
      attempts: details.attemptsMade
    });

    await this.logEvent({
      type: InteractionEventType.QUESTION_ATTEMPT,
      ...details
    }, sourceComponentId);
  }

  async logHintUsage(
    details: Omit<HintUsageEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
    console.log('💡 Hint Used:', details.hintId);

    await this.logEvent({
      type: InteractionEventType.HINT_USAGE,
      ...details
    }, sourceComponentId);
  }

  async logGameInteraction(
    details: Omit<GameInteractionEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
    await this.logEvent({
      type: InteractionEventType.GAME_INTERACTION,
      ...details
    }, sourceComponentId);
  }

  async logTutorQuery(
    details: Omit<TutorQueryEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
    await this.logEvent({
      type: InteractionEventType.TUTOR_QUERY,
      ...details
    }, sourceComponentId);
  }

  async logContentView(
    details: Omit<ContentViewEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
    console.log('👀 Content View:', {
      contentAtomId: details.contentAtomId,
      contentType: details.contentType,
      timeViewed: details.timeViewedMs
    });

    await this.logEvent({
      type: InteractionEventType.CONTENT_VIEW,
      ...details
    }, sourceComponentId);
  }

  // --- Debug/Test methods for in-memory queue ---
  public async getInMemoryEvents(): Promise<InteractionEvent[]> {
    return [...this.eventQueue];
  }

  public async clearInMemoryEvents(): Promise<void> {
    this.eventQueue = [];
  }

  public getRecentEvents(count: number): InteractionEvent[] {
    return this.eventQueue.slice(-count);
  }

  public clearQueue(): void {
    this.eventQueue = [];
  }

  public getQueueSize(): number {
    return this.eventQueue.length;
  }
}

// Export a singleton instance
const stealthAssessmentService = new StealthAssessmentService();
export default stealthAssessmentService;
