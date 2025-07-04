
import { UserStepProgress, ObjectiveProgressMetrics } from '@/types/curriculum';
import { LearningAtomPerformance } from '@/types/learning';

// In-memory store for mock user progress
// Key: userId, Value: Array of UserStepProgress objects for that user
const userProgressStore: Record<string, UserStepProgress[]> = {
  'testUser1': [
    {
      id: 'progress1_user1',
      userId: 'testUser1',
      stepId: '1',
      isCompleted: false,
      timeSpent: 1200,
      curriculumProgress: {
        'k-cc-1': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 60, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 60, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'k-cc-2': { isCompleted: false, totalAttempts: 2, successfulAttempts: 0, totalTimeSpentSeconds: 120, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 70, hintsUsed:1, success:false, firstAttemptSuccess:false, timestamp: new Date().toISOString()}},
        'dk-math-basic-arithmetic': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 2, successfulAttempts: 1, totalTimeSpentSeconds: 180, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 90, hintsUsed:0, success:true, firstAttemptSuccess:false, timestamp: new Date().toISOString()}},
      }
    },
    {
      id: 'progress2_user1',
      userId: 'testUser1',
      stepId: '2',
      isCompleted: false,
      timeSpent: 600,
      curriculumProgress: {
        '1-oa-1': { isCompleted: false, totalAttempts: 0, successfulAttempts: 0, totalTimeSpentSeconds: 0 },
      }
    }
  ],
  // testUser2 has completed step 1 fully
  'testUser2': [
     {
      id: 'progress1_user2',
      userId: 'testUser2',
      stepId: '1',
      isCompleted: true,
      completedAt: new Date().toISOString(),
      timeSpent: 3000,
      curriculumProgress: {
        'k-cc-1': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 50, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 50, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'k-cc-2': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 70, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 70, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'k-oa-1': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 80, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 80, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'dk-math-basic-arithmetic': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 90, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 90, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'dk-danish-reading': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 60, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 60, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
      }
    }
  ],
  // Add rich test data for the actual test user ID from the adaptive integration test
  '62612ab6-0c5f-4713-b716-feee788c89d9': [
    {
      id: 'progress1_testuser_adaptive',
      userId: '62612ab6-0c5f-4713-b716-feee788c89d9',
      stepId: '1',
      isCompleted: false,
      timeSpent: 2400,
      curriculumProgress: {
        // k-cc-1: Completed easily on first try (should suggest medium/hard for revision)
        'k-cc-1': { 
          isCompleted: true, 
          completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          totalAttempts: 1, 
          successfulAttempts: 1, 
          totalTimeSpentSeconds: 45,
          successRate: 1.0,
          avgTimeSpentSeconds: 45,
          lastAttemptPerformance: { 
            attempts: 1, 
            timeTakenSeconds: 45, 
            hintsUsed: 0, 
            success: true, 
            firstAttemptSuccess: true, 
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        },
        // k-cc-2: Multiple failed attempts (should suggest easy)
        'k-cc-2': { 
          isCompleted: false, 
          totalAttempts: 4, 
          successfulAttempts: 1, 
          totalTimeSpentSeconds: 280,
          successRate: 0.25,
          avgTimeSpentSeconds: 70,
          lastAttemptPerformance: { 
            attempts: 2, 
            timeTakenSeconds: 85, 
            hintsUsed: 2, 
            success: false, 
            firstAttemptSuccess: false, 
            timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
          }
        },
        // k-cc-3: Moderate performance (should suggest medium)
        'k-cc-3': { 
          isCompleted: false, 
          totalAttempts: 3, 
          successfulAttempts: 2, 
          totalTimeSpentSeconds: 150,
          successRate: 0.67,
          avgTimeSpentSeconds: 50,
          lastAttemptPerformance: { 
            attempts: 1, 
            timeTakenSeconds: 55, 
            hintsUsed: 1, 
            success: true, 
            firstAttemptSuccess: false, 
            timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          }
        },
        // dk-math-basic-arithmetic: High performance after initial struggle (should suggest medium/hard)
        'dk-math-basic-arithmetic': { 
          isCompleted: true, 
          completedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          totalAttempts: 3, 
          successfulAttempts: 2, 
          totalTimeSpentSeconds: 210,
          successRate: 0.67,
          avgTimeSpentSeconds: 70,
          lastAttemptPerformance: { 
            attempts: 1, 
            timeTakenSeconds: 60, 
            hintsUsed: 0, 
            success: true, 
            firstAttemptSuccess: true, 
            timestamp: new Date(Date.now() - 172800000).toISOString()
          }
        }
      }
    },
    {
      id: 'progress2_testuser_adaptive',
      userId: '62612ab6-0c5f-4713-b716-feee788c89d9',
      stepId: '2',
      isCompleted: false,
      timeSpent: 800,
      curriculumProgress: {
        // 1-oa-1: Fresh objective with no attempts (should default to medium)
        '1-oa-1': { 
          isCompleted: false, 
          totalAttempts: 0, 
          successfulAttempts: 0, 
          totalTimeSpentSeconds: 0 
        },
        // 1-oa-2: One successful attempt (should suggest medium)
        '1-oa-2': { 
          isCompleted: false, 
          totalAttempts: 1, 
          successfulAttempts: 1, 
          totalTimeSpentSeconds: 40,
          successRate: 1.0,
          avgTimeSpentSeconds: 40,
          lastAttemptPerformance: { 
            attempts: 1, 
            timeTakenSeconds: 40, 
            hintsUsed: 0, 
            success: true, 
            firstAttemptSuccess: true, 
            timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
          }
        }
      }
    }
  ]
};

// Helper to initialize empty metrics for an objective
function createInitialObjectiveMetrics(): ObjectiveProgressMetrics {
    return {
        isCompleted: false,
        totalAttempts: 0,
        successfulAttempts: 0,
        totalTimeSpentSeconds: 0,
    };
}

export const mockUserProgressService = {
  async getUserProgress(userId: string): Promise<UserStepProgress[]> {
    console.log(`[MockUserProgressService] Fetching all step progress for userId: ${userId}`);
    return userProgressStore[userId] || [];
  },

  async getObjectiveProgress(userId: string, objectiveId: string): Promise<ObjectiveProgressMetrics | undefined> {
    console.log(`[MockUserProgressService] Getting specific objective progress for userId: ${userId}, objectiveId: ${objectiveId}`);
    const userSteps = userProgressStore[userId] || [];
    for (const stepProgress of userSteps) {
      if (stepProgress.curriculumProgress.hasOwnProperty(objectiveId)) {
        return stepProgress.curriculumProgress[objectiveId];
      }
    }
    return undefined;
  },

  async isObjectiveCompleted(userId: string, objectiveId: string): Promise<boolean> {
    console.log(`[MockUserProgressService] Checking completion for userId: ${userId}, objectiveId: ${objectiveId}`);
    const objectiveMetrics = await this.getObjectiveProgress(userId, objectiveId);
    return objectiveMetrics?.isCompleted || false;
  },

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

    objectiveMetrics.totalAttempts += performance.attempts > 0 ? performance.attempts : 1; // Ensure at least 1 attempt is counted
    objectiveMetrics.totalTimeSpentSeconds += performance.timeTakenSeconds;
    objectiveMetrics.lastAttemptPerformance = performance;

    if (performance.success) {
      objectiveMetrics.isCompleted = true;
      if (!objectiveMetrics.completedAt) { // Set completedAt only once
          objectiveMetrics.completedAt = performance.timestamp;
      }
      objectiveMetrics.successfulAttempts += 1;
    }

    // Recalculate derived metrics (optional, can also be done on read)
    if(objectiveMetrics.totalAttempts > 0) {
        objectiveMetrics.successRate = objectiveMetrics.successfulAttempts / objectiveMetrics.totalAttempts;
    }
    if(objectiveMetrics.successfulAttempts > 0) { // Or just totalAttempts for avg time overall
        objectiveMetrics.avgTimeSpentSeconds = objectiveMetrics.totalTimeSpentSeconds / objectiveMetrics.totalAttempts; // Avg time over all attempts
    }


    console.log(`[MockUserProgressService] Updated objective metrics for ${objectiveId}:`, objectiveMetrics);
  },


  async checkAndUpdateStepCompletion(userId: string, stepId: string, allObjectiveIdsInStep: string[]): Promise<void> {
    const stepProgress = userProgressStore[userId]?.find(sp => sp.stepId === stepId);
    if (!stepProgress) {
        console.warn(`[MockUserProgressService] Cannot check step completion. No progress found for user ${userId}, step ${stepId}`);
        return;
    }

    let allDone = true;
    if (allObjectiveIdsInStep.length === 0 && Object.keys(stepProgress.curriculumProgress).length === 0) {
        // If a step has no objectives defined in curriculum-steps.json, and no progress recorded (e.g. step 8)
        // Consider it "complete" by default if it's empty. Or, this case might need specific handling.
        // For now, if a step has no objectives, it's not considered completable through this mechanism.
        // Let's assume steps must have objectives to be completed.
        if(allObjectiveIdsInStep.length === 0) {
            console.warn(`[MockUserProgressService] Step ${stepId} has no objectives defined. Cannot mark as complete via objective tracking.`);
            allDone = false; // Or handle as per application logic for empty steps
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
            // If step becomes incomplete again (e.g. if objectives were reset), clear completedAt
            delete stepProgress.completedAt;
            console.log(`[MockUserProgressService] Step ${stepId} for user ${userId} completion status updated to: ${allDone}`);
        }
    }
  }
};

export default mockUserProgressService;
