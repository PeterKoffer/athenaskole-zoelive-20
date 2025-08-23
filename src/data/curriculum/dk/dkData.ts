
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const dkCurriculumNodes: any[] = [
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
    subject: NELIESubject.MATH,
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
    subjectName: 'Mathematics', // Retaining for potential display purposes
    subject: NELIESubject.MATH,
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
    subjectName: 'Danish Language', // Retaining for potential display purposes
    subject: NELIESubject.WORLD_LANGUAGES, // Or a more specific 'DANISH' if added to enum
    tags: ['core_subject', 'language', 'native_language']
  },

  {
    id: 'dk-danish-reading',
    parentId: 'dk-danish',
    nodeType: 'learning_objective',
    name: 'Reading Comprehension',
    description: 'Developing reading skills and text comprehension in Danish',
    countryCode: 'DK',
    languageCode: 'da',
    subjectName: 'Danish Language', // Retaining for potential display purposes
    subject: NELIESubject.WORLD_LANGUAGES, // Or a more specific 'DANISH'
    estimatedDuration: 45,
    tags: ['reading', 'comprehension']
  }
];
