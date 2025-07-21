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
  id: string;
  layer: 'birthday' | 'holiday' | 'general' | 'league' | 'internal' | 'keyword';
  title: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  keywords?: string[] | null;
  scope_type: 'school' | 'year' | 'class' | 'custom';
  scope_target?: string[] | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}
