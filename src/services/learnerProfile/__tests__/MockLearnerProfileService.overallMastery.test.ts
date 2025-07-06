
import { describe, it, expect, beforeEach } from 'vitest';
import { MockLearnerProfileService } from '../MockLearnerProfileService';

describe('MockLearnerProfileService - Overall Mastery', () => {
  let service: MockLearnerProfileService;
  const testUserId = 'test-user-123';

  beforeEach(async () => {
    service = new MockLearnerProfileService();
    service.clearAllProfiles();
    await service.createInitialProfile(testUserId);
  });

  it('should update overall mastery when KC mastery changes', async () => {
    const kc1 = 'g4-math-oa-A-1-kc1';
    const kc2 = 'g4-math-oa-A-1-kc2';

    // Update mastery for first KC
    let profile = await service.updateKcMastery(testUserId, kc1, {
      isCorrect: true,
      newAttempt: true,
      interactionType: 'practice'
    });
    
    const singleKcMastery = profile.overallMastery;
    expect(singleKcMastery).toBeGreaterThan(0);

    // Update mastery for second KC
    profile = await service.updateKcMastery(testUserId, kc2, {
      isCorrect: true,
      newAttempt: true,
      interactionType: 'practice'
    });

    // Overall mastery should be average of both KCs
    const twoKcMastery = profile.overallMastery;
    expect(twoKcMastery).toBeGreaterThan(0);
    
    // Should be approximately the average of the two KC masteries
    const expectedAverage = (profile.kcMasteryMap[kc1].masteryLevel + profile.kcMasteryMap[kc2].masteryLevel) / 2;
    expect(Math.abs(twoKcMastery - expectedAverage)).toBeLessThan(0.001);
  });
});
