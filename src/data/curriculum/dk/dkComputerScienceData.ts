// Loose typing to avoid dependency during build
export const dkComputerScienceCurriculumData: any[] = [
  // DK Computer Science Subject Node
  {
    id: 'dk-computer-science',
    parentId: 'dk-root',
    nodeType: 'subject',
    name: 'Datalogi', // Danish for Computer Science/Informatics
    description: 'Curriculum for Datalogi (Computer Science) in Denmark, focusing on computational thinking, digital citizenship, programming, and technology understanding, adapted for Danish context.',
    educationalLevel: 'Grundskole-Gymnasium', // K-12 equivalent
    subject: 'computer-science',
    countryCode: 'DK',
    languageCode: 'da',
    tags: ['datalogi', 'it', 'teknologiforståelse', 'kodning', 'danmark'],
  },
  // K-5 (Indskoling/Mellemtrin) data will be added here in subsequent steps
];
