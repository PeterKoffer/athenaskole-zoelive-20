
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects'; // Added for the helper
import { usRootCurriculumNodes } from './us/usRootData';
import { usMathCurriculumNodes } from './us/usMathData';
import { usElaCurriculumNodes } from './us/usElaData';
import { usMentalWellnessCurriculumData } from './us/usMentalWellnessData';
import { usLifeEssentialsCurriculumData } from './us/usLifeEssentialsData';
import { usComputerScienceCurriculumData } from './us/usComputerScienceData';
import { usCreativeArtsCurriculumData } from './us/usCreativeArtsData'; // Import US Creative Arts
import { dkCurriculumNodes } from './dk/dkData';
import { dkLifeEssentialsCurriculumData } from './dk/dkLifeEssentialsData';
import { dkComputerScienceCurriculumData } from './dk/dkComputerScienceData';
import { dkCreativeArtsCurriculumData } from './dk/dkCreativeArtsData'; // Import DK Creative Arts

// Combine all curriculum data from different countries and subjects
export const mockCurriculumData: CurriculumNode[] = [
  ...usRootCurriculumNodes,
  ...usMathCurriculumNodes,
  ...usElaCurriculumNodes,
  ...usMentalWellnessCurriculumData,
  ...usLifeEssentialsCurriculumData,
  ...usComputerScienceCurriculumData,
  ...usCreativeArtsCurriculumData, // Add US Creative Arts
  ...dkCurriculumNodes,
  ...dkLifeEssentialsCurriculumData,
  ...dkComputerScienceCurriculumData,
  ...dkCreativeArtsCurriculumData // Add DK Creative Arts
];

// Export individual country/subject data for specific use cases
export {
  usRootCurriculumNodes,
  usMathCurriculumNodes,
  usElaCurriculumNodes,
  usMentalWellnessCurriculumData,
  usLifeEssentialsCurriculumData,
  usComputerScienceCurriculumData,
  usCreativeArtsCurriculumData, // Export US Creative Arts
  dkCurriculumNodes,
  dkLifeEssentialsCurriculumData,
  dkComputerScienceCurriculumData,
  dkCreativeArtsCurriculumData // Export DK Creative Arts
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
