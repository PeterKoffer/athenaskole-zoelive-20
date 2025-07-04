import { UserStepProgress } from '@/types/curriculum';

// In-memory store for mock user progress
// Key: userId, Value: Array of UserStepProgress objects for that user
const userProgressStore: Record<string, UserStepProgress[]> = {
  'testUser1': [
    {
      id: 'progress1_user1',
      userId: 'testUser1',
      stepId: '1', // Corresponds to CurriculumStep id "1"
      isCompleted: false,
      timeSpent: 1200,
      curriculumProgress: {
        'k-cc-1': true, // Example: Kindergarten Counting to 100
        'k-cc-2': false,
        'dk-math-basic-arithmetic': true,
        // other objectives from step 1...
      }
    },
    {
      id: 'progress2_user1',
      userId: 'testUser1',
      stepId: '2',
      isCompleted: false,
      timeSpent: 600,
      curriculumProgress: {
        '1-oa-1': false,
      }
    }
  ],
  'testUser2': [
     {
      id: 'progress1_user2',
      userId: 'testUser2',
      stepId: '1',
      isCompleted: true, // This user completed step 1
      timeSpent: 3000,
      curriculumProgress: { // All objectives in step 1 would be true
        'k-cc-1': true,
        'k-cc-2': true,
        'k-oa-1': true,
        'dk-math-basic-arithmetic': true,
        'dk-danish-reading': true,
      }
    }
  ]
};

export const mockUserProgressService = {
  async getUserProgress(userId: string): Promise<UserStepProgress[]> {
    console.log(`[MockUserProgressService] Fetching progress for userId: ${userId}`);
    return userProgressStore[userId] || [];
  },

  async getObjectiveCompletionStatus(userId: string, objectiveId: string): Promise<boolean> {
    console.log(`[MockUserProgressService] Getting completion status for userId: ${userId}, objectiveId: ${objectiveId}`);
    const userSteps = userProgressStore[userId] || [];
    for (const stepProgress of userSteps) {
      if (stepProgress.curriculumProgress.hasOwnProperty(objectiveId)) {
        return stepProgress.curriculumProgress[objectiveId];
      }
    }
    return false; // Default to not completed if not found
  },

  async updateObjectiveCompletionStatus(
    userId: string,
    stepId: string, // The ID of the CurriculumStep
    objectiveId: string,
    isCompleted: boolean
  ): Promise<void> {
    console.log(`[MockUserProgressService] Updating objective for userId: ${userId}, stepId: ${stepId}, objectiveId: ${objectiveId}, completed: ${isCompleted}`);
    if (!userProgressStore[userId]) {
      userProgressStore[userId] = [];
    }

    let stepProgress = userProgressStore[userId].find(sp => sp.stepId === stepId);

    if (!stepProgress) {
      // Create a new UserStepProgress if it doesn't exist for this step
      stepProgress = {
        id: `progress_${stepId}_${userId}_${Date.now()}`,
        userId,
        stepId,
        isCompleted: false, // Overall step completion, to be updated separately
        timeSpent: 0,
        curriculumProgress: {},
      };
      userProgressStore[userId].push(stepProgress);
    }

    stepProgress.curriculumProgress[objectiveId] = isCompleted;
    console.log(`[MockUserProgressService] Updated progress:`, stepProgress.curriculumProgress);
    // Note: This mock doesn't automatically update stepProgress.isCompleted. That would require knowing all objectives in a step.
  },

  // Helper to determine if an entire step is completed
  // This would be called after an objective is updated.
  async checkAndUpdateStepCompletion(userId: string, stepId: string, allObjectiveIdsInStep: string[]): Promise<void> {
    const stepProgress = userProgressStore[userId]?.find(sp => sp.stepId === stepId);
    if (!stepProgress) return;

    let allDone = true;
    for (const objId of allObjectiveIdsInStep) {
      if (!stepProgress.curriculumProgress[objId]) { // If any objective is not true (completed)
        allDone = false;
        break;
      }
    }
    if (stepProgress.isCompleted !== allDone) {
        stepProgress.isCompleted = allDone;
        if (allDone) stepProgress.completedAt = new Date().toISOString();
        console.log(`[MockUserProgressService] Step ${stepId} for user ${userId} completion updated to: ${allDone}`);
    }
  }
};

export default mockUserProgressService;
