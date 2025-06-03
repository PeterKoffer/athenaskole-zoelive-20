
export * from './types';
export { pathGenerationService } from './pathGenerationService';
export { pathwayManagementService } from './pathwayManagementService';
export { stepManagementService } from './stepManagementService';
export { progressTrackingService } from './progressTrackingService';

// Import the services for use in the main service object
import { pathGenerationService } from './pathGenerationService';
import { pathwayManagementService } from './pathwayManagementService';
import { stepManagementService } from './stepManagementService';
import { progressTrackingService } from './progressTrackingService';

// Main service object for backward compatibility
export const learningPathService = {
  generateLearningPath: pathGenerationService.generateLearningPath,
  getUserLearningPaths: pathwayManagementService.getUserLearningPaths,
  getLearningPathSteps: stepManagementService.getLearningPathSteps,
  getRecommendedNextSteps: stepManagementService.getRecommendedNextSteps,
  updatePathProgress: progressTrackingService.updatePathProgress
};
