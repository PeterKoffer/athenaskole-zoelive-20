
import { describe, it, expect, beforeEach } from 'vitest';
import { MockLearnerProfileService } from '../MockLearnerProfileService';

describe('MockLearnerProfileService - Store Management', () => {
  let service: MockLearnerProfileService;

  beforeEach(() => {
    service = new MockLearnerProfileService();
    service.clearAllProfiles();
  });

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
