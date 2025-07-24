import { CurriculumNode } from '@/types/curriculum';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const dkCreativeArtsCurriculumData: CurriculumNode[] = [
  // DK Creative Arts Subject Node
  {
    id: 'dk-creative-arts',
    parentId: 'dk-root',
    nodeType: 'subject',
    name: 'Billedkunst', // Danish for Visual Arts, often a main part of Creative Arts
    description: 'Curriculum for Billedkunst (Visual Arts) in Denmark, adapted for the Danish context, focusing on creative expression, materials, and cultural understanding.',
    educationalLevel: 'Grundskole-Gymnasium', // K-12 equivalent
    subject: NELIESubject.ART, // Using ART from the enum
    countryCode: 'DK',
    languageCode: 'da',
    tags: ['billedkunst', 'kreative_fag', 'visuel_kultur', 'danmark'],
  },
  // K-5 (Indskoling/Mellemtrin) data will be added here in subsequent steps
];
