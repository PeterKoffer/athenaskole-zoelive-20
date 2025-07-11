
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

// Import the data for default export
import { mockCurriculumData } from './curriculum';

// Default export for backward compatibility
export default mockCurriculumData;
