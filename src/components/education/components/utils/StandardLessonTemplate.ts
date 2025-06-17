
import { LessonActivity } from '../types/LessonTypes';

export interface StandardLessonConfig {
  subject: string;
  skillArea: string;
  learningObjectives: string[];
  prerequisites: string[];
  
  // Phase 1: Introduction (2-3 min)
  hook: string;
  realWorldExample: string;
  thoughtQuestion: string;
  
  // Phase 2: Content Delivery (5-7 min, split into segments)
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
  
  // Phase 3: Interactive Game (4-5 min)
  gameType: 'problem-solving' | 'matching' | 'true-false' | 'adventure-game';
  gameInstructions: string;
  gameQuestion: string;
  gameOptions: string[];
  gameCorrectAnswer: number;
  gameExplanation: string;
  
  // Phase 4: Application (3-4 min)
  applicationScenario: string;
  problemSteps: Array<{
    step: string;
    solution: string;
  }>;
  
  // Phase 5: Creative Exploration (2-3 min)
  creativePrompt: string;
  whatIfScenario: string;
  explorationTask: string;
  
  // Phase 6: Summary (1-2 min)
  keyTakeaways: string[];
  selfAssessment: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  nextTopicSuggestion: string;
}

export interface StandardLesson {
  phases: LessonActivity[];
  totalDuration: number;
  metadata: {
    subject: string;
    skillArea: string;
    createdAt: string;
    version: string;
  };
}

export const createStandardLesson = (config: StandardLessonConfig): StandardLesson => {
  const lessonId = `lesson-${Date.now()}`;
  const phases: LessonActivity[] = [];

  // Phase 1: Engaging Introduction (2-3 minutes)
  phases.push({
    id: `${lessonId}-introduction`,
    title: `Welcome to ${config.subject}`,
    type: 'introduction',
    phase: 'introduction',
    duration: 150, // 2.5 minutes
    phaseDescription: 'Get excited about learning!',
    content: {
      hook: config.hook,
      realWorldExample: config.realWorldExample,
      thoughtQuestion: config.thoughtQuestion,
      text: config.hook
    }
  });

  // Phase 2: Content Delivery Segments (5-7 minutes total)  
  config.contentSegments.forEach((segment, index) => {
    phases.push({
      id: `${lessonId}-content-${index}`,
      title: segment.concept,
      type: 'content-delivery',
      phase: 'content-delivery',
      duration: Math.floor(400 / config.contentSegments.length), // Distribute 400 seconds
      phaseDescription: `Learn about ${segment.concept}`,
      content: {
        text: segment.explanation,
        concept: segment.concept,
        segments: [{
          concept: segment.concept,
          explanation: segment.explanation,
          checkQuestion: segment.checkQuestion
        }]
      }
    });

    // Add comprehension check question
    phases.push({
      id: `${lessonId}-check-${index}`,
      title: `Check: ${segment.concept}`,
      type: 'interactive-game',
      phase: 'interactive-game',
      duration: 60, // 1 minute per check
      phaseDescription: 'Quick understanding check',
      content: {
        question: segment.checkQuestion.question,
        options: segment.checkQuestion.options,
        correctAnswer: segment.checkQuestion.correctAnswer,
        explanation: segment.checkQuestion.explanation
      }
    });
  });

  // Phase 3: Interactive Learning Game (4-5 minutes)
  phases.push({
    id: `${lessonId}-game`,
    title: 'Interactive Challenge',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 270, // 4.5 minutes
    phaseDescription: config.gameInstructions,
    content: {
      question: config.gameQuestion,
      options: config.gameOptions,
      correctAnswer: config.gameCorrectAnswer,
      explanation: config.gameExplanation,
      gameType: config.gameType
    }
  });

  // Phase 4: Application & Problem-Solving (3-4 minutes)
  config.problemSteps.forEach((step, index) => {
    phases.push({
      id: `${lessonId}-application-${index}`,
      title: `Apply: Step ${index + 1}`,
      type: 'application',
      phase: 'application',
      duration: Math.floor(210 / config.problemSteps.length), // Distribute 3.5 minutes
      phaseDescription: step.step,
      content: {
        scenario: config.applicationScenario,
        task: step.step,
        solution: step.solution,
        text: `${step.step}\n\nSolution: ${step.solution}`
      }
    });
  });

  // Phase 5: Creative Exploration (2-3 minutes)
  phases.push({
    id: `${lessonId}-creative`,
    title: 'Creative Exploration',
    type: 'creative-exploration',
    phase: 'creative-exploration',
    duration: 150, // 2.5 minutes
    phaseDescription: 'Think creatively and explore!',
    content: {
      creativePrompt: config.creativePrompt,
      whatIfScenario: config.whatIfScenario,
      explorationTask: config.explorationTask,
      text: config.creativePrompt
    }
  });

  // Phase 6: Summary & Assessment (1-2 minutes)
  phases.push({
    id: `${lessonId}-summary`,
    title: 'Lesson Summary',
    type: 'summary',
    phase: 'summary',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Review what we learned',
    content: {
      keyTakeaways: config.keyTakeaways,
      nextTopicSuggestion: config.nextTopicSuggestion,
      text: `Key takeaways: ${config.keyTakeaways.join(', ')}`
    }
  });

  phases.push({
    id: `${lessonId}-assessment`,
    title: 'Self-Assessment',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Check your understanding',
    content: {
      question: config.selfAssessment.question,
      options: config.selfAssessment.options,
      correctAnswer: config.selfAssessment.correctAnswer,
      explanation: config.selfAssessment.explanation
    }
  });

  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);

  return {
    phases,
    totalDuration,
    metadata: {
      subject: config.subject,
      skillArea: config.skillArea,
      createdAt: new Date().toISOString(),
      version: '1.0'
    }
  };
};

// Add the missing validation function
export const validateStandardLesson = (lesson: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!lesson.phases || lesson.phases.length === 0) {
    errors.push('Lesson must have phases');
  }

  if (lesson.totalDuration < 1000 || lesson.totalDuration > 1500) {
    warnings.push(`Total duration ${lesson.totalDuration}s is outside recommended 16-25 minute range`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
