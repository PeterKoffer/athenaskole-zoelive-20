
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { usRootCurriculumNodes } from './us/usRootData';
import { usMathCurriculumNodes } from './us/usMathData';
import { usElaCurriculumNodes } from './us/usElaData';
import { dkCurriculumNodes } from './dk/dkData';

// Combine all curriculum data from different countries and subjects
export const mockCurriculumData: CurriculumNode[] = [
  ...usRootCurriculumNodes,
  ...usMathCurriculumNodes,
  ...usElaCurriculumNodes,
  ...dkCurriculumNodes
];

// Export individual country/subject data for specific use cases
export {
  usRootCurriculumNodes,
  usMathCurriculumNodes,
  usElaCurriculumNodes,
  dkCurriculumNodes
};

// Helper functions for filtering data
export const getCurriculumByCountry = (countryCode: string): CurriculumNode[] => {
  return mockCurriculumData.filter(node => node.countryCode === countryCode);
};

export const getCurriculumBySubject = (subjectName: string): CurriculumNode[] => {
  return mockCurriculumData.filter(node => node.subjectName === subjectName);
};

export const getCurriculumByGrade = (educationalLevel: string): CurriculumNode[] => {
  return mockCurriculumData.filter(node => node.educationalLevel === educationalLevel);
};
