
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';

export const usMathCurriculumNodes: CurriculumNode[] = [
  // US Math Root
  {
    id: 'us-math',
    parentId: 'us',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'K-12 Mathematics curriculum following Common Core State Standards',
    countryCode: 'US',
    languageCode: 'en',
    subjectName: 'Mathematics',
    tags: ['core_subject', 'stem']
  },

  // Kindergarten Math
  {
    id: 'us-k-math',
    parentId: 'us-math',
    nodeType: 'course',
    name: 'Kindergarten Mathematics',
    description: 'Foundational math concepts for kindergarten students',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    estimatedDuration: 180,
    tags: ['foundational', 'early_childhood']
  },

  // K.CC - Counting and Cardinality
  {
    id: 'k-cc',
    parentId: 'us-k-math',
    nodeType: 'domain',
    name: 'Counting and Cardinality',
    description: 'Understanding numbers and counting sequences',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    sourceIdentifier: 'K.CC',
    tags: ['counting', 'numbers']
  },

  {
    id: 'k-cc-1',
    parentId: 'k-cc',
    nodeType: 'learning_objective',
    name: 'Count to 100 by ones and by tens',
    description: 'Count to 100 by ones and by tens',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    sourceIdentifier: 'K.CC.A.1',
    estimatedDuration: 30,
    tags: ['counting', 'sequences']
  },

  {
    id: 'k-cc-2',
    parentId: 'k-cc',
    nodeType: 'learning_objective',
    name: 'Count forward beginning from a given number',
    description: 'Count forward beginning from a given number within the known sequence',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    sourceIdentifier: 'K.CC.A.2',
    estimatedDuration: 25,
    tags: ['counting', 'number_sequence']
  },

  {
    id: 'k-cc-3',
    parentId: 'k-cc',
    nodeType: 'learning_objective',
    name: 'Write numbers from 0 to 20',
    description: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    sourceIdentifier: 'K.CC.A.3',
    estimatedDuration: 35,
    tags: ['number_writing', 'representation']
  },

  // K.OA - Operations and Algebraic Thinking
  {
    id: 'k-oa',
    parentId: 'us-k-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Understanding addition and subtraction with numbers 0-10',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    sourceIdentifier: 'K.OA',
    tags: ['operations', 'addition', 'subtraction']
  },

  {
    id: 'k-oa-1',
    parentId: 'k-oa',
    nodeType: 'learning_objective',
    name: 'Represent addition and subtraction',
    description: 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds, acting out situations, verbal explanations, expressions, or equations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    sourceIdentifier: 'K.OA.A.1',
    estimatedDuration: 40,
    tags: ['addition', 'subtraction', 'representation']
  },

  // Grade 1 Math
  {
    id: 'us-1-math',
    parentId: 'us-math',
    nodeType: 'course',
    name: 'Grade 1 Mathematics',
    description: 'First grade mathematics building on kindergarten foundations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    estimatedDuration: 200,
    prerequisites: ['us-k-math'],
    tags: ['elementary', 'foundational']
  },

  // 1.OA - Operations and Algebraic Thinking
  {
    id: '1-oa',
    parentId: 'us-1-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving addition and subtraction',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    sourceIdentifier: '1.OA',
    tags: ['operations', 'problem_solving']
  },

  {
    id: '1-oa-1',
    parentId: '1-oa',
    nodeType: 'learning_objective',
    name: 'Addition and subtraction word problems',
    description: 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    sourceIdentifier: '1.OA.A.1',
    estimatedDuration: 45,
    prerequisites: ['k-oa-1'],
    tags: ['word_problems', 'addition', 'subtraction']
  },

  {
    id: '1-oa-2',
    parentId: '1-oa',
    nodeType: 'learning_objective',
    name: 'Three numbers addition and subtraction',
    description: 'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    sourceIdentifier: '1.OA.A.2',
    estimatedDuration: 35,
    prerequisites: ['1-oa-1'],
    tags: ['three_addends', 'word_problems']
  }
];
