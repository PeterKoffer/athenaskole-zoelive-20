
// @ts-nocheck
import { LessonActivity } from '../types/LessonTypes';
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

export interface SubjectLessonPlan {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  estimatedDuration?: number;
  objectives?: string[];
  difficulty?: number;
  prerequisites?: string[];
  assessmentCriteria?: string[];
  extensions?: string[];
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
  if (!lesson.subject) {
    errors.push('Lesson must have a subject');
    qualityScore -= 10;
  }

  if (!lesson.skillArea) {
    errors.push('Lesson must have a skill area');
    qualityScore -= 10;
  }

  // Validate duration if requested
  if (checkDuration && lesson.estimatedDuration) {
    if (lesson.estimatedDuration < 600) { // Less than 10 minutes
      warnings.push('Lesson might be too short for effective learning');
      qualityScore -= 5;
    }
    if (lesson.estimatedDuration > 2400) { // More than 40 minutes
      warnings.push('Lesson might be too long, consider breaking it up');
      qualityScore -= 5;
    }
  }

  // Validate content quality if requested
  if (checkContent && lesson.objectives) {
    if (lesson.objectives.length === 0) {
      suggestions.push('Consider adding learning objectives');
      qualityScore -= 5;
    }

    if (lesson.difficulty && (lesson.difficulty < 1 || lesson.difficulty > 5)) {
      warnings.push('Difficulty should be between 1 and 5');
      qualityScore -= 5;
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
  gradeLevel: number = 6,
  config?: LessonValidationConfig
): Promise<LessonValidationResult> => {
  try {
    const enhancedLesson = await generateEnhancedLesson(subject, skillArea);
    
    // Convert to SubjectLessonPlan format for validation
    const lessonPlan: SubjectLessonPlan = {
      subject: enhancedLesson.subject,
      skillArea: enhancedLesson.skillArea,
      gradeLevel: enhancedLesson.gradeLevel,
      estimatedDuration: enhancedLesson.estimatedDuration,
      objectives: enhancedLesson.objectives,
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
