
export interface LessonActivity {
  id: string;
  type: 'introduction' | 'content-delivery' | 'interactive-game' | 'quiz' | 'creative-exploration' | 'application' | 'summary' | 'simulation';
  title: string;
  duration: number; // in seconds
  content: {
    text?: string;
    hook?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    segments?: Array<{
      explanation: string;
      visual?: string;
    }>;
    creativePrompt?: string;
    scenario?: string;
    keyTakeaways?: string[];
    simulationDescription?: string;
  };
  difficulty?: 'easy' | 'medium' | 'hard';
  subject?: string;
  skillArea?: string;
}

export interface LessonProgress {
  currentActivityIndex: number;
  totalActivities: number;
  score: number;
  timeElapsed: number;
  correctStreak: number;
}

export interface ClassroomSession {
  id: string;
  subject: string;
  skillArea: string;
  activities: LessonActivity[];
  startTime: Date;
  progress: LessonProgress;
  studentName: string;
}
