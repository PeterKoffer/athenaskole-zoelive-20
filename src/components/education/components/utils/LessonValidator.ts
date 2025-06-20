
import { LessonActivity, SubjectLessonPlan } from '../types/LessonTypes';
import { generateEnhancedLesson } from './EnhancedLessonGenerator';

export interface LessonValidationResult {
  isValid: boolean;
  qualityScore: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface LessonValidationConfig {
  checkDuration?: boolean;
  checkProgression?: boolean;
  checkContent?: boolean;
  minQualityScore?: number;
}

export const validateLessonStructure = (
  lesson: SubjectLessonPlan,
  config: LessonValidationConfig = {}
): LessonValidationResult => {
  const {
    checkDuration = true,
    checkProgression = true,
    checkContent = true,
    minQualityScore = 70
  } = config;

  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let qualityScore = 100;

  // Validate basic structure
  if (!lesson.title) {
    errors.push('Lesson must have a title');
    qualityScore -= 10;
  }

  if (!lesson.activities || lesson.activities.length === 0) {
    errors.push('Lesson must have activities');
    qualityScore -= 20;
  }

  // Validate duration if requested
  if (checkDuration && lesson.activities) {
    const totalDuration = lesson.activities.reduce((sum, activity) => sum + activity.duration, 0);
    if (totalDuration < 600) { // Less than 10 minutes
      warnings.push('Lesson might be too short for effective learning');
      qualityScore -= 5;
    }
    if (totalDuration > 2400) { // More than 40 minutes
      warnings.push('Lesson might be too long, consider breaking it up');
      qualityScore -= 5;
    }
  }

  // Validate content quality if requested
  if (checkContent && lesson.activities) {
    const hasIntroduction = lesson.activities.some(a => a.phase === 'introduction');
    const hasSummary = lesson.activities.some(a => a.phase === 'summary');
    const hasInteractive = lesson.activities.some(a => a.phase === 'interactive-game');

    if (!hasIntroduction) {
      suggestions.push('Consider adding an introduction activity');
      qualityScore -= 5;
    }
    if (!hasSummary) {
      suggestions.push('Consider adding a summary activity');
      qualityScore -= 5;
    }
    if (!hasInteractive) {
      suggestions.push('Consider adding interactive elements');
      qualityScore -= 10;
    }
  }

  return {
    isValid: errors.length === 0 && qualityScore >= minQualityScore,
    qualityScore,
    errors,
    warnings,
    suggestions
  };
};

export const validateEnhancedLessonAsync = async (
  subject: string,
  skillArea: string,
  config?: LessonValidationConfig
): Promise<LessonValidationResult> => {
  try {
    const enhancedLesson = await generateEnhancedLesson(subject, skillArea);
    
    // Convert to SubjectLessonPlan format for validation
    const lessonPlan: SubjectLessonPlan = {
      title: enhancedLesson.title,
      subject: enhancedLesson.subject,
      skillArea: enhancedLesson.skillArea,
      gradeLevel: enhancedLesson.gradeLevel,
      estimatedDuration: enhancedLesson.estimatedDuration,
      objectives: enhancedLesson.objectives,
      activities: enhancedLesson.phases,
      difficulty: enhancedLesson.difficulty,
      prerequisites: enhancedLesson.prerequisites,
      assessmentCriteria: enhancedLesson.assessmentCriteria,
      extensions: enhancedLesson.extensions
    };

    return validateLessonStructure(lessonPlan, config);
  } catch (error) {
    return {
      isValid: false,
      qualityScore: 0,
      errors: [`Failed to generate lesson: ${error}`],
      warnings: [],
      suggestions: []
    };
  }
};

export const validateActivitySequence = (activities: LessonActivity[]): LessonValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let qualityScore = 100;

  if (activities.length === 0) {
    errors.push('No activities provided');
    return { isValid: false, qualityScore: 0, errors, warnings, suggestions };
  }

  // Check for proper sequencing
  const phases = activities.map(a => a.phase);
  const firstPhase = phases[0];
  const lastPhase = phases[phases.length - 1];

  if (firstPhase !== 'introduction') {
    suggestions.push('Consider starting with an introduction phase');
    qualityScore -= 5;
  }

  if (lastPhase !== 'summary') {
    suggestions.push('Consider ending with a summary phase');
    qualityScore -= 5;
  }

  return {
    isValid: errors.length === 0,
    qualityScore,
    errors,
    warnings,
    suggestions
  };
};
