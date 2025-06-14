
export interface DailyLessonConfig {
  subject: string;
  skillArea: string;
  userId: string;
  gradeLevel: number;
  currentDate: string;
}

export interface StudentProgressData {
  currentLevel: number;
  strengths: string[];
  weaknesses: string[];
  masteredConcepts: string[];
  overallAccuracy: number;
}
