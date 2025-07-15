
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
  title?: string;
  concept?: string;
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

export interface ScenarioItem {
  customer?: string;
  challenge?: string;
  reward?: string;
}

export interface GrandChallenge {
  title: string;
  description: string;
  type: 'boss-battle' | 'final-project' | 'presentation' | 'epic-quest';
  celebration: string;
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
  
  // Story and narrative properties
  storyHook?: string;
  storyContext?: string;
  celebration?: string;
  achievementCelebration?: string;
  excitementBuilder?: string;
  celebrationLevel?: string;
  
  // Game-specific properties
  gameType?: string;
  description?: string;
  challenges?: string[];
  gameDescription?: string;
  mechanics?: string[];
  rewards?: string[];
  winCondition?: string;
  epicnessLevel?: string;
  
  // Simulation-specific properties
  simulationType?: string;
  simulationDescription?: string;
  scenarios?: (string | ScenarioItem)[];
  
  // Battle-specific properties
  enemyName?: string;
  enemyHealth?: number;
  playerHealth?: number;
  attackOptions?: string[];
  
  // Character properties
  characterName?: string;
  characterRole?: string;
  characterIntroduction?: string;
  characterGuide?: string;
  
  // Content delivery properties
  segments?: ContentSegment[];
  uniqueTheme?: string;
  uniqueScenario?: string;
  uniqueActivity?: string;
  concept?: string;
  
  // Educational properties
  examples?: string[];
  story?: string;
  realWorldExample?: string;
  
  // Puzzle properties
  puzzleDescription?: string;
  difficulty?: string;
  
  // Summary properties
  whatNext?: string;
  selfAssessment?: SelfAssessment;
  achievementsList?: string[];
  
  // Application properties
  problemSteps?: ProblemStep[];
  guidance?: string;
  grandChallenge?: GrandChallenge;
  activityInstructions?: string;
  
  // Creative properties
  creativeType?: string;
  tools?: string[];
  shareOpportunity?: boolean;
  inspirationBoost?: string;
  
  // Additional properties found in the codebase
  theme?: string;
  heroStatus?: string;
  thoughtQuestion?: string;
  excitementLevel?: string;
  
  // Template-specific properties
  interactiveExplanation?: string;
  quickChallenge?: string;
  engagementType?: string;
  celebrationReady?: boolean;
  missionBriefing?: string;
}

export interface LessonActivity {
  id: string;
  type: ActivityType;
  phase?: ActivityPhase;
  title: string;
  content: LessonActivityContent;
  duration: number;
  phaseDescription?: string;
  games?: any[];
  metadata?: {
    subject?: string;
    skillArea?: string;
    templateId?: string;
    gradeLevel?: number;
    difficultyLevel?: number;
  };
}

export interface SubjectLessonPlan {
  id: string;
  title: string;
  subject: string;
  skillArea: string;
  gradeLevel: number;
  activities: LessonActivity[];
  estimatedDuration: number;
  learningObjectives: string[];
  totalDuration?: number;
  phases?: LessonActivity[];
  objectives?: string[];
  difficulty?: number;
  prerequisites?: string[];
  assessmentCriteria?: string[];
  extensions?: string[];
  engagementLevel?: string;
  funFactor?: string;
}
