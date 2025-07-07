
// Learning Path Services

export { PathGenerationService } from './pathGenerationService';
export { PathwayManagementService } from './pathwayManagementService'; 
export { ProgressTrackingService, progressTrackingService } from './progressTrackingService';
export { learningPathService } from './LearningPathService';
export { stepManagementService } from './stepManagementService';

// Export types
export type { LearningPathway, LearningPathStep, LearningPathService } from './types';

// Create default service instances
export const pathGenerationService = new PathGenerationService();
export const pathwayManagementService = new PathwayManagementService();
