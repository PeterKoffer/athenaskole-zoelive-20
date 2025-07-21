import { supabase, SUPABASE_URL } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { CalendarEvent, KeywordEvent, CalendarLayer, KeywordScopeType } from '@/types/calendar';

export interface CreateCalendarEvent {
  date: string;
  layer: CalendarLayer;
  title: string;
  description?: string | null;
  visibility?: any;
  editable_by?: any;
}

export interface CreateKeywordEvent {
  calendar_event_id: number;
  keyword: string;
  date_start: string;
  date_end: string;
  scope_type: KeywordScopeType;
  scope_target?: any;
  created_by?: number;
}

const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

class CalendarService {
  private async authHeader() {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async listEvents(start: string, end: string) {
    const headers = await this.authHeader();
    const res = await fetch(`${FUNCTIONS_URL}/calendar-events?start=${start}&end=${end}`, { headers });
    if (!res.ok) {
      console.error('Error fetching calendar events');
      return [];
    }
    return (await res.json()) as CalendarEvent[];
  }

  async createEvent(event: CreateCalendarEvent) {
    const headers = { ...(await this.authHeader()), 'Content-Type': 'application/json' };
    const res = await fetch(`${FUNCTIONS_URL}/calendar-events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event)
    });
    if (!res.ok) {
      console.error('Error creating calendar event');
      return null;
    }
    return (await res.json()) as CalendarEvent;
  }

  async createKeywordEvent(event: CreateKeywordEvent) {
    const headers = { ...(await this.authHeader()), 'Content-Type': 'application/json' };
    const res = await fetch(`${FUNCTIONS_URL}/keyword-events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event)
    });
    if (!res.ok) {
      console.error('Error creating keyword event');
      return null;
    }
    return (await res.json()) as KeywordEvent;
  }

  async updateKeywordEvent(id: number, updates: Partial<CreateKeywordEvent>) {
    const headers = { ...(await this.authHeader()), 'Content-Type': 'application/json' };
    const res = await fetch(`${FUNCTIONS_URL}/keyword-events/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      console.error('Error updating keyword event');
      return null;
    }
    return (await res.json()) as KeywordEvent;
  }

  async deleteKeywordEvent(id: number) {
    const headers = await this.authHeader();
    const res = await fetch(`${FUNCTIONS_URL}/keyword-events/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) {
      console.error('Error deleting keyword event');
      return false;
    }
    return true;
  }

  async getKeywordEventForCalendar(eventId: number) {
    const { data, error } = await supabase
      .from('keyword_event')
      .select('*')
      .eq('calendar_event_id', eventId)
      .single();
    if (error) return null;
    return data as KeywordEvent;
  }

  async updateEvent(id: number, updates: Partial<CreateCalendarEvent>) {
    const { data, error } = await supabase
      .from('calendar_event')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error updating calendar event', error);
      return null;
    }
    return data as CalendarEvent;
  }

  async deleteEvent(id: number) {
    const { error } = await supabase
      .from('calendar_event')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting calendar event', error);
      return false;
    }
    return true;
  }

  async getActiveKeywords(date: string, grade: number, classes: string[]) {
    const { data, error } = await supabase
      .from('keyword_event')
      .select('*')
      .lte('date_start', date)
      .gte('date_end', date);
    if (error || !data) {
      console.error('Error fetching keyword events', error);
      return [] as string[];
    }
    const keywords: string[] = [];
    data.forEach((row) => {
      const { keyword, scope_type, scope_target } = row as Database['public']['Tables']['keyword_event']['Row'];
      switch (scope_type as KeywordScopeType) {
        case 'school':
          keywords.push(keyword);
          break;
        case 'year':
          if (scope_target && (scope_target as string[]).includes(String(grade))) {
            keywords.push(keyword);
          }
          break;
        case 'class':
          if (scope_target && (scope_target as string[]).some((c) => classes.includes(c))) {
            keywords.push(keyword);
          }
          break;
        case 'custom':
          if (scope_target && (scope_target as string[]).some((c) => classes.includes(c))) {
            keywords.push(keyword);

          }
          break;
      }
    });
    return Array.from(new Set(keywords));
  }
}

export const calendarService = new CalendarService();
