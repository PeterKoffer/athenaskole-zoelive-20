
export interface EnhancedLessonConfig {
  id?: string;
  title?: string;
  overview?: string;
  gradeLevel?: number;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  subject: string;
  skillArea: string;
  difficulty?: number;
  estimatedDuration?: number;
  objectives?: string[];
  prerequisites?: string[];
  assessmentCriteria?: string[];
  materials?: string[];
  extensions?: string[];
  phases?: any[];
  sessionId?: string;
  learningObjectives?: string[];
  hook?: string;
  realWorldExample?: string;
  thoughtQuestion?: string;
  contentSegments?: any[];
  gameType?: string;
  gameInstructions?: string;
  gameQuestion?: string;
  gameOptions?: string[];
  gameCorrectAnswer?: number;
  gameExplanation?: string;
  applicationScenario?: string;
  problemSteps?: any[];
  creativePrompt?: string;
  whatIfScenario?: string;
  explorationTask?: string;
  keyTakeaways?: string[];
  selfAssessment?: any;
  nextTopicSuggestion?: string;
  estimatedTotalDuration?: number;
  assessmentMethods?: string[];
  keywords?: string[];
}

export const ENHANCED_LESSON_PHASES = {
  introduction: {
    baseSeconds: 180, // 2-3 minutes
    name: 'Introduction',
    description: 'Engaging hook and real-world connections'
  },
  contentDelivery: {
    baseSeconds: 390, // 5-7 minutes
    name: 'Content Delivery',
    description: 'Core concepts with comprehension checks'
  },
  interactiveGame: {
    baseSeconds: 270, // 4-5 minutes
    name: 'Interactive Game',
    description: 'Fun activities to reinforce learning'
  },
  application: {
    baseSeconds: 210, // 3-4 minutes
    name: 'Application',
    description: 'Real-world problem solving'
  },
  creativeExploration: {
    baseSeconds: 150, // 2-3 minutes
    name: 'Creative Exploration',
    description: 'Open-ended thinking and creativity'
  },
  summary: {
    baseSeconds: 90, // 1-2 minutes
    name: 'Summary',
    description: 'Key takeaways and next steps'
  }
};

export const K12_CURRICULUM_STANDARDS = {
  0: {
    mathematics: ['Number recognition', 'Counting', 'Basic shapes', 'Patterns'],
    english: ['Letter recognition', 'Phonics', 'Basic vocabulary', 'Simple sentences'],
    science: ['Observation', 'Living vs non-living', 'Weather', 'Senses']
  },
  1: {
    mathematics: ['Addition within 20', 'Subtraction within 20', 'Place value', 'Time'],
    english: ['Reading simple texts', 'Writing sentences', 'Grammar basics', 'Spelling'],
    science: ['Animal habitats', 'Plant life cycles', 'Seasons', 'Materials']
  },
  2: {
    mathematics: ['Addition within 100', 'Subtraction within 100', 'Measurement', 'Data'],
    english: ['Reading comprehension', 'Writing paragraphs', 'Vocabulary building', 'Punctuation'],
    science: ['Life cycles', 'States of matter', 'Forces', 'Earth materials']
  },
  3: {
    mathematics: ['Multiplication', 'Division', 'Fractions', 'Area and perimeter'],
    english: ['Opinion writing', 'Research skills', 'Text analysis', 'Grammar rules'],
    science: ['Ecosystems', 'Heredity', 'Weather patterns', 'Motion']
  },
  4: {
    mathematics: ['Multi-digit operations', 'Fraction operations', 'Decimals', 'Angles'],
    english: ['Informative writing', 'Literary analysis', 'Vocabulary in context', 'Language conventions'],
    science: ['Energy', 'Waves', 'Rock cycle', 'Animal structures']
  },
  5: {
    mathematics: ['Decimal operations', 'Volume', 'Coordinate plane', 'Algebraic thinking'],
    english: ['Narrative writing', 'Text comparison', 'Figurative language', 'Research writing'],
    science: ['Matter interactions', 'Earth systems', 'Ecosystems interactions', 'Space']
  },
  6: {
    mathematics: ['Ratios', 'Proportions', 'Integers', 'Statistics'],
    english: ['Argumentative writing', 'Text evidence', 'Academic vocabulary', 'Grammar analysis'],
    science: ['Cell structure', 'Genetics', 'Energy transfer', 'Weather systems']
  },
  7: {
    mathematics: ['Linear equations', 'Probability', 'Geometry', 'Proportional reasoning'],
    english: ['Literary devices', 'Research projects', 'Argument analysis', 'Language variation'],
    science: ['Chemical reactions', 'Heredity patterns', 'Ecosystems dynamics', 'Earth history']
  },
  8: {
    mathematics: ['Functions', 'Systems of equations', 'Transformations', 'Data analysis'],
    english: ['Complex texts', 'Rhetorical analysis', 'Research synthesis', 'Language evolution'],
    science: ['Atomic structure', 'Evolution', 'Waves and energy', 'Human impact']
  },
  9: {
    mathematics: ['Algebra I', 'Quadratic functions', 'Exponential functions', 'Statistics'],
    english: ['Literary criticism', 'Research methodology', 'Rhetorical strategies', 'Language analysis'],
    science: ['Chemistry principles', 'Biology systems', 'Physics concepts', 'Environmental science']
  },
  10: {
    mathematics: ['Geometry', 'Trigonometry', 'Proof writing', 'Mathematical modeling'],
    english: ['World literature', 'Advanced composition', 'Critical thinking', 'Media literacy'],
    science: ['Advanced chemistry', 'Advanced biology', 'Advanced physics', 'Scientific research']
  },
  11: {
    mathematics: ['Algebra II', 'Pre-calculus', 'Statistics', 'Mathematical reasoning'],
    english: ['American literature', 'Research writing', 'Literary theory', 'Public speaking'],
    science: ['Organic chemistry', 'Genetics and biotechnology', 'Modern physics', 'Environmental systems']
  },
  12: {
    mathematics: ['Calculus', 'Advanced statistics', 'Discrete mathematics', 'Mathematical applications'],
    english: ['British literature', 'Advanced rhetoric', 'Independent research', 'Professional writing'],
    science: ['Advanced placement sciences', 'Research projects', 'Scientific methodology', 'Ethics in science']
  }
};

export const generateEnhancedLesson = async (subject: string, skillArea: string): Promise<EnhancedLessonConfig> => {
  const baseConfig: EnhancedLessonConfig = {
    id: `lesson_${subject}_${skillArea}_${Date.now()}`,
    title: `${subject} - ${skillArea}`,
    overview: `Enhanced learning experience for ${subject} focusing on ${skillArea}`,
    gradeLevel: 3,
    learningStyle: 'mixed',
    subject,
    skillArea,
    difficulty: 1,
    estimatedDuration: 30,
    objectives: [`Learn ${skillArea} concepts`, `Apply ${skillArea} skills`, `Master ${skillArea} fundamentals`],
    prerequisites: ['Basic foundational knowledge'],
    assessmentCriteria: ['Understanding of concepts', 'Application of skills', 'Problem-solving ability'],
    materials: ['Interactive content', 'Practice exercises', 'Assessment tools'],
    extensions: ['Advanced practice', 'Real-world applications', 'Creative projects'],
    phases: []
  };

  return baseConfig;
};
