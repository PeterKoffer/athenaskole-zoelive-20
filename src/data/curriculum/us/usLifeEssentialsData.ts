import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usLifeEssentialsCurriculumData: CurriculumNode[] = [
  // Subject Node
  {
    id: 'us-life-essentials',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'Life Essentials',
    description: 'Curriculum for Life Essentials in the United States, covering practical skills for independent living, financial literacy, health/safety, and relationship navigation.',
    educationalLevel: 'K-12',
    subject: NELIESubject.LIFE_ESSENTIALS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['life_skills', 'practical_skills', 'independent_living', 'usa']
  },
  // K-2
  {
    id: 'us-k-2-le',
    parentId: 'us-life-essentials',
    nodeType: 'course',
    name: 'K-2 Life Essentials',
    description: 'Basic self-care and safety skills for K-2.',
    educationalLevel: 'K-2',
    subject: NELIESubject.LIFE_ESSENTIALS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'grade1', 'grade2', 'life_essentials', 'foundation']
  },
  // 3-5
  {
    id: 'us-3-5-le',
    parentId: 'us-life-essentials',
    nodeType: 'course',
    name: 'Grades 3-5 Life Essentials',
    description: 'Expanding Independence',
    educationalLevel: '3-5',
    subject: NELIESubject.LIFE_ESSENTIALS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'grade4', 'grade5', 'life_essentials', 'independence']
  },
  // 6-8
  {
    id: 'us-6-8-le',
    parentId: 'us-life-essentials',
    nodeType: 'course',
    name: 'Grades 6-8 Life Essentials',
    description: 'Building Competence',
    educationalLevel: '6-8',
    subject: NELIESubject.LIFE_ESSENTIALS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade6', 'grade7', 'grade8', 'life_essentials', 'competence']
  },
  // 9-12
  {
    id: 'us-9-12-le',
    parentId: 'us-life-essentials',
    nodeType: 'course',
    name: 'Grades 9-12 Life Essentials',
    description: 'Adult Readiness',
    educationalLevel: '9-12',
    subject: NELIESubject.LIFE_ESSENTIALS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade9', 'grade10', 'grade11', 'grade12', 'life_essentials', 'adulthood']
  },
];
