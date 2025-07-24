// @ts-nocheck
import { LessonActivity, SubjectLessonPlan } from '../types/LessonTypes';

export interface EnhancedLessonConfig {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic';
  sessionId: string;
  title: string;
  overview: string;
  phases: LessonActivity[];
  estimatedTotalDuration: number;
  learningObjectives: string[];
  materials: string[];
  assessmentMethods: string[];
  keywords: string[];
  // Additional properties that were being used
  estimatedDuration: number; // Alias for estimatedTotalDuration
  objectives: string[]; // Alias for learningObjectives
  difficulty: number;
  prerequisites: string[];
  assessmentCriteria: string[];
  extensions: string[];
}

export const ENHANCED_LESSON_PHASES = {
  introduction: { baseSeconds: 180 },
  contentDelivery: { baseSeconds: 300 },
  interactiveGame: { baseSeconds: 240 },
  application: { baseSeconds: 180 },
  creativeExploration: { baseSeconds: 150 },
  summary: { baseSeconds: 90 }
};

// Add missing exports for testing
export const LEARNING_STYLE_ADAPTATIONS = {
  visual: { preferredMediaTypes: ['images', 'charts', 'diagrams'], extraDuration: 60 },
  auditory: { preferredMediaTypes: ['audio', 'speech', 'music'], extraDuration: 30 },
  kinesthetic: { preferredMediaTypes: ['interactive', 'hands-on', 'movement'], extraDuration: 90 },
  mixed: { preferredMediaTypes: ['all'], extraDuration: 45 }
};

export const K12_CURRICULUM_STANDARDS = {
  mathematics: {
    elementary: ['counting', 'addition', 'subtraction', 'basic-geometry'],
    middle: ['algebra-basics', 'fractions', 'decimals', 'geometry'],
    high: ['algebra', 'geometry', 'trigonometry', 'calculus']
  },
  science: {
    elementary: ['earth-science', 'life-science', 'physical-science'],
    middle: ['biology', 'chemistry', 'physics'],
    high: ['advanced-biology', 'advanced-chemistry', 'advanced-physics']
  }
};

function getGamesForSubject(subject: string) {
    // In a real application, this would fetch games from a database.
    // For now, we'll just return some sample games.
    switch (subject) {
        case 'mathematics':
            return [
                {
                    name: 'Math Blaster',
                    description: 'Blast your way through math problems!',
                    url: 'https://www.coolmathgames.com/0-math-blaster',
                },
            ];
        case 'english':
            return [
                {
                    name: 'Word Wipe',
                    description: 'Wipe away words in this fast-paced word game!',
                    url: 'https://www.coolmathgames.com/0-word-wipe',
                },
            ];
        default:
            return [];
    }
}

function getContentForPhase(phase: string, subject: string, skillArea: string) {
    // In a real application, this would fetch content from a database.
    // For now, we'll just return some sample content.
    switch (phase) {
        case 'introduction':
            return [
                {
                    type: 'text',
                    value: `Welcome to this lesson on ${skillArea}! In this lesson, we'll be learning about...`,
                },
            ];
        case 'contentDelivery':
            return [
                {
                    type: 'video',
                    value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                },
                {
                    type: 'text',
                    value: 'This is the main content of the lesson. We\'ll be covering...',
                },
            ];
        case 'interactiveGame':
            return [
                {
                    type: 'text',
                    value: 'Now it\'s time to play a game!',
                },
            ];
        case 'application':
            return [
                {
                    type: 'text',
                    value: 'Now it\'s time to apply what you\'ve learned.',
                },
            ];
        case 'creativeExploration':
            return [
                {
                    type: 'text',
                    value: 'Now it\'s time to get creative!',
                },
            ];
        case 'summary':
            return [
                {
                    type: 'text',
                    value: 'In this lesson, we learned about...',
                },
            ];
        default:
            return [];
    }
}

export function generateEnhancedLesson(subject: string, skillArea: string, gradeLevel: number = 6, learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic' = 'mixed', difficulty: number = 2): Promise<EnhancedLessonConfig> {
  return new Promise((resolve) => {
    const adaptation = LEARNING_STYLE_ADAPTATIONS[learningStyle];
    const phases: LessonActivity[] = Object.entries(ENHANCED_LESSON_PHASES).map(([phase, { baseSeconds }]) => {
        const activity: LessonActivity = {
            id: `${subject}-${phase}`,
            type: phase as any,
            phase: phase as any,
            title: `${phase.charAt(0).toUpperCase() + phase.slice(1)}`,
            duration: baseSeconds + adaptation.extraDuration / Object.keys(ENHANCED_LESSON_PHASES).length,
            phaseDescription: `This is the ${phase} phase.`,
            metadata: { subject, skillArea },
            content: getContentForPhase(phase, subject, skillArea),
        };

        if (phase === 'interactiveGame') {
            activity.games = getGamesForSubject(subject);
        }

        return activity;
    });

    const totalDuration = phases.reduce((acc, phase) => acc + phase.duration, 0);

    const gradeRange = gradeLevel <= 5 ? 'elementary' : gradeLevel <= 8 ? 'middle' : 'high';
    const learningObjectives = K12_CURRICULUM_STANDARDS[subject]?.[gradeRange] || [`Learn ${skillArea} concepts`];

    const lessonConfig: EnhancedLessonConfig = {
      subject,
      skillArea,
      gradeLevel,
      learningStyle,
      sessionId: `session_${subject}_${Date.now()}`,
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} - ${skillArea}`,
      overview: `Interactive ${subject} lesson focusing on ${skillArea}`,
      phases,
      estimatedTotalDuration: totalDuration,
      learningObjectives,
      materials: ['Interactive content'],
      assessmentMethods: ['Interactive exercises'],
      keywords: [subject, skillArea],
      // Required additional properties
      estimatedDuration: totalDuration,
      objectives: learningObjectives,
      difficulty,
      prerequisites: [],
      assessmentCriteria: ['Understanding of concepts'],
      extensions: ['Practice exercises']
    };

    resolve(lessonConfig);
  });
}

export function validateEnhancedLesson(lesson: SubjectLessonPlan): {
  qualityScore: number;
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
    const errors: string[] = [];
    if (lesson.phases.length !== 6) {
        errors.push("Lesson must have exactly 6 phases.");
    }
    const totalDuration = lesson.phases.reduce((acc, phase) => acc + phase.duration, 0);
    if (totalDuration < 1140 || totalDuration > 1500) {
        errors.push("Total duration must be between 1140 and 1500 seconds (19-25 minutes).");
    }
    if (!lesson.learningObjectives || lesson.learningObjectives.length === 0) {
        errors.push("Lesson must have at least one learning objective.");
    }
    if (!lesson.title || lesson.title.length === 0) {
        errors.push("Lesson must have a title.");
    }
    if (!lesson.overview || lesson.overview.length === 0) {
        errors.push("Lesson must have an overview.");
    }

  return {
    qualityScore: errors.length > 0 ? 50 : 95,
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}
