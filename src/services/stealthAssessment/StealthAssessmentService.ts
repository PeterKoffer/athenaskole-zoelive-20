
// src/services/stealthAssessment/StealthAssessmentService.ts

import { 
  InteractionEvent, 
  InteractionEventType, 
  IStealthAssessmentService,
  QuestionAttemptEvent,
  HintUsageEvent,
  GameInteractionEvent,
  TutorQueryEvent,
  ContentViewEvent
} from '@/types/stealthAssessment';
import { StealthAssessmentConfig, EventQueueManager } from './types';

class MockStealthAssessmentService implements IStealthAssessmentService {
  private eventQueue: InteractionEvent[] = [];
  private config: StealthAssessmentConfig;
  private sessionId: string;
  private userId: string;

  constructor() {
    this.config = {
      flushInterval: 30000, // 30 seconds
      immediateFlushThreshold: 10, // Flush when 10 events queued
      testUserId: 'mock-user-123',
      mockSessionId: `session-${Date.now()}`
    };
    
    this.sessionId = this.config.mockSessionId;
    this.userId = this.config.testUserId;
    
    // Set up periodic flushing
    setInterval(() => {
      this.flushEvents();
    }, this.config.flushInterval);
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async logEvent(
    eventData: Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
    const fullEvent: InteractionEvent = {
      ...eventData,
      eventId: this.generateEventId(),
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      sourceComponentId: sourceComponentId || 'unknown'
    } as InteractionEvent;

    this.eventQueue.push(fullEvent);
    
    console.log('🎯 Stealth Assessment Event Logged:', {
      type: fullEvent.type,
      eventId: fullEvent.eventId,
      sourceComponent: sourceComponentId,
      timestamp: new Date(fullEvent.timestamp).toISOString(),
      queueSize: this.eventQueue.length
    });

    // Detailed logging based on event type
    switch (fullEvent.type) {
      case InteractionEventType.QUESTION_ATTEMPT:
        const qaEvent = fullEvent as QuestionAttemptEvent;
        console.log('  📝 Question Attempt:', {
          questionId: qaEvent.questionId,
          isCorrect: qaEvent.isCorrect,
          timeTaken: qaEvent.timeTakenMs ? `${qaEvent.timeTakenMs}ms` : 'unknown',
          attempts: qaEvent.attemptsMade,
          knowledgeComponents: qaEvent.knowledgeComponentIds
        });
        break;
      
      case InteractionEventType.HINT_USAGE:
        const hintEvent = fullEvent as HintUsageEvent;
        console.log('  💡 Hint Usage:', {
          hintId: hintEvent.hintId,
          hintLevel: hintEvent.hintLevel,
          questionId: hintEvent.questionId
        });
        break;
      
      case InteractionEventType.CONTENT_VIEW:
        const contentEvent = fullEvent as ContentViewEvent;
        console.log('  👀 Content View:', {
          contentAtomId: contentEvent.contentAtomId,
          contentType: contentEvent.contentType,
          timeViewed: contentEvent.timeViewedMs ? `${contentEvent.timeViewedMs}ms` : 'unknown'
        });
        break;
    }

    // Auto-flush if threshold reached
    if (this.eventQueue.length >= this.config.immediateFlushThreshold) {
      await this.flushEvents();
    }
  }

  // Convenience methods for common event types
  async logQuestionAttempt(
    details: Omit<QuestionAttemptEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
    await this.logEvent({
      type: InteractionEventType.QUESTION_ATTEMPT,
      ...details
    }, sourceComponentId);
  }

  async logHintUsage(
    details: Omit<HintUsageEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, 
    sourceComponentId?: string
  ): Promise<void> {
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
    await this.logEvent({
      type: InteractionEventType.CONTENT_VIEW,
      ...details
    }, sourceComponentId);
  }

  // Utility methods for development and testing
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    console.log(`🔄 Flushing ${this.eventQueue.length} stealth assessment events`);
    
    // In a real implementation, this would send events to a backend service
    // For now, we'll just clear the queue and log a summary
    const eventSummary = this.getEventSummary();
    console.log('📊 Event Summary:', eventSummary);
    
    this.eventQueue = [];
  }

  private getEventSummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    
    for (const event of this.eventQueue) {
      summary[event.type] = (summary[event.type] || 0) + 1;
    }
    
    return summary;
  }

  // Development utilities
  getQueueSize(): number {
    return this.eventQueue.length;
  }

  getRecentEvents(count: number = 10): InteractionEvent[] {
    return this.eventQueue.slice(-count);
  }

  clearQueue(): void {
    console.log(`🗑️ Manually clearing ${this.eventQueue.length} events from queue`);
    this.eventQueue = [];
  }
}

// Export singleton instance
export const stealthAssessmentService = new MockStealthAssessmentService();
export default stealthAssessmentService;
