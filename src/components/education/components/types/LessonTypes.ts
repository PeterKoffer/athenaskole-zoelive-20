
export type ActivityType = 
  | 'introduction'
  | 'interactive-game'
  | 'creative-exploration'
  | 'application'
  | 'summary'
  | 'simulation'
  | 'quiz'
  | 'content-delivery'
  | 'educational-game';

export type ActivityPhase = 
  | 'introduction'
  | 'interactive-game'
  | 'creative-exploration'
  | 'application'
  | 'summary'
  | 'simulation'
  | 'quiz'
  | 'content-delivery';

export interface ContentSegment {
  explanation?: string;
  checkQuestion?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface SelfAssessment {
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
}

export interface ProblemStep {
  step: string;
  hint?: string;
  solution?: string;
}

export interface LessonActivityContent {
  text?: string;
  question?: string;
  options?: string[];
  choices?: string[];
  correctAnswer?: number;
  correct?: number;
  explanation?: string;
  title?: string;
  battleScenario?: string;
  activityId?: string;
  questionText?: string;
  scenario?: string;
  task?: string;
  keyTakeaways?: string[];
  nextTopicSuggestion?: string;
  hook?: string;
  message?: string;
  creativePrompt?: string;
  whatIfScenario?: string;
  explorationTask?: string;
  
  // Game-specific properties
  gameType?: string;
  description?: string;
  challenges?: string[];
  gameDescription?: string;
  mechanics?: string[];
  rewards?: string[];
  
  // Simulation-specific properties
  simulationType?: string;
  simulationDescription?: string;
  scenarios?: string[];
  
  // Battle-specific properties
  enemyName?: string;
  enemyHealth?: number;
  playerHealth?: number;
  attackOptions?: string[];
  
  // Character properties
  characterName?: string;
  characterRole?: string;
  characterIntroduction?: string;
  
  // Content delivery properties
  segments?: ContentSegment[];
  uniqueTheme?: string;
  uniqueScenario?: string;
  uniqueActivity?: string;
  
  // Educational properties
  examples?: string[];
  story?: string;
  
  // Puzzle properties
  puzzleDescription?: string;
  difficulty?: string;
  
  // Summary properties
  whatNext?: string;
  selfAssessment?: SelfAssessment;
  
  // Application properties
  problemSteps?: ProblemStep[];
  guidance?: string;
}

export interface LessonActivity {
  id: string;
  type: ActivityType;
  phase?: ActivityPhase;
  title: string;
  content: LessonActivityContent;
  duration: number;
  phaseDescription?: string;
  metadata?: {
    subject?: string;
    skillArea?: string;
    templateId?: string;
  };
}
