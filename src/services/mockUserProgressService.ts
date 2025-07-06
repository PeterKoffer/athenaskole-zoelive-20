
import { UserStepProgress, ObjectiveProgressMetrics } from '@/types/curriculum';
import { LearningAtomPerformance } from '@/types/learning';
import { userProgressStore } from './mockUserProgressService/mockData';
import { createInitialObjectiveMetrics, updateDerivedMetrics } from './mockUserProgressService/helpers';
import type { UserProgressService } from './mockUserProgressService/types';

class MockUserProgressService implements UserProgressService {
  
  async getUserProgress(userId: string): Promise<UserStepProgress[]> {
    console.log(`[MockUserProgressService] Fetching all step progress for userId: ${userId}`);
    return userProgressStore[userId] || [];
  }

  async getObjectiveProgress(userId: string, objectiveId: string): Promise<ObjectiveProgressMetrics | undefined> {
    console.log(`[MockUserProgressService] Getting specific objective progress for userId: ${userId}, objectiveId: ${objectiveId}`);
    const userSteps = userProgressStore[userId] || [];
    for (const stepProgress of userSteps) {
      if (stepProgress.curriculumProgress.hasOwnProperty(objectiveId)) {
        return stepProgress.curriculumProgress[objectiveId];
      }
    }
    return undefined;
  }

  async isObjectiveCompleted(userId: string, objectiveId: string): Promise<boolean> {
    console.log(`[MockUserProgressService] Checking completion for userId: ${userId}, objectiveId: ${objectiveId}`);
    const objectiveMetrics = await this.getObjectiveProgress(userId, objectiveId);
    return objectiveMetrics?.isCompleted || false;
  }

  async recordObjectiveAttempt(
    userId: string,
    stepId: string,
    objectiveId: string,
    performance: LearningAtomPerformance
  ): Promise<void> {
    console.log(`[MockUserProgressService] Recording attempt for userId: ${userId}, stepId: ${stepId}, objectiveId: ${objectiveId}, success: ${performance.success}`);

    if (!userProgressStore[userId]) {
      userProgressStore[userId] = [];
    }

    let stepProgress = userProgressStore[userId].find(sp => sp.stepId === stepId);

    if (!stepProgress) {
      stepProgress = {
        id: `progress_${stepId}_${userId}_${Date.now()}`,
        userId,
        stepId,
        isCompleted: false,
        timeSpent: 0,
        curriculumProgress: {},
      };
      userProgressStore[userId].push(stepProgress);
    }

    let objectiveMetrics = stepProgress.curriculumProgress[objectiveId];
    if (!objectiveMetrics) {
      objectiveMetrics = createInitialObjectiveMetrics();
      stepProgress.curriculumProgress[objectiveId] = objectiveMetrics;
    }

    // Objective's total attempts increments by 1 for this session,
    // as each session is considered one attempt at the objective level.
    objectiveMetrics.totalAttempts += 1;
    objectiveMetrics.totalTimeSpentSeconds += performance.timeTakenSeconds;
    // Keep detailed performance of the last session, including its internal attempts
    objectiveMetrics.lastAttemptPerformance = performance;

    if (performance.success) {
      objectiveMetrics.isCompleted = true;
      if (!objectiveMetrics.completedAt) {
          objectiveMetrics.completedAt = performance.timestamp;
      }
      objectiveMetrics.successfulAttempts += 1;
    }

    updateDerivedMetrics(objectiveMetrics);

    console.log(`[MockUserProgressService] Updated objective metrics for ${objectiveId}:`, objectiveMetrics);
  }

  async checkAndUpdateStepCompletion(userId: string, stepId: string, allObjectiveIdsInStep: string[]): Promise<void> {
    const stepProgress = userProgressStore[userId]?.find(sp => sp.stepId === stepId);
    if (!stepProgress) {
        console.warn(`[MockUserProgressService] Cannot check step completion. No progress found for user ${userId}, step ${stepId}`);
        return;
    }

    let allDone = true;
    if (allObjectiveIdsInStep.length === 0 && Object.keys(stepProgress.curriculumProgress).length === 0) {
        if(allObjectiveIdsInStep.length === 0) {
            console.warn(`[MockUserProgressService] Step ${stepId} has no objectives defined. Cannot mark as complete via objective tracking.`);
            allDone = false;
        }
    }

    for (const objId of allObjectiveIdsInStep) {
      const objectiveMetrics = stepProgress.curriculumProgress[objId];
      if (!objectiveMetrics || !objectiveMetrics.isCompleted) {
        allDone = false;
        break;
      }
    }

    if (stepProgress.isCompleted !== allDone) {
        stepProgress.isCompleted = allDone;
        if (allDone) {
            stepProgress.completedAt = new Date().toISOString();
            console.log(`[MockUserProgressService] Step ${stepId} for user ${userId} completion status updated to: ${allDone} at ${stepProgress.completedAt}`);
        } else {
            delete stepProgress.completedAt;
            console.log(`[MockUserProgressService] Step ${stepId} for user ${userId} completion status updated to: ${allDone}`);
        }
    }
  }
}

export const mockUserProgressService = new MockUserProgressService();

export default mockUserProgressService;
