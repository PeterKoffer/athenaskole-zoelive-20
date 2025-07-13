import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usCreativeArtsCurriculumData: CurriculumNode[] = [
  // Subject Node
  {
    id: 'us-creative-arts',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'Creative Arts',
    description: 'Curriculum for K-12 Creative Arts in the United States, encompassing visual arts, digital media, and creative expression.',
    educationalLevel: 'K-12',
    subject: NELIESubject.ART,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['creative_arts', 'visual_arts', 'digital_arts', 'expression', 'usa']
  },
  // K-2
  {
    id: 'us-k-2-ca',
    parentId: 'us-creative-arts',
    nodeType: 'course',
    name: 'K-2 Creative Arts',
    description: 'Exploration & Play',
    educationalLevel: 'K-2',
    subject: NELIESubject.ART,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'grade1', 'grade2', 'creative_arts', 'foundation']
  },
  // 3-5
  {
    id: 'us-3-5-ca',
    parentId: 'us-creative-arts',
    nodeType: 'course',
    name: 'Grades 3-5 Creative Arts',
    description: 'Skill Building',
    educationalLevel: '3-5',
    subject: NELIESubject.ART,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'grade4', 'grade5', 'creative_arts', 'skills']
  },
  // 6-8
  {
    id: 'us-6-8-ca',
    parentId: 'us-creative-arts',
    nodeType: 'course',
    name: 'Grades 6-8 Creative Arts',
    description: 'Technical Development & Personal Voice',
    educationalLevel: '6-8',
    subject: NELIESubject.ART,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade6', 'grade7', 'grade8', 'creative_arts', 'technical_development']
  },
  // 9-12
  {
    id: 'us-9-12-ca',
    parentId: 'us-creative-arts',
    nodeType: 'course',
    name: 'Grades 9-12 Creative Arts',
    description: 'Mastery & Professional Preparation',
    educationalLevel: '9-12',
    subject: NELIESubject.ART,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade9', 'grade10', 'grade11', 'grade12', 'creative_arts', 'mastery']
  },
];
