// @ts-nocheck
import { describe, it, expect, beforeEach } from 'vitest';
import { mockProfileService, MOCK_USER_ID } from '../MockProfileService';
import { KCMasteryUpdateData } from '@/types/learnerProfile';

const TEST_KC_ID_1 = 'g4-math-oa-A-1-kc1';
const TEST_KC_ID_2 = 'g4-math-oa-A-1-kc2';

describe('MockLearnerProfileService - KC Mastery Logic', () => {
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

  it('should increase mastery level on successful attempts', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const kcMastery = profile.kcMasteryMap[TEST_KC_ID_1];
    
    expect(kcMastery.masteryLevel).toBe(0.6); // Initial 0.5 + (1-0.5)*0.2 (learningRate)
    expect(kcMastery.currentStreak).toBe(1);
  });

  it('should decrease mastery level on failed attempts', async () => {
    // First, establish some mastery
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    
    // Then fail
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(false));
    
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const kcMastery = profile.kcMasteryMap[TEST_KC_ID_1];
    
    expect(kcMastery.masteryLevel).toBe(0.54); // 0.6 - 0.6*0.1
    expect(kcMastery.currentStreak).toBe(0);
  });

  it('should track interaction history', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(false));
    
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const kcMastery = profile.kcMasteryMap[TEST_KC_ID_1];
    
    expect(kcMastery.interactionHistory).toHaveLength(2);
    expect(kcMastery.interactionHistory[0].success).toBe(true);
    expect(kcMastery.interactionHistory[1].success).toBe(false);
  });

  it('should limit interaction history to 20 entries', async () => {
    // Add 25 interactions
    for (let i = 0; i < 25; i++) {
      await mockProfileService.updateKCMastery(
        MOCK_USER_ID, 
        TEST_KC_ID_1, 
        createKCMasteryUpdateData(i % 2 === 0)
      );
    }
    
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const kcMastery = profile.kcMasteryMap[TEST_KC_ID_1];
    
    expect(kcMastery.interactionHistory).toHaveLength(20);
    expect(kcMastery.totalAttempts).toBe(25);
  });

  it('should handle mastery bounds correctly', async () => {
    // Test upper bound (should not exceed 0.99)
    for (let i = 0; i < 20; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    }
    
    let profile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(profile.kcMasteryMap[TEST_KC_ID_1].masteryLevel).toBeLessThanOrEqual(0.99);
    
    // Test lower bound (should not go below 0.01)
    // Need more iterations to hit the 0.01 floor from 0.5 with forgettingRate 0.1
    // 0.5 * (0.9^N) <= 0.01  => N >= log(0.02)/log(0.9) approx 37.17. So use 40.
    for (let i = 0; i < 40; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_2, createKCMasteryUpdateData(false));
    }
    
    profile = await mockProfileService.getProfile(MOCK_USER_ID);
    // After enough iterations, it should hit the floor
    expect(profile.kcMasteryMap[TEST_KC_ID_2].masteryLevel).toBe(0.01);
  });
});
