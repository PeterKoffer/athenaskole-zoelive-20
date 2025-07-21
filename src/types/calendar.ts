export type CalendarLayer =
  | 'birthday'
  | 'holiday'
  | 'general'
  | 'league'
  | 'internal'
  | 'keyword';

export type KeywordScopeType = 'school' | 'year' | 'class' | 'custom';

export interface CalendarEvent {
  id: number;
  date: string; // ISO date
  layer: CalendarLayer;
  title: string;
  description?: string | null;
  visibility?: any;
  editable_by?: any;
  created_at: string;
  updated_at: string;
}

export interface KeywordEvent {
  id: number;
  calendar_event_id: number;
  keyword: string;
  date_start: string;
  date_end: string;
  scope_type: KeywordScopeType;
  scope_target?: any;
  created_by?: number | null;
  created_at: string;
  updated_at: string;
}
