
export interface LessonActivity {
  id: string;
  type: 'introduction' | 'content-delivery' | 'interactive-game' | 'application' | 'creative-exploration' | 'summary';
  phase: 'introduction' | 'content-delivery' | 'interactive-game' | 'application' | 'creative-exploration' | 'summary';
  title: string;
  duration: number; // in seconds
  phaseDescription: string;
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
    
    // Interactive game phase
    gameType?: 'fill-blanks' | 'drag-drop' | 'true-false' | 'matching' | 'problem-solving';
    gameInstructions?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
    correct?: number;
    explanation?: string;
    
    // Application phase
    scenario?: string;
    problemSteps?: Array<{
      step: string;
      hint?: string;
      solution: string;
    }>;
    
    // Creative exploration phase
    creativePrompt?: string;
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
}
