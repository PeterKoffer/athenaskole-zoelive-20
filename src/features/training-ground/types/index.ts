export interface TrainingSession {
  id: string;
  subject: string;
  skillArea: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  activities: TrainingActivity[];
}

export interface TrainingActivity {
  id: string;
  type: 'video' | 'quiz' | 'interactive' | 'exercise';
  title: string;
  content: any;
  completed?: boolean;
}

export interface TrainingProgress {
  userId: string;
  subject: string;
  skillArea: string;
  completedActivities: string[];
  score?: number;
  timeSpent: number;
  lastActivity: Date;
}