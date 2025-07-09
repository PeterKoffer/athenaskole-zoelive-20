
import { describe, it, expect, beforeEach } from 'vitest';
import { mockLearnerProfileService, MOCK_USER_ID } from '../MockLearnerProfileService';

describe('MockLearnerProfileService - Store Management', () => {
  beforeEach(() => {
    // We call resetStore in most tests, but here we test resetStore itself and initial state
  });

  it('should start with an empty store', () => {
    // Note: The service might auto-create on first get.
    // This test assumes direct access to store or a method to check size before any getProfile.
    // For this mock, getStoreSize() is added for testability.
    // If resetStore wasn't called by a previous test's afterEach/beforeEach, this might not be 0.
    // So, explicitly reset for this specific test's assertion if needed.
    mockLearnerProfileService.resetStore();
    expect(mockLearnerProfileService.getStoreSize()).toBe(0);
  });

  it('should increment store size when a new profile is created via getProfile', async () => {
    mockLearnerProfileService.resetStore();
    await mockLearnerProfileService.getProfile(MOCK_USER_ID);
    expect(mockLearnerProfileService.getStoreSize()).toBe(1);
    await mockLearnerProfileService.getProfile('another-user-id');
    expect(mockLearnerProfileService.getStoreSize()).toBe(2);
  });

  it('resetStore should clear all profiles from the store', async () => {
    await mockLearnerProfileService.getProfile(MOCK_USER_ID);
    await mockLearnerProfileService.getProfile('another-user-id');
    expect(mockLearnerProfileService.getStoreSize()).toBe(2); // Before reset

    mockLearnerProfileService.resetStore();
    expect(mockLearnerProfileService.getStoreSize()).toBe(0); // After reset
  });

  it('getProfile should not affect store size if profile already exists', async () => {
    mockLearnerProfileService.resetStore();
    await mockLearnerProfileService.getProfile(MOCK_USER_ID);
    expect(mockLearnerProfileService.getStoreSize()).toBe(1);
    await mockLearnerProfileService.getProfile(MOCK_USER_ID); // Call again
    expect(mockLearnerProfileService.getStoreSize()).toBe(1); // Size should remain 1
  });
});
