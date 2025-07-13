import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usComputerScienceCurriculumData: CurriculumNode[] = [
  // Subject Node
  {
    id: 'us-computer-science',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'Computer Science',
    description: 'Curriculum for K-12 Computer Science in the United States, focusing on computational thinking, digital citizenship, programming, data analysis, and AI literacy.',
    educationalLevel: 'K-12',
    subject: NELIESubject.COMPUTER_SCIENCE,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['computer_science', 'stem', 'digital_literacy', 'coding', 'usa']
  },
  // K-2
  {
    id: 'us-k-2-cs',
    parentId: 'us-computer-science',
    nodeType: 'course',
    name: 'K-2 Computer Science',
    description: 'Digital Foundations',
    educationalLevel: 'K-2',
    subject: NELIESubject.COMPUTER_SCIENCE,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'grade1', 'grade2', 'computer_science', 'foundation']
  },
  // 3-5
  {
    id: 'us-3-5-cs',
    parentId: 'us-computer-science',
    nodeType: 'course',
    name: 'Grades 3-5 Computer Science',
    description: 'Building Skills',
    educationalLevel: '3-5',
    subject: NELIESubject.COMPUTER_SCIENCE,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'grade4', 'grade5', 'computer_science', 'skills']
  },
  // 6-8
  {
    id: 'us-6-8-cs',
    parentId: 'us-computer-science',
    nodeType: 'course',
    name: 'Grades 6-8 Computer Science',
    description: 'Computational Thinking & Ethics',
    educationalLevel: '6-8',
    subject: NELIESubject.COMPUTER_SCIENCE,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade6', 'grade7', 'grade8', 'computer_science', 'ethics']
  },
  // 9-12
  {
    id: 'us-9-12-cs',
    parentId: 'us-computer-science',
    nodeType: 'course',
    name: 'Grades 9-12 Computer Science',
    description: 'Advanced Computing & AI Mastery',
    educationalLevel: '9-12',
    subject: NELIESubject.COMPUTER_SCIENCE,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade9', 'grade10', 'grade11', 'grade12', 'computer_science', 'ai']
  },
];
