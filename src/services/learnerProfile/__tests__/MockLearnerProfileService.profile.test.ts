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
    expect(profile.preferences.learningPace).toBe('medium');
    expect(profile.preferences.preferredDifficulty).toBe('medium');
    expect(profile.preferences.targetSessionLengthMinutes).toBe(30);
  });

  it('should retrieve an existing profile', async () => {
    await mockProfileService.getProfile(MOCK_USER_ID); // Ensure profile is created
    const retrievedProfile = await mockProfileService.getProfile(MOCK_USER_ID);
    expect(retrievedProfile).toBeDefined();
    expect(retrievedProfile.userId).toBe(MOCK_USER_ID);
  });

  it('should update user preferences', async () => {
    const newPreferences: Partial<LearnerPreferences> = {
      learningPace: 'fast',
      preferredDifficulty: 'hard',
      targetSessionLengthMinutes: 60,
    };
    const updatedProfile = await mockProfileService.updateUserPreferences(MOCK_USER_ID, newPreferences);
    expect(updatedProfile.preferences.learningPace).toBe('fast');
    expect(updatedProfile.preferences.preferredDifficulty).toBe('hard');
    expect(updatedProfile.preferences.targetSessionLengthMinutes).toBe(60);

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
