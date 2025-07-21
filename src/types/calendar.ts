export type CalendarLayer = 'birthday' | 'holiday' | 'general' | 'league' | 'internal' | 'keyword';
export type KeywordScopeType = 'school' | 'year' | 'class' | 'custom';

export interface CalendarEvent {
  id: string;
  layer: CalendarLayer;
  title: string;
  description?: string | null;
  start_date: string; // ISO date
  end_date: string;   // ISO date
  keywords?: string[] | null;
  scope_type: KeywordScopeType;
  scope_target?: string[] | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}
