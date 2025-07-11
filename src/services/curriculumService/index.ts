// Re-export the main curriculum service
export { curriculumService as mockCurriculumService, CurriculumService } from '../curriculum/CurriculumService';
export type { ICurriculumService as CurriculumService } from '../curriculum/CurriculumService';

// Keep the existing types for backward compatibility
export type { CurriculumService as CurriculumServiceInterface } from './types';
