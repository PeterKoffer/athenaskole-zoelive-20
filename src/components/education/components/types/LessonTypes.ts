

export interface LessonActivity {
  id: string;
  title: string;
  type: 'introduction' | 'interactive-game' | 'creative-exploration' | 'application' | 'summary' | 'simulation' | 'quiz' | 'content-delivery';
  phase: string;
  duration: number;
  phaseDescription: string;
  metadata: {
    subject: string;
    skillArea: string;
    templateId?: string; // Optional template identifier
  };
  content: {
    text?: string;
    question?: string;
    options?: string[];
    choices?: string[];
    correctAnswer?: number;
    correct?: number; // Alternative property name used by some components
    explanation?: string;
    title?: string;
    battleScenario?: string;
    activityId?: string;
    questionText?: string;
    creativePrompt?: string;
    whatIfScenario?: string;
    explorationTask?: string;
    scenario?: string;
    scenarios?: Array<{
      customer: string;
      challenge: string;
      reward: string;
    }>;
    task?: string;
    guidance?: string;
    keyTakeaways?: string[];
    nextTopicSuggestion?: string;
    gameType?: string;
    quickChallenge?: string;
    simulationDescription?: string;
    segments?: Array<{
      title: string;
      explanation: string;
      concept?: string;
      checkQuestion?: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
      };
    }>;
    // Additional properties used throughout the codebase
    hook?: string;
    uniqueTheme?: string;
    uniqueScenario?: string;
    uniqueActivity?: string;
    uniqueContext?: string;
    mechanics?: string[];
    rewards?: string[];
    problemSteps?: Array<{
      step: string;
      hint?: string;
      solution?: string;
    }>;
    // Properties for various activity types
    examples?: string[];
    story?: string;
    gameDescription?: string;
    puzzleDescription?: string;
    whatNext?: string;
    selfAssessment?: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    };
    // Additional missing properties
    message?: string; // Used in ActivityWelcome
    difficulty?: number; // Used in PuzzleQuestBriefing
    storyHook?: string; // Used in EngagingLessonGenerator
    achievementCelebration?: string; // Used in EngagingLessonGenerator
    celebration?: string; // Used in EngagingLessonGenerator
    // New properties for factory files
    thoughtQuestion?: string;
    concept?: string;
    activityInstructions?: string;
    tools?: string[];
    // Additional properties found in StandardLessonTemplate
    realWorldExample?: string;
    hint?: string;
    storyContext?: string;
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

