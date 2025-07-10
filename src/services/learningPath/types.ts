
// Learning Path Type Definitions

export interface LearningPathway {
  id: string;
  userId: string;
  subject: string;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  estimatedCompletionTime: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPathStep {
  id: string;
  pathwayId: string;
  stepNumber: number;
  learningObjectiveId: string;
  contentId: string;
  isCompleted: boolean;
  completionTime?: string;
  score?: number;
}

export interface LearningPathService {
  getUserLearningPaths(userId: string): Promise<LearningPathway[]>;
  generateLearningPath(userId: string, subject: string): Promise<string | null>;
  getLearningPathSteps(pathwayId: string): Promise<LearningPathStep[]>;
}
