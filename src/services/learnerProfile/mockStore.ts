
// src/services/learnerProfile/mockStore.ts

import { LearnerProfile } from '@/types/learnerProfile';

// In-memory storage for mock profiles
const mockProfileStore: Record<string, LearnerProfile> = {};

export class MockProfileStore {
  static get(userId: string): LearnerProfile | undefined {
    return mockProfileStore[userId];
  }

  static set(userId: string, profile: LearnerProfile): void {
    mockProfileStore[userId] = profile;
  }

  static has(userId: string): boolean {
    return userId in mockProfileStore;
  }

  static delete(userId: string): boolean {
    if (mockProfileStore[userId]) {
      delete mockProfileStore[userId];
      return true;
    }
    return false;
  }

  static clear(): void {
    Object.keys(mockProfileStore).forEach(key => delete mockProfileStore[key]);
  }

  static size(): number {
    return Object.keys(mockProfileStore).length;
  }

  static keys(): string[] {
    return Object.keys(mockProfileStore);
  }

  static values(): LearnerProfile[] {
    return Object.values(mockProfileStore);
  }
}
