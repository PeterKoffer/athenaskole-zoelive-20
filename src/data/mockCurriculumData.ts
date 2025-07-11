
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const mockCurriculumData: CurriculumNode[] = [
  // Root countries
  {
    id: 'us',
    parentId: null,
    nodeType: 'country',
    name: 'United States',
    countryCode: 'US',
    languageCode: 'en'
  },
  {
    id: 'dk',
    parentId: null,
    nodeType: 'country',
    name: 'Denmark',
    countryCode: 'DK',
    languageCode: 'da'
  },

  // Grade levels for US
  {
    id: 'us-g3',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 3',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3'
  },
  {
    id: 'us-g6',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 6',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6'
  },

  // Grade levels for Denmark
  {
    id: 'dk-g6',
    parentId: 'dk',
    nodeType: 'grade_level',
    name: '6. klasse',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6'
  },

  // Subjects for US Grade 3
  {
    id: 'us-g3-math',
    parentId: 'us-g3',
    nodeType: 'subject',
    name: 'Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },

  // Subjects for US Grade 6
  {
    id: 'us-g6-math',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },
  {
    id: 'us-g6-ela',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'English Language Arts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH
  },

  // Subjects for Denmark Grade 6
  {
    id: 'dk-g6-math',
    parentId: 'dk-g6',
    nodeType: 'subject',
    name: 'Matematik',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },
  {
    id: 'dk-g6-engelsk',
    parentId: 'dk-g6',
    nodeType: 'subject',
    name: 'Engelsk',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'World Languages',
    subject: NELIESubject.WORLD_LANGUAGES
  },

  // Domains for US Grade 3 Math
  {
    id: 'us-g3-math-oa',
    parentId: 'us-g3-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.3.OA'
  },

  // Topics for US Grade 3 Math OA
  {
    id: 'us-g3-math-oa-1',
    parentId: 'us-g3-math-oa',
    nodeType: 'topic',
    name: 'Interpret products of whole numbers',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.3.OA.A.1'
  },

  // Learning objectives for US Grade 3 Math
  {
    id: 'us-g3-math-oa-1-obj1',
    parentId: 'us-g3-math-oa-1',
    nodeType: 'learning_objective',
    name: 'Interpret products of whole numbers',
    description: 'Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.3.OA.A.1',
    estimatedDuration: 45,
    tags: ['foundational', 'multiplication']
  },

  // Knowledge components for US Grade 3 Math
  {
    id: 'us-g3-math-oa-1-obj1-kc1',
    parentId: 'us-g3-math-oa-1-obj1',
    nodeType: 'kc',
    name: 'Understand multiplication as groups',
    description: 'Understand that multiplication represents equal groups',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 20,
    tags: ['foundational'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'word_problem'
    }
  },
  {
    id: 'us-g3-math-oa-1-obj1-kc2',
    parentId: 'us-g3-math-oa-1-obj1',
    nodeType: 'kc',
    name: 'Count objects in equal groups',
    description: 'Count the total number of objects arranged in equal groups',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 20,
    tags: ['foundational'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'computation'
    }
  },

  // Domains for US Grade 6 Math
  {
    id: 'us-g6-math-rp',
    parentId: 'us-g6-math',
    nodeType: 'domain',
    name: 'Ratios and Proportional Relationships',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.6.RP'
  },

  // Topics for US Grade 6 Math RP
  {
    id: 'us-g6-math-rp-1',
    parentId: 'us-g6-math-rp',
    nodeType: 'topic',
    name: 'Understand ratio concepts and use ratio reasoning',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.6.RP.A'
  },

  // Learning objectives for US Grade 6 Math
  {
    id: 'us-g6-math-rp-1-obj1',
    parentId: 'us-g6-math-rp-1',
    nodeType: 'learning_objective',
    name: 'Understand the concept of a ratio',
    description: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.6.RP.A.1',
    estimatedDuration: 50,
    tags: ['ratios', 'proportional_reasoning']
  },

  // Knowledge components for US Grade 6 Math
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
    subject: NELIESubject.MATH,
    estimatedDuration: 25,
    tags: ['definition'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'word_problem'
    }
  },

  // Domains for US Grade 6 ELA
  {
    id: 'us-g6-ela-rl',
    parentId: 'us-g6-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.6'
  },

  // Learning objectives for US Grade 6 ELA
  {
    id: 'us-g6-ela-rl-1',
    parentId: 'us-g6-ela-rl',
    nodeType: 'learning_objective',
    name: 'Cite textual evidence',
    description: 'Cite textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.6.1',
    estimatedDuration: 45,
    tags: ['textual_evidence', 'analysis']
  },

  // Knowledge components for US Grade 6 ELA
  {
    id: 'us-g6-ela-rl-1-kc1',
    parentId: 'us-g6-ela-rl-1',
    nodeType: 'kc',
    name: 'Identify explicit textual evidence',
    description: 'Find direct statements in text that support analysis',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 20,
    tags: ['textual_evidence'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },
  {
    id: 'us-g6-ela-rl-1-kc2',
    parentId: 'us-g6-ela-rl-1',
    nodeType: 'kc',
    name: 'Make inferences from text',
    description: 'Draw logical conclusions from textual evidence',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 25,
    tags: ['inference'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },

  // Danish curriculum content
  {
    id: 'dk-g6-engelsk-mundtlig',
    parentId: 'dk-g6-engelsk',
    nodeType: 'domain',
    name: 'Mundtlig kommunikation',
    description: 'Oral communication skills in English',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'World Languages',
    subject: NELIESubject.WORLD_LANGUAGES
  },

  // Learning objective for Danish English
  {
    id: 'dk-g6-engelsk-mundtlig-obj1',
    parentId: 'dk-g6-engelsk-mundtlig',
    nodeType: 'learning_objective',
    name: 'Deltage i samtaler',
    description: 'Participate in conversations and dialogues in English',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'World Languages',
    subject: NELIESubject.WORLD_LANGUAGES,
    estimatedDuration: 40,
    tags: ['speaking', 'conversation'],
    subjectSpecific: {
      linguisticSkill: 'speaking',
      interactionType: 'discussion'
    }
  }
];
