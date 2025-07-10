
import { describe, it, expect, beforeEach } from 'vitest';
import { mockProfileService, MOCK_USER_ID } from '../MockProfileService';
import { KCMasteryUpdateData } from '@/types/learnerProfile';

describe('MockLearnerProfileService - Basic Operations', () => {
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

  it('should create a profile when getProfile is called for a new user', async () => {
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    
    expect(profile).toBeDefined();
    expect(profile.userId).toBe(MOCK_USER_ID);
    expect(profile.overallMastery).toBe(0);
    expect(profile.kcMasteryMap).toEqual({});
  });

  it('should return the same profile when getProfile is called multiple times', async () => {
    const profile1 = await mockProfileService.getProfile(MOCK_USER_ID);
    const profile2 = await mockProfileService.getProfile(MOCK_USER_ID);
    
    expect(profile1).toBe(profile2); // Same object reference
  });

  it('should update KC mastery when updateKCMastery is called', async () => {
    const testKcId = 'test-kc-1';
    
    await mockProfileService.updateKCMastery(
      MOCK_USER_ID, 
      testKcId, 
      createKCMasteryUpdateData(true)
    );
    
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    
    expect(profile.kcMasteryMap[testKcId]).toBeDefined();
    expect(profile.kcMasteryMap[testKcId].masteryLevel).toBeGreaterThan(0.5);
    expect(profile.kcMasteryMap[testKcId].totalAttempts).toBe(1);
    expect(profile.kcMasteryMap[testKcId].successfulAttempts).toBe(1);
  });

  it('should handle incorrect answers properly', async () => {
    const testKcId = 'test-kc-2';
    
    await mockProfileService.updateKCMastery(
      MOCK_USER_ID, 
      testKcId, 
      createKCMasteryUpdateData(false)
    );
    
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    const kcMastery = profile.kcMasteryMap[testKcId];
    
    expect(kcMastery.masteryLevel).toBeLessThan(0.5);
    expect(kcMastery.totalAttempts).toBe(1);
    expect(kcMastery.successfulAttempts).toBe(0);
    expect(kcMastery.currentStreak).toBe(0);
  });
});
