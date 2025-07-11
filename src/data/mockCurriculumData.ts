import { CurriculumNode } from '@/types/curriculum/index';

// Mock curriculum data for testing and development
export const mockCurriculumData: CurriculumNode[] = [
  // USA - Root country node
  {
    id: 'us',
    parentId: null,
    nodeType: 'country',
    name: 'United States',
    description: 'K-12 Education System in the United States',
    countryCode: 'US',
    languageCode: 'en'
  },
  
  // Grade levels in the US
  {
    id: 'us-k',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Kindergarten',
    description: 'Kindergarten level education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K'
  },
  {
    id: 'us-g1',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 1',
    description: 'First grade education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1'
  },
  {
    id: 'us-g6',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 6',
    description: 'Sixth grade education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6'
  },

  // Mathematics subject for different grades
  {
    id: 'us-k-math',
    parentId: 'us-k',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'Kindergarten Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    tags: ['foundational', 'number-sense']
  },
  {
    id: 'us-g1-math',
    parentId: 'us-g1',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'Grade 1 Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    tags: ['foundational', 'addition', 'subtraction']
  },
  {
    id: 'us-g6-math',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'Grade 6 Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    tags: ['ratios', 'algebra-readiness']
  },

  // Ratios and Proportional Relationships domain for Grade 6
  {
    id: 'us-g6-math-rp',
    parentId: 'us-g6-math',
    nodeType: 'domain',
    name: 'Ratios and Proportional Relationships',
    description: 'Understand ratio concepts and use ratio reasoning to solve problems',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    sourceIdentifier: '6.RP',
    tags: ['ratios', 'proportions']
  },

  // Topics within Ratios and Proportional Relationships
  {
    id: 'us-g6-math-rp-1',
    parentId: 'us-g6-math-rp',
    nodeType: 'topic',
    name: 'Understanding Ratios',
    description: 'Understand the concept of a ratio and use ratio language',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    sourceIdentifier: '6.RP.A.1',
    estimatedDuration: 45,
    tags: ['ratios', 'conceptual']
  },

  // Learning objectives within Understanding Ratios
  {
    id: 'us-g6-math-rp-1-obj1',
    parentId: 'us-g6-math-rp-1',
    nodeType: 'learning_objective',
    name: 'Describe ratio relationships',
    description: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    sourceIdentifier: '6.RP.A.1',
    estimatedDuration: 25,
    assessmentTypes: ['formative', 'summative'],
    preferredTeachingMethods: ['hands_on', 'discussion']
  },

  // Knowledge Components for the learning objective
  {
    id: 'us-g6-math-rp-1-obj1-kc1',
    parentId: 'us-g6-math-rp-1-obj1',
    nodeType: 'kc',
    name: 'Define ratio',
    description: 'Define what a ratio is and identify ratio relationships',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    estimatedDuration: 10,
    assessmentTypes: ['formative'],
    tags: ['definition', 'vocabulary']
  },
  {
    id: 'us-g6-math-rp-1-obj1-kc2',
    parentId: 'us-g6-math-rp-1-obj1',
    nodeType: 'kc',
    name: 'Use ratio language',
    description: 'Use appropriate language to describe ratio relationships',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    estimatedDuration: 15,
    assessmentTypes: ['formative', 'peer'],
    prerequisites: ['us-g6-math-rp-1-obj1-kc1'],
    tags: ['communication', 'application']
  },

  // Other subjects for variety
  {
    id: 'us-g6-ela',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'English Language Arts',
    description: 'Grade 6 English Language Arts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subjectSpecific: {
      proficiencyLevel: 'intermediate',
      linguisticSkill: 'reading'
    }
  },

  // Science subject with enhanced metadata
  {
    id: 'us-g6-science',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'Science',
    description: 'Grade 6 Science',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Science',
    subjectSpecific: {
      labRequired: true,
      safetyConsiderations: ['eye_protection', 'chemical_handling'],
      experimentType: 'hypothesis_testing'
    }
  },

  // Denmark example for international support
  {
    id: 'dk',
    parentId: null,
    nodeType: 'country',
    name: 'Denmark',
    description: 'Danish Education System',
    countryCode: 'DK',
    languageCode: 'da'
  },
  {
    id: 'dk-g6',
    parentId: 'dk',
    nodeType: 'grade_level',
    name: '6. klasse',
    description: 'Sixth grade in Danish system',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6'
  },
  {
    id: 'dk-g6-math',
    parentId: 'dk-g6',
    nodeType: 'subject',
    name: 'Matematik',
    description: '6. klasse matematik',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Mathematics'
  }
];
