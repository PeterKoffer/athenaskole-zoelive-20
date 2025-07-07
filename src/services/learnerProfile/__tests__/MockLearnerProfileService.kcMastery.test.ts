import { describe, it, expect, beforeEach } from 'vitest';
import { mockProfileService, MOCK_USER_ID } from '../MockProfileService';
import { LearningAtomPerformance } from '@/types/learning';
import { KnowledgeComponentMastery } from '@/types/learnerProfile';

const TEST_KC_ID_1 = 'g4-math-oa-A-1-kc1'; // Example KC from curriculum data
const TEST_KC_ID_2 = 'g4-math-oa-A-1-kc2'; // Another example KC

describe('MockLearnerProfileService - KC Mastery Management', () => {
  beforeEach(() => {
    mockProfileService.resetStore();
  });

  const createPerformance = (success: boolean, attempts: number = 1, time: number = 30, hints: number = 0): LearningAtomPerformance => ({
    attempts,
    timeTakenSeconds: time,
    hintsUsed: hints,
    success,
    firstAttemptSuccess: success && attempts === 1,
    timestamp: new Date().toISOString(),
  });

  it('should create KC mastery on first interaction', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true));
    const kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery).toBeDefined();
    expect(kcMastery?.kcId).toBe(TEST_KC_ID_1);
    expect(kcMastery?.totalAttempts).toBe(1);
    expect(kcMastery?.successfulAttempts).toBe(1);
    expect(kcMastery?.masteryLevel).toBeGreaterThan(0.5); // Initial boost from 0.5
  });

  it('should update mastery level correctly for a successful attempt', async () => {
    // Initial neutral state (0.5)
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true));
    let kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    const firstMastery = kcMastery!.masteryLevel; // Should be 0.5 + (1-0.5)*0.25 = 0.625
    expect(firstMastery).toBe(0.625);

    // Another success
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true));
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery!.masteryLevel).toBeGreaterThan(firstMastery); // Should increase
    expect(kcMastery!.masteryLevel).toBe(0.625 + (1 - 0.625) * 0.25); // 0.625 + 0.375 * 0.25 = 0.625 + 0.09375 = 0.71875
    expect(kcMastery!.totalAttempts).toBe(2);
    expect(kcMastery!.successfulAttempts).toBe(2);
  });

  it('should update mastery level correctly for a failed attempt', async () => {
    // Initial neutral state (0.5)
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false));
    let kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    const firstMastery = kcMastery!.masteryLevel; // Should be 0.5 - 0.5*0.25 = 0.375
    expect(firstMastery).toBe(0.375);


    // Another failure
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false));
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery!.masteryLevel).toBeLessThan(firstMastery); // Should decrease
    expect(kcMastery!.masteryLevel).toBe(0.375 - 0.375 * 0.25); // 0.375 - 0.09375 = 0.28125
    expect(kcMastery!.totalAttempts).toBe(2);
    expect(kcMastery!.successfulAttempts).toBe(0);
  });

  it('should accumulate interaction history', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true, 1, 20, 0));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false, 1, 30, 1));
    const kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.interactionHistory.length).toBe(2);
    expect(kcMastery?.interactionHistory[0].success).toBe(true);
    expect(kcMastery?.interactionHistory[1].success).toBe(false);
    expect(kcMastery?.interactionHistory[1].hintsUsed).toBe(1);
  });

  it('should cap interaction history at 20 entries', async () => {
    for (let i = 0; i < 25; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(i % 2 === 0, 1, 10+i, 0));
    }
    const kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.interactionHistory.length).toBe(20);
    // Last event should be from iteration 24 (success = true)
    expect(kcMastery?.interactionHistory[19].success).toBe(true);
    expect(kcMastery?.interactionHistory[19].timeTakenSeconds).toBe(10+24);
  });


  it('should update currentStreak correctly', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true));
    let kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.currentStreak).toBe(1);

    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true));
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.currentStreak).toBe(2);

    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false));
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.currentStreak).toBe(0);

    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true));
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.currentStreak).toBe(1);
  });

  it('should handle performance with multiple internal attempts for a single KC update', async () => {
    // This tests if performance.attempts is used for totalAttempts in KC
    const performance: LearningAtomPerformance = {
      attempts: 3, // e.g. student tried 3 times within one learning atom for this KC
      timeTakenSeconds: 90,
      hintsUsed: 2,
      success: true, // overall atom success
      firstAttemptSuccess: false,
      timestamp: new Date().toISOString(),
    };
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, performance);
    const kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.totalAttempts).toBe(3);
    expect(kcMastery?.successfulAttempts).toBe(1); // Session success counts as 1 successful attempt for KC
    expect(kcMastery?.masteryLevel).toBe(0.625); // 0.5 + (1-0.5)*0.25
  });

  it('should bound mastery level between 0.01 and 0.99', async () => {
    // Drive mastery down
    for(let i=0; i<20; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false));
    }
    let kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.masteryLevel).toBe(0.01);

    // Reset and drive mastery up
    mockProfileService.resetStore();
    for(let i=0; i<20; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true));
    }
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.masteryLevel).toBe(0.99);
  });
});
