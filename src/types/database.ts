export interface GameAssignment {
  id: string;
  teacher_id: string;
  game_id: string;
  subject: string;
  skill_area?: string;
  learning_objective?: string;
  assigned_to_class?: string;
  assigned_to_students?: string[];
  due_date?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  game_id: string;
  assignment_id?: string;
  subject: string;
  skill_area?: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  score?: number;
  completion_status?: 'in_progress' | 'completed' | 'abandoned';
  learning_objectives_met?: string[];
  engagement_metrics?: any;
  performance_data?: any;
  created_at: string;
}

export interface CalendarEventRecord {
  id: number;
  date: string;
  layer: string;
  title: string;
  description?: string | null;
  visibility?: any;
  editable_by?: any;
  created_at: string;
  updated_at: string;
}

export interface KeywordEventRecord {
  id: number;
  calendar_event_id: number;
  keyword: string;
  date_start: string;
  date_end: string;
  scope_type: 'school' | 'year' | 'class' | 'custom';
  scope_target?: any;
  created_by?: number | null;
  created_at: string;
  updated_at: string;
}
