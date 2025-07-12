import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usSpanishCurriculumData: CurriculumNode[] = [
  // US World Languages (Spanish) Subject Node
  {
    id: 'us-spanish',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'World Languages: Spanish',
    description: 'Curriculum for K-12 Spanish as a World Language in the United States, focusing on the 5 C\'s: Communication, Cultures, Connections, Comparisons, and Communities.',
    educationalLevel: 'K-12',
    subject: NELIESubject.WORLD_LANGUAGES,
    countryCode: 'US',
    languageCode: 'en', // The curriculum is for English speakers learning Spanish
    tags: ['spanish', 'world_languages', 'second_language', 'usa'],
  },

  // --- K-2 Novice-Low Spanish ---
  {
    id: 'us-k2-spanish',
    parentId: 'us-spanish',
    nodeType: 'course',
    name: 'K-2 Spanish (Novice-Low)',
    description: 'Introduction to Spanish for early elementary, focusing on basic vocabulary, greetings, and cultural awareness.',
    educationalLevel: 'K-2', // Grouping K-2 as is common for early language programs
    subject: NELIESubject.WORLD_LANGUAGES,
    tags: ['kindergarten', 'grade1', 'grade2', 'novice_low'],
  },
  // K-2 Domains (The 5 C's)
  {
    id: 'us-k2-spanish-comm', parentId: 'us-k2-spanish', nodeType: 'domain', name: 'Communication',
    educationalLevel: 'K-2', subject: NELIESubject.WORLD_LANGUAGES,
  },
  {
    id: 'us-k2-spanish-cult', parentId: 'us-k2-spanish', nodeType: 'domain', name: 'Cultures',
    educationalLevel: 'K-2', subject: NELIESubject.WORLD_LANGUAGES,
  },
  // K-2 LOs
  {
    id: 'us-k2-spanish-comm-lo1', parentId: 'us-k2-spanish-comm', nodeType: 'learning_objective', name: 'Use basic greetings and leave-takings.',
    educationalLevel: 'K-2', subject: NELIESubject.WORLD_LANGUAGES,
  },
  {
    id: 'us-k2-spanish-cult-lo1', parentId: 'us-k2-spanish-cult', nodeType: 'learning_objective', name: 'Identify some products and practices of Spanish-speaking cultures (e.g., foods, holidays).',
    educationalLevel: 'K-2', subject: NELIESubject.WORLD_LANGUAGES,
  },

  // --- Grades 3-5 Novice-Mid Spanish ---
  {
    id: 'us-g35-spanish',
    parentId: 'us-spanish',
    nodeType: 'course',
    name: 'Grades 3-5 Spanish (Novice-Mid)',
    description: 'Building on foundations with more complex sentences, questions, and cultural comparisons.',
    educationalLevel: '3-5', // Grouping 3-5
    subject: NELIESubject.WORLD_LANGUAGES,
    tags: ['grade3', 'grade4', 'grade5', 'novice_mid'],
  },
  // 3-5 Domains
  {
    id: 'us-g35-spanish-comm', parentId: 'us-g35-spanish', nodeType: 'domain', name: 'Communication',
    educationalLevel: '3-5', subject: NELIESubject.WORLD_LANGUAGES,
  },
  {
    id: 'us-g35-spanish-conn', parentId: 'us-g35-spanish', nodeType: 'domain', name: 'Connections',
    educationalLevel: '3-5', subject: NELIESubject.WORLD_LANGUAGES,
  },
  {
    id: 'us-g35-spanish-comp', parentId: 'us-g35-spanish', nodeType: 'domain', name: 'Comparisons',
    educationalLevel: '3-5', subject: NELIESubject.WORLD_LANGUAGES,
  },
  // 3-5 LOs
  {
    id: 'us-g35-spanish-comm-lo1', parentId: 'us-g35-spanish-comm', nodeType: 'learning_objective', name: 'Ask and answer simple questions about self and family.',
    educationalLevel: '3-5', subject: NELIESubject.WORLD_LANGUAGES,
  },
  {
    id: 'us-g35-spanish-conn-lo1', parentId: 'us-g35-spanish-conn', nodeType: 'learning_objective', name: 'Connect Spanish vocabulary to other subjects (e.g., numbers in Math, animals in Science).',
    educationalLevel: '3-5', subject: NELIESubject.WORLD_LANGUAGES,
  },
  {
    id: 'us-g35-spanish-comp-lo1', parentId: 'us-g35-spanish-comp', nodeType: 'learning_objective', name: 'Compare patterns of politeness between own culture and Spanish-speaking cultures.',
    educationalLevel: '3-5', subject: NELIESubject.WORLD_LANGUAGES,
  }
];
