
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects'; // Added for the helper
import { usRootCurriculumNodes } from './us/usRootData';
import { usMathCurriculumNodes } from './us/usMathData';
import { usElaCurriculumNodes } from './us/usElaData';
import { usMentalWellnessCurriculumData } from './us/usMentalWellnessData'; // Import new data
import { dkCurriculumNodes } from './dk/dkData';

// Combine all curriculum data from different countries and subjects
export const mockCurriculumData: CurriculumNode[] = [
  ...usRootCurriculumNodes,
  ...usMathCurriculumNodes,
  ...usElaCurriculumNodes,
  ...usMentalWellnessCurriculumData, // Add new data to the array
  ...dkCurriculumNodes
];

// Export individual country/subject data for specific use cases
export {
  usRootCurriculumNodes,
  usMathCurriculumNodes,
  usElaCurriculumNodes,
  usMentalWellnessCurriculumData, // Export new data array
  dkCurriculumNodes
};

// Helper functions for filtering data
export const getCurriculumByCountry = (countryCode: string): CurriculumNode[] => {
  return mockCurriculumData.filter(node => node.countryCode === countryCode);
};

export const getCurriculumBySubject = (subject: NELIESubject): CurriculumNode[] => { // Changed parameter to NELIESubject
  return mockCurriculumData.filter(node => node.subject === subject); // Changed to filter by subject enum
};

export const getCurriculumByGrade = (educationalLevel: string): CurriculumNode[] => {
  return mockCurriculumData.filter(node => node.educationalLevel === educationalLevel);
};
