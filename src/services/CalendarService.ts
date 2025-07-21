import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { CalendarEvent, CalendarLayer, KeywordScopeType } from '@/types/calendar';

export interface CreateCalendarEvent {
  layer: CalendarLayer;
  title: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  keywords?: string[] | null;
  scope_type?: KeywordScopeType;
  scope_target?: string[] | null;
}

class CalendarService {
  async listEvents(start: string, end: string) {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .lte('start_date', end)
      .gte('end_date', start);
    if (error) {
      console.error('Error fetching calendar events', error);
      return [];
    }
    return data as CalendarEvent[];
  }

  async createEvent(event: CreateCalendarEvent) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(event)
      .select()
      .single();
    if (error) {
      console.error('Error creating calendar event', error);
      return null;
    }
    return data as CalendarEvent;
  }

  async updateEvent(id: string, updates: Partial<CreateCalendarEvent>) {
    const { data, error } = await supabase
      .from('calendar_events')
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

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('calendar_events')
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
      .from('calendar_events')
      .select('keywords, scope_type, scope_target')
      .eq('layer', 'keyword')
      .lte('start_date', date)
      .gte('end_date', date);
    if (error || !data) {
      console.error('Error fetching keyword events', error);
      return [] as string[];
    }
    const keywords: string[] = [];
    data.forEach((row) => {
      const { keywords: k, scope_type, scope_target } = row as Database['public']['Tables']['calendar_events']['Row'];
      if (!k) return;
      switch (scope_type as KeywordScopeType) {
        case 'school':
          keywords.push(...k);
          break;
        case 'year':
          if (scope_target && scope_target.includes(String(grade))) {
            keywords.push(...k);
          }
          break;
        case 'class':
          if (scope_target && classes.some((c) => scope_target.includes(c))) {
            keywords.push(...k);
          }
          break;
        case 'custom':
          if (scope_target && classes.some((c) => scope_target.includes(c))) {
            keywords.push(...k);
          }
          break;
      }
    });
    return Array.from(new Set(keywords));
  }
}

export const calendarService = new CalendarService();
