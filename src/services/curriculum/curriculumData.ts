
// Re-export the existing curriculum data with enhancements
export { completeStudyPugCurriculum, type CurriculumLevel, type CurriculumSubject, type CurriculumTopic } from '../../../supabase/functions/generate-content-atoms/curriculumData';

// Additional curriculum enhancements for AI integration
export interface AIEnhancedCurriculum {
  originalData: typeof import('../../../supabase/functions/generate-content-atoms/curriculumData').completeStudyPugCurriculum;
  enhancedTopics: Map<string, any>;
  gradeMapping: Record<number, string[]>;
  subjectDomains: Record<string, string[]>;
}

export const GRADE_SKILL_MAPPING = {
  3: {
    'operations': ['multiplication', 'division', 'word_problems'],
    'fractions': ['unit_fractions', 'fraction_understanding'],
    'measurement': ['time', 'liquid_volume', 'mass']
  },
  4: {
    'operations': ['multi_digit_arithmetic', 'factors', 'multiples'],
    'fractions': ['equivalent_fractions', 'fraction_comparison', 'fraction_operations'],
    'measurement': ['area', 'perimeter', 'angles'],
    'decimals': ['decimal_notation', 'decimal_comparison']
  },
  5: {
    'operations': ['decimal_operations', 'whole_number_operations'],
    'fractions': ['fraction_addition', 'fraction_subtraction', 'fraction_multiplication'],
    'measurement': ['coordinate_plane', 'volume'],
    'decimals': ['decimal_place_value', 'decimal_operations']
  },
  6: {
    'ratios': ['ratio_concepts', 'unit_rates', 'ratio_tables'],
    'numbers': ['positive_negative', 'absolute_value', 'coordinate_plane'],
    'expressions': ['algebraic_expressions', 'equations'],
    'geometry': ['area_surface', 'volume']
  }
};

export const COMMON_CORE_DOMAINS = {
  'oa': 'Operations and Algebraic Thinking',
  'nbt': 'Number and Operations in Base Ten',
  'nf': 'Number and Operations—Fractions',
  'md': 'Measurement and Data',
  'g': 'Geometry',
  'rp': 'Ratios and Proportional Relationships',
  'ns': 'The Number System',
  'ee': 'Expressions and Equations',
  'sp': 'Statistics and Probability'
};
