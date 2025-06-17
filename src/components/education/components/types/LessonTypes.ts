
export interface LessonActivity {
  id: string;
  type: 'introduction' | 'content-delivery' | 'interactive-game' | 'application' | 'creative-exploration' | 'summary';
  phase: 'introduction' | 'content-delivery' | 'interactive-game' | 'application' | 'creative-exploration' | 'summary';
  title: string;
  duration: number;
  phaseDescription: string;
  content: {
    // Content delivery fields
    text?: string;
    concept?: string;
    explanation?: string;
    segments?: Array<{
      concept: string;
      explanation: string;
      checkQuestion?: {
        question: string;
        options: readonly string[];
        correctAnswer: number;
        explanation: string;
      };
    }>;

    // Interactive game fields
    question?: string;
    options?: string[];
    correctAnswer?: number;
    gameType?: 'problem-solving' | 'matching' | 'true-false' | 'adventure-game';

    // Introduction fields
    hook?: string;
    realWorldExample?: string;
    thoughtQuestion?: string;
    storyContext?: string;
    theme?: string;
    characterGuide?: string;
    missionBriefing?: string;
    excitementLevel?: string;

    // Application fields
    scenario?: string;
    task?: string;
    hint?: string;
    solution?: string;
    problemSteps?: Array<{
      step: string;
      hint?: string;
      solution?: string;
    }>;

    // Creative exploration fields
    creativePrompt?: string;
    whatIfScenario?: string;
    explorationTask?: string;
    creativeType?: string;
    tools?: string[];
    shareOpportunity?: boolean;
    inspirationBoost?: string;

    // Summary fields
    keyTakeaways?: string[];
    nextTopicSuggestion?: string;
    achievementsList?: string[];
    celebration?: string;
    nextAdventureTeaser?: string;
    heroStatus?: string;

    // Game-specific fields
    mechanics?: string;
    winCondition?: string;
    rewards?: string[];
    epicnessLevel?: string;

    // Interactive elements
    quickChallenge?: {
      type: 'drag-drop' | 'click-reveal' | 'mini-puzzle' | 'matching';
      instruction: string;
      options: string[];
      correctAnswer: number | number[];
      celebration: string;
    };
    interactiveExplanation?: string;
    engagementType?: string;
    celebrationReady?: boolean;

    // Grand challenge fields
    grandChallenge?: {
      title: string;
      description: string;
      type: 'boss-battle' | 'final-project' | 'presentation' | 'epic-quest';
      celebration: string;
    };

    // Legacy and additional fields
    story?: string;
    image?: string;
    video?: string;
    audio?: string;
    interactiveElements?: any[];
    assessmentCriteria?: string[];
    
    [key: string]: any; // Allow additional properties for flexibility
  };
}

export interface SubjectLessonPlan {
  subject: string;
  skillArea: string;
  totalDuration: number;
  phases: LessonActivity[];
  learningObjectives: string[];
  prerequisites: string[];
  engagementLevel?: string;
  funFactor?: string;
}

export interface QuestionContent {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: number;
  concept?: string;
  timeLimit?: number;
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  topic: string;
}
