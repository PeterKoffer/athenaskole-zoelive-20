import { describe, it, expect, beforeEach } from 'vitest';
import { mockProfileService, MOCK_USER_ID } from '../MockProfileService';
import { LearnerPreferences } from '@/types/learnerProfile';

describe('MockLearnerProfileService - Profile Management', () => {
  beforeEach(() => {
    mockProfileService.resetStore();
  });

  it('should create a new profile with default preferences if one does not exist', async () => {
    const profile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(profile).toBeDefined();
    expect(profile.userId).toBe(MOCK_USER_ID);
    expect(profile.preferences.learningStyle).toBe('mixed');
    expect(profile.preferences.difficultyPreference).toBe(0.5);
    expect(profile.preferences.sessionLength).toBe(30);
  });

  it('should retrieve an existing profile', async () => {
    await mockProfileService.getProfile(MOCK_USER_ID); // Ensure profile is created
    const retrievedProfile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(retrievedProfile).toBeDefined();
    expect(retrievedProfile.userId).toBe(MOCK_USER_ID);
  });

  it('should update user preferences', async () => {
    const newPreferences: Partial<LearnerPreferences> = {
      learningStyle: 'kinesthetic',
      difficultyPreference: 0.8, // Corresponds to 'hard' conceptually
      sessionLength: 45,
    };
    const updatedProfile = await mockProfileService.updateUserPreferences(MOCK_USER_ID, newPreferences);
    expect(updatedProfile.preferences.learningStyle).toBe('kinesthetic');
    expect(updatedProfile.preferences.difficultyPreference).toBe(0.8);
    expect(updatedProfile.preferences.sessionLength).toBe(45);

    const storedProfile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(storedProfile.preferences).toEqual(expect.objectContaining(newPreferences));
  });

  it('should return the same profile object if getProfile is called multiple times for the same user without modifications', async () => {
    const profile1 = await mockProfileService.getProfile(MOCK_USER_ID);
    const profile2 = await mockProfileService.getProfile(MOCK_USER_ID);
    // Check for deep equality as getProfile returns a deep copy
    expect(profile1).toEqual(profile2);
  });
});
