
export interface SessionData {
  completed: boolean;
  content_id: string;
  created_at: string;
  difficulty_level: number;
  end_time: string;
  id: string;
  score: number;
  skill_area: string;
  start_time: string;
  subject: string;
  time_spent: number;
  user_feedback: Record<string, unknown>;
  user_id: string;
}

export interface UserPerformanceData {
  accuracy_rate: number;
  attempts_count: number;
  completion_time_avg: number;
  created_at: string;
  current_level: number;
  engagement_score: number;
  id: string;
  last_assessment: string;
  learning_style: string;
  skill_area: string;
  strengths: Record<string, unknown>;
  subject: string;
  updated_at: string;
  user_id: string;
  weaknesses: Record<string, unknown>;
}
