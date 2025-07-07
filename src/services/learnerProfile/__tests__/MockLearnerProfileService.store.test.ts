import { describe, it, expect, beforeEach } from 'vitest';
import { mockProfileService, MOCK_USER_ID } from '../MockProfileService';

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
    mockProfileService.resetStore();
    expect(mockProfileService.getStoreSize()).toBe(0);
  });

  it('should increment store size when a new profile is created via getProfile', async () => {
    mockProfileService.resetStore();
    await mockProfileService.getProfile(MOCK_USER_ID);
    expect(mockProfileService.getStoreSize()).toBe(1);
    await mockProfileService.getProfile('another-user-id');
    expect(mockProfileService.getStoreSize()).toBe(2);
  });

  it('resetStore should clear all profiles from the store', async () => {
    await mockProfileService.getProfile(MOCK_USER_ID);
    await mockProfileService.getProfile('another-user-id');
    expect(mockProfileService.getStoreSize()).toBe(2); // Before reset

    mockProfileService.resetStore();
    expect(mockProfileService.getStoreSize()).toBe(0); // After reset
  });

  it('getProfile should not affect store size if profile already exists', async () => {
    mockProfileService.resetStore();
    await mockProfileService.getProfile(MOCK_USER_ID);
    expect(mockProfileService.getStoreSize()).toBe(1);
    await mockProfileService.getProfile(MOCK_USER_ID); // Call again
    expect(mockProfileService.getStoreSize()).toBe(1); // Size should remain 1
  });
});
