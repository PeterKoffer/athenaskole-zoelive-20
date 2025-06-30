
// src/services/learnerProfile/UserIdService.ts

export class UserIdService {
  getCurrentUserId(): string {
    // For testing purposes, return a mock user ID
    // In a real app, this would get the current authenticated user's ID
    return '12345678-1234-5678-9012-123456789012';
  }

  isValidUserId(userId: string): boolean {
    return typeof userId === 'string' && userId.length > 0;
  }
}

export const userIdService = new UserIdService();
