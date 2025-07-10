
// src/services/stealthAssessment/eventQueue.ts

import { InteractionEvent, InteractionEventType, QuestionAttemptEvent } from '@/types/stealthAssessment';
import { SupabaseEventLogger } from './supabaseEventLogger';
import { STEALTH_ASSESSMENT_CONFIG } from './config';
import { mockProfileService } from '@/services/learnerProfile/MockProfileService';
import { KCMasteryUpdateData } from '@/types/learnerProfile';

export class EventQueue {
  private queue: InteractionEvent[] = [];
  private flushTimerId?: NodeJS.Timeout;
  private isFlushing = false;
  private logger: SupabaseEventLogger;

  constructor() {
    this.logger = new SupabaseEventLogger();
    this.startFlushTimer();
  }

  private startFlushTimer(): void {
    this.flushTimerId = setInterval(() => {
      this.flush().catch(err => console.error("EventQueue: Error during scheduled flush:", err));
    }, STEALTH_ASSESSMENT_CONFIG.flushInterval);
  }

  async addEvent(event: InteractionEvent): Promise<void> {
    this.queue.push(event);
    console.log('EventQueue: Event added to queue:', event.type, event.eventId);

    // --- Integration with Learner Profile ---
    if (event.type === InteractionEventType.QUESTION_ATTEMPT) {
      const questionEvent = event as QuestionAttemptEvent;
      const { userId, knowledgeComponentIds, isCorrect, attemptsMade, timeTakenMs, timestamp } = questionEvent;

      if (userId && knowledgeComponentIds && knowledgeComponentIds.length > 0) {
        for (const kcId of knowledgeComponentIds) {
          const updateData: KCMasteryUpdateData = {
            success: isCorrect,
            attemptsInInteraction: attemptsMade, // This is attempts on the question, which we'll count as 1 attempt for the KC for this interaction
            timeTakenMs: timeTakenMs,
            // hintsUsed is not directly on QuestionAttemptEvent, might be part of a richer payload if logEvent was used directly
            // For now, we'll omit it or set to 0. The KCMasteryUpdateData makes it optional.
            hintsUsed: (event as any).payload?.hintsUsed || (event as any).hintsUsed || 0, // Try to get it if it exists on a more general payload
            timestamp: new Date(timestamp).toISOString(), // Convert number timestamp to ISO string
            eventType: InteractionEventType.QUESTION_ATTEMPT,
            details: { questionId: questionEvent.questionId, answerGiven: questionEvent.answerGiven }
          };
          try {
            console.log(`EventQueue: Triggering KC mastery update for KC ${kcId}, User ${userId}`);
            await mockProfileService.updateKCMastery(userId, kcId, updateData);
          } catch (error) {
            console.error(`EventQueue: Error updating KC mastery for KC ${kcId}, User ${userId}:`, error);
          }
        }
      }
    }
    // --- End Integration ---

    // Flush immediately if we have reached the threshold
    if (this.queue.length >= STEALTH_ASSESSMENT_CONFIG.immediateFlushThreshold) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0 || this.isFlushing) {
      return;
    }
    this.isFlushing = true;

    const eventsToFlush = [...this.queue];
    this.queue = [];

    try {
      await this.logger.flushEventBatch(eventsToFlush);
    } catch (error) {
      console.error('EventQueue: Error during flush, re-adding events to queue:', error);
      // Re-add events to queue for retry
      this.queue.unshift(...eventsToFlush);
    } finally {
      this.isFlushing = false;
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  destroy(): void {
    if (this.flushTimerId) {
      clearInterval(this.flushTimerId);
    }
    this.flush().catch(err => console.error("EventQueue: Error on final flush:", err));
  }

  // --- Methods for debugging/testing ---
  /**
   * Returns a copy of the current events in the queue.
   * Does not clear the queue.
   */
  public getEvents(): InteractionEvent[] {
    return [...this.queue]; // Return a copy
  }

  /**
   * Clears all events from the queue without flushing them.
   * Useful for test setup/teardown.
   */
  public clearEvents(): void {
    this.queue = [];
    console.log('EventQueue: Events cleared from queue (manual)');
  }
}
