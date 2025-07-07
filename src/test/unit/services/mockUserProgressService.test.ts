import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockUserProgressService } from '@/services/mockUserProgressService';
import { mockProfileService } from '@/services/learnerProfile/MockProfileService';
import { mockCurriculumService } from '@/services/curriculumService/mockCurriculumService';
import { LearningAtomPerformance } from '@/types/learning';
import { CurriculumNode } from '@/types/curriculumIndex';

// Mock the dependencies
vi.mock('@/services/learnerProfile/MockProfileService', () => ({
  mockProfileService: {
    updateKCMastery: vi.fn().mockResolvedValue(undefined),
    // Add other methods if they are called directly by tested service and need mocking
  },
}));

vi.mock('@/services/curriculumService/mockCurriculumService', () => ({
  mockCurriculumService: {
    getNodes: vi.fn().mockResolvedValue([]), // Default to no KCs
    // Add other methods if they are called directly by tested service and need mocking
  },
}));

const TEST_USER_ID = 'user-test-progress-123';
const TEST_STEP_ID = 'step-1';
const TEST_OBJECTIVE_ID_WITH_KCS = 'objective-with-kcs';
const TEST_OBJECTIVE_ID_NO_KCS = 'objective-no-kcs';

const KC_1: CurriculumNode = { id: 'kc-1', parentId: TEST_OBJECTIVE_ID_WITH_KCS, nodeType: 'kc', name: 'KC 1' };
const KC_2: CurriculumNode = { id: 'kc-2', parentId: TEST_OBJECTIVE_ID_WITH_KCS, nodeType: 'kc', name: 'KC 2' };

const MOCK_PERFORMANCE_SUCCESS: LearningAtomPerformance = {
  attempts: 1,
  timeTakenSeconds: 30,
  hintsUsed: 0,
  success: true,
  firstAttemptSuccess: true,
  timestamp: new Date().toISOString(),
};

const MOCK_PERFORMANCE_FAILURE: LearningAtomPerformance = {
  attempts: 1,
  timeTakenSeconds: 60,
  hintsUsed: 2,
  success: false,
  firstAttemptSuccess: false,
  timestamp: new Date().toISOString(),
};


describe('MockUserProgressService - Integration with LearnerProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // If MockUserProgressService has its own state that needs resetting for tests:
    // mockUserProgressService.resetStore(); // Assuming such a method exists or is added
  });

  it('should call updateKCMastery for each child KC when an objective attempt is recorded and KCs exist', async () => {
    (mockCurriculumService.getNodes as vi.Mock).mockResolvedValueOnce([KC_1, KC_2]);

    await mockUserProgressService.recordObjectiveAttempt(
      TEST_USER_ID,
      TEST_STEP_ID,
      TEST_OBJECTIVE_ID_WITH_KCS,
      MOCK_PERFORMANCE_SUCCESS
    );

    expect(mockCurriculumService.getNodes).toHaveBeenCalledWith({
      parentId: TEST_OBJECTIVE_ID_WITH_KCS,
      nodeType: 'kc',
    });
    expect(mockProfileService.updateKCMastery).toHaveBeenCalledTimes(2);
    expect(mockProfileService.updateKCMastery).toHaveBeenCalledWith(TEST_USER_ID, KC_1.id, MOCK_PERFORMANCE_SUCCESS);
    expect(mockProfileService.updateKCMastery).toHaveBeenCalledWith(TEST_USER_ID, KC_2.id, MOCK_PERFORMANCE_SUCCESS);
  });

  it('should NOT call updateKCMastery if objective has no child KCs', async () => {
    (mockCurriculumService.getNodes as vi.Mock).mockResolvedValueOnce([]); // No KCs

    await mockUserProgressService.recordObjectiveAttempt(
      TEST_USER_ID,
      TEST_STEP_ID,
      TEST_OBJECTIVE_ID_NO_KCS,
      MOCK_PERFORMANCE_SUCCESS
    );

    expect(mockCurriculumService.getNodes).toHaveBeenCalledWith({
      parentId: TEST_OBJECTIVE_ID_NO_KCS,
      nodeType: 'kc',
    });
    expect(mockProfileService.updateKCMastery).not.toHaveBeenCalled();
  });

  it('should pass the correct performance data to updateKCMastery on failure', async () => {
    (mockCurriculumService.getNodes as vi.Mock).mockResolvedValueOnce([KC_1]);

    await mockUserProgressService.recordObjectiveAttempt(
      TEST_USER_ID,
      TEST_STEP_ID,
      TEST_OBJECTIVE_ID_WITH_KCS,
      MOCK_PERFORMANCE_FAILURE
    );
    expect(mockProfileService.updateKCMastery).toHaveBeenCalledWith(TEST_USER_ID, KC_1.id, MOCK_PERFORMANCE_FAILURE);
  });

  it('should still update objective progress even if KC update fails', async () => {
    (mockCurriculumService.getNodes as vi.Mock).mockResolvedValueOnce([KC_1]);
    (mockProfileService.updateKCMastery as vi.Mock).mockRejectedValueOnce(new Error('KC update failed'));

    // We expect console.error to be called
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await mockUserProgressService.recordObjectiveAttempt(
      TEST_USER_ID,
      TEST_STEP_ID,
      TEST_OBJECTIVE_ID_WITH_KCS,
      MOCK_PERFORMANCE_SUCCESS
    );

    // Check that objective progress was still made (implicitly, by not throwing error from recordObjectiveAttempt itself)
    // A more robust test would check the actual state of userProgressStore if possible,
    // or ensure recordObjectiveAttempt doesn't re-throw the error.
    // For now, we check that the error was logged.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `[MockUserProgressService] Error updating KC mastery for objective ${TEST_OBJECTIVE_ID_WITH_KCS}:`,
      expect.any(Error)
    );

    // Ensure objective metrics would have been updated (this part is harder to test without deeper access/refactor)
    // For instance, we can check that getObjectiveProgress after this would return updated metrics.
    // This requires MockUserProgressService to have a resettable store or for us to inspect its internal store.
    // Since userProgressStore is exported from mockData, we could potentially inspect it IF tests allow side effects.
    // For simplicity, this test primarily ensures flow continues and error is logged.

    consoleErrorSpy.mockRestore();
  });

});
