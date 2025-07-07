
// src/services/stealthAssessment/eventQueue.ts

import { supabaseEventLogger } from './supabaseEventLogger';
import { STEALTH_ASSESSMENT_CONFIG } from './config';

// Simple event interface for queue compatibility
interface QueueEvent {
  type: string;
  eventId: string;
  timestamp: number;
  userId: string;
  sessionId?: string;
  data: any;
}

export class EventQueue {
  private queue: QueueEvent[] = [];
  private flushTimerId?: NodeJS.Timeout;
  private isFlushing = false;

  constructor() {
    this.startFlushTimer();
  }

  private startFlushTimer(): void {
    this.flushTimerId = setInterval(() => {
      this.flush().catch(err => console.error("EventQueue: Error during scheduled flush:", err));
    }, STEALTH_ASSESSMENT_CONFIG.flushInterval);
  }

  async addEvent(event: QueueEvent): Promise<void> {
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
      // Convert to format expected by supabaseEventLogger
      const convertedEvents = eventsToFlush.map(event => ({
        user_id: event.userId,
        session_id: event.sessionId || 'default',
        event_type: event.type,
        event_data: event.data,
        timestamp: new Date(event.timestamp).toISOString()
      }));

      await supabaseEventLogger.flushEventBatch(convertedEvents);
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
}
