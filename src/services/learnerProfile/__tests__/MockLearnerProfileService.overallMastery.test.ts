import { describe, it, expect, beforeEach } from 'vitest';
import { mockProfileService, MOCK_USER_ID } from '../MockProfileService';
import { LearningAtomPerformance } from '@/types/learning';

const TEST_KC_ID_1 = 'g4-math-oa-A-1-kc1';
const TEST_KC_ID_2 = 'g4-math-oa-A-1-kc2';
const TEST_KC_ID_3 = 'g4-math-oa-A-2-kc1';


describe('MockLearnerProfileService - Overall Mastery Calculation', () => {
  beforeEach(() => {
    mockProfileService.resetStore();
  });

  const createPerformance = (success: boolean): LearningAtomPerformance => ({
    attempts: 1,
    timeTakenSeconds: 30,
    hintsUsed: 0,
    success,
    firstAttemptSuccess: success,
    timestamp: new Date().toISOString(),
  });

  it('should have overallMastery of 0 for a new profile with no KC interactions', async () => {
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(profile.aggregateMetrics.overallMastery).toBe(0);
    expect(profile.aggregateMetrics.completedKCs).toBe(0);
    expect(profile.aggregateMetrics.totalKCsAttempted).toBe(0);
  });

  it('should calculate overallMastery as the average of KC mastery levels', async () => {
    // KC1: success -> masteryLevel = 0.625
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true));
    // KC2: failure -> masteryLevel = 0.375
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createPerformance(false));

    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const expectedOverallMastery = (0.625 + 0.375) / 2;
    expect(profile.aggregateMetrics.overallMastery).toBeCloseTo(expectedOverallMastery);
    expect(profile.aggregateMetrics.totalKCsAttempted).toBe(2);
  });

  it('should update completedKCs count based on mastery threshold (>=0.85)', async () => {
    // KC1: Strong mastery
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true)); // 0.625
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true)); // 0.71875
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true)); // ~0.789
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true)); // ~0.841
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(true)); // ~0.881 -> completed

    // KC2: Lower mastery
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createPerformance(false)); // 0.375

    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(profile.aggregateMetrics.completedKCs).toBe(1);
    expect(profile.aggregateMetrics.totalKCsAttempted).toBe(2);

    // KC3: Also strong mastery
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_3, createPerformance(true));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_3, createPerformance(true));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_3, createPerformance(true));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_3, createPerformance(true));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_3, createPerformance(true));

    const updatedProfile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(updatedProfile.aggregateMetrics.completedKCs).toBe(2);
    expect(updatedProfile.aggregateMetrics.totalKCsAttempted).toBe(3);
  });

  it('overallMastery should remain 0 if all KC mastery levels are 0 (or very low after failures)', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createPerformance(false));
     // Mastery will be 0.5 * (0.75)^4 which is approx 0.15, then bounded to 0.01

    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createPerformance(false));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createPerformance(false));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createPerformance(false));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createPerformance(false));
    // Mastery will be 0.5 * (0.75)^4 which is approx 0.15, then bounded to 0.01

    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const kc1Mastery = profile.kcMasteryMap[TEST_KC_ID_1].masteryLevel;
    const kc2Mastery = profile.kcMasteryMap[TEST_KC_ID_2].masteryLevel;

    expect(kc1Mastery).toBe(0.01);
    expect(kc2Mastery).toBe(0.01);
    expect(profile.aggregateMetrics.overallMastery).toBeCloseTo(0.01); // (0.01 + 0.01) / 2
    expect(profile.aggregateMetrics.completedKCs).toBe(0);
  });
});
