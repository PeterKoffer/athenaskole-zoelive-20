
export interface LearningPathway {
  id: string;
  userId: string;
  subject: string;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  difficultyProgression: number[];
  estimatedCompletionTime: number;
  isActive: boolean;
  createdAt: string;
}

export interface LearningPathStep {
  id: string;
  pathwayId: string;
  stepNumber: number;
  learningObjectiveId: string;
  contentId?: string;
  isCompleted: boolean;
  completionTime?: string;
  score?: number;
}
