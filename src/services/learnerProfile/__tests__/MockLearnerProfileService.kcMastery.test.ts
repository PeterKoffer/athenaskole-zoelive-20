
import { describe, it, expect, beforeEach } from 'vitest';
import { MockLearnerProfileService } from '../MockLearnerProfileService';

describe('MockLearnerProfileService - KC Mastery Management', () => {
  let service: MockLearnerProfileService;
  const testUserId = 'test-user-123';
  const testKcId = 'g4-math-oa-A-1-kc1';

  beforeEach(async () => {
    service = new MockLearnerProfileService();
    service.clearAllProfiles();
    await service.createInitialProfile(testUserId);
  });

  it('should return null for non-existent KC mastery', async () => {
    const kcMastery = await service.getKcMastery(testUserId, 'non-existent-kc');
    expect(kcMastery).toBeNull();
  });

  it('should create KC mastery on first interaction', async () => {
    const updatedProfile = await service.updateKcMastery(testUserId, testKcId, {
      isCorrect: true,
      newAttempt: true,
      interactionType: 'practice',
      interactionDetails: { difficulty: 'easy' }
    });

    const kcMastery = updatedProfile.kcMasteryMap[testKcId];
    expect(kcMastery).toBeDefined();
    expect(kcMastery.kcId).toBe(testKcId);
    expect(kcMastery.attempts).toBe(1);
    expect(kcMastery.correctAttempts).toBe(1);
    expect(kcMastery.masteryLevel).toBeGreaterThan(0.5); // Should increase from initial 0.5
    expect(kcMastery.history).toHaveLength(1);
  });

  it('should update existing KC mastery correctly', async () => {
    // First interaction - correct
    await service.updateKcMastery(testUserId, testKcId, {
      isCorrect: true,
      newAttempt: true,
      interactionType: 'practice'
    });

    // Second interaction - incorrect
    const updatedProfile = await service.updateKcMastery(testUserId, testKcId, {
      isCorrect: false,
      newAttempt: true,
      interactionType: 'assessment'
    });

    const kcMastery = updatedProfile.kcMasteryMap[testKcId];
    expect(kcMastery.attempts).toBe(2);
    expect(kcMastery.correctAttempts).toBe(1);
    expect(kcMastery.history).toHaveLength(2);
    expect(kcMastery.history[1].eventType).toBe('assessment');
    expect(kcMastery.history[1].score).toBe(0.0);
  });

  it('should track mastery level changes over time', async () => {
    let profile = await service.getProfile(testUserId);
    let initialMastery: number;

    // First correct attempt
    profile = await service.updateKcMastery(testUserId, testKcId, {
      isCorrect: true,
      newAttempt: true,
      interactionType: 'practice'
    });
    initialMastery = profile!.kcMasteryMap[testKcId].masteryLevel;

    // Second correct attempt should increase mastery
    profile = await service.updateKcMastery(testUserId, testKcId, {
      isCorrect: true,
      newAttempt: true,
      interactionType: 'practice'
    });
    const secondMastery = profile!.kcMasteryMap[testKcId].masteryLevel;

    expect(secondMastery).toBeGreaterThan(initialMastery);

    // Incorrect attempt should decrease mastery
    profile = await service.updateKcMastery(testUserId, testKcId, {
      isCorrect: false,
      newAttempt: true,
      interactionType: 'practice'
    });
    const thirdMastery = profile!.kcMasteryMap[testKcId].masteryLevel;

    expect(thirdMastery).toBeLessThan(secondMastery);
  });

  it('should retrieve specific KC mastery', async () => {
    await service.updateKcMastery(testUserId, testKcId, {
      isCorrect: true,
      newAttempt: true,
      interactionType: 'practice'
    });

    const kcMastery = await service.getKcMastery(testUserId, testKcId);
    expect(kcMastery).not.toBeNull();
    expect(kcMastery!.kcId).toBe(testKcId);
    expect(kcMastery!.attempts).toBe(1);
  });

  it('should handle updates for non-existent user by creating profile', async () => {
    const profile = await service.updateKcMastery('new-user', 'test-kc', {
      isCorrect: true,
      newAttempt: true,
      interactionType: 'practice'
    });

    expect(profile.userId).toBe('new-user');
    expect(profile.kcMasteryMap['test-kc']).toBeDefined();
  });
});
