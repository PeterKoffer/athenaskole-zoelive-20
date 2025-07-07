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

  // --- Domain: Number & Operations—Fractions (NF) ---
  {
    id: 'g4-math-nf',
    parentId: 'g4-math',
    nodeType: 'domain',
    name: 'Number & Operations—Fractions',
    description: 'Develop understanding of fraction equivalence, addition, and subtraction of fractions with like denominators, and multiplication of fractions by whole numbers.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Domain.4.NF' // Example
  },
  // --- Topic within NF: Extend understanding of fraction equivalence and ordering. ---
  {
    id: 'g4-math-nf-A',
    parentId: 'g4-math-nf',
    nodeType: 'topic',
    name: 'Extend understanding of fraction equivalence and ordering.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Cluster.4.NF.A' // Example
  },
  // Learning Objective under NF-A
  {
    id: 'g4-math-nf-A-1',
    parentId: 'g4-math-nf-A',
    nodeType: 'learning_objective',
    name: 'Explain why a fraction a/b is equivalent to a fraction (n×a)/(n×b).',
    description: 'Use visual fraction models to recognize and generate equivalent fractions.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.NF.A.1',
    tags: ['fractions', 'equivalence', 'visual models']
  },
  // KC for g4-math-nf-A-1
  {
    id: 'g4-math-nf-A-1-kc1',
    parentId: 'g4-math-nf-A-1',
    nodeType: 'kc',
    name: 'Define equivalent fractions',
    description: 'Understand that equivalent fractions represent the same part of a whole or the same point on a number line.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['fractions', 'equivalence', 'definition']
  },
  {
    id: 'g4-math-nf-A-1-kc2',
    parentId: 'g4-math-nf-A-1',
    nodeType: 'kc',
    name: 'Generate equivalent fractions using multiplication/division',
    description: 'Understand that multiplying or dividing both the numerator and denominator by the same non-zero number results in an equivalent fraction.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['fractions', 'equivalence', 'generation']
  },

  // --- Domain: Measurement & Data (MD) ---
  {
    id: 'g4-math-md',
    parentId: 'g4-math',
    nodeType: 'domain',
    name: 'Measurement & Data',
    description: 'Solve problems involving measurement and conversion of measurements; represent and interpret data; understand concepts of angle and measure angles.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Domain.4.MD' // Example
  },
  // --- Topic within MD: Solve problems involving measurement and conversion of measurements. ---
  {
    id: 'g4-math-md-A',
    parentId: 'g4-math-md',
    nodeType: 'topic',
    name: 'Solve problems involving measurement and conversion of measurements.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Cluster.4.MD.A' // Example
  },
  // Learning Objective under MD-A
  {
    id: 'g4-math-md-A-1',
    parentId: 'g4-math-md-A',
    nodeType: 'learning_objective',
    name: 'Know relative sizes of measurement units within one system of units.',
    description: 'Including km, m, cm; kg, g; lb, oz.; l, ml; hr, min, sec. Within a single system of measurement, express measurements in a larger unit in terms of a smaller unit.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.MD.A.1',
    tags: ['measurement', 'conversion', 'units', 'length', 'mass', 'volume', 'time']
  },
  // KC for g4-math-md-A-1
  {
    id: 'g4-math-md-A-1-kc1',
    parentId: 'g4-math-md-A-1',
    nodeType: 'kc',
    name: 'Convert larger units to smaller units (customary length)',
    description: 'e.g., Convert feet to inches, yards to feet.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['conversion', 'length', 'customary units']
  },
  {
    id: 'g4-math-md-A-1-kc2',
    parentId: 'g4-math-md-A-1',
    nodeType: 'kc',
    name: 'Convert larger units to smaller units (metric mass)',
    description: 'e.g., Convert kilograms to grams.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['conversion', 'mass', 'metric units']
  },


  // --- Topic MD-B: Represent and interpret data. ---
  {
    id: 'g4-math-md-B',
    parentId: 'g4-math-md',
    nodeType: 'topic',
    name: 'Represent and interpret data.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Cluster.4.MD.B' // Example
  },
  // Learning Objective under MD-B
  {
    id: 'g4-math-md-B-4',
    parentId: 'g4-math-md-B',
    nodeType: 'learning_objective',
    name: 'Make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8).',
    description: 'Solve problems involving addition and subtraction of fractions by using information presented in line plots.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.MD.B.4',
    tags: ['data analysis', 'line plot', 'fractions', 'measurement data']
  },
  // KC for g4-math-md-B-4
  {
    id: 'g4-math-md-B-4-kc1',
    parentId: 'g4-math-md-B-4',
    nodeType: 'kc',
    name: 'Create a line plot for fractional data',
    description: 'Accurately represent measurements given in fractions (halves, quarters, eighths) on a line plot.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['line plot', 'fractions', 'data representation']
  },


  // --- Domain: Geometry (G) ---
  {
    id: 'g4-math-g',
    parentId: 'g4-math',
    nodeType: 'domain',
    name: 'Geometry',
    description: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Domain.4.G' // Example
  },
  // --- Topic within G: Draw and identify lines and angles, and classify shapes by properties of their lines and angles. ---
  {
    id: 'g4-math-g-A',
    parentId: 'g4-math-g',
    nodeType: 'topic',
    name: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Cluster.4.G.A' // Example
  },
  // Learning Objective under G-A
  {
    id: 'g4-math-g-A-1',
    parentId: 'g4-math-g-A',
    nodeType: 'learning_objective',
    name: 'Draw points, lines, line segments, rays, angles (right, acute, obtuse), and perpendicular and parallel lines.',
    description: 'Identify these in two-dimensional figures.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.G.A.1',
    tags: ['geometry', 'lines', 'angles', '2D shapes', 'drawing']
  },
  // KC for g4-math-g-A-1
  {
    id: 'g4-math-g-A-1-kc1',
    parentId: 'g4-math-g-A-1',
    nodeType: 'kc',
    name: 'Identify parallel lines',
    description: 'Recognize and define parallel lines as lines in a plane that never meet.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['geometry', 'lines', 'parallel']
  },
  {
    id: 'g4-math-g-A-1-kc2',
    parentId: 'g4-math-g-A-1',
    nodeType: 'kc',
    name: 'Identify perpendicular lines',
    description: 'Recognize and define perpendicular lines as lines that intersect to form right angles.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['geometry', 'lines', 'perpendicular']
  },

  // Adding more to existing OA domain
  // Learning Objective under OA-A (Use the four operations...)
  {
    id: 'g4-math-oa-A-4', // New LO, assuming A-1, A-2, A-3 exist
    parentId: 'g4-math-oa-A',
    nodeType: 'learning_objective',
    name: 'Find all factor pairs for a whole number in the range 1-100.',
    description: 'Recognize that a whole number is a multiple of each of its factors. Determine whether a given whole number in the range 1-100 is a multiple of a given one-digit number. Determine whether a given whole number in the range 1-100 is prime or composite.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    sourceIdentifier: 'CCSS.Math.Content.4.OA.B.4', // Note: This standard is typically in OA.B, but placing under OA.A topic for simplicity in this mock structure
    tags: ['factors', 'multiples', 'prime', 'composite']
  },
  // KC for g4-math-oa-A-4
  {
    id: 'g4-math-oa-A-4-kc1',
    parentId: 'g4-math-oa-A-4',
    nodeType: 'kc',
    name: 'Define factor pairs',
    description: 'Understand that factor pairs are sets of two whole numbers that multiply to make a given product.',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['factors', 'definition']
  },
  {
    id: 'g4-math-oa-A-4-kc2',
    parentId: 'g4-math-oa-A-4',
    nodeType: 'kc',
    name: 'Determine if a number is prime or composite',
    description: 'Identify a number as prime if it has exactly two distinct factors (1 and itself), and composite otherwise (for numbers > 1).',
    subjectName: 'Mathematics',
    educationalLevel: '4',
    countryCode: 'XG',
    languageCode: 'en',
    tags: ['prime numbers', 'composite numbers', 'factors']
  },
];
