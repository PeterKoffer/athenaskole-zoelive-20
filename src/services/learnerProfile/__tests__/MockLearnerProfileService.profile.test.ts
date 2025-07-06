import { describe, it, expect, beforeEach } from 'vitest';
import { MockLearnerProfileService, MOCK_USER_ID } from '../MockLearnerProfileService';

describe('MockLearnerProfileService - Profile Management', () => {
  let service: MockLearnerProfileService;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    service = new MockLearnerProfileService();
    service.clearAllProfiles();
  });

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
