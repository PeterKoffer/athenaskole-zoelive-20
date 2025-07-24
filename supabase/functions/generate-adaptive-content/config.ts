
export const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') || 'gpt-3.5-turbo';

export const OPENAI_CONFIG = {
  model: OPENAI_MODEL,
  temperature: 0.7,
  maxTokens: 1000,
} as const;

export const SUBJECTS_CONFIG = {
  math: {
    name: 'Matematik',
    skillAreas: ['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'geometry']
  },
  danish: {
    name: 'Dansk',
    skillAreas: ['reading', 'writing', 'grammar', 'vocabulary']
  },
  english: {
    name: 'Engelsk',
    skillAreas: ['vocabulary', 'grammar', 'reading', 'pronunciation']
  }
} as const;

export const DIFFICULTY_LEVELS = {
  1: 'Begynder',
  2: 'Let',
  3: 'Mellem',
  4: 'Svær',
  5: 'Ekspert'
} as const;
