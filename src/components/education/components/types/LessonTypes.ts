
export interface LessonActivity {
  id: string;
  type: 'introduction' | 'content-delivery' | 'interactive-game' | 'quiz' | 'creative-exploration' | 'application' | 'summary' | 'simulation';
  title: string;
  duration: number; // in seconds
  phase?: string; // Add phase property for backward compatibility
  phaseDescription?: string; // Add phaseDescription property for backward compatibility
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
    mechanics?: any; // For game activities
    rewards?: any; // For adventure games
    problemSteps?: Array<{
      step: string;
      hint?: string;
      solution?: string;
    }>; // For application activities
    practiceExercises?: any[]; // For practice activities
    uniqueTheme?: string; // For content delivery activities
    questStep?: string; // For creative exploration
    questGoal?: string; // For creative exploration
    questReward?: string; // For creative exploration
    backgroundContext?: string; // For simulations
    interactionPrompts?: string[]; // For simulations
    learningCheckpoints?: Array<{
      concept: string;
      validation: string;
    }>; // For tracking learning
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
