import { CurriculumNode } from '@/types/curriculumIndex';

// Pilot data for a curriculum index.
// Focusing on Grade 4 Math as an example.
// IDs are simple and illustrative for now.

export const mockCurriculumData: CurriculumNode[] = [
  // --- Country Level ---
  {
    id: 'global-curriculum',
    parentId: null,
    nodeType: 'country', // Using 'country' as a placeholder for a global/generic system
    name: 'Global K-12 Curriculum Framework (NELIE)',
    description: 'A generalized framework adaptable for various national curricula.',
    countryCode: 'XG', // ISO 3166-1 User-assigned code for global/international
    languageCode: 'en',
  },

  // --- Grade Level ---
  {
    id: 'g4',
    parentId: 'global-curriculum',
    nodeType: 'grade_level',
    name: 'Grade 4',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
  },

  // --- Subject Level ---
  {
    id: 'g4-math',
    parentId: 'g4',
    nodeType: 'subject',
    name: 'Mathematics',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
  },

  // --- Domain/Course Level within Grade 4 Math ---
  {
    id: 'g4-math-oa',
    parentId: 'g4-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Understanding and applying properties of operations and algebraic concepts.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Domain.4.OA' // Example
  },
  {
    id: 'g4-math-nbt',
    parentId: 'g4-math',
    nodeType: 'domain',
    name: 'Number & Operations in Base Ten',
    description: 'Generalize place value understanding for multi-digit whole numbers.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Domain.4.NBT' // Example
  },

  // --- Topic Level within Operations and Algebraic Thinking ---
  {
    id: 'g4-math-oa-A',
    parentId: 'g4-math-oa',
    nodeType: 'topic',
    name: 'Use the four operations with whole numbers to solve problems.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Cluster.4.OA.A' // Example
  },

  // --- Learning Objective Level ---
  {
    id: 'g4-math-oa-A-1',
    parentId: 'g4-math-oa-A',
    nodeType: 'learning_objective',
    name: 'Interpret a multiplication equation as a comparison.',
    description: 'e.g., interpret 35 = 5 × 7 as a statement that 35 is 5 times as many as 7 and 7 times as many as 5. Represent verbal statements of multiplicative comparisons as multiplication equations.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.OA.A.1', // Example
    tags: ['multiplication', 'comparison', 'word problems']
  },
  // KCs for g4-math-oa-A-1
  {
    id: 'g4-math-oa-A-1-kc1',
    parentId: 'g4-math-oa-A-1',
    nodeType: 'kc',
    name: 'Define multiplicative comparison',
    description: 'Understand that a multiplicative comparison describes how many times greater one quantity is than another (e.g., "3 times as many").',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['definition', 'multiplicative comparison']
  },
  {
    id: 'g4-math-oa-A-1-kc2',
    parentId: 'g4-math-oa-A-1',
    nodeType: 'kc',
    name: 'Translate verbal multiplicative comparison to equation',
    description: 'Given a verbal statement like "A is N times as many as B", write it as A = N × B.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['translation', 'equation', 'multiplicative comparison']
  },
  {
    id: 'g4-math-oa-A-2',
    parentId: 'g4-math-oa-A',
    nodeType: 'learning_objective',
    name: 'Multiply or divide to solve word problems involving multiplicative comparison.',
    description: 'e.g., by using drawings and equations with a symbol for the unknown number to represent the problem, distinguishing multiplicative comparison from additive comparison.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.OA.A.2', // Example
    tags: ['multiplication', 'division', 'word problems', 'comparison']
  },
  // KCs for g4-math-oa-A-2
  {
    id: 'g4-math-oa-A-2-kc1',
    parentId: 'g4-math-oa-A-2',
    nodeType: 'kc',
    name: 'Identify operation for multiplicative comparison word problem',
    description: 'Determine whether multiplication or division is needed to solve a word problem involving "N times as many" or "N times less".',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['problem solving', 'operation choice']
  },
  {
    id: 'g4-math-oa-A-2-kc2',
    parentId: 'g4-math-oa-A-2',
    nodeType: 'kc',
    name: 'Represent multiplicative comparison word problem with equation and symbol',
    description: 'Use a symbol (e.g., a letter) for the unknown number when setting up an equation for a word problem.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['equation setup', 'unknown symbol', 'word problems']
  },
   {
    id: 'g4-math-oa-A-2-kc3',
    parentId: 'g4-math-oa-A-2',
    nodeType: 'kc',
    name: 'Distinguish multiplicative from additive comparison',
    description: 'Recognize the difference between problems asking "how many times more?" (multiplicative) versus "how many more?" (additive).',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['comparison types', 'problem interpretation']
  },
  {
    id: 'g4-math-oa-A-3',
    parentId: 'g4-math-oa-A',
    nodeType: 'learning_objective',
    name: 'Solve multistep word problems posed with whole numbers and having whole-number answers using the four operations.',
    description: 'Including problems in which remainders must be interpreted. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.OA.A.3', // Example
    tags: ['multi-step problems', 'word problems', 'all operations', 'estimation', 'remainders']
  },

  // --- Topic Level within Number & Operations in Base Ten ---
   {
    id: 'g4-math-nbt-A',
    parentId: 'g4-math-nbt',
    nodeType: 'topic',
    name: 'Generalize place value understanding for multi-digit whole numbers.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Cluster.4.NBT.A' // Example
  },

  // --- Learning Objective Level ---
  {
    id: 'g4-math-nbt-A-1',
    parentId: 'g4-math-nbt-A',
    nodeType: 'learning_objective',
    name: 'Recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right.',
    description: 'For example, recognize that 700 ÷ 70 = 10 by applying concepts of place value and division.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.NBT.A.1', // Example
    tags: ['place value', 'multi-digit numbers', 'powers of 10']
  },
];
