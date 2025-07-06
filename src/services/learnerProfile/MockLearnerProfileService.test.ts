// src/services/learnerProfile/MockLearnerProfileService.test.ts

import { MockLearnerProfileService, MOCK_USER_ID } from './MockLearnerProfileService';
import { LearnerProfile } from '@/types/learnerProfile';

describe('MockLearnerProfileService', () => {
  let service: MockLearnerProfileService;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    service = new MockLearnerProfileService();
    service.clearAllProfiles(); // Start with clean state
  });

  describe('Profile Management', () => {
    it('should return null for non-existent profile', async () => {
      const profile = await service.getProfile('non-existent-user');
      expect(profile).toBeNull();
    });

    it('should create initial profile with default values', async () => {
      const profile = await service.createInitialProfile(testUserId);
      
      expect(profile.userId).toBe(testUserId);
      expect(profile.kcMasteryMap).toEqual({});
      expect(profile.preferences.learningStyle).toBe('mixed');
      expect(profile.preferences.difficultyPreference).toBe(0.5);
      expect(profile.preferences.sessionLength).toBe(20);
      expect(profile.overallMastery).toBe(0.0);
      expect(profile.recentPerformance).toEqual([]);
      expect(profile.createdAt).toBeGreaterThan(0);
      expect(profile.lastUpdatedTimestamp).toBeGreaterThan(0);
    });

    it('should retrieve created profile', async () => {
      await service.createInitialProfile(testUserId);
      const retrievedProfile = await service.getProfile(testUserId);
      
      expect(retrievedProfile).not.toBeNull();
      expect(retrievedProfile!.userId).toBe(testUserId);
    });

    it('should update learner preferences', async () => {
      await service.createInitialProfile(testUserId);
      
      await service.updatePreferences(testUserId, {
        learningStyle: 'visual',
        sessionLength: 30
      });

      const profile = await service.getProfile(testUserId);
      expect(profile!.preferences.learningStyle).toBe('visual');
      expect(profile!.preferences.sessionLength).toBe(30);
      expect(profile!.preferences.difficultyPreference).toBe(0.5); // Should remain unchanged
    });
  });

  describe('KC Mastery Management', () => {
    const testKcId = 'g4-math-oa-A-1-kc1';

    beforeEach(async () => {
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
  });

  describe('Store Management', () => {
    it('should start with empty store', () => {
      expect(service.getStoreSize()).toBe(0);
    });

    it('should track store size correctly', async () => {
      expect(service.getStoreSize()).toBe(0);
      
      await service.createInitialProfile('user1');
      expect(service.getStoreSize()).toBe(1);
      
      await service.createInitialProfile('user2');
      expect(service.getStoreSize()).toBe(2);
    });

    it('should clear all profiles', async () => {
      await service.createInitialProfile('user1');
      await service.createInitialProfile('user2');
      expect(service.getStoreSize()).toBe(2);
      
      service.clearAllProfiles();
      expect(service.getStoreSize()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle updates for non-existent user by creating profile', async () => {
      const profile = await service.updateKcMastery('new-user', 'test-kc', {
        isCorrect: true,
        newAttempt: true,
        interactionType: 'practice'
      });

      expect(profile.userId).toBe('new-user');
      expect(profile.kcMasteryMap['test-kc']).toBeDefined();
    });

    it('should handle preference updates for non-existent user by creating profile', async () => {
      await service.updatePreferences('new-user', { learningStyle: 'visual' });
      
      const profile = await service.getProfile('new-user');
      expect(profile).not.toBeNull();
      expect(profile!.preferences.learningStyle).toBe('visual');
    });

    it('should not modify original profile when returning copies', async () => {
      await service.createInitialProfile(testUserId);
      
      const profile1 = await service.getProfile(testUserId);
      const profile2 = await service.getProfile(testUserId);
      
      // Modify one copy
      if (profile1) {
        profile1.preferences.learningStyle = 'visual';
      }
      
      // Other copy should be unchanged
      expect(profile2!.preferences.learningStyle).toBe('mixed');
    });
  });
});
