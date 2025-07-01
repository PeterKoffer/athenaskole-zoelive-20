
export const grade3FractionTestCases = [
  {
    kcId: 'kc_math_g3_nf_1',
    description: 'Grade 3 - Understand fractions as numbers (3.NF.A.1)',
    focus: 'Unit fractions (1/b) and partitioning concepts',
    expectedQuestions: 'Visual fraction identification, parts of wholes, unit fraction definitions'
  },
  {
    kcId: 'kc_math_g3_understand_fractions',
    description: 'Grade 3 - Understanding Fractions (Alternative KC)',
    focus: 'Conceptual understanding of fractions',
    expectedQuestions: 'Fraction concepts, visual representations, basic fraction vocabulary'
  },
  {
    kcId: 'kc_math_g3_fractions_parts_whole',
    description: 'Grade 3 - Fractions as Parts of Whole',
    focus: 'Visual fraction representation',
    expectedQuestions: 'Identifying fractions from visual models, shaded parts'
  }
];

export interface TestResult {
  kcId: string;
  status: 'pending' | 'success' | 'error';
  atoms?: any[];
  error?: string;
  duration?: number;
  promptLogs?: string[];
  validationLogs?: string[];
  fallbackTest?: boolean;
}
