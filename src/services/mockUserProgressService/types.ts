
import { UserStepProgress, ObjectiveProgressMetrics } from '@/types/curriculum';
import { LearningAtomPerformance } from '@/types/learning';

export interface UserProgressService {
  getUserProgress(userId: string): Promise<UserStepProgress[]>;
  getObjectiveProgress(userId: string, objectiveId: string): Promise<ObjectiveProgressMetrics | undefined>;
  isObjectiveCompleted(userId: string, objectiveId: string): Promise<boolean>;
  recordObjectiveAttempt(
    userId: string,
    stepId: string,
    objectiveId: string,
    performance: LearningAtomPerformance
  ): Promise<void>;
  checkAndUpdateStepCompletion(userId: string, stepId: string, allObjectiveIdsInStep: string[]): Promise<void>;
}
