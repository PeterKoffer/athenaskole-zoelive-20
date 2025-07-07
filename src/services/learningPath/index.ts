
// Fixed exports for learning path services

export { PathGenerationService, pathGenerationService } from './pathGenerationService';
export { PathwayManagementService } from './pathwayManagementService';

// Create instances for backward compatibility
export const pathwayManagementService = new PathwayManagementService();
