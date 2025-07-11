
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';

export const usElaCurriculumNodes: CurriculumNode[] = [
  // US ELA Root
  {
    id: 'us-ela',
    parentId: 'us',
    nodeType: 'subject',
    name: 'English Language Arts',
    description: 'K-12 English Language Arts curriculum following Common Core State Standards',
    countryCode: 'US',
    languageCode: 'en',
    subjectName: 'English Language Arts',
    tags: ['core_subject', 'literacy']
  },

  // Kindergarten ELA
  {
    id: 'us-k-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Kindergarten English Language Arts',
    description: 'Foundational literacy skills for kindergarten students',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    estimatedDuration: 150,
    tags: ['foundational', 'literacy', 'early_childhood']
  },

  // K.RF - Reading: Foundational Skills
  {
    id: 'k-rf',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills',
    description: 'Print concepts, phonological awareness, phonics and word recognition, and fluency',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    sourceIdentifier: 'K.RF',
    tags: ['reading', 'phonics', 'foundational']
  },

  {
    id: 'k-rf-1',
    parentId: 'k-rf',
    nodeType: 'learning_objective',
    name: 'Print concepts',
    description: 'Demonstrate understanding of the organization and basic features of print',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    sourceIdentifier: 'K.RF.A.1',
    estimatedDuration: 30,
    tags: ['print_concepts', 'reading_foundations']
  },

  // Grade 1 ELA
  {
    id: 'us-1-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 1 English Language Arts',
    description: 'First grade literacy skills building on kindergarten foundations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    estimatedDuration: 180,
    prerequisites: ['us-k-ela'],
    tags: ['elementary', 'literacy']
  },

  {
    id: '1-rf',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills',
    description: 'Phonological awareness, phonics and word recognition, and fluency',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    sourceIdentifier: '1.RF',
    tags: ['reading', 'phonics', 'fluency']
  },

  {
    id: '1-rf-1',
    parentId: '1-rf',
    nodeType: 'learning_objective',
    name: 'Phonological awareness',
    description: 'Demonstrate understanding of spoken words, syllables, and sounds (phonemes)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    sourceIdentifier: '1.RF.B.2',
    estimatedDuration: 40,
    prerequisites: ['k-rf-1'],
    tags: ['phonological_awareness', 'phonemes']
  }
];
