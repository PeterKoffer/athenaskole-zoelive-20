
export interface LessonActivity {
  id: string;
  type: 'introduction' | 'content-delivery' | 'interactive-game' | 'application' | 'creative-exploration' | 'summary';
  phase: 'introduction' | 'content-delivery' | 'interactive-game' | 'application' | 'creative-exploration' | 'summary';
  title: string;
  duration: number; // in seconds
  phaseDescription?: string;
  metadata?: {
    subject?: string;
    skillArea?: string;
    difficultyLevel?: number;
    templateId?: string;
    isExtension?: boolean;
    gradeLevel?: number;
  };
  content: {
    // Introduction phase
    hook?: string;
    realWorldExample?: string;
    thoughtQuestion?: string;
    
    // Content delivery phase
    text?: string;
    segments?: Array<{
      concept: string;
      explanation: string;
      checkQuestion?: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
      };
    }>;
    
    // Interactive game phase - EXTENDED
    gameType?: 'fill-blanks' | 'drag-drop' | 'true-false' | 'matching' | 'problem-solving' | 'adventure-game' | 'puzzle-quest' | 'creative-builder' | 'exploration-sim';
    gameInstructions?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
    correct?: number;
    explanation?: string;
    
    // Mini-game and puzzle specific properties
    gameDescription?: string;
    puzzleDescription?: string;
    
    // ENGAGING ACTIVITY PROPERTIES
    // Adventure Game properties
    scenario?: string;
    mechanics?: string;
    rewards?: string[];
    difficulty?: number;
    engagementHooks?: string[];
    interactionStyle?: string;
    celebrationLevel?: string;
    winCondition?: string;
    epicnessLevel?: string;
    
    // Puzzle Quest properties
    hintSystem?: boolean;
    progressTracking?: boolean;
    multipleApproaches?: boolean;
    celebrationAnimation?: boolean;
    
    // Creative properties
    creativeType?: 'draw' | 'build' | 'story' | 'design' | 'compose';
    buildingProject?: string;
    tools?: string[];
    collaborationFeatures?: boolean;
    shareGallery?: boolean;
    prideFactor?: string;
    
    // Discovery/Simulation properties
    simulationType?: string;
    realWorldConnections?: string[];
    interactiveElements?: string[];
    discoveryMode?: boolean;
    experimentFreedom?: boolean;
    
    // Story and Theme properties
    storyHook?: string;
    storyContext?: string;
    theme?: string;
    characterGuide?: string;
    characterIntroduction?: string;
    missionBriefing?: string;
    excitementBuilder?: string;
    excitementLevel?: string;
    
    // Enhanced content delivery properties
    concept?: string;
    interactiveExplanation?: string;
    quickChallenge?: {
      type: 'drag-drop' | 'click-reveal' | 'mini-puzzle' | 'matching';
      instruction: string;
      options: string[];
      correctAnswer: number | number[];
      celebration: string;
    };
    engagementType?: string;
    celebrationReady?: boolean;
    
    // Celebration and Achievement properties
    celebration?: string;
    achievementCelebration?: string;
    heroStatus?: string;
    badgesEarned?: string[];
    nextQuestTeaser?: string;
    nextAdventureTeaser?: string;
    
    // Creative expression properties
    creativePrompt?: string;
    prompt?: string;
    shareOpportunity?: boolean;
    inspirationBoost?: string;
    
    // Grand challenge properties
    grandChallenge?: {
      title: string;
      description: string;
      type: 'boss-battle' | 'final-project' | 'presentation' | 'epic-quest';
      celebration: string;
    };
    
    // Application phase
    task?: string;
    guidance?: string;
    problemSteps?: Array<{
      step: string;
      hint?: string;
      solution: string;
    }>;
    scenario?: string;
    
    // Creative exploration phase
    explorationTask?: string;
    whatIfScenario?: string;
    
    // Summary phase
    keyTakeaways?: string[];
    whatNext?: string;
    selfAssessment?: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    };
    nextTopicSuggestion?: string;
    achievementsList?: string[];
    
    // Legacy support
    message?: string;
    examples?: string[];
    story?: string;
  };
}

export interface SubjectLessonPlan {
  subject: string;
  skillArea: string;
  totalDuration: number; // 20 minutes = 1200 seconds
  phases: LessonActivity[];
  learningObjectives: string[];
  prerequisites: string[];
  // ENGAGING LESSON PROPERTIES
  engagementLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
  funFactor?: string;
}
