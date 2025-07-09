
// Simplified Supabase Event Logger (Mock Implementation)

export interface InteractionEvent {
  id?: string;
  user_id: string;
  session_id: string;
  event_type: string;
  event_data: any;
  timestamp: string;
  context?: any;
}

export class SupabaseEventLogger {
  private events: InteractionEvent[] = [];

  async logEvent(event: Omit<InteractionEvent, 'id' | 'timestamp'>): Promise<string | null> {
    try {
      console.log('📊 [SupabaseEventLogger] Logging event:', event.event_type);
      
      const fullEvent: InteractionEvent = {
        ...event,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
      
      // Store in memory for now (since we don't have the database table)
      this.events.push(fullEvent);
      
      console.log('✅ [SupabaseEventLogger] Event logged successfully:', fullEvent.id);
      return fullEvent.id;
    } catch (error) {
      console.error('❌ [SupabaseEventLogger] Failed to log event:', error);
      return null;
    }
  }

  async getEvents(userId: string, sessionId?: string): Promise<InteractionEvent[]> {
    try {
      console.log('📋 [SupabaseEventLogger] Retrieving events for user:', userId);
      
      let filteredEvents = this.events.filter(event => event.user_id === userId);
      
      if (sessionId) {
        filteredEvents = filteredEvents.filter(event => event.session_id === sessionId);
      }
      
      console.log('✅ [SupabaseEventLogger] Retrieved events:', filteredEvents.length);
      return filteredEvents;
    } catch (error) {
      console.error('❌ [SupabaseEventLogger] Failed to retrieve events:', error);
      return [];
    }
  }

  async flushEventBatch(events: any[]): Promise<boolean> {
    try {
      console.log('🔄 [SupabaseEventLogger] Flushing event batch:', events.length);
      // In a real implementation, this would send events to Supabase
      return true;
    } catch (error) {
      console.error('❌ [SupabaseEventLogger] Failed to flush event batch:', error);
      return false;
    }
  }

  getStoredEventsCount(): number {
    return this.events.length;
  }

  clearEvents(): void {
    this.events = [];
    console.log('🧹 [SupabaseEventLogger] Events cleared');
  }
}

export const supabaseEventLogger = new SupabaseEventLogger();
