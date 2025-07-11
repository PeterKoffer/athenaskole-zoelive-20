
// Re-export the modular curriculum data
export { 
  mockCurriculumData,
  getCurriculumByCountry,
  getCurriculumBySubject,
  getCurriculumByGrade,
  usRootCurriculumNodes,
  usMathCurriculumNodes,
  usElaCurriculumNodes,
  dkCurriculumNodes
} from './curriculum';

// Default export for backward compatibility
export default mockCurriculumData;
