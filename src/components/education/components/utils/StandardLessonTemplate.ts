import { LessonActivity, SubjectLessonPlan } from '../types/LessonTypes';

/**
 * Standard 20-minute lesson structure timing constraints (in seconds)
 * Total: 1200 seconds (20 minutes)
 */
export const STANDARD_LESSON_TIMING = {
  introduction: { min: 120, max: 180, target: 150 }, // 2-3 minutes
  contentDelivery: { min: 300, max: 420, target: 330 }, // 5-7 minutes (split across segments)
  interactiveGame: { min: 240, max: 300, target: 270 }, // 4-5 minutes
  application: { min: 180, max: 240, target: 210 }, // 3-4 minutes
  creativeExploration: { min: 120, max: 180, target: 150 }, // 2-3 minutes
  summary: { min: 60, max: 120, target: 90 }, // 1-2 minutes
  total: 1200 // 20 minutes exactly
};

export interface StandardLessonConfig {
  subject: string;
  skillArea: string;
  learningObjectives: string[];
  prerequisites: string[];
  
  // Introduction phase
  hook: string;
  realWorldExample: string;
  thoughtQuestion: string;
  
  // Content delivery (can be split into multiple segments)
  contentSegments: Array<{
    concept: string;
    explanation: string;
    checkQuestion: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    };
  }>;
  
  // Interactive game
  gameType: 'fill-blanks' | 'drag-drop' | 'true-false' | 'matching' | 'problem-solving';
  gameInstructions: string;
  gameQuestion: string;
  gameOptions: string[];
  gameCorrectAnswer: number;
  gameExplanation: string;
  
  // Application phase
  applicationScenario: string;
  problemSteps: Array<{
    step: string;
    hint?: string;
    solution: string;
  }>;
  
  // Creative exploration
  creativePrompt: string;
  whatIfScenario: string;
  explorationTask: string;
  
  // Summary
  keyTakeaways: string[];
  selfAssessment: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  nextTopicSuggestion: string;
}

/**
 * Creates a standardized 20-minute lesson plan from configuration
 */
export function createStandardLesson(config: StandardLessonConfig): SubjectLessonPlan {
  // Calculate content delivery timing per segment
  const totalContentTime = STANDARD_LESSON_TIMING.contentDelivery.target;
  const segmentTime = Math.floor(totalContentTime / config.contentSegments.length);
  
  const activities: LessonActivity[] = [
    // Phase 1: Engaging Introduction (2-3 min)
    {
      id: `${config.subject}-introduction`,
      type: 'introduction',
      phase: 'introduction',
      title: `Welcome to ${config.skillArea}`,
      duration: STANDARD_LESSON_TIMING.introduction.target,
      phaseDescription: 'Discover connections between learning and real life',
      content: {
        hook: config.hook,
        realWorldExample: config.realWorldExample,
        thoughtQuestion: config.thoughtQuestion
      }
    },
    
    // Phase 2: Core Content Delivery (5-7 min total, split into segments)
    ...config.contentSegments.map((segment, index) => ({
      id: `${config.subject}-content-${index + 1}`,
      type: 'content-delivery' as const,
      phase: 'content-delivery' as const,
      title: segment.concept,
      duration: segmentTime,
      phaseDescription: 'Master key concepts with active learning checks',
      content: {
        segments: [{
          concept: segment.concept,
          explanation: segment.explanation,
          checkQuestion: segment.checkQuestion
        }]
      }
    })),
    
    // Phase 3: Interactive Learning Game (4-5 min)
    {
      id: `${config.subject}-interactive-game`,
      type: 'interactive-game',
      phase: 'interactive-game',
      title: 'Interactive Learning Challenge',
      duration: STANDARD_LESSON_TIMING.interactiveGame.target,
      phaseDescription: 'Engage with concepts through fun, interactive activities',
      content: {
        gameType: config.gameType,
        gameInstructions: config.gameInstructions,
        question: config.gameQuestion,
        options: config.gameOptions,
        correctAnswer: config.gameCorrectAnswer,
        explanation: config.gameExplanation
      }
    },
    
    // Phase 4: Application & Problem-Solving (3-4 min)
    {
      id: `${config.subject}-application`,
      type: 'application',
      phase: 'application',
      title: 'Real-World Application',
      duration: STANDARD_LESSON_TIMING.application.target,
      phaseDescription: 'Apply learning to authentic, meaningful scenarios',
      content: {
        scenario: config.applicationScenario,
        problemSteps: config.problemSteps
      }
    },
    
    // Phase 5: Creative/Exploratory Element (2-3 min)
    {
      id: `${config.subject}-creative-exploration`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      title: 'Creative Exploration & Innovation',
      duration: STANDARD_LESSON_TIMING.creativeExploration.target,
      phaseDescription: 'Explore deeper connections and creative applications',
      content: {
        creativePrompt: config.creativePrompt,
        whatIfScenario: config.whatIfScenario,
        explorationTask: config.explorationTask
      }
    },
    
    // Phase 6: Summary & Next Steps (1-2 min)
    {
      id: `${config.subject}-summary`,
      type: 'summary',
      phase: 'summary',
      title: 'Learning Summary & Growth Path',
      duration: STANDARD_LESSON_TIMING.summary.target,
      phaseDescription: 'Consolidate understanding and plan continued learning',
      content: {
        keyTakeaways: config.keyTakeaways,
        selfAssessment: config.selfAssessment,
        nextTopicSuggestion: config.nextTopicSuggestion
      }
    }
  ];
  
  return {
    subject: config.subject,
    skillArea: config.skillArea,
    totalDuration: STANDARD_LESSON_TIMING.total,
    phases: activities,
    learningObjectives: config.learningObjectives,
    prerequisites: config.prerequisites
  };
}

/**
 * Validates that a lesson meets the standard 20-minute structure requirements
 */
export function validateStandardLesson(lesson: SubjectLessonPlan): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check total duration
  if (lesson.totalDuration !== STANDARD_LESSON_TIMING.total) {
    errors.push(`Total duration must be exactly ${STANDARD_LESSON_TIMING.total} seconds (20 minutes), got ${lesson.totalDuration}`);
  }
  
  // Check phase structure
  const requiredPhases = ['introduction', 'content-delivery', 'interactive-game', 'application', 'creative-exploration', 'summary'];
  const actualPhases = lesson.phases.map(phase => phase.phase);
  
  for (const requiredPhase of requiredPhases) {
    if (!actualPhases.includes(requiredPhase as any)) {
      errors.push(`Missing required phase: ${requiredPhase}`);
    }
  }
  
  // Check individual phase durations
  const phaseTimings = lesson.phases.reduce((acc, phase) => {
    acc[phase.phase] = (acc[phase.phase] || 0) + phase.duration;
    return acc;
  }, {} as Record<string, number>);
  
  for (const [phase, timing] of Object.entries(phaseTimings)) {
    const constraints = STANDARD_LESSON_TIMING[phase as keyof typeof STANDARD_LESSON_TIMING];
    if (constraints && typeof constraints === 'object') {
      if (timing < constraints.min || timing > constraints.max) {
        warnings.push(`Phase '${phase}' duration ${timing}s is outside recommended range ${constraints.min}-${constraints.max}s`);
      }
    }
  }
  
  // Check actual total matches sum of phases
  const calculatedTotal = lesson.phases.reduce((sum, phase) => sum + phase.duration, 0);
  if (calculatedTotal !== lesson.totalDuration) {
    errors.push(`Sum of phase durations (${calculatedTotal}s) doesn't match declared total duration (${lesson.totalDuration}s)`);
  }
  
  // Check content structure requirements
  const introPhase = lesson.phases.find(p => p.phase === 'introduction');
  if (introPhase && (!introPhase.content.hook || !introPhase.content.realWorldExample || !introPhase.content.thoughtQuestion)) {
    warnings.push('Introduction phase should include hook, realWorldExample, and thoughtQuestion');
  }
  
  const gamePhase = lesson.phases.find(p => p.phase === 'interactive-game');
  if (gamePhase && (!gamePhase.content.gameType || !gamePhase.content.gameInstructions)) {
    warnings.push('Interactive game phase should include gameType and gameInstructions');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}