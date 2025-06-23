
export interface DailyLessonConfig {
  subject: string;
  skillArea: string;
  userId: string;
  gradeLevel: number;
  currentDate: string;
}

export interface StudentProgressData {
  userId: string;
  subject: string;
  skillArea: string;
  currentLevel: number;
  strengths: string[];
  weaknesses: string[];
  recentPerformance: number[];
  preferredLearningStyle: string;
}

export interface CurriculumFocusArea {
  name: string;
  description: string;
  concepts: string[];
  skills: string[];
  examples: string[];
}
