
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
  
  // Simulation-specific properties
  simulationType?: string;
  
  // Battle-specific properties
  enemyName?: string;
  enemyHealth?: number;
  playerHealth?: number;
  attackOptions?: string[];
  
  // Character properties
  characterName?: string;
  characterRole?: string;
  characterIntroduction?: string;
}

export interface LessonActivity {
  id: string;
  type: ActivityType;
  phase?: ActivityPhase;
  title: string;
  content: LessonActivityContent;
  duration: number;
  phaseDescription?: string;
}
