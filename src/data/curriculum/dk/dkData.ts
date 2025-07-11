
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';

export const dkCurriculumNodes: CurriculumNode[] = [
  // Denmark Root
  {
    id: 'dk',
    parentId: null,
    nodeType: 'country',
    name: 'Denmark',
    description: 'Danish education system curriculum',
    countryCode: 'DK',
    languageCode: 'da',
    tags: ['country', 'european']
  },

  // Danish Math
  {
    id: 'dk-math',
    parentId: 'dk',
    nodeType: 'subject',
    name: 'Matematik',
    description: 'Danish mathematics curriculum for primary and secondary education',
    countryCode: 'DK',
    languageCode: 'da',
    subjectName: 'Mathematics',
    tags: ['core_subject', 'stem']
  },

  {
    id: 'dk-math-basic-arithmetic',
    parentId: 'dk-math',
    nodeType: 'learning_objective',
    name: 'Basic Arithmetic Operations',
    description: 'Fundamental arithmetic: addition, subtraction, multiplication, and division',
    countryCode: 'DK',
    languageCode: 'da',
    subjectName: 'Mathematics',
    estimatedDuration: 60,
    tags: ['arithmetic', 'foundational']
  },

  // Danish Language
  {
    id: 'dk-danish',
    parentId: 'dk',
    nodeType: 'subject',
    name: 'Dansk',
    description: 'Danish language and literature curriculum',
    countryCode: 'DK',
    languageCode: 'da',
    subjectName: 'Danish Language',
    tags: ['core_subject', 'language']
  },

  {
    id: 'dk-danish-reading',
    parentId: 'dk-danish',
    nodeType: 'learning_objective',
    name: 'Reading Comprehension',
    description: 'Developing reading skills and text comprehension in Danish',
    countryCode: 'DK',
    languageCode: 'da',
    subjectName: 'Danish Language',
    estimatedDuration: 45,
    tags: ['reading', 'comprehension']
  }
];
