
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
    templateId?: string;
    difficultyLevel?: number;
    isExtension?: boolean;
    gradeLevel?: number;
    concept?: string;
  };
  content: {
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
    message?: string;
    difficulty?: number;
    storyHook?: string;
    achievementCelebration?: string;
    celebration?: string;
    thoughtQuestion?: string;
    concept?: string;
    activityInstructions?: string;
    tools?: string[];
    realWorldExample?: string;
    hint?: string;
    storyContext?: string;
    theme?: string;
    characterGuide?: string;
    missionBriefing?: string;
    excitementLevel?: string;
    engagementType?: string;
    celebrationReady?: boolean;
    interactiveExplanation?: string;
    epicnessLevel?: string;
    winCondition?: string;
    inspirationBoost?: string;
    creativeType?: string;
    shareOpportunity?: boolean;
    grandChallenge?: any;
    achievementsList?: string[];
    nextAdventureTeaser?: string;
    heroStatus?: string;
    excitementBuilder?: string;
    celebrationLevel?: string;
    characterIntroduction?: string;
  };
}

export interface SubjectLessonPlan {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  totalDuration: number;
  phases: LessonActivity[];
  activities: LessonActivity[];
  estimatedDuration: number;
  objectives: string[];
  learningObjectives: string[];
  prerequisites: string[];
  difficulty: number;
  assessmentCriteria: string[];
  extensions: string[];
  engagementLevel?: string;
  funFactor?: string;
}
