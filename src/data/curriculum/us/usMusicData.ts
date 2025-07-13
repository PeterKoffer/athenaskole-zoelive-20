import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usMusicCurriculumData: CurriculumNode[] = [
  // Subject Node
  {
    id: 'us-music',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'Music',
    description: 'Curriculum for K-12 Music education in the United States, covering musical literacy, creative expression, performance, and cultural understanding.',
    educationalLevel: 'K-12',
    subject: NELIESubject.MUSIC,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['music', 'performing_arts', 'music_education', 'usa']
  },
  // K-2
  {
    id: 'us-k-2-music',
    parentId: 'us-music',
    nodeType: 'course',
    name: 'K-2 Music',
    description: 'Musical Exploration',
    educationalLevel: 'K-2',
    subject: NELIESubject.MUSIC,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'grade1', 'grade2', 'music', 'foundation']
  },
  // 3-5
  {
    id: 'us-3-5-music',
    parentId: 'us-music',
    nodeType: 'course',
    name: 'Grades 3-5 Music',
    description: 'Skill Development',
    educationalLevel: '3-5',
    subject: NELIESubject.MUSIC,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'grade4', 'grade5', 'music', 'skills']
  },
  // 6-8
  {
    id: 'us-6-8-music',
    parentId: 'us-music',
    nodeType: 'course',
    name: 'Grades 6-8 Music',
    description: 'Musical Identity & Collaboration',
    educationalLevel: '6-8',
    subject: NELIESubject.MUSIC,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade6', 'grade7', 'grade8', 'music', 'identity', 'collaboration']
  },
  // 9-12
  {
    id: 'us-9-12-music',
    parentId: 'us-music',
    nodeType: 'course',
    name: 'Grades 9-12 Music',
    description: 'Musical Mastery & Career Preparation',
    educationalLevel: '9-12',
    subject: NELIESubject.MUSIC,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade9', 'grade10', 'grade11', 'grade12', 'music', 'mastery']
  },
];
