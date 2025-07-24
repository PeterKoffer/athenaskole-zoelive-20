import { CurriculumNode } from '@/types/curriculum';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const dkLifeEssentialsCurriculumData: CurriculumNode[] = [
  // DK Life Essentials Subject Node
  {
    id: 'dk-life-essentials',
    parentId: 'dk-root', // Assuming 'dk-root' is the ID for the DK country root node
    nodeType: 'subject',
    name: 'Livsfærdigheder', // Danish for Life Skills/Life Essentials
    description: 'Curriculum for Livsfærdigheder (Life Essentials) in Denmark, covering practical skills for independent living, financial literacy, health/safety, and relationship navigation, adapted for Danish context.',
    educationalLevel: 'K-12',
    subject: NELIESubject.LIFE_ESSENTIALS,
    countryCode: 'DK',
    languageCode: 'da',
    tags: ['livsfærdigheder', 'praktiske_færdigheder', 'selvstændighed', 'danmark'],
  },
  // K-5 data (adapted for DK) will be added here in subsequent steps
];
