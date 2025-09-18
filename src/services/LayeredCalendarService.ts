import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  CalendarShare, 
  LayeredEvent, 
  EventShare,
  CalendarSubscription,
  CreateCalendarData,
  CreateEventData,
  CreateShareData,
  UserRole
} from '@/types/layered-calendar';

export class LayeredCalendarService {
  private async authCheck() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user;
  }

  // Calendar management
  async getCalendars(): Promise<Calendar[]> {
    await this.authCheck();
    const { data, error } = await supabase
      .from('calendars')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createCalendar(calendarData: CreateCalendarData): Promise<Calendar> {
    const user = await this.authCheck();
    const { data, error } = await supabase
      .from('calendars')
      .insert({
        ...calendarData,
        owner_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCalendar(id: string, updates: Partial<CreateCalendarData>): Promise<Calendar> {
    await this.authCheck();
    const { data, error } = await supabase
      .from('calendars')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteCalendar(id: string): Promise<void> {
    await this.authCheck();
    const { error } = await supabase
      .from('calendars')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Calendar sharing
  async shareCalendar(calendarId: string, shareData: CreateShareData): Promise<CalendarShare> {
    await this.authCheck();
    const { data, error } = await supabase
      .from('calendar_shares')
      .insert({
        calendar_id: calendarId,
        ...shareData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getCalendarShares(calendarId: string): Promise<CalendarShare[]> {
    await this.authCheck();
    const { data, error } = await supabase
      .from('calendar_shares')
      .select('*')
      .eq('calendar_id', calendarId);
    
    if (error) throw error;
    return data || [];
  }

  async removeCalendarShare(shareId: string): Promise<void> {
    await this.authCheck();
    const { error } = await supabase
      .from('calendar_shares')
      .delete()
      .eq('id', shareId);
    
    if (error) throw error;
  }

  // Event management
  async getEvents(startDate: string, endDate: string): Promise<LayeredEvent[]> {
    await this.authCheck();
    const { data, error } = await supabase
      .from('layered_events')
      .select(`
        *,
        calendars!inner(*)
      `)
      .gte('start_time', startDate)
      .lte('end_time', endDate)
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createEvent(eventData: CreateEventData): Promise<LayeredEvent> {
    const user = await this.authCheck();
    const { data, error } = await supabase
      .from('layered_events')
      .insert({
        ...eventData,
        created_by: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateEvent(id: string, updates: Partial<CreateEventData>): Promise<LayeredEvent> {
    await this.authCheck();
    const { data, error } = await supabase
      .from('layered_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteEvent(id: string): Promise<void> {
    await this.authCheck();
    const { error } = await supabase
      .from('layered_events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Event sharing
  async shareEvent(eventId: string, shareData: CreateShareData): Promise<EventShare> {
    await this.authCheck();
    const { data, error } = await supabase
      .from('event_shares')
      .insert({
        event_id: eventId,
        ...shareData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Subscriptions
  async subscribeToCalendar(calendarId: string): Promise<CalendarSubscription> {
    const user = await this.authCheck();
    const { data, error } = await supabase
      .from('calendar_subscriptions')
      .insert({
        user_id: user.id,
        calendar_id: calendarId,
        is_visible: true
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateSubscription(calendarId: string, isVisible: boolean): Promise<void> {
    const user = await this.authCheck();
    const { error } = await supabase
      .from('calendar_subscriptions')
      .update({ is_visible: isVisible })
      .eq('user_id', user.id)
      .eq('calendar_id', calendarId);
    
    if (error) throw error;
  }

  async getSubscriptions(): Promise<CalendarSubscription[]> {
    const user = await this.authCheck();
    const { data, error } = await supabase
      .from('calendar_subscriptions')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) throw error;
    return data || [];
  }

  // User roles and permissions
  async getUserRole(): Promise<UserRole | null> {
    const user = await this.authCheck();
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (error) return null;
    return data?.role || null;
  }

  async getUserClasses(): Promise<string[]> {
    const user = await this.authCheck();
    const { data, error } = await supabase
      .from('class_memberships')
      .select('class_id')
      .eq('user_id', user.id);
    
    if (error) return [];
    return data?.map(m => m.class_id) || [];
  }

  // Helper methods for creating common calendar setups
  async createPersonalCalendar(name: string = 'My Calendar'): Promise<Calendar> {
    return this.createCalendar({
      name,
      calendar_type: 'personal',
      color: '#3b82f6'
    });
  }

  async createClassCalendar(className: string, classId: string): Promise<Calendar> {
    const calendar = await this.createCalendar({
      name: `${className} Calendar`,
      calendar_type: 'class',
      color: '#10b981',
      metadata: { class_id: classId }
    });

    // Share with class members (view) and teachers (edit)
    await this.shareCalendar(calendar.id, {
      share_type: 'class',
      share_target: classId,
      permission: 'view'
    });

    await this.shareCalendar(calendar.id, {
      share_type: 'role',
      share_target: 'teacher',
      permission: 'edit'
    });

    await this.shareCalendar(calendar.id, {
      share_type: 'role',
      share_target: 'parent',
      permission: 'view'
    });

    return calendar;
  }
}

export const layeredCalendarService = new LayeredCalendarService();