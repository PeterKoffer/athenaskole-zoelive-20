
// src/services/stealthAssessment/eventQueue.ts

import { InteractionEvent } from '@/types/stealthAssessment';
import { SupabaseEventLogger } from './supabaseEventLogger';
import { STEALTH_ASSESSMENT_CONFIG } from './config';

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
