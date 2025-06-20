import { validateStandardLesson, StandardLessonConfig } from './StandardLessonTemplate';
import { SubjectLessonPlan } from '../types/LessonTypes';
import { englishLessons } from '../lessons/EnglishLessons';
import { createMathematicsLesson } from '../lessons/MathematicsLessons';
import { createScienceLesson } from '../lessons/ScienceLessons';
import { createMusicLesson } from '../lessons/MusicLessons';
import { createComputerScienceLesson } from '../lessons/ComputerScienceLessons';
import { createCreativeArtsLesson } from '../lessons/CreativeArtsLessons';

/**
 * Validates all subject lessons against the standard 20-minute structure
 */
export function validateAllLessons(): {
  overall: boolean;
  results: Record<string, {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    totalDuration: number;
    phaseBreakdown: Record<string, number>;
  }>;
} {
  const lessonCreators = {
    english: () => englishLessons,
    mathematics: createMathematicsLesson,
    science: createScienceLesson,
    music: createMusicLesson,
    'computer-science': createComputerScienceLesson,
    'creative-arts': createCreativeArtsLesson
  };

  const results: Record<string, any> = {};
  let overallValid = true;

  for (const [subject, createLesson] of Object.entries(lessonCreators)) {
    try {
      const activities = createLesson();
      
      // Convert activities to SubjectLessonPlan format for validation
      const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
      
      const lessonPlan: SubjectLessonPlan = {
        subject,
        skillArea: 'Standard Lesson',
        totalDuration,
        phases: activities,
        learningObjectives: [],
        prerequisites: []
      };

      const validation = validateStandardLesson(lessonPlan);
      
      // Calculate phase breakdown
      const phaseBreakdown = activities.reduce((acc, activity) => {
        acc[activity.phase] = (acc[activity.phase] || 0) + activity.duration;
        return acc;
      }, {} as Record<string, number>);

      results[subject] = {
        ...validation,
        totalDuration,
        phaseBreakdown
      };

      if (!validation.isValid) {
        overallValid = false;
      }
    } catch (error) {
      results[subject] = {
        isValid: false,
        errors: [`Failed to create lesson: ${error}`],
        warnings: [],
        totalDuration: 0,
        phaseBreakdown: {}
      };
      overallValid = false;
    }
  }

  return {
    overall: overallValid,
    results
  };
}

/**
 * Generates a detailed report of lesson structure validation
 */
export function generateLessonValidationReport(): string {
  const validation = validateAllLessons();
  
  let report = "=== STANDARDIZED LESSON VALIDATION REPORT ===\n\n";
  report += `Overall Status: ${validation.overall ? "✅ ALL LESSONS VALID" : "❌ SOME LESSONS NEED FIXES"}\n\n`;

  for (const [subject, result] of Object.entries(validation.results)) {
    report += `--- ${subject.toUpperCase()} LESSON ---\n`;
    report += `Status: ${result.isValid ? "✅ Valid" : "❌ Invalid"}\n`;
    report += `Total Duration: ${result.totalDuration}s (${(result.totalDuration / 60).toFixed(1)} minutes)\n`;
    
    if (result.phaseBreakdown) {
      report += "Phase Breakdown:\n";
      for (const [phase, duration] of Object.entries(result.phaseBreakdown)) {
        report += `  - ${phase}: ${duration}s (${(duration / 60).toFixed(1)} min)\n`;
      }
    }
    
    if (result.errors.length > 0) {
      report += "❌ ERRORS:\n";
      result.errors.forEach(error => report += `  - ${error}\n`);
    }
    
    if (result.warnings.length > 0) {
      report += "⚠️ WARNINGS:\n";
      result.warnings.forEach(warning => report += `  - ${warning}\n`);
    }
    
    report += "\n";
  }

  report += "=== TARGET STRUCTURE (20 minutes) ===\n";
  report += "1. Introduction: 2-3 min (120-180s)\n";
  report += "2. Content Delivery: 5-7 min (300-420s)\n";
  report += "3. Interactive Game: 4-5 min (240-300s)\n";
  report += "4. Application: 3-4 min (180-240s)\n";
  report += "5. Creative Exploration: 2-3 min (120-180s)\n";
  report += "6. Summary: 1-2 min (60-120s)\n";
  report += "TOTAL: 20 minutes (1200s) exactly\n";

  return report;
}

/**
 * Quick test function to verify a specific lesson meets standards
 */
export function testLessonStandard(subject: string): boolean {
  const validation = validateAllLessons();
  return validation.results[subject]?.isValid || false;
}

/**
 * Gets timing statistics for all lessons
 */
export function getLessonTimingStats(): {
  subjects: Record<string, {
    total: number;
    phases: Record<string, number>;
    meetsStandard: boolean;
  }>;
  averages: {
    introduction: number;
    contentDelivery: number;
    interactiveGame: number;
    application: number;
    creativeExploration: number;
    summary: number;
  };
} {
  const validation = validateAllLessons();
  const subjects: Record<string, any> = {};
  const phaseStats: Record<string, number[]> = {
    introduction: [],
    'content-delivery': [],
    'interactive-game': [],
    application: [],
    'creative-exploration': [],
    summary: []
  };

  for (const [subject, result] of Object.entries(validation.results)) {
    subjects[subject] = {
      total: result.totalDuration,
      phases: result.phaseBreakdown,
      meetsStandard: result.isValid
    };

    // Collect stats for averages
    for (const [phase, duration] of Object.entries(result.phaseBreakdown)) {
      if (phaseStats[phase]) {
        phaseStats[phase].push(duration);
      }
    }
  }

  // Calculate averages
  const averages = Object.entries(phaseStats).reduce((acc, [phase, durations]) => {
    acc[phase as keyof typeof acc] = durations.length > 0 
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
      : 0;
    return acc;
  }, {} as any);

  return {
    subjects,
    averages: {
      introduction: averages.introduction || 0,
      contentDelivery: averages['content-delivery'] || 0,
      interactiveGame: averages['interactive-game'] || 0,
      application: averages.application || 0,
      creativeExploration: averages['creative-exploration'] || 0,
      summary: averages.summary || 0
    }
  };
}
