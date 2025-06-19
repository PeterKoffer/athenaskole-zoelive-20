// Analytics type definitions for adaptive learning components
// Based on Supabase database table structures

/**
 * Session data structure based on learning_sessions table
 */
export interface SessionData {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  start_time: string;
  end_time: string | null;
  time_spent: number | null;
  score: number | null;
  completed: boolean;
  content_id: string | null;
  user_feedback: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Concept mastery data structure based on concept_mastery table
 */
export interface ConceptMasteryData {
  id: string;
  user_id: string;
  concept_name: string;
  subject: string;
  mastery_level: number | null;
  practice_count: number | null;
  correct_attempts: number | null;
  total_attempts: number | null;
  first_exposure: string | null;
  last_practice: string | null;
  decay_factor: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * User performance data structure based on user_performance table
 */
export interface UserPerformanceData {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  current_level: number;
  accuracy_rate: number;
  attempts_count: number;
  completion_time_avg: number;
  last_assessment: string;
  engagement_score: number | null;
  retention_rate: number | null;
  learning_style: string | null;
  preferred_pace: string | null;
  strengths: Record<string, unknown> | null;
  weaknesses: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Weekly progress data structure for processed analytics
 */
export interface WeeklyProgressData {
  week: string;
  sessions: number;
  avgScore: number;
  totalTime: number;
}

/**
 * Performance metrics calculation data
 */
export interface PerformanceMetrics {
  accuracy: number;
  responseTime: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  recentSessions: SessionData[];
}