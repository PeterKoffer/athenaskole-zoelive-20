import { LessonActivity } from '../types/LessonTypes';
import { StandardLessonConfig, createStandardLesson } from './StandardLessonTemplate';
import EnhancedContentUniquenessSystem from './EnhancedContentUniquenessSystem';

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
  },
  2: { // Grade 2
    mathematics: ['Addition/Subtraction up to 100', 'Place Value (Hundreds)', 'Basic Fractions Intro', 'Telling Time (Quarter Hour)'],
    english: ['Reading Simple Chapters', 'Writing Short Stories (Descriptive)', 'Compound Words', 'Verb Tenses (Present/Past/Future)'],
    science: ['States of Matter (Solid/Liquid/Gas)', 'Animal Life Cycles (Advanced)', 'Simple Machines Intro (Lever/Wheel)', 'Earth & Sun Interactions'],
    music: ['Melody basics', 'Instrument families', 'Dynamic variations (loud/soft)'],
    computerScience: ['Block-based programming intro', 'Debugging simple programs', 'Online safety basics'],
    creativeArts: ['Primary/Secondary colors', 'Basic sculpting (clay)', 'Storytelling through drawing'],
    mentalWellness: ['Identifying Feelings (Happy/Sad/Angry/Scared)', 'Sharing with Others', 'Asking for Help Nicely'],
    globalGeography: ['My Local Community Map', 'Neighborhood Features', 'Cardinal Directions (N,S,E,W)'],
    bodyLab: ['Fun Ways to Move (Running/Jumping/Dancing)', 'Importance of Sleep', 'Healthy Food Groups Intro']
  },
  5: { // Grade 5
    mathematics: ['Decimal Operations', 'Fraction Operations (Add/Subtract/Multiply)', 'Volume & Area of 3D Shapes', 'Order of Operations'],
    english: ['Analyzing Character Development', 'Writing Persuasive Essays', 'Figurative Language (Metaphor/Simile)', 'Complex Sentences'],
    science: ['Ecosystems & Food Webs', 'Water Cycle & Weather Systems', 'Properties of Light & Sound', 'Human Body Systems Overview'],
    music: ['Reading sheet music (basic notes)', 'Composing simple melodies', 'Music genres overview'],
    computerScience: ['Variables and loops', 'Basic game design concepts', 'Understanding algorithms'],
    creativeArts: ['Perspective drawing', 'Advanced color theory (analogous/complementary)', 'Creating comic strips'],
    mentalWellness: ['Managing Stress (Simple Techniques)', 'Understanding Empathy', 'Positive Self-Talk Basics'],
    worldHistoryReligions: ['Ancient Egypt (Daily Life, Pyramids)', 'Introduction to Greek Mythology', 'Early American History Snippets'],
    globalGeography: ['Continents and Oceans Detailed', 'Map Reading Skills (Latitude/Longitude)', 'World Climates Overview'],
    bodyLab: ["What's in My Food? (Nutrients Basics)", 'Importance of Regular Exercise', 'Understanding Hygiene'],
  },
  8: { // Grade 8
    mathematics: ['Pre-Algebra Concepts (Linear Equations)', 'Pythagorean Theorem', 'Probability & Statistics Basics', 'Geometric Transformations'],
    english: ['Analyzing Theme & Author\'s Purpose', 'Writing Research Reports', 'Advanced Grammar (Clauses, Punctuation)', 'Shakespeare Intro'],
    science: ['Newton\'s Laws of Motion', 'Periodic Table Introduction', 'Cellular Biology Basics', 'Plate Tectonics'],
    music: ['Chord progressions', 'Music history periods overview', 'Songwriting basics'],
    computerScience: ['Text-based programming (Python/JS intro)', 'Data representation (binary basics)', 'Cybersecurity awareness'],
    creativeArts: ['Digital art software intro', 'Exploring different art movements', 'Portfolio development basics'],
    mentalWellness: ['Healthy Relationships (Friends, Family)', 'Coping with Peer Pressure', 'Digital Well-being & Social Media'],
    worldHistoryReligions: ['The Roman Empire (Rise & Fall)', 'Medieval Societies (Europe/Asia)', 'Introduction to Major World Religions (Origins, Core Tenets)'],
    globalGeography: ['Climate Zones & Biomes In-depth', 'Globalization & Interdependence', 'Cultural Geography Basics'],
    bodyLab: ['Fitness Planning & Goal Setting', 'Understanding Mental Health Stigma', 'Effects of Substance Abuse (Intro)'],
    lifeEssentials: ['Introduction to Budgeting (Needs vs Wants)', 'Basic Banking Concepts', 'Time Management Skills']
  },
  10: { // Grade 10
    mathematics: ['Algebra II (Quadratics, Polynomials)', 'Trigonometry Basics', 'Advanced Statistics (Data Analysis)', 'Logarithms'],
    english: ['Critical Literary Analysis (Symbolism, Tone)', 'Writing Argumentative/Analytical Essays', 'Rhetorical Devices', 'World Literature Survey'],
    science: ['Genetics & Heredity', 'Chemical Reactions & Stoichiometry', 'Electromagnetism Basics', 'Environmental Science Issues'],
    music: ['Advanced music theory', 'Arranging music', 'Music production software intro'],
    computerScience: ['Object-Oriented Programming concepts', 'Web development basics (HTML/CSS/JS)', 'Database fundamentals'],
    creativeArts: ['Advanced digital art techniques', 'Independent art projects', 'Art criticism and analysis'],
    mentalWellness: ['Mindfulness Techniques for Stress Reduction', 'Understanding Anxiety & Depression (Signs, Seeking Help)', 'Conflict Resolution Skills'],
    worldHistoryReligions: ['Impact of World Wars', 'Cold War Era', 'Comparative Study of World Religions (Ethics, Philosophies)'],
    globalGeography: ['Globalization Patterns & Impacts', 'Geopolitics & International Relations', 'Sustainable Development Goals'],
    bodyLab: ['Advanced Nutrition (Micronutrients, Diet Planning)', 'Mental Well-being Strategies (CBT basics)', 'Long-term Fitness Programming'],
    lifeEssentials: ['Understanding Credit & Debt', 'Basic Investments (Stocks, Bonds Intro)', 'Renting vs Buying Housing (Pros/Cons)', 'Job Application & Interview Skills']
  }
  // ... Additional grades would be added here for complete K-12 coverage
};

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
  // Generate unique content using the enhanced system
  const uniqueContent = EnhancedContentUniquenessSystem.generateUniqueContent({
    subject: config.subject,
    sessionId: config.sessionId
  });
  
  console.log('🎨 Using enhanced unique content system:', {
    subject: config.subject,
    sessionId: config.sessionId?.substring(0, 12) + '...',
    contentGenerated: {
      themes: uniqueContent.themes.length,
      scenarios: uniqueContent.scenarios.length,
      activities: uniqueContent.activities.length,
      contexts: uniqueContent.contexts.length
    }
  });
  
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
    
    // Get unique content for this phase
    const themeIndex = index % uniqueContent.themes.length;
    const scenarioIndex = index % uniqueContent.scenarios.length;
    const activityIndex = index % uniqueContent.activities.length;
    const contextIndex = index % uniqueContent.contexts.length;
    
    return {
      ...phase,
      duration: phaseDuration,
      content: {
        ...phase.content,
        // Add learning style specific adaptations
        learningStyleAdaptation: LEARNING_STYLE_ADAPTATIONS[learningStyle],
        uniqueTheme: uniqueContent.themes[themeIndex],
        uniqueScenario: uniqueContent.scenarios[scenarioIndex],
        uniqueActivity: uniqueContent.activities[activityIndex],
        uniqueContext: uniqueContent.contexts[contextIndex],
        gradeLevel: config.gradeLevel,
        curriculum: K12_CURRICULUM_STANDARDS[config.gradeLevel as keyof typeof K12_CURRICULUM_STANDARDS]?.[config.subject as keyof typeof K12_CURRICULUM_STANDARDS[0]]
      }
    };
  });

  const finalDuration = enhancedPhases.reduce((sum, phase) => sum + phase.duration, 0);

  console.log('✅ Enhanced lesson generated:', {
    subject: config.subject,
    gradeLevel: config.gradeLevel,
    learningStyle,
    duration: `${Math.floor(finalDuration/60)}m ${finalDuration%60}s`,
    phases: enhancedPhases.length,
    uniqueContentUsed: {
      themes: uniqueContent.themes.slice(0, 3),
      firstScenario: uniqueContent.scenarios[0]?.substring(0, 50) + '...',
      firstActivity: uniqueContent.activities[0]?.substring(0, 50) + '...'
    }
  });

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
      version: '2.1-enhanced-unique'
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
