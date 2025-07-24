
export interface LessonActivity {
  id: string;
  type: 'introduction' | 'content-delivery' | 'interactive-game' | 'quiz' | 'creative-exploration' | 'application' | 'summary' | 'simulation' | 'educational-game';
  title: string;
  duration: number; // in seconds
  phase?: string; // Add phase property for backward compatibility
  phaseDescription?: string; // Add phaseDescription property for backward compatibility
  metadata?: {
    subject?: string;
    skillArea?: string;
    templateId?: string;
    isIntroduction?: boolean;
    [key: string]: any;
  };
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
      concept?: string;
      checkQuestion?: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
      };
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
    uniqueScenario?: string; // For content delivery activities
    questStep?: string; // For creative exploration
    questGoal?: string; // For creative exploration
    questReward?: string; // For creative exploration
    backgroundContext?: string; // For simulations
    interactionPrompts?: string[]; // For simulations
    learningCheckpoints?: Array<{
      concept: string;
      validation: string;
    }>; // For tracking learning
    whatIfScenarios?: string[]; // For creative exploration
    brainstormPrompts?: string[]; // For creative exploration
    inspirationalExamples?: string[]; // For creative exploration
    whatIfScenario?: string; // Alternative for creative exploration (single)
    explorationTask?: string; // For creative exploration tasks
    examples?: string[]; // For explanation activities
    correct?: boolean; // For interactive games
    feedback?: string; // For interactive games
    nextChallenge?: string; // For interactive games
    battleScenario?: string; // For interactive quiz
    gameDescription?: string; // For mini games
    puzzleDescription?: string; // For puzzles
    instructions?: string; // For general instructions
    gameData?: any; // For game-specific data
    challenges?: any[]; // For challenge-based activities
    story?: string; // For story-based questions
    scenarios?: any[]; // Alternative to scenario (plural)
    takeaways?: string[]; // For summary activities
    whatNext?: string; // For summary next steps
    selfAssessment?: any; // For self-assessment activities
    message?: string; // For welcome activities
    gameType?: string; // For educational games
    description?: string; // General description field
    simulationType?: string; // For simulation activities
    task?: string; // For task-based activities
    nextTopicSuggestion?: string; // For enhanced activity renderer
    uniqueActivity?: string; // For stable activity quiz
    difficulty?: 'easy' | 'medium' | 'hard'; // For puzzle quest difficulty
    choices?: string[]; // For multiple choice questions
    guidance?: string; // For guidance-based activities
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

// Additional types
export interface ScenarioItem {
  id: string;
  description: string;
  outcome?: string;
  customer?: string;
  challenge?: string;
  reward?: string;
}
