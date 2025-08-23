export interface AdminStats {
  totalSchools: number;
  totalUsers: number;
  totalStudents: number;
  systemUptime: number;
}

// Minimal LearnerProfile types to satisfy imports across the app
export interface LearnerPreferences {
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed' | string;
  preferredSubjects?: string[];
  interests?: string[];
  difficultyPreference?: number; // 1-5 scale
  sessionLength?: number; // in minutes
}

export interface LearnerProfile {
  userId: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  avatarColor?: string; // gradient token like 'from-purple-400 to-cyan-400'
  // Canonical fields used across the app
  grade_level?: number | string;
  learning_style_preference?: string;
  birth_date?: string;
  address?: string;
  grade?: string;
  school?: string;
  overall_mastery?: number;
  overallMastery?: number;
  kc_masteries?: any[];
  kcMasteryMap?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  recentPerformance?: any[];
  lastUpdatedTimestamp?: number;
  createdAt?: number;
  aggregateMetrics?: {
    overallMastery: number;
    completedKCs: number;
    totalKCsAttempted: number;
  };
  interests?: string[];
  preferences?: LearnerPreferences;
  performance_data?: Record<string, any>;
}

export interface KnowledgeComponentMastery {
  componentId: string;
  mastery: number; // 0-1
  lastUpdated?: string;
}

export interface KCMasteryUpdateData {
  userId: string;
  componentId: string;
  delta: number;
}
