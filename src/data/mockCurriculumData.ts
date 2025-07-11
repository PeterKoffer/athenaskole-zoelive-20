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
  },

  // --- Enhancements for USA ELA (Grade 6) ---
  {
    id: 'us-g6-ela-rl',
    parentId: 'us-g6-ela', // Assumes 'us-g6-ela' subject node exists
    nodeType: 'domain',
    name: 'Reading: Literature',
    description: 'Key Ideas and Details in Literature for Grade 6.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.6',
    tags: ['literature', 'reading_comprehension', 'analysis']
  },
  {
    id: 'us-g6-ela-rl-1',
    parentId: 'us-g6-ela-rl',
    nodeType: 'learning_objective',
    name: 'Cite textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.',
    description: 'Students will be able to accurately quote or paraphrase evidence from the text to support their understanding and interpretations.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.6.1',
    assessmentTypes: ['formative', 'summative', 'project'],
    preferredTeachingMethods: ['close_reading', 'text-based_discussion', 'modeling'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      proficiencyLevel: 'native', // For US ELA context
    },
    tags: ['textual_evidence', 'inference', 'analysis']
  },
  {
    id: 'us-g6-ela-rl-1-kc1',
    parentId: 'us-g6-ela-rl-1',
    nodeType: 'kc',
    name: 'Identify explicit textual evidence',
    description: 'Skill of locating sentences or phrases in the text that directly state a piece of information.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    estimatedDuration: 20, // minutes
    subjectSpecific: {
      linguisticSkill: 'reading',
      proficiencyLevel: 'native',
    }
  },
  {
    id: 'us-g6-ela-rl-1-kc2',
    parentId: 'us-g6-ela-rl-1',
    nodeType: 'kc',
    name: 'Draw inferences from textual details',
    description: 'Skill of combining textual clues with background knowledge to make a logical conclusion not explicitly stated.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    estimatedDuration: 30, // minutes
    subjectSpecific: {
      linguisticSkill: 'reading',
      proficiencyLevel: 'native',
    }
  },

  // --- Adding Danish Language Arts ("Dansk") for Denmark Grade 6 ---
  {
    id: 'dk-g6-dansk',
    parentId: 'dk-g6', // Assumes 'dk-g6' grade level node exists
    nodeType: 'subject',
    name: 'Dansk',
    description: '6. klasse Dansk (Danish Language Arts)',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Danish Language Arts', // Standardized name
    tags: ['danish', 'native_language']
  },
  {
    id: 'dk-g6-dansk-laesning',
    parentId: 'dk-g6-dansk',
    nodeType: 'domain',
    name: 'Læsning (Reading)',
    description: 'Fokus på læsefærdigheder og tekstforståelse i 6. klasse.',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Danish Language Arts',
    tags: ['læsning', 'reading_comprehension']
  },
  {
    id: 'dk-g6-dansk-laesning-obj1',
    parentId: 'dk-g6-dansk-laesning',
    nodeType: 'learning_objective',
    name: 'Eleven kan sammenfatte hovedindholdet af en tekst (The student can summarize the main content of a text).',
    description: 'Fælles Mål, Dansk, Læsning, Kompetenceområde: Tekstforståelse, efter 6. kl.',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Danish Language Arts',
    sourceIdentifier: 'FM-DA-LAE-6-TEKSTFORSTAAELSE-1', // Example Fælles Mål identifier
    subjectSpecific: {
      linguisticSkill: 'reading',
      proficiencyLevel: 'native', // For Danish in Denmark
    },
    tags: ['summarize', 'hovedindhold', 'tekstforståelse']
  },

  // --- Adding English as a Foreign Language for Denmark Grade 6 ---
  {
    id: 'dk-g6-engelsk',
    parentId: 'dk-g6', // Assumes 'dk-g6' grade level node exists
    nodeType: 'subject',
    name: 'Engelsk',
    description: '6. klasse Engelsk (English as a Foreign Language)',
    countryCode: 'DK',
    languageCode: 'da', // The curriculum itself is likely in Danish
    educationalLevel: '6',
    subjectName: 'English as a Foreign Language', // Standardized name
    tags: ['english', 'foreign_language', 'efl']
  },
  {
    id: 'dk-g6-engelsk-mundtlig',
    parentId: 'dk-g6-engelsk',
    nodeType: 'domain',
    name: 'Mundtlig kommunikation (Oral Communication)',
    description: 'Fokus på mundtlige engelskfærdigheder i 6. klasse.',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'English as a Foreign Language',
    tags: ['speaking', 'listening', 'oral_communication']
  },
  {
    id: 'dk-g6-engelsk-mundtlig-obj1',
    parentId: 'dk-g6-engelsk-mundtlig',
    nodeType: 'learning_objective',
    name: 'Eleven kan deltage i enkle, forberedte samtaler om nære emner (The student can participate in simple, prepared conversations about familiar topics).',
    description: 'Fælles Mål, Engelsk, Mundtlig Kommunikation, Kompetenceområde: Samtale, efter 6. kl.',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'English as a Foreign Language',
    sourceIdentifier: 'FM-EN-MUN-6-SAMTALE-1', // Example Fælles Mål identifier
    subjectSpecific: {
      targetLanguage: 'en',
      linguisticSkill: 'speaking',
      proficiencyLevel: 'beginner', // Or A1/A2 level for CEFR if applicable
    },
    tags: ['conversation', 'dialogue', 'familiar_topics']
  }
];
