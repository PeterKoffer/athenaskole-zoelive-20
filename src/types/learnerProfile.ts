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
}

export interface LearnerProfile {
  userId: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  avatarColor?: string; // gradient token like 'from-purple-400 to-cyan-400'
  grade_level?: number | string;
  learning_style_preference?: string;
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
