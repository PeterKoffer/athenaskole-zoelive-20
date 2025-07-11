import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const dkMusicCurriculumData: CurriculumNode[] = [
  // DK Music Subject Node
  {
    id: 'dk-music',
    parentId: 'dk-root',
    nodeType: 'subject',
    name: 'Musik', // Danish for Music
    description: 'Curriculum for Musik (Music) in Denmark, adapted for the Danish context, focusing on musical exploration, performance, creation, and cultural understanding.',
    educationalLevel: 'Grundskole-Gymnasium', // K-12 equivalent
    subject: NELIESubject.MUSIC,
    countryCode: 'DK',
    languageCode: 'da',
    tags: ['musik', 'musikkultur', 'kreative_fag', 'danmark'],
  },
  // K-5 (Indskoling/Mellemtrin) data will be added here in subsequent steps
];
