import { LessonActivity } from '../types/LessonTypes';
import { generateEnhancedLesson, EnhancedLessonConfig } from './EnhancedLessonGenerator';
import { 
  generateMathematicsLesson, 
  generateEnglishLesson,
  generateScienceLesson,
  generateMusicLesson,
  generateComputerScienceLesson,
  generateCreativeArtsLesson,
  generateCompleteEducationalSession
} from './EnhancedSubjectLessonFactory';
import { generateMentalWellnessLesson } from './EnhancedMentalWellnessLessonFactory';
import { generateWorldHistoryReligionsLesson } from './EnhancedWorldHistoryReligionsLessonFactory';
import { generateGlobalGeographyLesson } from './EnhancedGlobalGeographyLessonFactory';
import { generateBodyLabLesson } from './EnhancedBodyLabLessonFactory';
import { generateLifeEssentialsLesson } from './EnhancedLifeEssentialsLessonFactory';

/**
 * Integration bridge between existing lesson system and enhanced NELIE system
 * Provides backward compatibility while adding enhanced features
 */

export interface NELIESessionConfig {
  studentId?: string;
  gradeLevel: number; // 0-12 (K-12)
  preferredLearningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  subjects?: ('mathematics' | 'english' | 'science' | 'music' | 'computerScience' | 'creativeArts' | 'mentalHealth' | 'worldHistoryReligions' | 'globalGeography' | 'bodyLab' | 'lifeEssentials')[];
  sessionDuration?: 'standard' | 'extended'; // standard = 20min, extended = 20-25min
  enableUniqueness?: boolean;
  previousSessionIds?: string[];
}

export interface NELIESessionResult {
  sessionId: string;
  metadata: {
    totalDuration: number; // Total across all subjects
    subjectCount: number;
    gradeLevel: number;
    learningStyle: string;
    generatedAt: string;
    qualityScores: Record<string, number>;
  };
  subjects: Record<string, {
    lesson: any;
    validation: any;
    activities: LessonActivity[];
  }>;
}

/**
 * Enhanced NELIE Session Generator
 * Main interface for generating complete educational sessions
 */
export class NELIESessionGenerator {
  private static defaultConfig: Partial<NELIESessionConfig> = {
    preferredLearningStyle: 'mixed',
    subjects: [
      'mathematics', 'english', 'science', 'music',
      'computerScience', 'creativeArts', 'mentalHealth',
      'worldHistoryReligions', 'globalGeography', 'bodyLab', 'lifeEssentials'
    ],
    sessionDuration: 'extended',
    enableUniqueness: true
  };

  /**
   * Generate a complete NELIE educational session
   */
  static generateSession(config: NELIESessionConfig): NELIESessionResult {
    const finalConfig = { ...this.defaultConfig, ...config };
    const sessionId = `nelie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🎓 Generating Enhanced NELIE Session:', {
      sessionId,
      gradeLevel: finalConfig.gradeLevel,
      learningStyle: finalConfig.preferredLearningStyle,
      subjects: finalConfig.subjects?.length,
      uniqueness: finalConfig.enableUniqueness
    });

    // Generate complete session using enhanced system
    const completeSession = generateCompleteEducationalSession(
      finalConfig.gradeLevel!,
      finalConfig.preferredLearningStyle,
      sessionId
    );

    // Process each subject
    const subjects: Record<string, any> = {};
    let totalDuration = 0;
    const qualityScores: Record<string, number> = {};

    finalConfig.subjects?.forEach(subjectKey => {
      const lesson = completeSession[subjectKey as keyof typeof completeSession];
      
      if (lesson && typeof lesson === 'object' && 'phases' in lesson) {
        // Validate lesson quality
        const validation = this.validateLesson(lesson);
        
        subjects[subjectKey] = {
          lesson,
          validation,
          activities: lesson.phases as LessonActivity[]
        };

        totalDuration += (lesson.totalDuration as number) || 0;
        qualityScores[subjectKey] = validation.qualityScore || 0;
      }
    });

    const result: NELIESessionResult = {
      sessionId,
      metadata: {
        totalDuration,
        subjectCount: Object.keys(subjects).length,
        gradeLevel: finalConfig.gradeLevel!,
        learningStyle: finalConfig.preferredLearningStyle || 'mixed',
        generatedAt: new Date().toISOString(),
        qualityScores
      },
      subjects
    };

    console.log('✅ NELIE Session Generated:', {
      sessionId: result.sessionId,
      totalDuration: `${Math.floor(totalDuration / 60)} minutes`,
      avgQuality: Math.round(Object.values(qualityScores).reduce((a, b) => a + b, 0) / Object.values(qualityScores).length),
      subjects: Object.keys(subjects)
    });

    return result;
  }

  /**
   * Generate a single subject lesson
   */
  static generateSubjectLesson(
    subject: string, 
    gradeLevel: number, 
    learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed',
    sessionId?: string
  ): { lesson: any; validation: any; activities: LessonActivity[] } {
    
    let config: EnhancedLessonConfig;
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
        config = generateMathematicsLesson(gradeLevel, learningStyle, sessionId);
        break;
      case 'english':
      case 'language':
        config = generateEnglishLesson(gradeLevel, learningStyle, sessionId);
        break;
      case 'science':
        config = generateScienceLesson(gradeLevel, learningStyle, sessionId);
        break;
      case 'music':
        config = generateMusicLesson(gradeLevel, learningStyle, sessionId);
        break;
      case 'computerscience':
      case 'computer-science':
      case 'cs':
        config = generateComputerScienceLesson(gradeLevel, learningStyle, sessionId);
        break;
      case 'creativeart':
      case 'creative-arts':
      case 'arts':
        config = generateCreativeArtsLesson(gradeLevel, learningStyle, sessionId);
        break;
      case 'mentalhealth':
      case 'mentalwellness':
        config = generateMentalWellnessLesson(gradeLevel, learningStyle as any, sessionId);
        break;
      case 'worldhistoryreligions':
        config = generateWorldHistoryReligionsLesson(gradeLevel, learningStyle as any, sessionId);
        break;
      case 'globalgeography':
        config = generateGlobalGeographyLesson(gradeLevel, learningStyle as any, sessionId);
        break;
      case 'bodylab':
        config = generateBodyLabLesson(gradeLevel, learningStyle as any, sessionId);
        break;
      case 'lifeessentials':
        config = generateLifeEssentialsLesson(gradeLevel, learningStyle as any, sessionId);
        break;
      default:
        throw new Error(`Unknown subject: ${subject}`);
    }

    const lesson = generateEnhancedLesson(config);
    const validation = this.validateLesson(lesson);

    return {
      lesson,
      validation,
      activities: lesson.phases
    };
  }

  /**
   * Validate lesson meets NELIE requirements
   */
  private static validateLesson(lesson: any): any {
    // Import and use validation from enhanced system
    const { validateEnhancedLesson } = require('./EnhancedLessonGenerator');
    return validateEnhancedLesson(lesson);
  }

  /**
   * Get recommended lesson duration based on grade level and learning style
   */
  static getRecommendedDuration(gradeLevel: number, learningStyle: string): number {
    const baseDuration = 1350; // 22.5 minutes
    const styleMultipliers = {
      visual: 1.1,
      auditory: 1.0,
      kinesthetic: 1.2,
      mixed: 1.15
    };

    const gradeMultiplier = Math.min(1.0 + (gradeLevel * 0.05), 1.3); // Older students get slightly longer
    const styleMultiplier = styleMultipliers[learningStyle as keyof typeof styleMultipliers] || 1.0;

    return Math.floor(baseDuration * gradeMultiplier * styleMultiplier);
  }

  /**
   * Check if student needs content refresh
   */
  static needsContentRefresh(
    studentId: string, 
    subject: string, 
    previousSessions: string[]
  ): boolean {
    // Simple heuristic: refresh if more than 3 sessions with same subject
    const subjectSessions = previousSessions.filter(sessionId => 
      sessionId.includes(subject.toLowerCase())
    );
    
    return subjectSessions.length >= 3;
  }

  /**
   * Generate session summary for reporting
   */
  static generateSessionSummary(sessionResult: NELIESessionResult): string {
    const { metadata, subjects } = sessionResult;
    const avgQuality = Math.round(
      Object.values(metadata.qualityScores).reduce((a, b) => a + b, 0) / 
      Object.values(metadata.qualityScores).length
    );

    const totalMinutes = Math.floor(metadata.totalDuration / 60);
    const totalSeconds = metadata.totalDuration % 60;

    return `
NELIE Session Summary
=====================
Session ID: ${sessionResult.sessionId}
Grade Level: ${metadata.gradeLevel === 0 ? 'Kindergarten' : `Grade ${metadata.gradeLevel}`}
Learning Style: ${metadata.learningStyle}
Generated: ${new Date(metadata.generatedAt).toLocaleString()}

Content Overview:
- Subjects: ${metadata.subjectCount}
- Total Duration: ${totalMinutes}m ${totalSeconds}s
- Average Quality: ${avgQuality}/100

Subject Breakdown:
${Object.entries(subjects).map(([subject, data]) => 
  `- ${subject}: ${Math.floor((data.lesson.totalDuration || 0) / 60)}m (Quality: ${metadata.qualityScores[subject]}/100)`
).join('\n')}

Key Features:
✅ 20-25 minute lessons for optimal attention span
✅ Unique content for each session (no repetition)
✅ Learning style adaptations for better engagement
✅ K-12 curriculum aligned content
✅ Interactive games and activities
✅ Real-world application scenarios
✅ Creative exploration opportunities
    `.trim();
  }
}

/**
 * Quick helper functions for common use cases
 */
export const NELIEHelpers = {
  /**
   * Generate a math lesson for a specific grade
   */
  generateMathLesson: (grade: number, style?: string) => 
    NELIESessionGenerator.generateSubjectLesson('mathematics', grade, style as any),

  /**
   * Generate a reading lesson for a specific grade
   */
  generateReadingLesson: (grade: number, style?: string) => 
    NELIESessionGenerator.generateSubjectLesson('english', grade, style as any),

  /**
   * Generate a mental wellness lesson for a specific grade
   */
  generateMentalWellnessLesson: (grade: number, style?: string, sessionId?: string) =>
    NELIESessionGenerator.generateSubjectLesson('mentalhealth', grade, style as any, sessionId),
  generateWorldHistoryReligionsLesson: (grade: number, style?: string, sessionId?: string) =>
    NELIESessionGenerator.generateSubjectLesson('worldhistoryreligions', grade, style as any, sessionId),
  generateGlobalGeographyLesson: (grade: number, style?: string, sessionId?: string) =>
    NELIESessionGenerator.generateSubjectLesson('globalgeography', grade, style as any, sessionId),
  generateBodyLabLesson: (grade: number, style?: string, sessionId?: string) =>
    NELIESessionGenerator.generateSubjectLesson('bodylab', grade, style as any, sessionId),
  generateLifeEssentialsLesson: (grade: number, style?: string, sessionId?: string) =>
    NELIESessionGenerator.generateSubjectLesson('lifeessentials', grade, style as any, sessionId),

  /**
   * Generate a complete day's worth of lessons
   */
  generateDailyLessons: (grade: number, style?: string) => 
    NELIESessionGenerator.generateSession({
      gradeLevel: grade,
      preferredLearningStyle: style as any
    }),

  /**
   * Quick quality check for any lesson
   */
  checkLessonQuality: (lesson: any) => 
    NELIESessionGenerator['validateLesson'](lesson),

  /**
   * Format duration for display
   */
  formatDuration: (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
};

// Export types for external use
// (Types are already exported with their declarations above)

// Default export
export default NELIESessionGenerator;