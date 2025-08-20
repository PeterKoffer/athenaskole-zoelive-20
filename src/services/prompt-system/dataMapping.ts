// ============================================
// DATA MAPPING FOR 12-PARAMETER PROMPT SYSTEM
// Maps application data to Training Ground parameters
// ============================================

import { PromptContext } from './index';

export interface AppDataSources {
  // Student Profile Data
  studentProfile?: {
    grade_level?: number;
    learning_style_preference?: string;
    interests?: string[];
    performance_data?: {
      accuracy: number;
      engagement_level: string;
    };
    abilities_assessment?: string;
  };

  // Teacher Dashboard Settings
  teacherSettings?: {
    teaching_approach?: string;
    curriculum_alignment?: string;
    lesson_duration_minutes?: number;
    subject_priorities?: Record<string, 'high' | 'medium' | 'low'>;
  };

  // School Dashboard Configuration
  schoolConfig?: {
    pedagogy?: string;
    curriculum_standards?: string;
    default_lesson_duration?: number;
  };

  // Calendar System Data
  calendarData?: {
    active_themes?: string[];
    seasonal_keywords?: string[];
    current_unit_duration?: string;
    unit_timeframe?: string;
  };

  // Lesson Request Context
  lessonContext?: {
    subject: string;
    requested_duration?: number;
  };
}

/**
 * Maps application data sources to the 12 Training Ground parameters
 */
export function mapAppDataToPromptContext(
  dataSources: AppDataSources
): PromptContext {
  const {
    studentProfile,
    teacherSettings,
    schoolConfig,
    calendarData,
    lessonContext
  } = dataSources;

  return {
    // 1. Subject (Content Area) - REQUIRED
    subject: lessonContext?.subject || 'Mathematics',

    // 2. Student Grade Level - from student profile, fallback to 6
    gradeLevel: studentProfile?.grade_level ?? 6,

    // 3. Curriculum Alignment - from teacher settings or school config
    curriculumStandards: 
      teacherSettings?.curriculum_alignment || 
      schoolConfig?.curriculum_standards || 
      'broadly accepted topics and skills for that grade',

    // 4. School/Teaching Perspective - from teacher or school settings
    teachingPerspective: 
      teacherSettings?.teaching_approach || 
      schoolConfig?.pedagogy || 
      'balanced, evidence-based style',

    // 5. Lesson Duration - from request, teacher, or school defaults
    lessonDuration: 
      lessonContext?.requested_duration ||
      teacherSettings?.lesson_duration_minutes ||
      schoolConfig?.default_lesson_duration ||
      35,

    // 6. Subject Weight - from teacher's subject priorities
    subjectWeight: lessonContext?.subject ? 
      (teacherSettings?.subject_priorities?.[lessonContext.subject] || 'medium') : 
      'medium',

    // 7. Calendar Context (Keywords) - from active themes and seasonal data
    calendarKeywords: [
      ...(calendarData?.active_themes || []),
      ...(calendarData?.seasonal_keywords || [])
    ],

    // 8. Calendar Duration - from current unit timeframe
    calendarDuration: 
      calendarData?.current_unit_duration || 
      calendarData?.unit_timeframe || 
      'standalone session',

    // 9. Student Abilities and Proficiency - from performance assessment
    studentAbilities: 
      studentProfile?.abilities_assessment || 
      determineAbilitiesFromPerformance(studentProfile?.performance_data) ||
      'mixed ability with both support and challenges',

    // 10. Learning Style Preferences - from student profile
    learningStyle: 
      studentProfile?.learning_style_preference || 
      'multimodal approach',

    // 11. Student Interests - from student profile
    studentInterests: studentProfile?.interests || [],

    // Legacy support fields for backward compatibility
    performanceLevel: mapToLegacyPerformanceLevel(studentProfile?.performance_data),
    interests: studentProfile?.interests || [],
    schoolPhilosophy: teacherSettings?.teaching_approach || schoolConfig?.pedagogy
  };
}

/**
 * Determines student abilities description from performance data
 */
function determineAbilitiesFromPerformance(performanceData?: any): string {
  if (!performanceData?.accuracy) {
    return 'mixed ability with both support and challenges';
  }

  const accuracy = performanceData.accuracy;
  
  if (accuracy < 0.7) {
    return 'student performing below grade level - provide extra scaffolding, simpler vocabulary, and step-by-step guidance';
  }
  
  if (accuracy > 0.85) {
    return 'student performing above grade level - provide advanced challenges, complex scenarios, and extension activities';
  }
  
  return 'student performing at grade level - provide standard complexity with appropriate support';
}

/**
 * Maps performance data to legacy performance level for backward compatibility
 */
function mapToLegacyPerformanceLevel(performanceData?: any): 'below' | 'average' | 'above' {
  if (!performanceData?.accuracy) return 'average';
  
  const accuracy = performanceData.accuracy;
  if (accuracy < 0.7) return 'below';
  if (accuracy > 0.85) return 'above';
  return 'average';
}

/**
 * Helper function to build context with specific subject override
 */
export function buildContextForSubject(
  subject: string,
  dataSources: Omit<AppDataSources, 'lessonContext'>
): PromptContext {
  return mapAppDataToPromptContext({
    ...dataSources,
    lessonContext: { subject }
  });
}

/**
 * Data source validation - ensures we have minimum required data
 */
export function validateDataSources(dataSources: AppDataSources): {
  isValid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Subject is absolutely required
  if (!dataSources.lessonContext?.subject) {
    missing.push('Subject (lessonContext.subject)');
  }

  // Grade level is highly recommended
  if (!dataSources.studentProfile?.grade_level) {
    warnings.push('Grade level not specified - defaulting to Grade 6');
  }

  // Learning style helps with personalization
  if (!dataSources.studentProfile?.learning_style_preference) {
    warnings.push('Learning style not specified - using multimodal approach');
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
}