
// Fixed exports for learning path services

export { PathGenerationService, pathGenerationService } from './pathGenerationService';
export { PathwayManagementService } from './pathwayManagementService';
export type { LearningPathway, LearningPathStep, LearningPathService } from './types';
import type { LearningPathway, LearningPathStep, LearningPathService } from './types';

// Create instances for backward compatibility
// export const pathwayManagementService = new PathwayManagementService();

// Create a learning path service instance
export const learningPathService: LearningPathService = {
  async getUserLearningPaths(userId: string): Promise<LearningPathway[]> {
    console.log('📚 Getting learning paths for user:', userId);
    return [];
  },
  async generateLearningPath(userId: string, subject: string): Promise<string | null> {
    console.log('🔄 Generating learning path for:', { userId, subject });
    return `path_${Date.now()}`;
  },
  async getLearningPathSteps(pathwayId: string): Promise<LearningPathStep[]> {
    console.log('📝 Getting steps for pathway:', pathwayId);
    return [];
  }
};
