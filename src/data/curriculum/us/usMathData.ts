import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usMathCurriculumNodes: CurriculumNode[] = [
  // US Math Subject Node
  {
    id: 'us-math',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'US K-5 Mathematics curriculum based on Common Core State Standards',
    educationalLevel: 'K-5',
    subject: NELIESubject.MATH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['ccss', 'mathematics', 'elementary']
  },

  // --- Kindergarten Math ---
  {
    id: 'us-k-math',
    parentId: 'us-math',
    nodeType: 'grade_level',
    name: 'Kindergarten Mathematics',
    description: 'Foundational math skills for kindergarten students',
    educationalLevel: 'K',
    subject: NELIESubject.MATH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'foundational']
  },

  // K.CC - Counting and Cardinality
  {
    id: 'us-k-math-cc',
    parentId: 'us-k-math',
    nodeType: 'domain',
    name: 'Counting and Cardinality',
    description: 'Know number names and the count sequence',
    educationalLevel: 'K',
    subject: NELIESubject.MATH,
    tags: ['counting', 'numbers']
  },

  {
    id: 'us-k-math-cc-1',
    parentId: 'us-k-math-cc',
    nodeType: 'learning_objective',
    name: 'Count to 100 by ones and by tens',
    description: 'Count to 100 by ones and by tens',
    educationalLevel: 'K',
    subject: NELIESubject.MATH,
    estimatedDuration: 30,
    tags: ['counting', 'sequence']
  },

  {
    id: 'us-k-math-cc-2',
    parentId: 'us-k-math-cc',
    nodeType: 'learning_objective',
    name: 'Count forward beginning from a given number',
    description: 'Count forward beginning from a given number within the known sequence',
    educationalLevel: 'K',
    subject: NELIESubject.MATH,
    estimatedDuration: 25,
    tags: ['counting', 'sequence']
  },

  // --- Grade 1 Math ---
  {
    id: 'us-g1-math',
    parentId: 'us-math',
    nodeType: 'grade_level',
    name: 'Grade 1 Mathematics',
    description: 'First grade mathematics curriculum',
    educationalLevel: '1',
    subject: NELIESubject.MATH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade1', 'elementary']
  },

  // 1.OA - Operations and Algebraic Thinking
  {
    id: 'us-g1-math-oa',
    parentId: 'us-g1-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving addition and subtraction',
    educationalLevel: '1',
    subject: NELIESubject.MATH,
    tags: ['operations', 'addition', 'subtraction']
  },

  {
    id: 'us-g1-math-oa-1',
    parentId: 'us-g1-math-oa',
    nodeType: 'learning_objective',
    name: 'Use addition and subtraction within 20',
    description: 'Use addition and subtraction within 20 to solve word problems',
    educationalLevel: '1',
    subject: NELIESubject.MATH,
    estimatedDuration: 45,
    tags: ['word_problems', 'addition', 'subtraction']
  },

  // --- Grade 2 Math ---
  {
    id: 'us-g2-math',
    parentId: 'us-math',
    nodeType: 'grade_level',
    name: 'Grade 2 Mathematics',
    description: 'Second grade mathematics curriculum',
    educationalLevel: '2',
    subject: NELIESubject.MATH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade2', 'elementary']
  },

  // 2.OA - Operations and Algebraic Thinking
  {
    id: 'us-g2-math-oa',
    parentId: 'us-g2-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving addition and subtraction',
    educationalLevel: '2',
    subject: NELIESubject.MATH,
    tags: ['operations', 'addition', 'subtraction']
  },

  {
    id: 'us-g2-math-oa-1',
    parentId: 'us-g2-math-oa',
    nodeType: 'learning_objective',
    name: 'Use addition and subtraction within 100',
    description: 'Use addition and subtraction within 100 to solve one- and two-step word problems',
    educationalLevel: '2',
    subject: NELIESubject.MATH,
    estimatedDuration: 50,
    tags: ['word_problems', 'addition', 'subtraction', 'two_step']
  },

  // --- Grade 3 Math ---
  {
    id: 'us-g3-math',
    parentId: 'us-math',
    nodeType: 'grade_level',
    name: 'Grade 3 Mathematics',
    description: 'Third grade mathematics curriculum',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'elementary']
  },

  // 3.OA - Operations and Algebraic Thinking
  {
    id: 'us-g3-math-oa',
    parentId: 'us-g3-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving multiplication and division',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    tags: ['operations', 'multiplication', 'division']
  },

  {
    id: 'us-g3-math-oa-1',
    parentId: 'us-g3-math-oa',
    nodeType: 'learning_objective',
    name: 'Interpret products of whole numbers',
    description: 'Interpret products of whole numbers as equal groups',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    estimatedDuration: 40,
    tags: ['multiplication', 'equal_groups']
  },

  {
    id: 'us-g3-math-oa-2',
    parentId: 'us-g3-math-oa',
    nodeType: 'learning_objective',
    name: 'Interpret whole-number quotients',
    description: 'Interpret whole-number quotients of whole numbers',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    estimatedDuration: 40,
    tags: ['division', 'equal_shares']
  },

  // 3.NF - Number and Operations—Fractions
  {
    id: 'us-g3-math-nf',
    parentId: 'us-g3-math',
    nodeType: 'domain',
    name: 'Number and Operations—Fractions',
    description: 'Develop understanding of fractions as numbers',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    tags: ['fractions', 'number_line']
  },

  {
    id: 'us-g3-math-nf-1',
    parentId: 'us-g3-math-nf',
    nodeType: 'learning_objective',
    name: 'Understand a fraction as a number',
    description: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    estimatedDuration: 45,
    tags: ['unit_fractions', 'partitioning']
  },

  // --- Grade 4 Math ---
  {
    id: 'us-g4-math',
    parentId: 'us-math',
    nodeType: 'grade_level',
    name: 'Grade 4 Mathematics',
    description: 'Fourth grade mathematics curriculum',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade4', 'elementary']
  },

  // 4.OA - Operations and Algebraic Thinking
  {
    id: 'us-g4-math-oa',
    parentId: 'us-g4-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Use the four operations with whole numbers to solve problems',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    tags: ['operations', 'problem_solving']
  },

  {
    id: 'us-g4-math-oa-1',
    parentId: 'us-g4-math-oa',
    nodeType: 'learning_objective',
    name: 'Interpret multiplication equations as comparisons',
    description: 'Interpret a multiplication equation as a comparison',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    estimatedDuration: 40,
    tags: ['multiplication', 'comparison']
  },

  // 4.NF - Number and Operations—Fractions
  {
    id: 'us-g4-math-nf',
    parentId: 'us-g4-math',
    nodeType: 'domain',
    name: 'Number and Operations—Fractions',
    description: 'Extend understanding of fraction equivalence and ordering',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    tags: ['fractions', 'equivalence']
  },

  {
    id: 'us-g4-math-nf-1',
    parentId: 'us-g4-math-nf',
    nodeType: 'learning_objective',
    name: 'Explain why fractions are equivalent',
    description: 'Explain why a fraction a/b is equivalent to a fraction (n×a)/(n×b)',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    estimatedDuration: 50,
    tags: ['equivalent_fractions', 'multiplication']
  },

  // --- Grade 5 Math ---
  {
    id: 'us-g5-math',
    parentId: 'us-math',
    nodeType: 'grade_level',
    name: 'Grade 5 Mathematics',
    description: 'Fifth grade mathematics curriculum',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade5', 'elementary']
  },

  // 5.OA - Operations and Algebraic Thinking
  {
    id: 'us-g5-math-oa',
    parentId: 'us-g5-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Write and interpret numerical expressions',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    tags: ['expressions', 'patterns']
  },

  {
    id: 'us-g5-math-oa-1',
    parentId: 'us-g5-math-oa',
    nodeType: 'learning_objective',
    name: 'Use parentheses and brackets in expressions',
    description: 'Use parentheses, brackets, or braces in numerical expressions',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    estimatedDuration: 45,
    tags: ['order_of_operations', 'grouping_symbols']
  },

  // 5.NF - Number and Operations—Fractions
  {
    id: 'us-g5-math-nf',
    parentId: 'us-g5-math',
    nodeType: 'domain',
    name: 'Number and Operations—Fractions',
    description: 'Use equivalent fractions as a strategy to add and subtract fractions',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    tags: ['fractions', 'operations']
  },

  {
    id: 'us-g5-math-nf-1',
    parentId: 'us-g5-math-nf',
    nodeType: 'learning_objective',
    name: 'Add and subtract fractions with unlike denominators',
    description: 'Add and subtract fractions with unlike denominators by replacing given fractions with equivalent fractions',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    estimatedDuration: 60,
    tags: ['fraction_addition', 'fraction_subtraction', 'unlike_denominators']
  }
];
