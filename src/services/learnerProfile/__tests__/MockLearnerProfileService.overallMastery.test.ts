import { describe, it, expect, beforeEach } from 'vitest';
import { mockProfileService, MOCK_USER_ID } from '../MockProfileService';
import { KCMasteryUpdateData } from '@/types/learnerProfile'; // Using KCMasteryUpdateData

const TEST_KC_ID_1 = 'g4-math-oa-A-1-kc1';
const TEST_KC_ID_2 = 'g4-math-oa-A-1-kc2';
const TEST_KC_ID_3 = 'g4-math-oa-A-2-kc1';


describe('MockLearnerProfileService - Overall Mastery Calculation', () => {
  beforeEach(() => {
    mockProfileService.resetStore();
  });

  const createKCMasteryUpdateData = (
    success: boolean,
    eventType: string = 'kc_interaction_test'
    ): KCMasteryUpdateData => ({
    success,
    attemptsInInteraction: 1,
    timeTakenMs: 30000,
    hintsUsed: 0,
    timestamp: new Date().toISOString(),
    eventType,
  });

  it('should have overallMastery of 0 for a new profile with no KC interactions', async () => {
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(profile.overallMastery).toBe(0);
    // The new LearnerProfile type doesn't have aggregateMetrics.completedKCs or totalKCsAttempted
    // So these assertions need to be removed or adapted if that logic is elsewhere.
    // For now, commenting them out as per the type definition in src/types/learnerProfile.ts
    // expect(profile.aggregateMetrics.completedKCs).toBe(0);
    // expect(profile.aggregateMetrics.totalKCsAttempted).toBe(0);
  });

  it('should calculate overallMastery as the average of KC mastery levels', async () => {
    // KC1: 1 success (0.5 initial, 0.2 learningRate) -> 0.5 + (1-0.5)*0.2 = 0.6
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    // KC2: 1 failure (0.5 initial, 0.1 forgettingRate) -> 0.5 - 0.5*0.1 = 0.45
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createKCMasteryUpdateData(false));

    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const expectedOverallMastery = (0.6 + 0.45) / 2; // (0.6 + 0.45) / 2 = 0.525
    expect(profile.overallMastery).toBeCloseTo(expectedOverallMastery);
    // expect(profile.aggregateMetrics.totalKCsAttempted).toBe(2); // No longer on LearnerProfile type directly
  });

  it('should update overallMastery when KCs are added and their mastery changes', async () => {
    // KC1: Strong mastery (5 successes, initial 0.5, rate 0.2)
    let currentMasteryKC1 = 0.5;
    const learningRate = 0.2;
    for (let i=0; i<5; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
      currentMasteryKC1 = currentMasteryKC1 + (1 - currentMasteryKC1) * learningRate;
    }
    // currentMasteryKC1 will be 0.83616

    // KC2: Lower mastery (1 failure, initial 0.5, rate 0.1)
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createKCMasteryUpdateData(false));
    const masteryKC2 = 0.5 - (0.5 * 0.1); // 0.45

    let profile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(profile.overallMastery).toBeCloseTo((currentMasteryKC1 + masteryKC2) / 2);
    // expect(profile.aggregateMetrics.completedKCs).toBe(1); // No aggregateMetrics.completedKCs
    // expect(profile.aggregateMetrics.totalKCsAttempted).toBe(2);

    // KC3: Also strong mastery (5 successes, initial 0.5, rate 0.2)
    let currentMasteryKC3 = 0.5;
    for (let i=0; i<5; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_3, createKCMasteryUpdateData(true));
      currentMasteryKC3 = currentMasteryKC3 + (1 - currentMasteryKC3) * learningRate;
    }
    // currentMasteryKC3 will be 0.83616

    const updatedProfile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(updatedProfile.overallMastery).toBeCloseTo((currentMasteryKC1 + masteryKC2 + currentMasteryKC3) / 3);
    // expect(updatedProfile.aggregateMetrics.completedKCs).toBe(2);
    // expect(updatedProfile.aggregateMetrics.totalKCsAttempted).toBe(3);
  });

  // This is the test that was previously failing. Let's adapt its expectation.
  // The core issue was expecting 0.01 after 20 iterations, when the logic might be different.
  // The service now bounds at 0.01.
  it('overallMastery should reflect very low KC mastery levels correctly', async () => {
    mockProfileService.resetStore(); // Ensure clean start
    await mockProfileService.getProfile(MOCK_USER_ID); // Initialize profile

    // Increased iterations to 40 to ensure floor is hit
    for(let i=0; i<40; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(false));
    }
    for(let i=0; i<40; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createKCMasteryUpdateData(false));
    }

    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const kc1Mastery = profile.kcMasteryMap[TEST_KC_ID_1].masteryLevel;
    const kc2Mastery = profile.kcMasteryMap[TEST_KC_ID_2].masteryLevel;

    expect(kc1Mastery).toBe(0.01); // Should now be exactly 0.01 due to Math.max(0.01, ...)
    expect(kc2Mastery).toBe(0.01); // Should now be exactly 0.01
    expect(profile.overallMastery).toBeCloseTo(0.01); // Average of 0.01 and 0.01
    // expect(profile.aggregateMetrics.completedKCs).toBe(0); // No aggregateMetrics.completedKCs
  });
});
