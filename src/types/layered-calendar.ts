export type UserRole = 'student' | 'parent' | 'teacher' | 'staff' | 'leader';
export type CalendarType = 'personal' | 'class' | 'school' | 'shared';
export type ShareType = 'user' | 'class' | 'role';
export type Permission = 'view' | 'edit';

export interface Calendar {
  id: string;
  name: string;
  description?: string | null;
  color: string | null;
  owner_id: string;
  calendar_type: string | null;
  metadata: any;
  created_at: string | null;
  updated_at: string | null;
}

export interface CalendarShare {
  id: string;
  calendar_id: string;
  share_type: string;
  share_target: string;
  permission: string;
  created_at: string | null;
}

export interface LayeredEvent {
  id: string;
  calendar_id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  all_day: boolean | null;
  location?: string | null;
  metadata: any;
  created_by?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface EventShare {
  id: string;
  event_id: string;
  share_type: string;
  share_target: string;
  permission: string;
  created_at: string | null;
}

export interface CalendarSubscription {
  id: string;
  user_id: string;
  calendar_id: string;
  is_visible: boolean | null;
  created_at: string | null;
}

export interface ClassMembership {
  id: string;
  user_id: string;
  class_id: string;
  role: string;
  created_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface CreateCalendarData {
  name: string;
  description?: string;
  color?: string;
  calendar_type?: CalendarType;
  metadata?: Record<string, any>;
}

export interface CreateEventData {
  calendar_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day?: boolean;
  location?: string;
  metadata?: Record<string, any>;
}

export interface CreateShareData {
  share_type: ShareType;
  share_target: string;
  permission: Permission;
}

export type CalendarView = 'day' | 'week' | 'year';