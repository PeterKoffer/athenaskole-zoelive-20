import { LessonActivity } from '../types/LessonTypes';
import { StandardLessonConfig, createStandardLesson } from './StandardLessonTemplate';

/**
 * Enhanced lesson generator that creates 20-25 minute lessons with unique content
 * and learning style adaptation for every new class session.
 */

export interface EnhancedLessonConfig extends StandardLessonConfig {
  gradeLevel: number; // K-12 grade level (0-12, where 0 = Kindergarten)
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  sessionId?: string; // For content uniqueness
  previousSessions?: string[]; // To avoid content repetition
}

export interface ContentUniquenessTracker {
  sessionId: string;
  usedThemes: string[];
  usedScenarios: string[];
  usedActivities: string[];
  lastGenerated: string;
}

/**
 * Enhanced lesson duration targeting 20-25 minutes (1200-1500 seconds)
 * with adaptive timing based on student performance and learning style
 */
export const ENHANCED_LESSON_PHASES = {
  introduction: { 
    baseSeconds: 180, // 3 minutes base
    rangeSeconds: [120, 240], // 2-4 minutes range
    basePercentage: 12 // 12% of total lesson
  },
  contentDelivery: { 
    baseSeconds: 420, // 7 minutes base
    rangeSeconds: [300, 540], // 5-9 minutes range
    basePercentage: 28 // 28% of total lesson
  },
  interactiveGame: { 
    baseSeconds: 360, // 6 minutes base
    rangeSeconds: [240, 450], // 4-7.5 minutes range
    basePercentage: 24 // 24% of total lesson
  },
  application: { 
    baseSeconds: 300, // 5 minutes base
    rangeSeconds: [180, 390], // 3-6.5 minutes range
    basePercentage: 20 // 20% of total lesson
  },
  creativeExploration: { 
    baseSeconds: 180, // 3 minutes base
    rangeSeconds: [120, 270], // 2-4.5 minutes range
    basePercentage: 12 // 12% of total lesson
  },
  summary: { 
    baseSeconds: 90, // 1.5 minutes base
    rangeSeconds: [60, 120], // 1-2 minutes range
    basePercentage: 6 // 6% of total lesson
  }
};

/**
 * Learning style specific content adaptations
 */
export const LEARNING_STYLE_ADAPTATIONS = {
  visual: {
    contentFormat: 'Rich visual descriptions, diagrams, and color-coded elements',
    activityType: 'Visual puzzles, pattern matching, diagram creation',
    instructionStyle: 'Step-by-step visual guides with clear imagery',
    durationAdjustment: 1.1 // 10% longer for visual processing
  },
  auditory: {
    contentFormat: 'Story-based explanations, sound patterns, verbal instructions',
    activityType: 'Audio-based games, rhythm exercises, discussion prompts',
    instructionStyle: 'Clear verbal instructions with musical elements',
    durationAdjustment: 1.0 // Standard duration
  },
  kinesthetic: {
    contentFormat: 'Hands-on activities, movement-based learning, interactive elements',
    activityType: 'Physical manipulation games, building exercises, active simulations',
    instructionStyle: 'Action-oriented instructions with movement cues',
    durationAdjustment: 1.2 // 20% longer for hands-on activities
  },
  mixed: {
    contentFormat: 'Combination of visual, auditory, and kinesthetic elements',
    activityType: 'Multi-modal activities incorporating all learning styles',
    instructionStyle: 'Varied instruction methods within same lesson',
    durationAdjustment: 1.15 // 15% longer for comprehensive approach
  }
};

/**
 * Grade level curriculum alignment
 */
export const K12_CURRICULUM_STANDARDS = {
  0: { // Kindergarten
    mathematics: ['Number recognition 1-10', 'Basic shapes', 'Simple counting', 'Size comparison'],
    english: ['Letter recognition', 'Phonics basics', 'Simple words', 'Listening skills'],
    science: ['Living vs non-living', 'Weather observation', 'Animal identification', 'Plant parts'],
    music: ['Beat recognition', 'Simple songs', 'Instrument sounds', 'Volume concepts'],
    computerScience: ['Following directions', 'Pattern recognition', 'Basic sequencing', 'Problem solving'],
    creativeArts: ['Color identification', 'Basic shapes', 'Simple drawing', 'Creative expression']
  },
  1: { // Grade 1
    mathematics: ['Addition to 20', 'Subtraction basics', 'Number patterns', 'Money concepts'],
    english: ['Sight words', 'Reading comprehension', 'Writing sentences', 'Grammar basics'],
    science: ['Life cycles', 'Seasons', 'Materials properties', 'Scientific observation'],
    music: ['Rhythm patterns', 'High/low sounds', 'Musical notation basics', 'Singing'],
    computerScience: ['Simple algorithms', 'Basic coding concepts', 'Digital citizenship', 'Technology tools'],
    creativeArts: ['Art techniques', 'Creative projects', 'Color mixing', 'Art appreciation']
  }
  // ... Additional grades would be added here for complete K-12 coverage
};

/**
 * Content uniqueness system to ensure fresh content for each session
 */
export class ContentUniquenessSystem {
  private static sessionHistory: Map<string, ContentUniquenessTracker> = new Map();

  static generateUniqueContent(config: EnhancedLessonConfig): {
    themes: string[];
    scenarios: string[];
    activities: string[];
  } {
    const sessionId = config.sessionId || `session-${Date.now()}`;
    const history = this.sessionHistory.get(sessionId) || {
      sessionId,
      usedThemes: [],
      usedScenarios: [],
      usedActivities: [],
      lastGenerated: ''
    };

    // Generate fresh content pools
    const availableThemes = this.generateFreshThemes(config.subject, history.usedThemes);
    const availableScenarios = this.generateFreshScenarios(config.subject, history.usedScenarios);
    const availableActivities = this.generateFreshActivities(config.subject, history.usedActivities);

    // Update history
    history.usedThemes.push(...availableThemes.slice(0, 3));
    history.usedScenarios.push(...availableScenarios.slice(0, 5));
    history.usedActivities.push(...availableActivities.slice(0, 10));
    history.lastGenerated = new Date().toISOString();

    // Keep history manageable (last 50 items)
    history.usedThemes = history.usedThemes.slice(-50);
    history.usedScenarios = history.usedScenarios.slice(-50);
    history.usedActivities = history.usedActivities.slice(-50);

    this.sessionHistory.set(sessionId, history);

    return {
      themes: availableThemes,
      scenarios: availableScenarios,
      activities: availableActivities
    };
  }

  private static generateFreshThemes(subject: string, usedThemes: string[]): string[] {
    const allThemes = {
      mathematics: ['Detective Mystery', 'Space Adventure', 'Treasure Hunt', 'Time Travel', 'Animal Kingdom', 'Ocean Explorer', 'Super Hero Mission', 'Fantasy Quest', 'Sports Challenge', 'Cooking Adventure'],
      english: ['Story Adventure', 'Word Detective', 'Language Explorer', 'Book Quest', 'Writing Journey', 'Poetry Garden', 'Drama Stage', 'News Reporter', 'Author Workshop', 'Literary Journey'],
      science: ['Science Lab', 'Nature Explorer', 'Space Mission', 'Underwater World', 'Weather Station', 'Body Systems', 'Chemistry Magic', 'Physics Playground', 'Environmental Hero', 'Invention Station'],
      music: ['Musical Journey', 'Rhythm Quest', 'Melody Maker', 'Sound Explorer', 'Concert Hall', 'Instrument Adventure', 'Composer Studio', 'Music History', 'World Music Tour', 'Band Practice'],
      computerScience: ['Code Quest', 'Algorithm Adventure', 'Robot Mission', 'Digital World', 'Programming Playground', 'Logic Puzzle', 'Tech Inventor', 'Cyber Explorer', 'App Creator', 'Game Developer'],
      creativeArts: ['Art Studio', 'Creative Workshop', 'Design Challenge', 'Color Quest', 'Artistic Journey', 'Craft Adventure', 'Gallery Tour', 'Artist Studio', 'Creative Expression', 'Art History']
    };

    const subjectThemes = allThemes[subject as keyof typeof allThemes] || allThemes.mathematics;
    return subjectThemes.filter(theme => !usedThemes.includes(theme));
  }

  private static generateFreshScenarios(subject: string, usedScenarios: string[]): string[] {
    // Generate subject-specific scenarios that haven't been used
    const scenarioPool = this.getScenarioPool(subject);
    return scenarioPool.filter(scenario => !usedScenarios.includes(scenario));
  }

  private static generateFreshActivities(subject: string, usedActivities: string[]): string[] {
    // Generate subject-specific activities that haven't been used
    const activityPool = this.getActivityPool(subject);
    return activityPool.filter(activity => !usedActivities.includes(activity));
  }

  private static getScenarioPool(subject: string): string[] {
    // This would be expanded with hundreds of scenarios per subject
    return [
      `${subject}_scenario_1`,
      `${subject}_scenario_2`,
      `${subject}_scenario_3`,
      // ... many more scenarios
    ];
  }

  private static getActivityPool(subject: string): string[] {
    // This would be expanded with hundreds of activities per subject
    return [
      `${subject}_activity_1`,
      `${subject}_activity_2`,
      `${subject}_activity_3`,
      // ... many more activities
    ];
  }
}

/**
 * Generate enhanced lesson with 20-25 minute duration, unique content, and learning style adaptation
 */
export function generateEnhancedLesson(config: EnhancedLessonConfig): {
  phases: LessonActivity[];
  totalDuration: number;
  metadata: {
    subject: string;
    skillArea: string;
    gradeLevel: number;
    learningStyle: string;
    sessionId: string;
    targetDuration: string;
    createdAt: string;
    version: string;
  };
} {
  // Generate unique content for this session
  const uniqueContent = ContentUniquenessSystem.generateUniqueContent(config);
  
  // Determine target duration based on learning style
  const learningStyle = config.learningStyle || 'mixed';
  const durationAdjustment = LEARNING_STYLE_ADAPTATIONS[learningStyle].durationAdjustment;
  const baseDuration = 1350; // 22.5 minutes base
  const targetDuration = Math.floor(baseDuration * durationAdjustment);
  
  // Create base lesson using existing system
  const baseLesson = createStandardLesson(config);
  
  // Enhance each phase with unique content and learning style adaptations
  const enhancedPhases = baseLesson.phases.map((phase, index) => {
    const phaseType = phase.phase as keyof typeof ENHANCED_LESSON_PHASES;
    const phaseConfig = ENHANCED_LESSON_PHASES[phaseType];
    
    if (!phaseConfig) {
      return phase; // Return unchanged if no config found
    }
    
    // Calculate adaptive duration
    const phaseDuration = Math.floor((phaseConfig.basePercentage / 100) * targetDuration);
    
    return {
      ...phase,
      duration: phaseDuration,
      content: {
        ...phase.content,
        // Add learning style specific adaptations
        learningStyleAdaptation: LEARNING_STYLE_ADAPTATIONS[learningStyle],
        uniqueTheme: uniqueContent.themes[index % uniqueContent.themes.length],
        gradeLevel: config.gradeLevel,
        curriculum: K12_CURRICULUM_STANDARDS[config.gradeLevel as keyof typeof K12_CURRICULUM_STANDARDS]?.[config.subject as keyof typeof K12_CURRICULUM_STANDARDS[0]]
      }
    };
  });

  const finalDuration = enhancedPhases.reduce((sum, phase) => sum + phase.duration, 0);

  return {
    phases: enhancedPhases,
    totalDuration: finalDuration,
    metadata: {
      subject: config.subject,
      skillArea: config.skillArea,
      gradeLevel: config.gradeLevel,
      learningStyle,
      sessionId: config.sessionId || `session-${Date.now()}`,
      targetDuration: `${Math.floor(finalDuration/60)} minutes ${finalDuration%60} seconds`,
      createdAt: new Date().toISOString(),
      version: '2.0-enhanced'
    }
  };
}

/**
 * Validate enhanced lesson meets requirements
 */
export function validateEnhancedLesson(lesson: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  qualityScore: number;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  let qualityScore = 0;

  // Duration validation (20-25 minutes = 1200-1500 seconds)
  if (lesson.totalDuration < 1200) {
    errors.push(`Lesson duration ${lesson.totalDuration}s is below minimum 20 minutes (1200s)`);
  } else if (lesson.totalDuration > 1500) {
    errors.push(`Lesson duration ${lesson.totalDuration}s exceeds maximum 25 minutes (1500s)`);
  } else {
    qualityScore += 25;
  }

  // Content uniqueness validation
  if (lesson.metadata?.sessionId) {
    qualityScore += 20;
  } else {
    warnings.push('No session ID provided for content uniqueness tracking');
  }

  // Learning style adaptation validation
  if (lesson.phases?.some((phase: any) => phase.content?.learningStyleAdaptation)) {
    qualityScore += 25;
  } else {
    warnings.push('Learning style adaptations not found in lesson phases');
  }

  // Grade level curriculum alignment validation
  if (lesson.metadata?.gradeLevel !== undefined && lesson.phases?.some((phase: any) => phase.content?.curriculum)) {
    qualityScore += 20;
  } else {
    warnings.push('Grade level curriculum alignment not found');
  }

  // Phase structure validation
  if (lesson.phases?.length >= 6) {
    qualityScore += 10;
  } else {
    errors.push('Lesson must have at least 6 phases for complete learning experience');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    qualityScore
  };
}