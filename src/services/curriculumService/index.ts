// Re-export the main curriculum service
export { curriculumService as mockCurriculumService } from '../curriculum/CurriculumService';
export { CurriculumService } from '../curriculum/CurriculumService';
export type { ICurriculumService } from '../curriculum/CurriculumService';

// Keep the existing types for backward compatibility
export type { CurriculumService as CurriculumServiceInterface } from './types';
